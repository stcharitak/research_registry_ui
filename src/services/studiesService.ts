import api from "../api/client";
import type { PaginatedResponse } from "../types/common";
import type { Study } from "../types/study";

export async function fetchStudies(
  page: number = 1,
): Promise<PaginatedResponse<Study>> {
  const response = await api.get<PaginatedResponse<Study>>("/api/studies/", {
    params: { page },
  });
  return response.data;
}
