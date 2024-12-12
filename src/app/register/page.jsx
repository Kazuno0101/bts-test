'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function Register() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const handleRegister = async (e) => {
		e.preventDefault();

		const registerData = {
			username,
			email,
			password,
		};

		try {
			const response = await axios.post('http://94.74.86.174:8080/api/register', registerData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			setSuccessMessage('Registrasi berhasil. Silakan login.');
			setErrorMessage('');
			setUsername('');
			setEmail('');
			setPassword('');

			setTimeout(() => {
				router.push('/login');
			}, 1500);
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data.message || 'Registrasi gagal. Periksa data Anda.');
			} else {
				setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
			}
			setSuccessMessage('');
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen text-black bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
				<h1 className="mb-4 text-2xl font-bold text-center">Register</h1>
				<form onSubmit={handleRegister}>
					<div className="mb-4">
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							id="username"
							className="block w-full h-10 mt-1 text-black border-blue-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Enter your username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							id="email"
							className="block w-full h-10 mt-1 text-black border-blue-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							id="password"
							className="block w-full h-10 mt-1 text-black border-blue-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					{successMessage && <p className="mb-4 text-sm text-green-500">{successMessage}</p>}
					{errorMessage && <p className="mb-4 text-sm text-red-500">{errorMessage}</p>}
					<button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
						Register
					</button>
				</form>
				<p className="mt-4 text-sm text-center">
					Already have an account?
					<a href="/login" className="text-blue-500">
						Login
					</a>
				</p>
			</div>
		</div>
	);
}
