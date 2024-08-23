import pool from '../../db.js';

const getUserByEmail = async (email) => {
    const [result] = await pool.query('SELECT * FROM user WHERE email = ? AND archived = false LIMIT 1', [email]);
    return result[0];
}

const addUser = async (user) => {
    const [result] = await pool.query(`INSERT INTO user (username, email, password) VALUES ( ?, ?, ?);`, [user.username, user.email, user.password]);
    return result;
}

const updateUserPassword = async (email, newPassword) => {
    const [result] = await pool.query('UPDATE user SET password = ? WHERE email = ?', [newPassword, email]);
    return result;
}

const fetchUsers = async (email) => {
    const [result] = await pool.query('SELECT * FROM user WHERE email != ?', [email]);
    return result;
}

const deleteUser = async (id) => {
    const [result] = await pool.query('DELETE FROM user WHERE id = ?', [id]);
    return result;
}

const getUserById = async (id) => {
    const [result] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    return result[0];
}

const toggleUserArchived = async (id) => {
    const [result] = await pool.query('UPDATE user SET archived = NOT archived WHERE id = ?', [id]);
    return result;
}

export const userDB = {
    getUserByEmail,
    addUser,
    updateUserPassword,
    fetchUsers,
    deleteUser,
    getUserById,
    toggleUserArchived,
}