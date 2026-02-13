import { useCallback } from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const useFormHandlers = <T extends Record<string, any>>(
  setFormData: SetState<T>,
  fileKey?: keyof T
) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    },
    [setFormData],
  );

  const handleSelectChange = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData],
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!fileKey) return;

      setFormData((prev) => ({
        ...prev,
        [fileKey]: file,
      }));
    },
    [setFormData, fileKey],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    },
    [],
  );

  return {
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleDrop,
    handleDragOver,
  };
}

export default useFormHandlers;