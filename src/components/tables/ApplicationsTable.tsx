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

export default function ApplicationsTable() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [count, setCount] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchApplications = async (page: number = 1) => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get<ApplicationsResponse>(
                `/api/applications/?page=${page}`
            );

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
    }, []);

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
            </div>

            {loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            )}

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Participant
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Study
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Reviewed by
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Created at
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
                                                {application.participant.first_name} {application.participant.last_name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.study?.title || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.status || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.reviewed_by
                                                    ? `${application.reviewed_by.username} (${application.reviewed_by.role})`
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {application.created_at ? new Date(application.created_at).toLocaleString("de-DE") : "-"}
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