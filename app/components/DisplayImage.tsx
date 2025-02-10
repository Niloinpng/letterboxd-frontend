import { useState, useEffect } from "react";
import Image from "next/image";

interface DisplayImageProps {
  endpoint: string; // API endpoint for fetching (e.g., '/api/users/1/profile-picture' or '/api/media/1/cover')
  alt: string;
  className?: string;
  fallbackImage?: string;
}

export const DisplayImage = ({
  endpoint,
  alt,
  className,
  fallbackImage = "/placeholder-image.png",
}: DisplayImageProps) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(endpoint);

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
