import { useState, ReactNode } from "react";

interface ImageUploadProps {
  endpoint: string;
  onUploadSuccess?: () => void;
  className?: string;
  children?: ReactNode;
}

export const ImageUpload = ({
  endpoint,
  onUploadSuccess,
  className,
  children,
}: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [preview, setPreview] = useState<string | null>(null);

  // Adicionando uma referência única para o ID do input
  const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    // reader.onloadend = () => {
    //   setPreview(reader.result as string);
    // };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    handleFileSelect(file);

    setLoading(true);
    setError(null);

    const formData = new FormData();
    // Verifica se o endpoint contém "cover" para decidir qual chave usar
    const formDataKey = endpoint.includes("/cover") ? "cover" : "image";
    formData.append(formDataKey, file);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

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
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={loading}
        className="hidden"
        id={inputId}
      />

      <label
        htmlFor={inputId}
        className="cursor-pointer w-full" // Adicionado w-full
      >
        {children}
      </label>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <p className="text-white">Enviando...</p>
        </div>
      )}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-red-500 text-white text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
