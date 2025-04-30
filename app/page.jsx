"use client";

import Navbar from '../components/navbar';
import Link from "next/link";
import Footer from '../components/footer';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [sessionStatus, setSessionStatus] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const status = parseInt(localStorage.getItem("sessionStatus")) || 0;
    setSessionStatus(status);
  }, []);

  const handleStartHiring = () => {
    if (sessionStatus === 1) {
      router.push("/post-job");
    } else {
      router.push("/login");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen flex flex-col justify-between bg-gray-50">
        {/* Hero Split Section */}
        <section className="flex flex-col md:flex-row flex-grow">
          {/* Left - Job Seekers */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-100 to-blue-300 text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Looking for a Job?</h2>
            <p className="text-blue-900 mb-6">🚀 Discover thousands of opportunities across industries.</p>
            <Link
              href="/jobs"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Find Jobs
            </Link>
          </div>

          {/* Right - Employers */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-green-100 to-green-300 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Hiring Talent?</h2>
            <p className="text-green-900 mb-6">🤝 Connect with top candidates instantly and effortlessly.</p>
            <button
              onClick={handleStartHiring}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Start Hiring
            </button>
          </div>
        </section>


        {/* Subscribe Section */}
        <section className="bg-white py-10 text-center border-t border-gray-200">
          <h3 className="text-2xl font-semibold mb-4">Stay in the Loop</h3>
          <p className="text-gray-600 mb-4">Subscribe to our newsletter for updates, tips, and trends.</p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-2 px-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
