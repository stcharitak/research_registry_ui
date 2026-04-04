export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    Research Registry
                </h1>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    Sign in to continue.
                </p>

                <form className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Username or email
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-95 dark:bg-white dark:text-gray-900"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}