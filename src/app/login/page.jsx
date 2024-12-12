'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();

		const loginData = {
			username,
			password,
		};

		try {
			const response = await axios.post('http://94.74.86.174:8080/api/login', loginData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			localStorage.setItem('token', response.data.data.token);

			alert('Login berhasil');
			router.push('/');
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data.message || 'Login gagal. Cek kembali kredensial Anda.');
			} else {
				setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen text-black bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
				<h1 className="mb-4 text-2xl font-bold text-center">Login</h1>
				<form onSubmit={handleLogin}>
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
					{errorMessage && <p className="mb-4 text-sm text-red-500">{errorMessage}</p>}
					<button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
						Login
					</button>
				</form>
				<p className="mt-4 text-sm text-center">
					Don't have an account?{' '}
					<a href="/register" className="text-blue-500">
						Register
					</a>
				</p>
			</div>
		</div>
	);
}
