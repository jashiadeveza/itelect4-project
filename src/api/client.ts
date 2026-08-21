import type {
  Applicant,
  ApplicantCreateInput,
  Application,
  ApplicationCreateInput,
  Internship,
  InternshipCreateInput,
  ApiResponse,
} from "../types";

const API_BASE_URL = "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  getApplicants: async (): Promise<Applicant[]> => {
    const result = await request<Applicant[]>("/applicants");
    return result;
  },

  getApplicantById: async (id: number): Promise<Applicant> => {
    const result = await request<Applicant>(`/applicants/${id}`);
    return result;
  },

  createApplicant: async (payload: ApplicantCreateInput): Promise<Applicant> => {
    const result = await request<Applicant>("/applicants", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return result;
  },

  getInternships: async (): Promise<Internship[]> => {
    const result = await request<Internship[]>("/internships");
    return result;
  },

  createInternship: async (payload: InternshipCreateInput): Promise<Internship> => {
    const result = await request<Internship>("/internships", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return result;
  },

  getApplications: async (): Promise<Application[]> => {
    const result = await request<Application[]>("/applications");
    return result;
  },

  createApplication: async (payload: ApplicationCreateInput): Promise<Application> => {
    const result = await request<Application>("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return result;
  },

  updateApplicationStatus: async (id: number, status: string): Promise<Application> => {
    const current = await api.getApplications();
    const target = current.find((item) => item.id === id);

    if (!target) {
      throw new Error(`Application ${id} not found`);
    }

    const result = await request<Application>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return result;
  },

  getApiPing: async (): Promise<ApiResponse<{ ok: true }>> => {
    const result = await request<ApiResponse<{ ok: true }>>("/applicants?_limit=1");
    return result;
  },
};
