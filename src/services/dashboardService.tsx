import api from "../api/client";

type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type DashboardStats = {
    totalStudies: number;
    totalApplications: number;
    totalParticipants: number;
};

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