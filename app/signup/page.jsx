"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer"

const SignUpPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      router.push("/");
    }
  };

  const handleBack = () => {
    router.push("/");
  };
  

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <main className="flex-grow max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required className="w-full p-2 border rounded" />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full p-2 border rounded" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="w-full p-2 border rounded" />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Sign Up
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
          >
            ← Back to Home
          </button>
        </form>
      </main>
      <Footer/>
    </div>
  );
};

export default SignUpPage;
