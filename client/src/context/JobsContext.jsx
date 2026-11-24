import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import JobsContext from "./JobsContextInstance.js";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getFirebaseServices } from "../firebase/firebaseServices.js";

const SERVICES_UNAVAILABLE_MESSAGE = "Jobs are currently unavailable.";

const fetchJobs = async (fireStore) => {
  const q = query(collection(fireStore, "jobs"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [errors, setErrors] = useState(null);
  const [services, setServices] = useState(null);

  const createJob = async (job) => {
    if (!services) {
      setErrors(SERVICES_UNAVAILABLE_MESSAGE);
      return { error: SERVICES_UNAVAILABLE_MESSAGE };
    }
    const { auth, fireStore } = services;
    const { title, description, company, country, city, salary } = job;
    const jobId = uuidv4();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      setErrors("Usuario no autenticado");
      return;
    }

    try {
      const docRef = doc(fireStore, "jobs", jobId);
      await setDoc(docRef, {
        id_user: userId,
        title,
        description,
        company,
        country,
        city,
        salary,
      });

      setJobs((prevJobs) => [...prevJobs, { id: jobId, ...job }]);
      return { message: "Job created successfully" };
    } catch (error) {
      setErrors(error.message);
      return { error: error.message };
    }
  };

  const getAllJobs = async (availableServices = services) => {
    if (!availableServices) {
      setErrors(SERVICES_UNAVAILABLE_MESSAGE);
      return [];
    }
    const { fireStore } = availableServices;
    try {
      const jobs = await fetchJobs(fireStore);
      setJobs(jobs);
    } catch (error) {
      setErrors(error.message);
    }
  };

  const updateJob = async (job) => {
    if (!services) {
      setErrors(SERVICES_UNAVAILABLE_MESSAGE);
      return { error: SERVICES_UNAVAILABLE_MESSAGE };
    }
    const { auth, fireStore } = services;
    const { id, title, description, company, country, city, salary } = job;
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      setErrors("Usuario no autenticado");
      return;
    }

    try {
      const docRef = doc(fireStore, "jobs", id);
      const jobDoc = await getDoc(docRef);

      if (!jobDoc.exists() || jobDoc.data().id_user !== userId) {
        setErrors(
          "Job not found or you do not have permission to update this job"
        );
        return;
      }

      await updateDoc(docRef, {
        title,
        description,
        company,
        country,
        city,
        salary,
      });

      setJobs((prevJobs) =>
        prevJobs.map((jobItem) =>
          jobItem.id === id ? { ...jobItem, ...job } : jobItem
        )
      );

      return { message: "Job updated successfully" };
    } catch (error) {
      setErrors(error.message);
      return { error: error.message };
    }
  };

  const deleteJob = async (jobId) => {
    if (!services) {
      setErrors(SERVICES_UNAVAILABLE_MESSAGE);
      return { error: SERVICES_UNAVAILABLE_MESSAGE };
    }
    const { auth, fireStore } = services;
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      setErrors("Usuario no autenticado");
      return;
    }

    const userRef = doc(fireStore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      setErrors("User not found");
      return { error: "User not found" };
    }

    const userRole = userDoc.data().role;

    try {
      const docRef = doc(fireStore, "jobs", jobId);
      const jobDoc = await getDoc(docRef);
      if (userRole !== "admin") {
        if (!jobDoc.exists() || jobDoc.data().id_user !== userId) {
          setErrors(
            "Job not found or you do not have permission to delete this job"
          );
          return;
        }
      }

      await deleteDoc(docRef);

      setJobs((prevJobs) => prevJobs.filter((jobItem) => jobItem.id !== jobId));

      return { message: "Job deleted successfully" };
    } catch (error) {
      setErrors(error.message);
      return { error: error.message };
    }
  };

  useEffect(() => {
    let cancelled = false;
    getFirebaseServices()
      .then((availableServices) => {
        if (cancelled) return;
        setServices(availableServices);
        return fetchJobs(availableServices.fireStore)
          .then(setJobs)
          .catch((error) => setErrors(error.message));
      })
      .catch(() => {
        if (!cancelled) setErrors(SERVICES_UNAVAILABLE_MESSAGE);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <JobsContext.Provider
      value={{ jobs, errors, createJob, updateJob, deleteJob, getAllJobs }}
    >
      {children}
    </JobsContext.Provider>
  );
};

JobsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
