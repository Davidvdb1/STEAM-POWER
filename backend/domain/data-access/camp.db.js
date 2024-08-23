import pool from '../../db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fetchImage } from '../../util/img.js';
import { CustomException } from '../model/customException.js';
import { ErrorEnum } from '../model/errorEnum.js';
import mysql from "mysql2";

const fetchCamps = async (onlyActive = false) => {
    try {
        let query = `
            SELECT 
                c.id AS camp_id,
                c.title AS camp_title,
                c.start_date AS camp_start_date,
                c.end_date AS camp_end_date,
                c.start_time AS camp_start_time,
                c.end_time AS camp_end_time,
                c.starting_age AS camp_starting_age,
                c.ending_age AS camp_ending_age,
                c.location AS camp_location,
                c.content AS camp_content,
                c.archived AS camp_archived
            FROM 
                camp c
        `;

        if (onlyActive) {
            query += ` WHERE c.archived = false `;
        }

        query += ` ORDER BY c.id; `;

        const camps = {};
        const [rows] = await pool.query(query);

        for (const row of rows) {
            const campId = row.camp_id;
            if (!camps[campId]) {
                camps[campId] = {
                    id: campId,
                    title: row.camp_title,
                    startDate: row.camp_start_date,
                    endDate: row.camp_end_date,
                    startTime: row.camp_start_time,
                    endTime: row.camp_end_time,
                    startAge: row.camp_starting_age,
                    endAge: row.camp_ending_age,
                    location: row.camp_location,
                    archived: row.camp_archived,
                    workshops: []
                };
            }
            let content = row.camp_content;
            // fetch image data
            if (content.isUrl != true) {
                if (content && content.path) {
                    // Fetch image data asynchronously
                    const imageData = await fetchImage(content.path);
                    content = imageData;
                    content.fileName = row.camp_content.fileName; // keep the original name
                }
            }
            camps[campId].content = content;
        }

        // Convert the workshops object into an array
        const campArray = Object.values(camps);

        return campArray;

    } catch (err) {
        console.error('Error fetching camps:', err);
    }
};

