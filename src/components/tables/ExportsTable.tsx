import { useEffect, useState } from "react";
import api from "../../api/client";

export type Export = {
    id: number;
    export_type: string;
    status: string;
    created_at?: Date | string;
    download_url?: string | null;
};

type ExportsResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Export[];
};

export default function ExportsTable() {
    const [exports, setExports] = useState<Export[]>([]);
    const [count, setCount] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownloadExport = async (exportId: number) => {
        try {
            const response = await api.get(`api/exports/${exportId}/download/`, {
                responseType: "blob",
            });

            const contentType = response.headers["content-type"];

            if (contentType && contentType.includes("text/html")) {
                const text = await response.data.text();
                console.error("Expected CSV but got HTML:", text);
                return;
            }

            const disposition = response.headers["content-disposition"];
            let filename = `export-${exportId}.csv`;

            if (disposition) {
                const match = disposition.match(/filename="(.+)"/);
                if (match?.[1]) {
                    filename = match[1];
                }
            }

            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const fetchExports = async (page: number = 1) => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get<ExportsResponse>(
                `/api/exports/?page=${page}`
            );

            setExports(response.data.results);
            setCount(response.data.count);
            setNextUrl(response.data.next);
            setPreviousUrl(response.data.previous);
            setCurrentPage(page);
        } catch (err) {
            console.error("Failed to fetch exports", err);
            setError("Failed to load exports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExports(1);
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Exports
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Exports: {count}
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
                                        Export type
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Created at
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {exports.length > 0 ? (
                                    exports.map((ex) => (
                                        <tr
                                            key={ex.id}
                                            className="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {ex.id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {ex.export_type}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {ex.status || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {ex.created_at ? new Date(ex.created_at).toLocaleString("de-DE") : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {ex.status === "completed" ? (
                                                    <button
                                                        onClick={() => handleDownloadExport(ex.id)}
                                                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                                                    >
                                                        Download
                                                    </button>
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
                                            No exports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            onClick={() => fetchExports(currentPage - 1)}
                            disabled={!previousUrl || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Page {currentPage}
                        </span>

                        <button
                            onClick={() => fetchExports(currentPage + 1)}
                            disabled={!nextUrl || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </>
            )
            }
        </div >
    );
}