"use client";
import DragAndDropPDF from "@/components/DragAndDrop/DragAndDropPDF";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { UploadedFile } from "..";

export default function UploadDocsStep({
  isDisabled,
  uploadedFiles,
  submittedFormId
}: {
  isDisabled: boolean;
  uploadedFiles?: UploadedFile[];
  submittedFormId?:string
}) {
  const { setValue, trigger, register } = useFormContext();

  useEffect(() => {
    register("pdfDoc");
  }, [register]);

  const handleFilesChange = async (files: File[]) => {
    setValue("pdfDoc", files, { shouldValidate: true });
    trigger("pdfDoc");
  };

  return (
    <Box>
      <DragAndDropPDF
        onChange={handleFilesChange}
        disabled={isDisabled}
        uploadedFilesData={uploadedFiles}
        submittedFormIdLocal={submittedFormId}
      />
    </Box>
  );
}
