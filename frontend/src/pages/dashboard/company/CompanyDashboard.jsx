import { useState } from "react";

const CompanyDashboard = () => {
    const [metrics] = useState([
        { id: 1, label: "Total Staff", value: 25 },
        { id: 2, label: "Pending Approvals", value: 5 },
        { id: 3, label: "Total Transactions", value: 150 },
        { id: 4, label: "Revenue", value: "$20,000" },
    ]);

    const [recentActivities] = useState([
        { id: 1, message: "New staff member registered: John Doe", timestamp: "1 hour ago" },
        { id: 2, message: "Transaction completed: $500 to Staff Pool", timestamp: "2 hours ago" },
        { id: 3, message: "Profile updated by admin", timestamp: "Yesterday" },
    ]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4 shadow">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Company Dashboard</h1>
                    <p>Welcome, Company Admin!</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                {/* Metrics Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Company Metrics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((metric) => (
                            <div
                                key={metric.id}
                                className="bg-white p-6 rounded shadow text-center hover:shadow-lg transition-shadow"
                            >
                                <p className="text-3xl font-bold text-blue-600">{metric.value}</p>
                                <p className="text-lg text-gray-700">{metric.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Actions Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <a
                            href="/company/staff"
                            className="block p-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
                        >
                            Manage Staff
                        </a>
                        <a
                            href="/company/transactions"
                            className="block p-4 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-colors"
                        >
                            View Transactions
                        </a>
                        <a
                            href="/company/settings"
                            className="block p-4 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition-colors"
                        >
                            Configure Settings
                        </a>
                    </div>
                </section>

                {/* Recent Activity Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="bg-white rounded shadow divide-y">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <div key={activity.id} className="p-4 hover:bg-gray-50">
                                    <p className="text-gray-700">{activity.message}</p>
                                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-gray-500">No recent activity</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CompanyDashboard;
