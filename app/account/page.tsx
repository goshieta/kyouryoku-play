"use client";

import useUser from "../lib/auth/useUser";
import { auth } from "../lib/firebase-admin";
import styles from "./styles.module.css";

export default function AccountPage() {
  const [uid, udata] = useUser();
  console.log(uid, udata);

  return <div id={styles.account_page}></div>;
}
