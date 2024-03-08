import { useAuth } from "@/components/context/auth";
import { logout } from "@/lib/auth";

export default function Account() {
  return (
    <>
      <div>
        <p>ID : {useAuth()?.id}</p>
        <p>名前 : {useAuth()?.name}</p>
        <p>メールアドレス : {useAuth()?.email}</p>
        <img src={useAuth()?.photoURL} alt="" />
      </div>
      <button onClick={logout}>ログアウト</button>
    </>
  );
}
