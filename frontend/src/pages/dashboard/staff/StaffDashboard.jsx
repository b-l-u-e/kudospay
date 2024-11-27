import { useState } from "react";

const StaffDashboard = () => {
    const [tasks] = useState([
        { id: 1, title: "Complete Customer Order #1234", status: "In Progress" },
        { id: 2, title: "Team Meeting at 3:00 PM", status: "Scheduled" },
        { id: 3, title: "Monthly Performance Review", status: "Pending" },
    ]);

    const [performanceMetrics] = useState({
        tipsEarned: "$2,000",
        completedTasks: 48,
        rating: "4.8/5",
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-green-600 text-white p-4 shadow">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Staff Dashboard</h1>
                    <p>Welcome, Staff Member!</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                {/* Performance Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded shadow text-center hover:shadow-lg transition-shadow">
                            <p className="text-3xl font-bold text-green-600">
                                {performanceMetrics.tipsEarned}
                            </p>
                            <p className="text-lg text-gray-700">Tips Earned</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow text-center hover:shadow-lg transition-shadow">
                            <p className="text-3xl font-bold text-green-600">
                                {performanceMetrics.completedTasks}
                            </p>
                            <p className="text-lg text-gray-700">Completed Tasks</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow text-center hover:shadow-lg transition-shadow">
                            <p className="text-3xl font-bold text-green-600">
                                {performanceMetrics.rating}
                            </p>
                            <p className="text-lg text-gray-700">Rating</p>
                        </div>
                    </div>
                </section>

                {/* Tasks Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
                    <div className="bg-white rounded shadow divide-y">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 flex justify-between hover:bg-gray-50"
                                >
                                    <p className="text-gray-700">{task.title}</p>
                                    <span
                                        className={`px-2 py-1 rounded text-sm ${
                                            task.status === "In Progress"
                                                ? "bg-yellow-200 text-yellow-800"
                                                : task.status === "Scheduled"
                                                ? "bg-blue-200 text-blue-800"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-gray-500">No tasks assigned</p>
                        )}
                    </div>
                </section>

                {/* Quick Links Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <a
                            href="/staff/performance"
                            className="block p-4 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-colors"
                        >
                            View Performance
                        </a>
                        <a
                            href="/staff/account"
                            className="block p-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
                        >
                            Manage Account
                        </a>
                        <a
                            href="/staff/tasks"
                            className="block p-4 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition-colors"
                        >
                            View Tasks
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StaffDashboard;
