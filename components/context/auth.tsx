import { onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";
import { auth, db } from "@/lib/firebase/client";
import {
  Unsubscribe,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  isUserType,
  pubUserDataType,
  userType,
} from "@/lib/types/communityType";
import dynamic from "next/dynamic";

export type userContextType = userType | null | undefined;

const AuthContext = createContext<userContextType>(undefined);

export default function Auth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<userContextType>();

  const [isSignUp, setIsSignUp] = useState(false);
  const SignUp = dynamic(() => {
    console.log("imported!");
    return import("../account/signup");
  });

  useEffect(() => {
    let removeEventListener: null | Unsubscribe = null;
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
            description: "",
          };
          const pubAppUser: pubUserDataType = {
            createdAt: Date.now(),
            id: firebaseUser.uid,
            name: firebaseUser.displayName!,
            photoURL: firebaseUser.photoURL!,
            description: "",
          };
          setDoc(ref, appUser).then(() => {
            setUser(appUser);
            setIsSignUp(true);
          });
          //公開ユーザーデータをセット
          setDoc(doc(db, "pubUsers", firebaseUser.uid), pubAppUser);
        }
        removeEventListener = onSnapshot(ref, (newData) => {
          const data = newData.data();
          if (isUserType(data)) setUser(data);
        });
      } else {
        setUser(null);
      }
      return () => {
        unsubscribe();
        if (removeEventListener) removeEventListener();
      };
    });
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {isSignUp && user && <SignUp userInfo={user} setSignUp={setIsSignUp} />}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
