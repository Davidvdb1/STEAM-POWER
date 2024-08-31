import pool from '../../db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

const createBuilding = async (building, files) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Files:', files);
        console.log('Building:', building);
        const buildingData = JSON.parse(building.buildingData);
        console.log('BuildingData:', buildingData);

        // Prepare and execute the SQL INSERT INTO statement
        const query = `
      INSERT INTO building (name, cost_watt, reward, image)
      VALUES (?, ?, ?, ?)
    `;

        const params = [building.name, building.cost_watt, building.reward, buildingData.image];
        const [result] = await connection.query(query, params);

        const buildingId = result.insertId;

// Directory to save images
        const imgDir = `./img/buildings/${buildingId}`;
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }

        // If image is a file, save it in the imgDir
        if (files && files.length > 0) {
            const file = files[0];
            console.log ('file:', file);
            if (file) {
                // Generate a random seed for the image name
                const randomSeed = crypto.randomBytes(16).toString('hex');
                const fileExtension = path.extname(file.originalname);
                const newFileName = `${randomSeed}${fileExtension}`;
                const filePath = path.join(imgDir, newFileName);

                fs.writeFileSync(filePath, file.buffer);

                // Update image.src in the building object to the new file path
                console.log(buildingData.image)
                const image = JSON.parse(buildingData.image);
                image.src = `/backend/img/buildings/${buildingId}/${newFileName}`;
                buildingData.image = JSON.stringify(image);
                console.log('building.image:', building.image);
                await connection.query('UPDATE building SET image = ? WHERE id = ?', [buildingData.image, result.insertId]);
            }
        }

        await connection.commit();

        return result.insertId;
    } catch (err) {
        await connection.rollback();
        console.error('Error creating building', err);
        throw err;
    } finally {
        connection.release();
    }
};

const deleteBuilding = async (buildingId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Remove the building
        await connection.query('DELETE FROM building WHERE id = ?', [buildingId]);

        await connection.commit();

        // Delete the building's image folder
        const dirPath = `./img/buildings/${buildingId}`;
        fs.rm(dirPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error("Failed to delete directory!", err);
            } else {
                console.log("Successfully deleted directory!");
            }
        });
    } catch (err) {
        await connection.rollback();
        console.error('Error deleting building:', err);
    } finally {
        connection.release();
    }
};


export default {
    addRelation,
    deleteRelation,
    fetchRelationsForClassroom,
    fetchRelationForClassroomAndBuilding,
    fetchBuilding,
    fetchAllBuildings,
    createBuilding,
    deleteBuilding,
};