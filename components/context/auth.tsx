import { onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";
import { auth, db } from "@/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

type userType = {
  id: string;
  name: string;
  photoURL: string;
  email: string;
  createdAt: number;
};
type userContextType = userType | null | undefined;

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
          };
          setDoc(ref, appUser).then(() => {
            setUser(appUser);
          });
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
