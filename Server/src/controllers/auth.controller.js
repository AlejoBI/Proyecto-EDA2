import appFirebase from "../firebase/credentials.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, } from "firebase/firestore";

const auth = getAuth(appFirebase);
const fireStore = getFirestore(appFirebase);

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userFound = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const docRef = doc(fireStore, "users", userFound.user.uid);
    await setDoc(docRef, {
      username: username,
      email: email,
      role: role,
    });

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
    } else if (error.code === "auth/weak-password") {
      return res.status(400).json({ message: "Weak password" });
    } else if (error.code === "auth/invalid-email") {
      return res.status(400).json({ message: "Invalid email" });
    } else if (error.code === "auth/invalid-credential") {
      return res.status(400).json({ message: "Invalid credential" });
    } else if (error.code === "auth/operation-not-allowed") {
      return res.status(400).json({ message: "Operation not allowed" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await signInWithEmailAndPassword(auth, email, password);

    const docRef = doc(fireStore, "users", userFound.user.uid);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userDoc.data();

    return res.status(201).json({
      id: userFound.user.uid,
      email: user.email,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    if (error.code === "permission-denied") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.code === "auth/wrong-password") {
      return res.status(400).json({ message: "Wrong password" });
    }
    if (error.code === "auth/invalid-email") {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (error.code === "auth/invalid-credential") {
      return res.status(400).json({ message: "Invalid credential" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await signOut(auth);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const userDocFound = doc(fireStore, "users", req.user.id);
    if (!userDocFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const userDoc = await getDoc(userDocFound);
    const user = userDoc.data();

    return res.json({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const q = query(collection(fireStore, "users"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  const user = auth.currentUser;
  if (user) {
    const docRef = doc(fireStore, "users", user.uid);
    const userDoc = await getDoc(docRef);
    const userData = userDoc.data();

    return res.json({ id: user.uid, ...userData });
  } else {
    return res.status(401).json({ message: "No está autenticado" });
  }
};

export const updateProfile = async (req, res) => {
  const { age, name, lastName, gender, phone, city, country, professionalArea } = req.body;
  const user = auth.currentUser;

  try {
    const userDocRef = doc(fireStore, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const userDocData = userDocSnap.data();
    await setDoc(userDocRef, {
      username: userDocData.username,
      email: userDocData.email,
      role: userDocData.role,
      age: age,
      name: name,
      lastName: lastName,
      gender: gender,
      phone: phone,
      city: city,
      country: country,
      professionalArea: professionalArea
    });


    return res.json({
      username: userDocData.username,
      email: userDocData.email,
      role: userDocData.role,
      age: age,
      name: name,
      lastName: lastName,
      gender: gender,
      phone: phone,
      city: city,
      country: country,
      professionalArea: professionalArea
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}