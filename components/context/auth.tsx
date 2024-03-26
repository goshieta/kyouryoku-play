import { onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { pubUserDataType, userType } from "@/lib/types/communityType";

export type userContextType = userType | null | undefined;

const AuthContext = createContext<userContextType>(undefined);

export default function Auth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<userContextType>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, `users/${firebaseUser.uid}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const appUser = (await getDoc(ref)).data() as userType;
          setUser(appUser);
        } else {
          const appUser: userType = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName!,
            photoURL: firebaseUser.photoURL!,
            email: firebaseUser.email!,
            createdAt: Date.now(),
            belongCommunity: [],
          };
          const pubAppUser: pubUserDataType = {
            createdAt: Date.now(),
            id: firebaseUser.uid,
            name: firebaseUser.displayName!,
            photoURL: firebaseUser.photoURL!,
          };
          setDoc(ref, appUser).then(() => {
            setUser(appUser);
          });
          //公開ユーザーデータをセット
          setDoc(doc(db, "pubUsers", firebaseUser.uid), pubAppUser);
        }
      } else {
        setUser(null);
      }
      return unsubscribe;
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
