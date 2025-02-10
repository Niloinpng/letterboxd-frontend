import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  endpoint: string; // API endpoint for upload (e.g., '/api/users/1/profile-picture' or '/api/media/1/cover')
  onUploadSuccess?: () => void;
  className?: string;
}

export const ImageUpload = ({
  endpoint,
  onUploadSuccess,
  className,
}: ImageUploadProps) => {
  // Track loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Handle file selection and preview
  const handleFileSelect = (file: File) => {
    // Create preview for immediate visual feedback
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle the upload process
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    handleFileSelect(file);

    setLoading(true);
    setError(null);

    // Create form data for upload
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`image-upload-container ${className || ""}`}>
      {preview && (
        <Image
          src={preview}
          alt="Upload Preview"
          className="preview-image max-w-xs"
          width={500}
          height={500}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={loading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {loading && <p className="mt-2 text-gray-600">Uploading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};
