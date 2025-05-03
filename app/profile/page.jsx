'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', success: true });
    const [selectedJob, setSelectedJob] = useState(null);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const [deleteModal, setDeleteModal] = useState(false);


    const [locationType, setLocationType] = useState("");
    const [jobType, setJobType] = useState("");
    const [location, setLocation] = useState("");
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);

    useEffect(() => {
        const session = localStorage.getItem('sessionStatus');
        const userData = JSON.parse(localStorage.getItem('user'));

        if (session !== '1' || !userData) {
            router.push('/login');
        } else {
            setUser(userData);
            // Fetch jobs for the logged-in user
            fetch(`/api/job?email=${userData.email}`)
                .then((res) => res.json())
                .then((data) => setJobs(data.jobs || [])) // Sets jobs if available
                .catch((err) => console.error('Failed to fetch jobs', err));
        }
    }, []);

    const handleDeleteJob = async () => {
        try {
            const response = await fetch('/api/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId: selectedJob.id }), // Pass the job ID
            });

            const result = await response.json();

            if (response.ok) {
                setNotification({ show: true, message: result.message, success: true });
                setJobs(jobs.filter((job) => job.id !== selectedJob.id)); // Remove the deleted job from the list
                // closeDeleteModal();
                setSelectedJob();
            } else {
                setNotification({ show: true, message: 'Failed to delete job', success: false });
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            setNotification({ show: true, message: 'Failed to delete job', success: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data to send
        const jobData = {
            title,
            company,
            location_type: locationType,
            location, // This will be null if location is not required
            job_type: jobType,
            description,
            email: user.email, // Ensure you're sending the logged-in user's email
        };

        try {
            // Send POST request to the backend API
            const response = await fetch('/api/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            const result = await response.json();

            if (response.ok) {
                // If job published successfully
                setNotification({ show: true, message: result.message, success: true });
                setTimeout(() => setNotification({ show: false, message: '', success: true }), 3000);
                // Show success message or do something else
                closeModal();  // Close modal after successful submission
            } else {
                // Handle error
                setNotification({ show: true, message: 'Failed to publish job', success: false });
                setTimeout(() => setNotification({ show: false, message: '', success: true }), 3000);

            }
        } catch (error) {
            console.error('Error submitting job:', error);
            setNotification({ show: true, message: 'Failed to publish job', success: false });
            setTimeout(() => setNotification({ show: false, message: '', success: true }), 3000);

        }
    };


    if (!user) return <div className="text-center mt-20">Loading profile...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex flex-grow bg-gray-100 p-6 gap-6">

                {/* LEFT COLUMN: Profile Section */}
                <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-6 rounded shadow space-y-6">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center py-10 space-y-4">
                        <div className="bg-white rounded-full p-4 shadow-md">
                            <img src="https://img.icons8.com/wired/64/circled-user.png" alt="User Icon" className="w-24 h-24" />
                        </div>
                        <h2 className="text-2xl font-semibold">
                            {user.fname} {user.lname}
                        </h2>
                        <div className="w-full max-w-md border-b border-gray-400 my-6" />
                    </div>
                    {/* Details */}
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Name:</span>
                            <span>{user.fname} {user.lname}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span>{user.email}</span>
                        </div>
                        {/* You can hide password toggle section if necessary */}
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Password:</span>
                            <span>{showPassword ? user.password : '••••••••'}</span>
                        </div>
                        <div className="flex justify-end">
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="mr-2 text-sm text-gray-600">Show</span>
                                <div className="flex items-center space-x-2">
                                    <div role="switch" aria-checked={showPassword} tabIndex={0} className={`w-12 h-6 flex items-center
              bg-gray-300 rounded-full p-1 cursor-pointer transition ${showPassword ? 'bg-blue-500' : 'bg-gray-300'}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                        onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${showPassword
                                            ? 'translate-x-6' : ''}`} />
                                    </div>
                                    <span className="text-sm text-gray-700">{showPassword ? 'Visible' : 'Hidden'}</span>
                                </div>


                            </label>
                        </div>


                    </div>
                </div>

                {/* RIGHT COLUMN: Jobs Section */}
                <div className="w-full md:w-1/2 lg:w-2/3 bg-white p-6 rounded shadow space-y-4 relative">
                    {/* Title and Button */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">My Jobs</h2>
                        <button onClick={openModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                            Submit Vacancy
                        </button>
                    </div>

                    {/* Job Cards */}
                    {jobs.length === 0 ? (
                        <p className="text-gray-500">You haven't published any jobs yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className="cursor-pointer border p-4 rounded hover:shadow transition"
                                >
                                    <h3 className="font-medium text-lg">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.company}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Modal Popup */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">

                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                            >
                                ×
                            </button>

                            {/* Modal Content */}
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Publish New Vacancy</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Job Title */}
                                <div>
                                    <label className="block text-sm font-medium">Job Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter Job Title"
                                        required
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="block text-sm font-medium">Company</label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="Enter Company Name"
                                        required
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                {/* Location Type */}
                                <div>
                                    <label className="block text-sm font-medium">Location Type</label>
                                    <select
                                        name="locationType"
                                        value={locationType}
                                        onChange={(e) => setLocationType(e.target.value)}
                                        required
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select Location</option>
                                        <option value="On-Site">On-Site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                {/* Conditional Location Input */}
                                {(locationType === "On-Site" || locationType === "Hybrid") && (
                                    <div>
                                        <label className="block text-sm font-medium">Location</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Enter Location"
                                            required
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                )}

                                {/* Job Type */}
                                <div>
                                    <label className="block text-sm font-medium">Job Type</label>
                                    <select
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value)}
                                        required
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select Job Type</option>
                                        <option>Full-time employment</option>
                                        <option>Part-time employment</option>
                                        <option>Apprenticeship</option>
                                        <option>Traineeship</option>
                                        <option>Internship</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium">Job Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter Job Description"
                                        required
                                        className="w-full p-2 border rounded min-h-[100px]"
                                    />
                                </div>

                                {/* User's Email */}
                                <div>
                                    <label className="block text-sm font-medium">Your Email (Read-only)</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        readOnly
                                        className="w-full p-2 border rounded bg-gray-100"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-4"
                                >
                                    Submit Vacancy
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {
                    notification.show && (
                        <div className={`fixed top-6 right-6 px-4 py-2 rounded shadow z-50 text-white ${notification.success ? 'bg-green-600' : 'bg-red-600'}`}>
                            {notification.message}
                        </div>
                    )
                }
                {selectedJob && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative shadow-lg">
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="absolute top-3 right-4 text-xl font-bold"
                            >
                                ×
                            </button>
                            <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
                            <p><strong>Company:</strong> {selectedJob.company}</p>
                            <p><strong>Location Type:</strong> {selectedJob.location_type}</p>
                            {selectedJob.location && <p><strong>Location:</strong> {selectedJob.location}</p>}
                            <p><strong>Job Type:</strong> {selectedJob.job_type}</p>

                            {/* Scrollable Description Box */}
                            <div className="border p-3 rounded bg-gray-50 max-h-40 overflow-y-auto">
                                <p><strong>Description:</strong></p>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={handleDeleteJob}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}



            </main>

            <Footer />
        </div>
    );
}
