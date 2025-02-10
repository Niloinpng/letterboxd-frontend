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
    formData.append("image", file);

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
        className="cursor-pointer"
        onClick={(e) => {
          // Previne a propagação do clique para garantir que o input seja acionado
          e.stopPropagation();
        }}
      >
        {children}
      </label>

      {loading && <p className="mt-2 text-gray-600">Uploading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* {preview && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-black bg-opacity-50 p-4 rounded-lg z-50"
        >
          <Image
            src={preview}
            alt="Upload Preview"
            className="max-w-xs rounded-lg"
            width={300}
            height={300}
            objectFit="contain"
          />
          {loading ? (
            <p className="text-white text-center mt-2">Enviando...</p>
          ) : (
            <p className="text-white text-center mt-2">Preview da imagem</p>
          )}
        </div>
      )} */}
    </div>
  );
};
