import type {
  Applicant,
  ApplicantCreateInput,
  ApiApplication,
  AuthReply,
  ApplicationCreateInput,
  ApiHealth,
  Internship,
  InternshipCreateInput,
} from "../types";
import { useAuthStore } from "../store/authStore";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
export const API_URL = (
  configuredApiUrl || (import.meta.env.DEV ? "http://localhost:3000" : "")
).replace(/\/+$/, "");

const API_BASE_URL = API_URL ? `${API_URL}/api` : "";

async function request<T>(
  path: string,
  init: RequestInit = {},
  includeToken = true,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_URL is missing. Set it to the deployed backend URL and redeploy the frontend.",
    );
  }

  const token = includeToken ? useAuthStore.getState().token : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    if (token && response.status === 401) {
      useAuthStore.getState().logout();
    }

    const responseText = await response.text();
    let message = `Request failed (${response.status})`;
    try {
      const body: unknown = JSON.parse(responseText);
      if (
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
      ) {
        message = body.message;
      }
    } catch {
      if (responseText) message = responseText;
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(body) },
    false,
  );
}

export function registerUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(body) },
    false,
  );
}

export const api = {
  getApplicants: (): Promise<Applicant[]> => request("/applicants"),

  getApplicantById: (id: string): Promise<Applicant> =>
    request(`/applicants/${encodeURIComponent(id)}`),

  createApplicant: (payload: ApplicantCreateInput): Promise<Applicant> =>
    request("/applicants", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getInternships: (): Promise<Internship[]> =>
    request("/internships", {}, false),

  getInternshipById: (id: string): Promise<Internship> =>
    request(`/internships/${encodeURIComponent(id)}`, {}, false),

  createInternship: (payload: InternshipCreateInput): Promise<Internship> =>
    request("/internships", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getApplications: (): Promise<ApiApplication[]> => request("/applications"),

  createApplication: (payload: ApplicationCreateInput): Promise<ApiApplication> =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateApplicationStatus: (
    id: string,
    status: string,
  ): Promise<ApiApplication> =>
    request(`/applications/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  login: loginUser,
  register: registerUser,

  getApiPing: (): Promise<ApiHealth> => request("/health", {}, false),
};
