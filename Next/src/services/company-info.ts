import axios from "./axios";

// Constants
import { API_ROUTES } from "../constants/apiRoutes";

// Utils
import { getRouteByParams, getRouteByQueryParams } from "@/utils/route";
import {
  ApplicationInfoData,
  CompanyInfoData,
  UploadDocsData,
} from "@/validationSchema/multiStepSchema";

interface GetCompanyDetailsListArgs {
  page: number;
  limit: number;
}

export const getCompanyDetailsList = async ({
  page,
  limit,
}: GetCompanyDetailsListArgs) => {
  try {
    const URL = getRouteByQueryParams(API_ROUTES.LIST, { page, limit });
    const response = await axios.get(URL);
    if (response.status === 200 && response?.data) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCompanyDetails = async (formId: string) => {
  try {
    const URL = getRouteByParams(API_ROUTES.APPLICATION, {
      APPLICATION_ID: formId,
    });
    const response = await axios.get(URL);
    if (response.status === 200 && response?.data) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveCompanyInfo = async (payload: CompanyInfoData) => {
  try {
    const response = await axios.post(API_ROUTES.COMPANY_INFO, payload);
    if (response.status === 201 && response?.data) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface SaveApplicationDataPayload {
  applicationInformation: Omit<
    ApplicationInfoData,
    "emailAddress" | "reEnterEmailAddress"
  > & {
    email: string;
    reEnterEmail: string;
  };
}

export const saveApplication = async (
  formId: string,
  payload: SaveApplicationDataPayload
) => {
  try {
    const URL = getRouteByParams(API_ROUTES.APPLICATION, {
      APPLICATION_ID: formId,
    });
    const response = await axios.patch(URL, payload);
    if (response.status === 201 && response?.data) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface SaveUploadFilesData {
  files: UploadDocsData["pdfDoc"];
}

export const saveUploadFilesData = async (
  formId: string,
  payload: SaveUploadFilesData
) => {
  try {
    // ✅ Construct FormData
    return await Promise.all(payload.files.map(async(file) => {
      const formData = new FormData();
      formData.append("file", file);
      const URL = getRouteByParams(API_ROUTES.DOCUMENT, {
        APPLICATION_ID: formId,
      });
      try {
        const response = await axios.post(URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201 && response?.data) {
          return response?.data;
        }
      } catch(err: any) {
        console.log(err.response.data);
        return {
          ...err.response.data.details,
          error_message: err.response.data.message
        }
      }
    })).then((result) => {
      console.log({ result });
      return result
    });
  } catch (error) {
    // throw error;
  }
};

export const removeAllUploadedFiles = async (formId: string) => {
  try {
    const URL = getRouteByParams(API_ROUTES.DOCUMENT, {
      APPLICATION_ID: formId,
    });
    const response = await axios.delete(URL);
    if (response.status === 200 && response?.data) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const finalSubmit = async (
  formId: string,
  payload: { termsAndConditions: { termsAccepted: boolean } }
) => {
  try {
    const URL = getRouteByParams(API_ROUTES.APPLICATION, {
      APPLICATION_ID: formId,
    });
    const response = await axios.patch(URL, payload);
    if (response.status === 201 && response?.data) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