const createCamp = async (camp, files) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert the camp first to get the campId
        const [campResult] = await connection.query(`INSERT INTO camp 
            (title, start_date, end_date, start_time, end_time, starting_age, ending_age, location, content, archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [camp.title, camp.startDate, camp.endDate, camp.startTime, camp.endTime, camp.startAge, camp.endAge, camp.location, JSON.stringify(camp.content ?? {}), camp.archived ?? false]);
        const campId = campResult.insertId;

        // Directory to save images
        const campImgDir = `./img/camps/${campId}`;
        if (!fs.existsSync(campImgDir)) {
            fs.mkdirSync(campImgDir, { recursive: true });
        }

        if (camp.content) {
            if (camp.content.isUrl === 'true') {
                camp.content = { path: camp.content.path, isUrl: true };
            } else {
                const file = files.find(file => file.identifier === camp.content.fileUid && file.file.originalname === camp.content.fileData);
                if (file) {
                    // Generate a random seed for the image name
                    const randomSeed = crypto.randomBytes(16).toString('hex');
                    const fileExtension = path.extname(file.file.originalname);
                    const newFileName = `${randomSeed}${fileExtension}`;
                    const filePath = path.join(campImgDir, newFileName);

                    fs.writeFileSync(filePath, file.file.buffer);
                    camp.content = { path: filePath, isUrl: 'false', fileName: camp.content.fileData };
                }
            }

            // Update the camp with the correct content path after saving the file
            await connection.query(`UPDATE camp SET content = ? WHERE id = ?`, [JSON.stringify(camp.content), campId]);
        }

        await connection.commit();
        return campResult;
    } catch (err) {
        await connection.rollback();
        console.error('Error creating camp:', err);
        throw err;
    } finally {
        connection.release();
    }
};

const updateCamp = async (camp, files) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Update the camp details
        await connection.query(`
            UPDATE camp 
            SET 
                title = ?, 
                start_date = ?, 
                end_date = ?, 
                start_time = ?, 
                end_time = ?, 
                starting_age = ?, 
                ending_age = ?, 
                location = ?, 
                content = ?,
                archived = ?
            WHERE 
                id = ?`,
            [
                camp.title,
                camp.startDate,
                camp.endDate,
                camp.startTime,
                camp.endTime,
                camp.startAge,
                camp.endAge,
                camp.location,
                JSON.stringify(camp.content ?? {}),
                camp.archived,
                camp.id
            ]);

        // Delete all images in the camp's image folder
        const dirPath = `./img/camps/${camp.id}`;
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(file => {
                fs.unlinkSync(path.join(dirPath, file));
            });
        }

        // Create directory to save new images if not exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }


        if (camp.content) {
            if (camp.content.isUrl === 'true') {
                camp.content = { path: camp.content.path, isUrl: true };
            } else {
                const file = files.find(file => file.identifier === camp.content.fileUid && file.file.originalname === camp.content.fileData);
                if (file) {
                    // Generate a random seed for the image name
                    const randomSeed = crypto.randomBytes(16).toString('hex');
                    const fileExtension = path.extname(file.file.originalname);
                    const newFileName = `${randomSeed}${fileExtension}`;
                    const filePath = path.join(dirPath, newFileName);

                    fs.writeFileSync(filePath, file.file.buffer);
                    camp.content = { path: filePath, isUrl: 'false', fileName: camp.content.fileData };
                }
            }

            // Update the camp with the correct content path after saving the file
            await connection.query(`UPDATE camp SET content = ? WHERE id = ?`, [JSON.stringify(camp.content), camp.id]);
        }

        await connection.commit();
        return { id: camp.id, ...camp };
    } catch (err) {
        await connection.rollback();
        console.error('Error updating camp:', err);
        throw err;
    } finally {
        connection.release();
    }
};

const deleteCamp = async (campId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Remove the workshop
        await connection.query('DELETE FROM camp WHERE id = ?', [campId]);

        await connection.commit();

        // Delete the workshop's image folder
        const dirPath = `./img/camps/${campId}`;
        fs.rm(dirPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error("Failed to delete directory!", err);
            } else {
                console.log("Successfully deleted directory!");
            }
        });
    } catch (err) {
        await connection.rollback();
        console.error('Error deleting camp:', err);
    } finally {
        connection.release();
    }
};

const fetchCampById = async (campId) => {
    try {
        const query = `
            SELECT 
                c.id AS camp_id,
                c.title AS camp_title,
                c.start_date AS camp_start_date,
                c.end_date AS camp_end_date,
                c.start_time AS camp_start_time,
                c.end_time AS camp_end_time,
                c.starting_age AS camp_starting_age,
                c.ending_age AS camp_ending_age,
                c.location AS camp_location,
                c.content AS camp_content
            FROM 
                camp c
            WHERE 
                c.id = ?;
        `;

        const [rows] = await pool.query(query, [campId]);
        if (rows.length === 0) {
            return null; // No workshop found with the given ID
        }

        const camp = {
            id: rows[0].camp_id,
            title: rows[0].camp_title,
            startDate: rows[0].camp_start_date,
            endDate: rows[0].camp_end_date,
            startTime: rows[0].camp_start_time,
            endTime: rows[0].camp_end_time,
            startAge: rows[0].camp_starting_age,
            endAge: rows[0].camp_ending_age,
            location: rows[0].camp_location,
            content: rows[0].camp_content
        };
        // fetch image data
        if (camp.content.isUrl != true) {
            if (camp.content && camp.content.path) {
                // Fetch image data asynchronously
                const imageData = await fetchImage(camp.content.path);
                camp.content = imageData;
                camp.content.fileName = camp.content.fileName; // keep the original name
            }
        }

        return camp;
    } catch (err) {
        console.error('Error fetching camp by id:', err);
        throw err;
    }
};
const searchCamps = async (title, startDate, endDate, age, location) => {
    try {
        let query = `
            SELECT 
                c.id AS camp_id,
                c.title AS camp_title,
                c.start_date AS camp_start_date,
                c.end_date AS camp_end_date,
                c.start_time AS camp_start_time,
                c.end_time AS camp_end_time,
                c.starting_age AS camp_starting_age,
                c.ending_age AS camp_ending_age,
                c.location AS camp_location,
                c.content AS camp_content
            FROM 
                camp c
            WHERE
                1=1
        `;

        const queryParams = [];

        if (title) {
            query += ` AND c.title LIKE ?`;
            queryParams.push(`%${title}%`);
        }
        if (startDate) {
            query += ` AND c.start_date >= ?`;
            queryParams.push(startDate);
        }
        if (endDate) {
            query += ` AND c.end_date <= ?`;
            queryParams.push(endDate);
        }
        if (age !== undefined) {
            query += ` AND c.starting_age <= ? AND c.ending_age >= ?`;
            queryParams.push(age, age);
        }
        if (location) {
            query += ` AND c.location LIKE ?`;
            queryParams.push(`%${location}%`);
        }

        // Removed sorting logic from the query

        const [rows] = await pool.query(query, queryParams);

        const camps = rows.map(row => ({
            id: row.camp_id,
            title: row.camp_title,
            startDate: row.camp_start_date,
            endDate: row.camp_end_date,
            startTime: row.camp_start_time,
            endTime: row.camp_end_time,
            startAge: row.camp_starting_age,
            endAge: row.camp_ending_age,
            location: row.camp_location,
            content: row.camp_content,
            workshops: []
        }));

        return camps;

    } catch (err) {
        console.error('Error searching camps:', err);
        throw err;
    }
};

const addRelation = async (campId, workshopId) => {
    try {
        const maxPosition = await fetchMaxPositionForCamp(campId);
        // Execute the INSERT query to add the relation
        const [result] = await pool.query('INSERT INTO camp_workshop (camp_id, workshop_id, position) VALUES (?, ?, ?)', [campId, workshopId, maxPosition + 1]);
        return result;
    } catch (error) {
        console.error('Error adding relation:', error);
        throw error;
    }
};

const switchPosition = async (campId, workshopId, moveUp) => {
    const [result1] = await pool.query('SELECT camp_id, position FROM camp_workshop WHERE camp_id = ? AND workshop_id = ?', [campId, workshopId]);

    if (result1.length > 0) {
        const { position } = result1[0];

        const operator = moveUp ? '<' : '>';
        const order = moveUp ? 'DESC' : 'ASC';

        const [result2] = await pool.query(`SELECT * FROM camp_workshop WHERE camp_id = ? AND position ${operator} ? ORDER BY position ${order} LIMIT 1`, [campId, position]);

        if (result2.length > 0) {
            const { workshop_id: workshopId2, position: position2 } = result2[0];

            // Switch positions
            await pool.query('UPDATE camp_workshop SET position = ? WHERE camp_id = ? AND workshop_id = ?', [position2, campId, workshopId]);
            await pool.query('UPDATE camp_workshop SET position = ? WHERE camp_id = ? AND workshop_id = ?', [position, campId, workshopId2]);
        }
    } else {
        throw new CustomException(ErrorEnum.DoesntExist, 'No camp_workshop found with the provided camp_id and workshop_id');
    }
};

const fetchMaxPositionForCamp = async (campId) => {
    const [rows] = await pool.query('SELECT MAX(position) as maxPosition FROM camp_workshop WHERE camp_id = ?', [campId]);
    return rows[0].maxPosition;
};

const deleteRelation = async (campId, workshopId) => {
    const [result] = await pool.query('DELETE FROM camp_workshop WHERE camp_id = ? AND workshop_id = ?', [campId, workshopId]);
    return result;
};

const fetchRelationsForCamp = async (campId) => {
    const [rows] = await pool.query('SELECT * FROM camp_workshop WHERE camp_id = ?', [campId]);
    return rows;
};

const ToggleArchive = async (campId) => {
    try {
        // Execute the UPDATE query to toggle the archived status
        const [result] = await pool.query('UPDATE camp SET archived = NOT archived WHERE id = ?', [campId]);
        return result;
    } catch (error) {
        console.error('Error toggling archive status:', error);
        throw error;
    }
};

export default {
    fetchCamps,
    createCamp,
    updateCamp,
    deleteCamp,
    fetchCampById,
    searchCamps,
    addRelation,
    deleteRelation,
    fetchRelationsForCamp,
    ToggleArchive,
    switchPosition,
};
