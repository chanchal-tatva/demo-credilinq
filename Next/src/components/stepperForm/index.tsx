"use client";
import {
  applicantInfoSchema,
  ApplicationInfoData,
  CompanyInfoData,
  companyInfoSchema,
  fullSchema,
  StepFormData,
  termsSchema,
  uploadDocsSchema,
} from "@/validationSchema/multiStepSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import ApplicantInfoStep from "./steps/ApplicantInfoStep";
import CompanyInfoStep from "./steps/CompanyInfoStep";
import TermsAndConditionsStep from "./steps/TermsAndConditionsStep";
import UploadDocsStep from "./steps/UploadDocsStep";
import {
  finalSubmit,
  getCompanyDetails,
  saveApplication,
  saveCompanyInfo,
} from "@/services/company-info";

import { useRouter, useSearchParams } from "next/navigation";

export interface UploadedFile {
  id: string;
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
  error?: boolean;
  error_message?: string;
}

interface StepComponentInterface {
  isDisabled: boolean;
  uploadedFiles?: UploadedFile[];
}

const steps = [
  {
    title: "Company Information",
    component: ({ isDisabled }: StepComponentInterface) => (
      <CompanyInfoStep isDisabled={isDisabled} />
    ),
    schema: companyInfoSchema,
    fields: ["companyUEN", "companyName"],
  },
  {
    title: "Applicant Information",
    component: ({ isDisabled }: StepComponentInterface) => (
      <ApplicantInfoStep />
    ),
    schema: applicantInfoSchema,
    fields: [
      "fullName",
      "position",
      "emailAddress",
      "reEnterEmailAddress",
      "mobileNumber",
    ],
  },
  {
    title: "Upload Document",
    component: ({ isDisabled, uploadedFiles }: StepComponentInterface) => (
      <UploadDocsStep isDisabled={isDisabled} uploadedFiles={uploadedFiles} />
    ),
    schema: uploadDocsSchema,
    fields: ["pdfDoc"],
  },
  {
    title: "Terms & Conditions",
    component: ({ isDisabled }: StepComponentInterface) => (
      <TermsAndConditionsStep isDisabled={isDisabled} />
    ),
    schema: termsSchema,
    fields: ["agreeToTerms"],
  },
];

interface SaveFormData {
  activeStep: number;
  formValues?: Partial<StepFormData>;
}

export default function StepperForm() {
  const searchParams = useSearchParams();
  const submittedFormId = searchParams.get("formId");
  const [activeStep, setActiveStep] = useState(0);
  const [validatedStep, setValidatedStep] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    4: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState([] as UploadedFile[]);

  const router = useRouter();

  const methods = useForm<StepFormData>({
    resolver: zodResolver(fullSchema),
    mode: "all",
  });

  const { watch, setError, trigger, clearErrors } = methods;

  const { dirtyFields } = methods.formState;

  const email = watch("emailAddress");
  const reEmail = watch("reEnterEmailAddress");

  useEffect(() => {
    if (email !== reEmail) {
      console.log("NOT_MATCHED");
      setError("reEnterEmailAddress", {
        message: "Email addresses do not match",
      });
      trigger("reEnterEmailAddress");
    } else {
      clearErrors("reEnterEmailAddress");
    }
  }, [email, reEmail, dirtyFields]);

  useEffect(() => {
    if (submittedFormId) {
      getCompanyDetails(submittedFormId)
        .then((result) => {
          methods.reset({
            companyName: result?.companyName,
            companyUEN: result?.companyUEN,
            fullName: result?.fullName,
            emailAddress: result?.email,
            reEnterEmailAddress: result?.email,
            mobileNumber: result?.mobileNumber,
            position: result?.position,
          });

          if (result?.email) {
            setActiveStep(2);
          }

          if (result?.documents.length > 0) {
            setUploadedFiles(result?.documents);
            setActiveStep(3);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [submittedFormId]);

  const currentStep = steps[activeStep];
  const watchedValues = useWatch({ control: methods.control });

  const saveFormData = async ({ activeStep, formValues }: SaveFormData) => {
    if (activeStep === 0 && !submittedFormId) {
      const { companyName, companyUEN } = formValues as CompanyInfoData;
      const result = await saveCompanyInfo({ companyName, companyUEN });
      const formId = result?.id;
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set("formId", formId);
      router.push(`?${newSearchParams.toString()}`);
    } else if (activeStep === 1) {
      const {
        fullName,
        position,
        emailAddress,
        reEnterEmailAddress,
        mobileNumber,
      } = formValues as ApplicationInfoData;

      try {
        await saveApplication(submittedFormId as string, {
          applicationInformation: {
            fullName,
            position,
            email: emailAddress,
            reEnterEmail: reEnterEmailAddress,
            mobileNumber,
          },
        });
      } catch (error) {
        console.log({ error });
      }
    }
  };

  useEffect(() => {
    const currentValues = methods.getValues();
    const currentSchema = currentStep.schema;
    const validation = currentSchema?.safeParse(currentValues);
    if (validation.success) {
      saveFormData({ activeStep, formValues: methods.getValues() });
      setValidatedStep((prevState) => {
        const updateState = { ...prevState, [activeStep + 1]: false };
        return updateState;
      });
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }
  }, [watchedValues]); // Re-run when relevant fields change

  const onSubmit = async (data: StepFormData) => {
    try {
      const result = await finalSubmit(submittedFormId as string, {
        termsAndConditions: {
          termsAccepted: true,
        },
      });
      console.log({ result });

      // Show the listing only after successful submission
      router.push("/list");
    } catch (error) {
      console.log({ error });
    }
  };

  const getFormStatus = ({ activeStep }: { activeStep: number }) => {
    return validatedStep[activeStep];
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        maxWidth: "1150px",
        margin: "auto",
        padding: "48px 32px",
      }}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(onSubmit, (errors) => {
            console.error("❌ Form submission failed with errors:", errors);
          })}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step) => {
              return (
                <Step key={step.title}>
                  <StepLabel>
                    <Box
                      className="stepHeader"
                      sx={{
                        backgroundColor: "rgb(96, 26, 121)",
                        fontSize: "20px",
                        marginBottom: "8px",
                      }}
                    >
                      {step.title}
                    </Box>
                  </StepLabel>
                  <StepContent
                    slotProps={{
                      transition: {
                        in: true,
                      },
                    }}
                  >
                    {step.component({
                      isDisabled: getFormStatus({ activeStep }),
                      uploadedFiles,
                    })}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              disabled={!watchedValues.agreeToTerms}
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Paper>
  );
}
