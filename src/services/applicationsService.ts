import api from "../api/client";
import type { Application } from "../types/application";
import type { PaginatedResponse } from "../types/common";

export type ApplicationsQuery = {
  page?: number;
  status?: string;
  study?: string;
  participant?: string;
  reviewed_by?: string;
  ordering?: string;
};

export type ApplicationsExportFilters = {
  status?: string;
  study_id?: number;
  participant_id?: number;
  reviewed_by_id?: number;
};

export async function fetchApplications(
  query: ApplicationsQuery = {},
): Promise<PaginatedResponse<Application>> {
  const response = await api.get<PaginatedResponse<Application>>("/api/applications/", {
    params: query,
  });
  return response.data;
}

export async function approveApplication(applicationId: number): Promise<void> {
  await api.post(`/api/applications/${applicationId}/approve/`);
}

export async function rejectApplication(applicationId: number): Promise<void> {
  await api.post(`/api/applications/${applicationId}/reject/`);
}

export async function requestApplicationsExport(
  filters: ApplicationsExportFilters = {},
): Promise<void> {
  await api.post("/api/exports/", {
    export_type: "applications",
    filters,
  });
}
