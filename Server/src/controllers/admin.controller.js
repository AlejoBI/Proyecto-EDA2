import appFirebase from "../firebase/credentials.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const auth = getAuth(appFirebase);
const fireStore = getFirestore(appFirebase);

export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userFound = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const docRef = doc(fireStore, "users", userFound.user.uid);
    await setDoc(docRef, { username, email, role });

    const userDoc = await getDoc(docRef);
    const user = userDoc.data();

    return res.status(201).json({
      id: userFound.user.uid,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return res.status(400).json({ message: "Email already in use" });
    } else if (error.code === "permission-denied") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (_, res) => {
  const user = auth.currentUser;

  if (!user) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  try {
    const docRef = doc(fireStore, "users", user.uid);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteDoc(docRef);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
