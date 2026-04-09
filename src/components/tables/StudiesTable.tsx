import { useEffect, useState } from "react";
import api from "../../api/client";

export type Study = {
    id: number;
    title: string;
    description?: string | null;
    status: string;
    created_by_username: string;
    created_at?: Date | string;
};

type StudiesResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Study[];
};

export default function StudiesTable() {
    const [studies, setStudies] = useState<Study[]>([]);
    const [count, setCount] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchStudies = async (page: number = 1) => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get<StudiesResponse>(
                `/api/studies/?page=${page}`
            );

            setStudies(response.data.results);
            setCount(response.data.count);
            setNextUrl(response.data.next);
            setPreviousUrl(response.data.previous);
            setCurrentPage(page);
        } catch (err) {
            console.error("Failed to fetch studies", err);
            setError("Failed to load studies.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudies(1);
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Studies
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total studies: {count}
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
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Created by
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Created at
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {studies.length > 0 ? (
                                    studies.map((study) => (
                                        <tr
                                            key={study.id}
                                            className="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {study.id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {study.title}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {study.description || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {study.status || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {study.created_by_username || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {study.created_at ? new Date(study.created_at).toLocaleString("de-DE") : "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            No studies found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            onClick={() => fetchStudies(currentPage - 1)}
                            disabled={!previousUrl || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Page {currentPage}
                        </span>

                        <button
                            onClick={() => fetchStudies(currentPage + 1)}
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