import pool from '../../db.js';

const addRelation = async (classroomId, buildingId) => {
    try {
        // Execute the INSERT query to add the relation
        const [result] = await pool.query('INSERT INTO classroom_power_building (classroom_id, building_id) VALUES (?, ?)', [classroomId, buildingId]);
        return result;
    } catch (error) {
        console.error('Error adding relation:', error);
        throw error;
    }
};

const deleteRelation = async (classroomId, buildingId) => {
    const [result] = await pool.query('DELETE FROM classroom_power_building WHERE classroom_id = ? AND building_id = ?', [classroomId, buildingId]);
    return result;
};

const fetchRelationsForClassroom = async (classroomId) => {
    const [rows] = await pool.query('SELECT * FROM classroom_power_building WHERE classroom_id = ?', [classroomId]);
    return rows;
};

const fetchRelationForClassroomAndBuilding = async (classroomId, buildingId) => {
    const [rows] = await pool.query('SELECT * FROM classroom_power_building WHERE classroom_id = ? AND building_id = ?', [classroomId, buildingId]);
    return rows;
};


const fetchBuilding = async (buildingId) => {
    const [rows] = await pool.query('SELECT * FROM building WHERE id = ?', [buildingId]);
    return rows;
}

const fetchAllBuildings = async () => {
    const [rows] = await pool.query('SELECT * FROM building');
    return rows;
}
export default {
    addRelation,
    deleteRelation,
    fetchRelationsForClassroom,
    fetchRelationForClassroomAndBuilding,
    fetchBuilding,
    fetchAllBuildings,
};