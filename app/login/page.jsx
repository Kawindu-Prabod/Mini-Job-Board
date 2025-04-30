'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || 'Login failed');
        } else {
            localStorage.setItem('sessionStatus', '1');
            
            // Set exact expiration timestamp (15 minutes from now)
            const expiresAt = Date.now() + 15 * 60 * 1000;
            localStorage.setItem('sessionExpiresAt', expiresAt.toString());
            router.push('/');
        }
    };

    const goToSignup = () => {
        router.push('/signup');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6">
                <h1 className="text-2xl font-bold text-center text-blue-600">Log In</h1>

                {error && <p className="text-red-600 text-center">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Log In
                </button>

                <div className="text-center">
                    Don't have an account?
                    <button
                        onClick={goToSignup}
                        className="ml-2 text-blue-600 font-semibold hover:underline"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
