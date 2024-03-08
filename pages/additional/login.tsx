import { login } from "@/lib/auth";

export default function Login() {
  return (
    <>
      <button onClick={login}>ログイン</button>
    </>
  );
}
