import pool from '../../db.js';

const getPasswordResets = async () => {
    const [result] = await pool.query('SELECT * FROM password_resets WHERE token = ? AND expires > NOW();');
    return result[0];
}

const setPasswordReset = async (email, token, expires) => {
    const [result] = await pool.query('INSERT INTO password_resets (email, token, expires) VALUES (?, ?, ?)', [email, token, expires]);
    return result;
}

const removePasswordResetByToken = async (token) => {
    const [result] = await pool.query('DELETE FROM password_resets WHERE token = ?', [token]);
    return result;
}

const getPasswordResetByToken = async (token) => {
    const [result] = await pool.query('SELECT * FROM password_resets WHERE token = ?', [token]);
    return result[0];
}

export default {
    getPasswordResets,
    setPasswordReset,
    removePasswordResetByToken,
    getPasswordResetByToken,
}