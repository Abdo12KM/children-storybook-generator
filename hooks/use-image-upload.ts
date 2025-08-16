import { useCallback } from "react";

export function useImageUpload() {
  const handleImageUpload = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      onUpload: (result: string) => void,
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onUpload(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  return { handleImageUpload };
}
