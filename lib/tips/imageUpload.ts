import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/client";

export default function onFileChange(
  e: React.ChangeEvent<HTMLInputElement>,
  width: number,
  height: number,
  target: string
) {
  if (!e.target.files || e.target.files.length === 0) return;
  const file = e.target.files[0];
  if (!file.type.includes("image/")) {
    e.currentTarget.value = "";
    return;
  }
  const objectURL = window.URL.createObjectURL(file);
  const fileImage = new Image();
  fileImage.src = objectURL;
  return new Promise<string>((resolve) => {
    fileImage.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context?.drawImage(fileImage, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          uploadBytes(ref(storage, target), blob).then(async (result) => {
            const link = await getDownloadURL(result.ref);
            resolve(link);
          });
        }
      });
    };
  });
}
