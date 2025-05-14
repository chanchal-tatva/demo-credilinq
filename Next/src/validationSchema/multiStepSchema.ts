import { z } from "zod";

export const companyInfoSchema = z.object({
  companyUEN: z
    .string()
    .min(1, "Company UEN is required")
    .regex(/^\d{8}[a-zA-Z]$/, "Invalid Company UEN"),
  companyName: z
    .string()
    .min(1, "Company Name is required")
    .min(2, "Minimum 2 characters required"),
});

export const applicantInfoSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  position: z.string().min(1, "Position is required"),
  emailAddress: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  reEnterEmailAddress: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  mobileNumber: z.string().max(11, "Enter an 8-digit Mobile Number"),
});

export const uploadDocsSchema = z.object({
  pdfDoc: z
    .array(
      z.instanceof(File).refine((file) => file.type === "application/pdf", {
        message: "Only PDF files are allowed",
      })
    )
    .min(1, "At least one PDF file is required")
    .max(6, "You can upload a maximum of 6 PDF files"),
});

export const termsSchema = z.object({
  agreeToTerms: z.literal(true, {
    errorMap: () => ({
      message: "You must agree to the terms and conditions",
    }),
  }),
});

export type ApplicantInfoSchema = z.infer<typeof applicantInfoSchema>;

const baseSchema = companyInfoSchema
  .merge(applicantInfoSchema)
  .merge(uploadDocsSchema)
  .merge(termsSchema);

export const fullSchema = baseSchema
export type StepFormData = z.infer<typeof fullSchema>;

export type CompanyInfoData = z.infer<typeof companyInfoSchema>;
export type ApplicationInfoData = z.infer<typeof applicantInfoSchema>;
export type UploadDocsData = z.infer<typeof uploadDocsSchema>;
