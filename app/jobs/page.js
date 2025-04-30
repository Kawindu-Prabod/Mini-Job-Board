"use client"; // for App Router

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/navbar"; // adjust the path accordingly

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const loaderRef = useRef(null);

    // Fake job fetcher (simulating API calls)
    const fetchJobs = (page) => {
        const newJobs = Array.from({ length: 10 }, (_, i) => ({
            id: (page - 1) * 10 + i + 1,
            title: `Job #${(page - 1) * 10 + i + 1}`,
            description: "This is a placeholder job description.",
        }));
        setJobs((prev) => [...prev, ...newJobs]);
    };

    useEffect(() => {
        fetchJobs(page);
    }, [page]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        const target = loaderRef.current;
        if (target) observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, []);

    return (
        <div>
            <Navbar />
            <main className="p-6">
                <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
                <div className="space-y-4">
                    {jobs.map((job, index) => (
                        <div key={`${job.id}-${index}`} className="border p-4 rounded shadow">
                            <h2 className="text-lg font-semibold">{job.title}</h2>
                            <p>{job.description}</p>
                        </div>
                    ))}

                </div>
                {/* Infinity Scroll Anchor */}
                <div ref={loaderRef} className="h-10 bg-transparent"></div>
            </main>
        </div>
    );
}
