import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-blue-500 text-white px-4 py-2">
            <div className="flex justify-between items-center">
                <a href="/" className="text-lg font-bold">
                    KudosPay
                </a>
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                    >
                        ☰
                    </button>
                </div>
                <div className={`flex-col md:flex md:flex-row md:space-x-4 ${isOpen ? "block" : "hidden"} md:block`}>
                    <a href="/dashboard" className="hover:underline">
                        Dashboard
                    </a>
                    <a href="/profile" className="hover:underline">
                        Profile
                    </a>
                    <button
                        className="hover:underline"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
