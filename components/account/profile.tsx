import styles from "@/styles/pages/account.module.css";
import Image from "next/image";
import { userType } from "@/lib/types/communityType";

export default function Profile({ authInfo }: { authInfo: userType }) {
  return (
    <div id={styles.accountInfo}>
      <div id={styles.ai_image_area}>
        <button id={styles.editPhoto}>
          <Image
            src={authInfo.photoURL}
            alt="プロフィール画像"
            width={100}
            height={100}
          ></Image>
          <div>
            <span className="material-symbols-outlined">edit</span>
          </div>
        </button>
      </div>
      <div id={styles.ai_desc_area}>
        <div>
          <h3>{authInfo.name}</h3>
          <button>
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        <p>{authInfo.email}</p>
      </div>
    </div>
  );
}
