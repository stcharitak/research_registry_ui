import { useEffect, useState } from "react";
import type { Participant } from "../../types/participant";
import { fetchParticipants as fetchParticipantsPage } from "../../services/participantsService";

export default function ParticipantsTable() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [count, setCount] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchParticipants = async (page: number = 1) => {
        try {
            setLoading(true);
            setError("");

            const data = await fetchParticipantsPage(page);

            setParticipants(data.results);
            setCount(data.count);
            setNextUrl(data.next);
            setPreviousUrl(data.previous);
            setCurrentPage(page);
        } catch (err) {
            console.error("Failed to fetch participants", err);
            setError("Failed to load participants.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants(1);
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Participants
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total participants: {count}
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
                                        Code
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        First name
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Last name
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Birth year
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Consent
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Created at
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {participants.length > 0 ? (
                                    participants.map((participant) => (
                                        <tr
                                            key={participant.id}
                                            className="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.code}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.first_name || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.last_name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.email || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.birth_year || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.consent ? "✔️" : "✖️"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                {participant.created_at ? new Date(participant.created_at).toLocaleString("de-DE") : "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            No participants found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            onClick={() => fetchParticipants(currentPage - 1)}
                            disabled={!previousUrl || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Page {currentPage}
                        </span>

                        <button
                            onClick={() => fetchParticipants(currentPage + 1)}
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
