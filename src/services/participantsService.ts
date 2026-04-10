import api from "../api/client";
import type { PaginatedResponse } from "../types/common";
import type { Participant } from "../types/participant";

export async function fetchParticipants(
  page: number = 1,
): Promise<PaginatedResponse<Participant>> {
  const response = await api.get<PaginatedResponse<Participant>>("/api/participants/", {
    params: { page },
  });
  return response.data;
}
