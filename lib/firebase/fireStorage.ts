import { getStorage ,ref,uploadBytes,getDownloadURL} from "firebase/storage";

export async function uploadFile(path:string,file:File){
  const storage=getStorage();
  const contentRef=ref(storage,path);
  const snapshot=await uploadBytes(contentRef,file);
  const url=await getDownloadURL(snapshot.ref);
  return url;
}

