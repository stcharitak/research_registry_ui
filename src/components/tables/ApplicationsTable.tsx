import { useEffect, useState } from "react";
import api from "../../api/client";
import type { Participant } from "./ParticipantsTable";
import { Study } from "./StudiesTable";
import { User } from "./UsersTable";

export type Application = {
    id: number;
    participant: Participant;
    study?: Study | null;
    status: string;
    reviewed_by?: User | null;
    created_at?: Date | string;
};

type ApplicationsResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Application[];
};

type Props = {
    currentUser: User | null;
};

export default function ApplicationsTable({
    currentUser
}: Props) {
    const canManageApplication = (application: Application) => {
        if (!currentUser) return null;
        return (
            currentUser.role === "admin" ||
            currentUser.id === application.reviewed_by?.id
        );
    };
    const getAvailableActions = (status: string) => {
        return {
            canApprove: status !== "approved",
            canReject: status !== "rejected",
        };
    };
    const handleApprove = async (applicationId: number) => {
        try {
            await api.post(`/api/applications/${applicationId}/approve/`);

            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application.id === applicationId
                        ? {
                            ...application,
                            status: "approved",
                            reviewed_by: currentUser
                                ? {
                                    id: currentUser.id,
                                    username: currentUser.username,
                                    email: currentUser.email ?? "",
                                    role: currentUser.role,
                                }
                                : application.reviewed_by,
                        }
                        : application
                )
            );
        } catch (error) {
            console.error("Failed to approve application", error);
        }
    };

    const handleReject = async (applicationId: number) => {
        try {
            await api.post(`/api/applications/${applicationId}/reject/`);

            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application.id === applicationId
                        ? {
                            ...application,
                            status: "rejected",
                            reviewed_by: currentUser
                                ? {
                                    id: currentUser.id,
                                    username: currentUser.username,
                                    email: currentUser.email ?? "",
                                    role: currentUser.role,
                                }
                                : application.reviewed_by,
                        }
                        : application
                )
            );
        } catch (error) {
            console.error("Failed to reject application", error);
        }
    };
    const [applications, setApplications] = useState<Application[]>([]);
    const [count, setCount] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [exporting, setExporting] = useState(false);
    const [exportMessage, setExportMessage] = useState("");

    const [ordering, setOrdering] = useState<string>("");

    const [filters, setFilters] = useState({
        status: "",
        study: "",
        participant: "",
        reviewed_by: "",
    });

    // =========================
    // FILTER HANDLER
    // =========================
    const handleFilterChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            status: "",
            study: "",
            participant: "",
            reviewed_by: "",
        });
        setOrdering("");
    };

    const handleExportCSV = async () => {
        try {
            setExporting(true);
            setExportMessage("");

            await api.post("/api/exports/", {
                export_type: "applications",
            });

            setExportMessage("Export job created successfully.");
        } catch (error) {
            console.error("Failed to create export job", error);
            setExportMessage("Failed to create export job.");
        } finally {
            setExporting(false);
        }
    };

    const [error, setError] = useState("");

    const fetchApplications = async (page: number = 1) => {
        try {
            setLoading(true);
            setError("");

            const params: Record<string, string | number> = { page };

            if (filters.status) params.status = filters.status;
            if (filters.study) params.study = filters.study;
            if (filters.participant) params.participant = filters.participant;
            if (filters.reviewed_by) params.reviewed_by = filters.reviewed_by;
            if (ordering) params.ordering = ordering;

            const response = await api.get<ApplicationsResponse>("/api/applications/", { params });

            setApplications(response.data.results);
            setCount(response.data.count);
            setNextUrl(response.data.next);
            setPreviousUrl(response.data.previous);
            setCurrentPage(page);
        } catch (err) {
            console.error("Failed to fetch applications", err);
            setError("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications(1);
    }, [filters, ordering]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Applications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total applications: {count}
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={exporting}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {exporting ? "Creating export..." : "Export CSV"}
                </button>
            </div>

            {exportMessage && (
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    {exportMessage}
                </p>
            )}

            {loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            )}

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {/* Filters */}
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="rounded-lg border px-4 py-2 text-sm dark:bg-gray-900"
                >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                <input
                    type="number"
                    name="study"
                    value={filters.study}
                    onChange={handleFilterChange}
                    placeholder="Study ID"
                    className="rounded-lg border px-4 py-2 text-sm dark:bg-gray-900"
                />

                <input
                    type="number"
                    name="participant"
                    value={filters.participant}
                    onChange={handleFilterChange}
                    placeholder="Participant ID"
                    className="rounded-lg border px-4 py-2 text-sm dark:bg-gray-900"
                />

                <input
                    type="number"
                    name="reviewed_by"
                    value={filters.reviewed_by}
                    onChange={handleFilterChange}
                    placeholder="Reviewer ID"
                    className="rounded-lg border px-4 py-2 text-sm dark:bg-gray-900"
                />
            </div>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={resetFilters}
                    className="rounded-lg border px-4 py-2 text-sm"
                >
                    Reset filters
                </button>
            </div>

            {!loading && !error && (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                                        onClick={() =>
                                            setOrdering((prev) =>
                                                prev === "id" ? "-id" : "id"
                                            )
                                        }>
                                        ID
                                    </th>
                                    <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                                        onClick={() =>
                                            setOrdering((prev) =>
                                                prev === "participant" ? "-participant" : "participant"
                                            )
                                        }>
                                        Participant
                                    </th>
                                    <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                                        onClick={() =>
                                            setOrdering((prev) =>
                                                prev === "study" ? "-study" : "study"
                                            )
                                        }>
                                        Study
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                                        onClick={() =>
                                            setOrdering((prev) =>
                                                prev === "reviewed_by" ? "-reviewed_by" : "reviewed_by"
                                            )
                                        }>
                                        Reviewed by
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Created at
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {applications.length > 0 ? (
                                    applications.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.participant.first_name} {application.participant.last_name} (ID: {application.participant.id})
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.study?.title || "-"} (ID: {application.study?.id || "-"})
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.status || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.reviewed_by
                                                    ? `${application.reviewed_by.username} (${application.reviewed_by.role})`
                                                    : "-"}
                                                (ID: {application.reviewed_by?.id || "-"})
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.created_at ? new Date(application.created_at).toLocaleString("de-DE") : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                {canManageApplication(application) ? (
                                                    (() => {
                                                        const { canApprove, canReject } = getAvailableActions(application.status);

                                                        return (
                                                            <div className="flex gap-2">
                                                                {canApprove && (
                                                                    <button
                                                                        onClick={() => handleApprove(application.id)}
                                                                        className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                )}

                                                                {canReject && (
                                                                    <button
                                                                        onClick={() => handleReject(application.id)}
                                                                        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })()
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            onClick={() => fetchApplications(currentPage - 1)}
                            disabled={!previousUrl || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Page {currentPage}
                        </span>

                        <button
                            onClick={() => fetchApplications(currentPage + 1)}
                            disabled={!nextUrl || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}