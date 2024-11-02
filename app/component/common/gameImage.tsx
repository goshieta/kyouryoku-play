"use client";

// ImageFromFirebase.tsx
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import styles from "./gamesImage.module.css";

interface ImageFromFirebaseProps {
  path: string; // Firebase Storageの画像パス
  width: number;
  height: number;
  alt: string;
}

const ImageFromFirebase: React.FC<ImageFromFirebaseProps> = ({
  path,
  width,
  height,
  alt,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        // 画像のURLを取得
        const url = await getDownloadURL(ref(storage, path));
        setImageUrl(url);
      } catch (err) {
        console.error("Error fetching image URL:", err);
        setError("画像を取得できませんでした");
      }
    };

    fetchImageUrl();
  }, [path]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ width: width, height: height }} id={styles.image_div}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          id={styles.image}
        />
      ) : (
        <p id={styles.message}>画像を読み込み中...</p>
      )}
    </div>
  );
};

export default ImageFromFirebase;
