import api from "../api/client";
import type { PaginatedResponse } from "../types/common";
import type { DashboardStats } from "../types/dashboard";

export async function fetchDashboardStats(): Promise<DashboardStats> {
    const [studiesResponse, applicationsResponse, participantsResponse] = await Promise.all([
        api.get<PaginatedResponse<unknown>>("/api/studies/"),
        api.get<PaginatedResponse<unknown>>("/api/applications/"),
        api.get<PaginatedResponse<unknown>>("/api/participants/"),
    ]);

    return {
        totalStudies: studiesResponse.data.count,
        totalApplications: applicationsResponse.data.count,
        totalParticipants: participantsResponse.data.count,
    };
}
