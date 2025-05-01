"use client"; // for App Router

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/navbar"; // adjust the path accordingly

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null); // Store selected job for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
    const loaderRef = useRef(null);

    // Fetch jobs from API
    const fetchJobs = (page) => {
        fetch(`/api/jobs?page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                // Append new jobs only if they are not already in the list
                setJobs((prev) => {
                    const newJobs = data.jobs.filter(
                        (newJob) => !prev.some((job) => job.id === newJob.id)
                    );
                    return [...prev, ...newJobs];
                });
            })
            .catch((err) => console.error("Failed to fetch jobs", err));
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

    // Open modal with job details
    const openModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    return (
        <div>
            <Navbar />
            <main className="p-6">
                <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="border p-4 rounded shadow cursor-pointer"
                            onClick={() => openModal(job)} // Open modal on job click
                        >
                            <h2 className="text-lg font-semibold">{job.title}</h2>
                            <p>{job.description}</p>
                        </div>
                    ))}
                </div>

                {/* Infinity Scroll Anchor */}
                <div ref={loaderRef} className="h-10 bg-transparent"></div>

                {/* Job Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 relative">
                            {/* Close Button inside the modal card */}
                            <button
                                className="absolute top-2 right-2 text-xl font-bold"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-semibold mb-4">
                                {selectedJob?.title}
                            </h2>
                            <p className="mb-2"><strong>Company:</strong> {selectedJob?.company}</p>
                            <p className="mb-2"><strong>Location:</strong> {selectedJob?.location}</p>
                            <p className="mb-2"><strong>Job Type:</strong> {selectedJob?.job_type}</p>
                            <p className="mb-4"><strong>Description:</strong> {selectedJob?.description}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
