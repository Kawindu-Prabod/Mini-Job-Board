"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const JOBS_PER_PAGE = 15;

    const fetchJobs = (page) => {
        fetch(`/api/jobs?page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                setJobs(data.jobs);
                // If fewer than 15 jobs returned, we’re likely at the end
                setHasNext(data.jobs.length === JOBS_PER_PAGE);
            })
            .catch((err) => {
                console.error("Failed to fetch jobs", err);
                setJobs([]);
                setHasNext(false);
            });
    };

    useEffect(() => {
        fetchJobs(page);
    }, [page]);

    const openModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    const handleNext = () => {
        if (hasNext) setPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (page > 1) setPage((prev) => prev - 1);
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
                        className="border p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => openModal(job)}
                    >
                    
                            <h2 className="text-lg font-semibold">{job.title}</h2>
                            <p className="text-sm text-gray-600">{job.company}</p>
                            <p>{job.location_type}</p>
                        </div>
                    ))}
                </div>
                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold transition-colors duration-200"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <h2 className="text-2xl font-semibold mb-4">{selectedJob?.title}</h2>
                            <p className="mb-2"><strong>Company:</strong> {selectedJob?.company}</p>
                            <p className="mb-2"><strong>Location:</strong> {selectedJob?.location}</p>
                            <p className="mb-2"><strong>Job Type:</strong> {selectedJob?.job_type}</p>
                            <div className="mb-4">
                                <strong>Description:</strong>
                                <div className="mt-1 max-h-60 overflow-y-auto p-2 bg-gray-100 rounded text-sm leading-relaxed">
                                    {selectedJob?.description}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={handlePrevious}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        Previous
                    </button>
                    <span className="font-semibold">Page {page}</span>
                    <button
                        onClick={handleNext}
                        disabled={!hasNext}
                        className={`px-4 py-2 rounded ${!hasNext ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
}
