export default function ExportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Exports
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Create and track CSV export jobs.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
                <table className="min-w-full text-sm">
                    <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Created</th>
                            <th className="px-4 py-3 text-left">Finished</th>
                            <th className="px-4 py-3 text-left">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-4 text-gray-500" colSpan={6}>
                                No exports loaded yet.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}