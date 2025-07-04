import React, { useEffect, useState } from 'react';
import {
    getAllUsers,
    createUser,
    deleteUser,
    changeUserRole
} from '../Admin/AdminPanelService';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', gmail: '', password: '', roleEnum: 'USER' });

    const fetchUsers = async () => {
        const response = await getAllUsers();
        setUsers(response.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        await createUser(newUser);
        setNewUser({ username: '', gmail: '', password: '', roleEnum: 'USER' });
        fetchUsers();
    };

    const handleDeleteUser = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    const handleRoleChange = async (id, newRole) => {
        await changeUserRole(id, newRole);
        fetchUsers();
    };

    return (
        <div className="container">
            <h2>Admin Panel - İstifadəçi İdarəetməsi</h2>

            <form onSubmit={handleCreateUser} className="user-form">
                <input type="text" placeholder="İstifadəçi adı" value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
                <input type="email" placeholder="Gmail" value={newUser.gmail}
                    onChange={(e) => setNewUser({ ...newUser, gmail: e.target.value })} required />
                <input type="password" placeholder="Şifrə" value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                <select value={newUser.roleEnum}
                    onChange={(e) => setNewUser({ ...newUser, roleEnum: e.target.value })}>
                    <option value="USER">USER</option>
            
                </select>
                <button type="submit">Əlavə Et</button>
            </form>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ad</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.gmail}</td>
                            <td>{user.roleEnum}</td>
                            <td className="actions">
                                <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Sil</button>
                                <button className="role-btn" onClick={() => handleRoleChange(user.id, user.roleEnum === 'USER')}>
                                    {user.roleEnum === 'ADMIN' ? 'USER et' : 'ADMIN et'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                /* Container styling */
                .container {
                    max-width: 960px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #333;
                }

                h2 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: #2c3e50;
                }

                /* Form styling */
                .user-form {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    justify-content: center;
                }

                .user-form input,
                .user-form select {
                    padding: 0.5rem 0.75rem;
                    font-size: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    min-width: 180px;
                    flex-grow: 1;
                    transition: border-color 0.3s ease;
                }

                .user-form input:focus,
                .user-form select:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
                }

                .user-form button {
                    padding: 0.5rem 1.5rem;
                    font-size: 1rem;
                    background-color: #3498db;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    align-self: center;
                }

                .user-form button:hover {
                    background-color: #2980b9;
                }

                /* Table styling */
                .user-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .user-table th,
                .user-table td {
                    border: 1px solid #ddd;
                    padding: 0.75rem 1rem;
                    text-align: left;
                }

                .user-table thead {
                    background-color: #f5f7fa;
                }

                .user-table tbody tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .user-table tbody tr:hover {
                    background-color: #eef6fc;
                }

                /* Buttons in table */
                .actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .delete-btn {
                    background-color: #e74c3c;
                    border: none;
                    padding: 0.4rem 0.8rem;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .delete-btn:hover {
                    background-color: #c0392b;
                }

                .role-btn {
                    background-color: #2ecc71;
                    border: none;
                    padding: 0.4rem 0.8rem;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .role-btn:hover {
                    background-color: #27ae60;
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    .user-form {
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .user-form input,
                    .user-form select,
                    .user-form button {
                        min-width: 100%;
                    }

                    .actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
