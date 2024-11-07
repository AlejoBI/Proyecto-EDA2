import { createContext, useState, useContext, useEffect } from "react";

import appFirebase from "../firebase/credentials.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

const auth = getAuth(appFirebase);
const fireStore = getFirestore(appFirebase);

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [errors, setErrors] = useState(null);

  const createJob = async (job) => {
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

  const getAllJobs = async () => {
    try {
      const q = query(collection(fireStore, "jobs"));
      const querySnapshot = await getDocs(q);
      const jobs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobs);
    } catch (error) {
      setErrors(error.message);
    }
  };

  const updateJob = async (job) => {
    const { id, title, description, company, country, city, salary } = job;
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      setErrors("Usuario no autenticado");
      return;
    }

    try {
      const docRef = doc(fireStore, "jobs", id);
      const jobDoc = await getDoc(docRef);

      if (!jobDoc.exists || jobDoc.data().id_user !== userId) {
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
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      setErrors("Usuario no autenticado");
      return;
    }

    try {
      const docRef = doc(fireStore, "jobs", jobId);
      const jobDoc = await getDoc(docRef);

      if (!jobDoc.exists || jobDoc.data().id_user !== userId) {
        setErrors(
          "Job not found or you do not have permission to delete this job"
        );
        return;
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
    getAllJobs();
  }, []);

  return (
    <JobsContext.Provider
      value={{ jobs, errors, createJob, updateJob, deleteJob, getAllJobs }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
