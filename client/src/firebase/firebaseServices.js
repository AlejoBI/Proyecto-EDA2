import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let servicesPromise;

export const getFirebaseServices = () => {
  if (!servicesPromise) {
    servicesPromise = import("./credentials.js").then(({ default: appFirebase }) => ({
      auth: getAuth(appFirebase),
      fireStore: getFirestore(appFirebase),
    }));
  }

  return servicesPromise;
};
