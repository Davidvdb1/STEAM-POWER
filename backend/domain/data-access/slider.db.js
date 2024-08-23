import pool from '../../db.js';

const getSliderValue = async (id) => {
    const [result] = await pool.query('SELECT * FROM slider WHERE id = ? LIMIT 1', [id]);
    return result[0];
}

const setNewSliderValue = async (id, value) => {
    const [result] = await pool.query('UPDATE slider SET multiplier = ? WHERE id = ?', [value, id]);
    return result[0];
}

export default {
    getSliderValue,
    setNewSliderValue,
}