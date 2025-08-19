import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../public/firebase";
import axiosInstance from "./axiosInstance";

export async function signupNewUser({
  firebaseReg,
}: {
  firebaseReg: FirebaseAccessProps;
}) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    firebaseReg.email,
    firebaseReg.password
  );
  const user = userCredential.user;
  return user;
}

export async function signInExistingUser({
  firebaseReg,
}: {
  firebaseReg: FirebaseAccessProps;
}) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    firebaseReg.email,
    firebaseReg.password
  );
  const user = userCredential.user;
  return user;
}

export async function firebaseLogout() {
  try {
    const response = await signOut(auth);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

export async function firebaseSendPasswordResetEmail({
  email,
}: {
  email: string;
}) {
  const actionCodeSettings = {
    // url: "www.iloverealestates.com",
    url: "http://localhost:3000/",
    handleCodeInApp: false,
  };
  const response = await sendPasswordResetEmail(
    auth,
    email,
    actionCodeSettings
  );

  return response;
}

export async function logoutUser() {
  const res = await axiosInstance.get("logout_user");
  return res.data;
}

export async function checkUserEmailExist({ email }: { email: string }) {
  const res = await axiosInstance.get(`check_user_email?email=${email}`);
  return res.data;
}
