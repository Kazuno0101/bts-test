'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
	const [checklists, setChecklists] = useState([]);
	const [newChecklist, setNewChecklist] = useState('');
	const [selectedChecklist, setSelectedChecklist] = useState(null);
	const router = useRouter();

	const fetchChecklists = () => {
		const token = localStorage.getItem('token');
		if (!token) {
			alert('You need to login first.');
			router.push('/login');
		} else {
			axios.get('http://94.74.86.174:8080/api/checklist', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((response) => {
					if (response.data.statusCode === 2100) {
						setChecklists(response.data.data);
						if (selectedChecklist) {
							const updatedChecklist = response.data.data.find((c) => c.id === selectedChecklist.id);
							setSelectedChecklist(updatedChecklist || null);
						}
					} else {
						console.error('Error fetching checklists:', response.data.message);
					}
				})
				.catch((error) => {
					console.error('Error fetching checklists:', error);
				});
		}
	};

	useEffect(() => {
		fetchChecklists();
	}, []);

	// Checklist functions
	const handleAddChecklist = () => {
		const token = localStorage.getItem('token');
		if (newChecklist.trim() !== '') {
			axios.post(
				'http://94.74.86.174:8080/api/checklist',
				{ name: newChecklist },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then(() => {
					setNewChecklist('');
					fetchChecklists();
				})
				.catch((error) => {
					console.error('Error creating checklist:', error);
				});
		}
	};

	const handleDeleteChecklist = (checklistId) => {
		const token = localStorage.getItem('token');

		axios.delete(`http://94.74.86.174:8080/api/checklist/${checklistId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(() => {
				fetchChecklists();
			})
			.catch((error) => {
				console.error('Error deleting checklist:', error);
			});
	};
	// End of checklist functions

	// Item functions
	const handleEditItem = (checklistId, itemId, newItemName) => {
		const token = localStorage.getItem('token');
		if (newItemName.trim() !== '') {
			axios.put(
				`http://94.74.86.174:8080/api/checklist/${checklistId}/item/rename/${itemId}`,
				{ itemName: newItemName },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then(() => {
					alert('Item updated successfully.');
					fetchChecklists();
				})
				.catch((error) => {
					console.error('Error editing item:', error);
				});
		}
	};

	const handleAddItem = (checklistId, item) => {
		const token = localStorage.getItem('token');
		if (item.trim() !== '') {
			axios.post(
				`http://94.74.86.174:8080/api/checklist/${checklistId}/item`,
				{ itemName: item },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then(() => {
					fetchChecklists();
				})
				.catch((error) => {
					console.error('Error adding item to checklist:', error);
				});
		}
	};

	const handleDeleteItem = (checklistId, itemId) => {
		const token = localStorage.getItem('token');
		axios.delete(`http://94.74.86.174:8080/api/checklist/${checklistId}/item/${itemId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(() => {
				fetchChecklists();
			})
			.catch((error) => {
				console.error('Error deleting item:', error);
			});
	};

	const handleToggleItemStatus = (checklistId, itemId) => {
		const token = localStorage.getItem('token');
		axios.put(
			`http://94.74.86.174:8080/api/checklist/${checklistId}/item/${itemId}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then(() => {
				fetchChecklists();
			})
			.catch((error) => {
				console.error('Error toggling item status:', error);
			});
	};
	// End of item functions

	const handleLogout = () => {
		localStorage.removeItem('token');
		router.push('/login');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-10 text-black bg-gray-100">
			<button onClick={handleLogout} className="px-4 py-2 mb-6 text-white bg-gray-500 rounded hover:bg-gray-600">
				Logout
			</button>

			<div className="w-full max-w-md p-6 mb-6 bg-white rounded shadow-md">
				<h1 className="mb-4 text-2xl font-bold text-center ">Create Checklist</h1>
				<input
					type="text"
					placeholder="Card Name"
					className="w-full px-3 py-2 mb-4 border rounded-md"
					value={newChecklist}
					onChange={(e) => setNewChecklist(e.target.value)}
				/>
				<button onClick={handleAddChecklist} className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
					Add Checklist
				</button>
			</div>

			<div className="grid w-full max-w-6xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
				{checklists.map((checklist) => (
					<div key={checklist.id} className="p-4 bg-white rounded shadow-md">
						<h3 className="text-lg font-semibold">{checklist.name}</h3>
						<button
							onClick={() => setSelectedChecklist(checklist)}
							className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
						>
							View Details
						</button>
						<button
							onClick={() => handleDeleteChecklist(checklist.id)}
							className={`px-4 py-2 mt-2 ml-2 text-white ${
								!(checklist.items && checklist.items.length > 0)
									? ' bg-red-500 rounded hover:bg-red-600'
									: ' bg-gray-800'
							}`}
							disabled={checklist.items && checklist.items.length > 0}
						>
							Delete Checklist
						</button>
					</div>
				))}
			</div>

			{selectedChecklist && (
				<div className="w-full max-w-2xl p-6 mt-6 bg-white rounded shadow-md">
					<h2 className="mb-4 text-2xl font-bold">{selectedChecklist.name}</h2>
					<input
						type="text"
						placeholder="Add Item"
						className="w-full px-3 py-2 mb-4 border rounded-md"
						onKeyDown={(e) => {
							if (e.key === 'Enter' && e.target.value !== '') {
								handleAddItem(selectedChecklist.id, e.target.value);
								e.target.value = '';
							}
						}}
					/>
					<ul>
						{selectedChecklist.items && selectedChecklist.items.length > 0 ? (
							selectedChecklist.items.map((item) => (
								<li
									key={item.id}
									className={`flex flex-col px-3 py-2 mb-2 border rounded-md ${
										item.itemCompletionStatus
											? ' bg-green-500'
											: ' bg-gray-100'
									}`}
								>
									<input
										type="text"
										defaultValue={item.name}
										className="flex-1 px-3 py-1 mr-2 border rounded-md"
										onKeyDown={(e) => {
											if (
												e.key ===
													'Enter' &&
												e
													.target
													.value !==
													''
											) {
												handleEditItem(
													selectedChecklist.id,
													item.id,
													e
														.target
														.value
												);
											}
										}}
									/>

									<div className="mt-2">
										<button
											onClick={() =>
												handleToggleItemStatus(
													selectedChecklist.id,
													item.id
												)
											}
											className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
										>
											Toggle Status
										</button>

										<button
											onClick={() =>
												handleDeleteItem(
													selectedChecklist.id,
													item.id
												)
											}
											className="px-3 py-1 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
										>
											Delete Item
										</button>
									</div>
								</li>
							))
						) : (
							<li className="px-3 py-2 mb-2 text-center text-gray-500">No items available.</li>
						)}
					</ul>
				</div>
			)}
		</div>
	);
}
