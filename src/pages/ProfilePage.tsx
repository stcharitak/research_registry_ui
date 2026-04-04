export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Profile
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Account details will appear here.
                </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                    <p className="font-medium text-gray-900 dark:text-white">-</p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">-</p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-medium text-gray-900 dark:text-white">-</p>
                </div>
            </div>
        </div>
    );
}