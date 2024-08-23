import pool from '../../db.js';

const fetchAllClassrooms = async () => {
    const [rows] = await pool.query('SELECT * FROM classroom');
    return rows;
};

const createClassroom = async (classroom) => {
    const { name, code } = classroom;
    const [insertResult] = await pool.query('INSERT INTO classroom (name, code) VALUES (?, ?)', [name, code]);

    // After the insert, get the newly created classroom
    const [rows] = await pool.query('SELECT * FROM classroom WHERE id = ?', [insertResult.insertId]);
    return rows[0]; // Return the first (and only) record
};

const deleteClassroom = async (classroomId) => {
    const [result] = await pool.query('DELETE FROM classroom WHERE id = ?', [classroomId]);
    return result;
};

const updateClassroom = async (classroomId, updatedData) => {
    const { name, code, energy_watt, score } = updatedData;
    const sql = 'UPDATE classroom SET name = ?, code = ?, energy_watt = ?, score = ? WHERE id = ?';
    const values = [name, code, energy_watt, score, classroomId];
    await pool.query(sql, values);

    // After the update, get the updated classroom
    const [rows] = await pool.query('SELECT * FROM classroom WHERE id = ?', [classroomId]);
    return rows[0]; // Return the first (and only) record
};

const fetchClassroomByCode = async (code) => {
    const sql = 'SELECT * FROM classroom WHERE code = ?';
    const values = [code];
    const [rows] = await pool.query(sql, values);
    return rows[0]; // Return the first (and only) record
};

const fetchClassroomByName = async (name) => {
    const sql = 'SELECT * FROM classroom WHERE name = ?';
    const values = [name];
    const [rows] = await pool.query(sql, values);
    return rows[0]; // Return the first (and only) record
};

const fetchClassroomById = async (id) => {
    const sql = 'SELECT * FROM classroom WHERE id = ?';
    const values = [id];
    const [rows] = await pool.query(sql, values);
    return rows[0]; // Return the first (and only) record
};

const deleteAllClassrooms = async () => {
    const [result] = await pool.query('DELETE FROM classroom');
    return result;
};

const increaseEnergy = async (classroom, amount) => {
    const [result] = await pool.query('UPDATE classroom SET energy_watt = energy_watt + ? WHERE id = ?;', [amount, classroom]);
    return result;
};

const getEnergy = async (classroom) => {
    const [energy] = await pool.query('SELECT energy_watt FROM classroom WHERE id = ?;', [classroom]);
    return energy[0].energy_watt;
}

const getAll = async () => {
    const [result] = await pool.query('SELECT id, name, energy_watt, score from classroom');
    return result;
}

const chargeBuilding = async (groupId, score, energy) => {
    const [result] = await pool.query('UPDATE classroom SET energy_watt = energy_watt - ?,score = score + ? WHERE id = ?;', [energy, score, groupId]);
    return result;
}

const getChargedBuildings = async (groupId) => {
    const [result] = await pool.query('SELECT building_id FROM classroom_power_building WHERE classroom_id = ?;', [groupId]);
    return result;
}

const getLeaderBoard = async () => {
    const [result] = await pool.query('SELECT * from classroom ORDER BY energy_watt DESC, name ASC');
    return result;
}

export default {
    fetchAllClassrooms,
    createClassroom,
    deleteClassroom,
    updateClassroom,
    fetchClassroomByCode,
    fetchClassroomByName,
    fetchClassroomById,
    deleteAllClassrooms,
    increaseEnergy,
    getEnergy,
    getAll,
    getLeaderBoard,
    chargeBuilding,
    getChargedBuildings,
};