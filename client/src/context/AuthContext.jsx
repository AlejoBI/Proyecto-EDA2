import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthContext from "./AuthContextInstance.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { getFirebaseServices } from "../firebase/firebaseServices.js";

const AUTH_UNAVAILABLE_MESSAGE = "Authentication is currently unavailable.";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState("checking");
  const [services, setServices] = useState(null);

  const getAvailableServices = () => {
    if (!services) {
      setErrors(AUTH_UNAVAILABLE_MESSAGE);
      return null;
    }
    return services;
  };

  const signup = async ({ username, email, password, role }) => {
    const availableServices = getAvailableServices();
    if (!availableServices) return { error: AUTH_UNAVAILABLE_MESSAGE };
    const { auth, fireStore } = availableServices;
    setLoading(true);
    setErrors(null);
    try {
      if (password.length < 6) {
        setErrors("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(fireStore, "users", userCredential.user.uid);
      await setDoc(docRef, {
        username,
        email,
        role,
      });

      const userDoc = await getDoc(docRef);
      const userData = userDoc.data();

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrors("Email already in use");
      } else if (error.code === "permission-denied") {
        setErrors("Insufficient permissions");
      } else if (error.code === "auth/weak-password") {
        setErrors("Weak password");
      } else if (error.code === "auth/invalid-email") {
        setErrors("Invalid email");
      } else if (error.code === "auth/invalid-credential") {
        setErrors("Invalid credential");
      } else if (error.code === "auth/operation-not-allowed") {
        setErrors("Operation not allowed");
      } else {
        setErrors(error.message);
      }
    }
    setLoading(false);
  };

  const signin = async ({ email, password }) => {
    const availableServices = getAvailableServices();
    if (!availableServices) return { error: AUTH_UNAVAILABLE_MESSAGE };
    const { auth, fireStore } = availableServices;
    setLoading(true);
    setErrors(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(fireStore, "users", userCredential.user.uid);
      const userDoc = await getDoc(docRef);

      if (!userDoc.exists()) {
        setErrors("User not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (error.code === "permission-denied") {
        setErrors("Insufficient permissions");
      } else if (error.code === "auth/user-not-found") {
        setErrors("User not found");
      } else if (error.code === "auth/wrong-password") {
        setErrors("Wrong password");
      } else if (error.code === "auth/invalid-email") {
        setErrors("Invalid email");
      } else if (error.code === "auth/invalid-credential") {
        setErrors("Invalid credential");
      } else {
        setErrors(error.message);
      }
    }
    setLoading(false);
  };

  const signinWithGoogle = async () => {
    const availableServices = getAvailableServices();
    if (!availableServices) return { error: AUTH_UNAVAILABLE_MESSAGE };
    const { auth, fireStore } = availableServices;
    setLoading(true);
    setErrors(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const docRef = doc(fireStore, "users", userCredential.user.uid);
      const userDoc = await getDoc(docRef);

      let userData;
      if (!userDoc.exists()) {
        userData = {
          username: userCredential.user.displayName,
          email: userCredential.user.email,
          role: "customer", 
        };
        await setDoc(docRef, userData);
      } else {
        userData = userDoc.data();
      }

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });
      setIsAuthenticated(true);
      return userCredential.user;
    } catch (error) {
      if (error.code === "permission-denied") {
        setErrors("Insufficient permissions");
      } else if (error.code === "auth/user-not-found") {
        setErrors("User not found");
      } else if (error.code === "auth/wrong-password") {
        setErrors("Wrong password");
      } else if (error.code === "auth/invalid-email") {
        setErrors("Invalid email");
      } else if (error.code === "auth/invalid-credential") {
        setErrors("Invalid credential");
      } else {
        setErrors(error.message);
      }
    }
    setLoading(false);
  };

  const signinWithGithub = async () => {
    const availableServices = getAvailableServices();
    if (!availableServices) return { error: AUTH_UNAVAILABLE_MESSAGE };
    const { auth, fireStore } = availableServices;
    setLoading(true);
    setErrors(null);
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const docRef = doc(fireStore, "users", userCredential.user.uid);
      const userDoc = await getDoc(docRef);

      let userData;
      if (!userDoc.exists()) {
        userData = {
          username: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          email: userCredential.user.email,
          role: "customer", 
        };
        await setDoc(docRef, userData);
      } else {
        userData = userDoc.data();
      }

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });
      setIsAuthenticated(true);
      return userCredential.user;
    } catch (error) {
      if (error.code === "permission-denied") {
        setErrors("Insufficient permissions");
      } else if (error.code === "auth/account-exists-with-different-credential") {
        setErrors("An account already exists with the same email address");
      } else if (error.code === "auth/popup-blocked") {
        setErrors("Popup blocked by browser");
      } else if (error.code === "auth/popup-closed-by-user") {
        setErrors("Login cancelled");
      } else {
        setErrors(error.message);
      }
    }
    setLoading(false);
  };

  const logout = async () => {
    const availableServices = getAvailableServices();
    if (!availableServices) return { error: AUTH_UNAVAILABLE_MESSAGE };
    const { auth } = availableServices;
    setLoading(true);
    setErrors(null);
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      setErrors(error.message);
    }
    setLoading(false);
  };

  const getAllUsers = async () => {
    const availableServices = getAvailableServices();
    if (!availableServices) return [];
    const { fireStore } = availableServices;
    setErrors(null);
    try {
      const q = query(collection(fireStore, "users"));
      const querySnapshot = await getDocs(q);

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return users;
    } catch (error) {
      setErrors(error.message);
      return [];
    }
  };

  const profile = async () => {
    const availableServices = getAvailableServices();
    if (!availableServices) return { error: AUTH_UNAVAILABLE_MESSAGE };
    const { auth, fireStore } = availableServices;
    setLoading(true);
    setErrors(null);
    try {
      const userDocRef = doc(fireStore, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setIsAuthenticated(false);
        setErrors("Usuario no encontrado");
        setLoading(false);
        return;
      }

      const user = userDoc.data();

      setUser({
        username: user.username,
        email: user.email,
        role: user.role,
      });
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (user) => {
    const availableServices = getAvailableServices();
    if (!availableServices) return { error: AUTH_UNAVAILABLE_MESSAGE };
    const { auth, fireStore } = availableServices;
    setLoading(true);
    setErrors(null);

    try {
      const {
        age,
        name,
        lastName,
        gender,
        phone,
        city,
        country,
        professionalArea,
        skills,
        profileImage,
        role, 
      } = user;

      const currentUser = auth.currentUser;
      const userDocRef = doc(fireStore, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        setErrors("Usuario no encontrado");
        setLoading(false);
        return;
      }

      const userDocData = userDocSnap.data();

      await setDoc(userDocRef, {
        ...userDocData,
        age,
        name,
        lastName,
        gender,
        phone,
        city,
        country,
        professionalArea,
        skills,
        profileImage,
        role, 
      });

      setUser({
        ...userDocData,
        age,
        name,
        lastName,
        gender,
        phone,
        city,
        country,
        professionalArea,
        skills,
        profileImage,
        role, 
      });
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let unsubscribe;

    getFirebaseServices()
      .then(({ auth, fireStore }) => {
        if (cancelled) return;
        setServices({ auth, fireStore });
        setAuthStatus("ready");
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setLoading(true);
          if (currentUser) {
            try {
              const docRef = doc(fireStore, "users", currentUser.uid);
              const userDoc = await getDoc(docRef);
              const userData = userDoc.exists() ? userDoc.data() : null;

              if (userData) {
                setUser({ id: currentUser.uid, ...userData });
                setIsAuthenticated(true);
              } else {
                setIsAuthenticated(false);
                setUser(null);
              }
            } catch {
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
          setLoading(false);
        });
      })
      .catch(() => {
        if (cancelled) return;
        setServices(null);
        setAuthStatus("unavailable");
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        signinWithGoogle,
        signinWithGithub,
        logout,
        getAllUsers,
        profile,
        updateProfile,
        user,
        isAuthenticated,
        errors,
        loading,
        authStatus,
        setLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
