import appFirebase from "../firebase/credentials.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = getAuth(appFirebase);
const fireStore = getFirestore(appFirebase);


export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const userFound = await createUserWithEmailAndPassword(auth, email, password); // Create a new user with email and password

        const docRef = doc(fireStore, "users", userFound.user.uid);
        await setDoc(docRef, {
            username: username,
            email: email,
            role: role
        }); // Save the user in the database

        const userDoc = await getDoc(docRef);
        const user = userDoc.data();

        return res.status(201).json({
            id: userFound.user.uid,
            email: user.email,
            username: user.username,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await signInWithEmailAndPassword(auth, email, password); // Sign in with email and password

        const docRef = doc(fireStore, "users", userFound.user.uid);
        const userDoc = await getDoc(docRef);
        const user = userDoc.data();

        return res.status(201).json({
            id: userFound.user.uid,
            email: user.email,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    signOut(auth); // Sign out the user 
    return res.sendStatus(200);
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

export const checkAuth = async (req, res) => {
    const user = auth.currentUser;
    if (user) {
        // Aquí puedes obtener más información del usuario si es necesario
        const docRef = doc(fireStore, "users", user.uid);
        const userDoc = await getDoc(docRef);
        const userData = userDoc.data();

        return res.json({
            id: user.uid,
            email: user.email,
            username: userData.username,
            role: userData.role,
        });
    } else {
        return res.status(401).json({ message: "No está autenticado" });
    }
};
