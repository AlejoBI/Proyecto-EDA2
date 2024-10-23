import appFirebase from "../firebase/credentials.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

const auth = getAuth(appFirebase);
const fireStore = getFirestore(appFirebase);

export const createJob = async (req, res) => {
    const { title, description, company, country, city, salary } = req.body;
    const jobId = uuidv4();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
        return res.status(400).json({ error: "Usuario no autenticado" });
    }

    try {
        const docRef = doc(fireStore, "jobs", jobId);
        await setDoc(docRef, {
            id_user: userId,
            title: title,
            description: description,
            company: company,
            country: country,
            city: city,
            salary: salary
        });

        return res.status(201).json({ message: "Job created successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const q = query(collection(fireStore, "jobs"));
        const querySnapshot = await getDocs(q);
        const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(jobs);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateJob = async (req, res) => {
    const { id, title, description, company, country, city, salary } = req.body;
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    try {
        const docRef = doc(fireStore, "jobs", id);
        const jobDoc = await getDoc(docRef);

        if (!jobDoc.exists || jobDoc.data().id_user !== userId) {
            return res.status(404).json({ error: "Job not found or you do not have permission to update this job" });
        }

        await updateDoc(docRef, {
            title: title,
            description: description,
            company: company,
            country: country,
            city: city,
            salary: salary
        });

        return res.status(200).json({ message: "Job updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteJob = async (req, res) => {
    const { id } = req.body;
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    try {
        const docRef = doc(fireStore, "jobs", id);
        const jobDoc = await getDoc(docRef);

        if (!jobDoc.exists || jobDoc.data().id_user !== userId) {
            return res.status(404).json({ error: "Job not found or you do not have permission to delete this job" });
        }

        await deleteDoc(docRef);

        return res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
