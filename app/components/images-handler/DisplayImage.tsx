import { useState, useEffect } from "react";
import Image from "next/image";

interface DisplayImageProps {
  endpoint: string;
  alt: string;
  className?: string;
  fallbackImage?: string;
}

export const DisplayImage = ({
  endpoint,
  alt,
  className,
  fallbackImage = "",
}: DisplayImageProps) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(endpoint, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ajuste conforme seu token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const data = await response.text();
        setImageData(data);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [endpoint]);

  if (loading) {
    return (
      <div
        className="animate-pulse bg-gray-200 rounded-lg"
        style={{ width: "100%", height: "200px" }}
      />
    );
  }

  if (error || !imageData) {
    return (
      <Image
        src={fallbackImage}
        alt={alt}
        className={className}
        layout="fill"
      />
    );
  }

  return (
    <Image
      src={imageData}
      alt={alt}
      className={className}
      layout="fill"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = fallbackImage;
      }}
    />
  );
};
