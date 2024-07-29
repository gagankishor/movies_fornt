'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            console.log(data)
            if (res.ok) {
                router.push('/login'); // Redirect to login page
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <section className='bg-gray-50'>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"> Register to your account</h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 outline-none"
                                    placeholder='Enter UserName'
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 outline-none"
                                    placeholder='Enter Password'
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full text-white bg-teal-500 hover:bg-primary-700 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center">Register</button>
                            <div className="mt-4">
                                <p className="text-sm font-light text-gray-500">
                                    Already have an account?
                                    <span className="font-medium ms-2 text-primary-600 hover:underline cursor-pointer"
                                        onClick={() => router.push('/login')}
                                    >Login</span>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
