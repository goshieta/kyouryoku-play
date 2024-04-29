import Image from "next/image";
import { pubUserDataType } from "@/lib/types/communityType";

export default function PubProfile({
  info,
}: {
  info: pubUserDataType | null | undefined;
}) {
  return (
    <>
      {info === null ? <div>読み込み中</div> : <></>}
      {info === undefined ? <div>存在しないユーザーです</div> : <></>}
      {info ? (
        <div>
          <Image
            src={info.photoURL}
            alt={`${info.name}の写真`}
            width={70}
            height={70}
          />
          <div>
            <h1>{info.name}</h1>
            <p>{info.description}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
