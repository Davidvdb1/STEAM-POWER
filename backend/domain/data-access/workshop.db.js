import pool from '../../db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fetchImage } from '../../util/img.js';

const fetchWorkshops = async () => {
    try {
        const query = `
            SELECT 
                w.id AS workshop_id,
                w.name AS workshop_name,
                w.archived AS workshop_archived,
                c.id AS component_id,
                c.type AS component_type,
                c.content AS component_content,
                wc.position AS component_position
            FROM 
                workshop w
            LEFT JOIN 
                workshop_component wc ON w.id = wc.workshop_id
            LEFT JOIN 
                component c ON wc.component_id = c.id
            ORDER BY 
                w.id, wc.position;
        `;

        const [rows] = await pool.query(query);

        // Transform the results into a structured format
        const workshops = {};

        for (const row of rows) {
            const workshopId = row.workshop_id;
            if (!workshops[workshopId]) {
                workshops[workshopId] = {
                    id: workshopId,
                    name: row.workshop_name,
                    components: []
                };
            }
            if (row.component_id) {
                let content = row.component_content;
                // If component type is 'afbeelding' (image), fetch image data
                if (row.component_type === 'afbeelding') {
                    if (content.isUrl !== 'true') {
                        // Fetch image data asynchronously
                        const imageData = await fetchImage(content.path);
                        content = imageData;
                        content.fileName = row.component_content.fileName; // keep the original name
                    }
                }
                workshops[workshopId].components.push({
                    id: row.component_id,
                    type: row.component_type,
                    content: content,
                    position: row.component_position
                });
            }
        }

        // Convert the workshops object into an array
        const workshopArray = Object.values(workshops);

        return workshopArray;

    } catch (err) {
        console.error('Error fetching workshops:', err);
    }
};

const fetchWorkshopsIdAndName = async () => {
    const query = `
        SELECT 
            w.id,
            w.name
        FROM 
            workshop w
        ORDER BY 
            w.id;
    `;

    const [rows] = await pool.query(query);
    return rows;
}

const fetchWorkshopsByCampId = async (campId, onlyActive = false) => {
    try {
        let query = `
            SELECT
                w.id AS workshop_id,
                w.name AS workshop_name,
                w.archived AS workshop_archived,
                c.id AS component_id,
                c.type AS component_type,
                c.content AS component_content,
                wc.position AS component_position,
                cw.position AS workshop_position
            FROM
                camp_workshop cw
            JOIN
                workshop w ON cw.workshop_id = w.id
            LEFT JOIN
                workshop_component wc ON w.id = wc.workshop_id
            LEFT JOIN
                component c ON wc.component_id = c.id
            WHERE
                cw.camp_id = ? `;

        if (onlyActive) {
            query += ` AND w.archived = false `;
        }

        query += ` ORDER BY cw.position ASC, w.id, wc.position;`;

        const [rows] = await pool.query(query, [campId]);

        // Transform the results into a structured format
        const workshops = {};

        for (const row of rows) {
            const workshopId = row.workshop_id;
            if (!workshops[workshopId]) {
                workshops[workshopId] = {
                    id: workshopId,
                    name: row.workshop_name,
                    archived: row.workshop_archived,
                    components: [],
                    position: row.workshop_position
                };
            }

            if (row.component_id) {
                let content = row.component_content;
                // If component type is 'afbeelding' (image), fetch image data
                if (row.component_type === 'afbeelding') {
                    if (content.isUrl !== 'true') {
                        // Fetch image data asynchronously
                        const imageData = await fetchImage(content.path);
                        content = imageData;
                        content.fileName = row.component_content.fileName; // keep the original name
                    }
                }
                workshops[workshopId].components.push({
                    id: row.component_id,
                    type: row.component_type,
                    content: content,
                    position: row.component_position
                });
            }
        }

        // Convert the workshops object into an array and sort by position
        const workshopArray = Object.values(workshops);
        workshopArray.sort((a, b) => a.position - b.position);

        return workshopArray;

    } catch (err) {
        console.error('Error fetching workshops by camp ID:', err);
    }
};

const createWorkshop = async (workshop, files) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert the workshop
        const [workshopResult] = await connection.query('INSERT INTO workshop (name, archived) VALUES (?, ?)', [workshop.name, workshop.archived ?? false]);
        const workshopId = workshopResult.insertId;

        // Directory to save images
        const workshopImgDir = `./img/${workshopId}`;
        if (!fs.existsSync(workshopImgDir)) {
            fs.mkdirSync(workshopImgDir, { recursive: true });
        }

        // Insert components and their associations
        for (const component of workshop.components) {
            let componentResult = null;
            if (component.type === "afbeelding") {
                let content = {};

                if (component.content.isUrl === 'true') {
                    content = { path: component.content.path, isUrl: 'true' };
                    [componentResult] = await connection.query('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', [component.type, JSON.stringify(content), workshopId]);
                } else {
                    const file = files.find(file => file.identifier === component.content.fileUid && file.file.originalname === component.content.fileData);
                    if (file) {
                        // Generate a random seed for the image name
                        const randomSeed = crypto.randomBytes(16).toString('hex');
                        const fileExtension = path.extname(file.file.originalname);
                        const newFileName = `${randomSeed}${fileExtension}`;
                        const filePath = path.join(workshopImgDir, newFileName);

                        fs.writeFileSync(filePath, file.file.buffer);
                        content = { path: filePath, isUrl: 'false', fileName: component.content.fileData };
                        [componentResult] = await connection.query('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', [component.type, JSON.stringify(content), workshopId]);
                    }
                }
            } else {
                let key = "text";
                if (component.type === "link") {
                    key = "url";
                }
                [componentResult] = await connection.query('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', [component.type, JSON.stringify({ [key]: component.content }), workshopId]);
            }

            if (componentResult) {
                const componentId = componentResult.insertId;
                await connection.query('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, componentId, component.position]);
            }
        }

        await connection.commit();
        return { id: workshopId, ...workshop };
    } catch (err) {
        await connection.rollback();
        console.error('Error creating workshop:', err);
        throw err;
    } finally {
        connection.release();
    }
};

const updateWorkshop = async (workshop, files) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Update the workshop name
        await connection.query('UPDATE workshop SET name = ?, archived = ? WHERE id = ?', [workshop.name, workshop.archived, workshop.id]);
        // Remove old components associations
        await connection.query('DELETE FROM workshop_component WHERE workshop_id = ?', [workshop.id]);

        // Remove old components
        await connection.query('DELETE FROM component WHERE workshop_id = ?', [workshop.id]);

        // Delete all images in the workshop's image folder
        const dirPath = `./img/${workshop.id}`;
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(file => {
                fs.unlinkSync(path.join(dirPath, file));
            });
        }

        // Create directory to save new images if not exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Insert or update components and their associations
        for (const component of workshop.components) {
            let componentResult = null;

            if (component.type === "afbeelding") {
                let content = {};

                if (component.content.isUrl === 'true') {
                    content = { path: component.content.path, isUrl: 'true' };
                    [componentResult] = await connection.query('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', [component.type, JSON.stringify(content), workshop.id]);
                } else {
                    const file = files.find(file => file.identifier === component.content.fileUid && file.file.originalname === component.content.fileData);
                    if (file) {
                        // Generate a random seed for the image name
                        const randomSeed = crypto.randomBytes(16).toString('hex');
                        const fileExtension = path.extname(file.file.originalname);
                        const newFileName = `${randomSeed}${fileExtension}`;
                        const filePath = path.join(dirPath, newFileName);

                        fs.writeFileSync(filePath, file.file.buffer);
                        content = { path: filePath, isUrl: 'false', fileName: component.content.fileData };
                        [componentResult] = await connection.query('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', [component.type, JSON.stringify(content), workshop.id]);
                    }
                }
            } else {
                let key = "text";
                if (component.type === "link") {
                    key = "url";
                }
                const content = JSON.stringify({ [key]: component.content });
                [componentResult] = await connection.query('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', [component.type, content, workshop.id]);
            }

            if (componentResult) {
                const componentId = componentResult.insertId;
                await connection.query('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshop.id, componentId, component.position]);
            }
        }

        await connection.commit();
        return { id: workshop.id, ...workshop };
    } catch (err) {
        await connection.rollback();
        console.error('Error updating workshop:', err);
        throw err;
    } finally {
        connection.release();
    }
};


const deleteWorkshop = async (workshopId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Remove components associations
        await connection.query('DELETE wc FROM workshop_component wc JOIN component c ON wc.component_id = c.id WHERE wc.workshop_id = ?', [workshopId]);

        // Remove components
        await connection.query('DELETE FROM component WHERE id IN (SELECT component_id FROM workshop_component WHERE workshop_id = ?)', [workshopId]);

        // Remove the workshop
        await connection.query('DELETE FROM workshop WHERE id = ?', [workshopId]);

        await connection.commit();

        // Delete the workshop's image folder
        const dirPath = `./img/${workshopId}`;
        fs.rm(dirPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error("Failed to delete directory!", err);
            } else {
                console.log("Successfully deleted directory!");
            }
        });
    } catch (err) {
        await connection.rollback();
        console.error('Error deleting workshop:', err);
    } finally {
        connection.release();
    }
};

const fetchWorkshopById = async (workshopId) => {
    try {
        const query = `
            SELECT 
                w.id AS workshop_id,
                w.name AS workshop_name,
                w.archived AS workshop_archived,
                c.id AS component_id,
                c.type AS component_type,
                c.content AS component_content,
                wc.position AS component_position
            FROM 
                workshop w
            LEFT JOIN 
                workshop_component wc ON w.id = wc.workshop_id
            LEFT JOIN 
                component c ON wc.component_id = c.id
            WHERE w.id = ?
            ORDER BY 
                w.id, wc.position;
        `;

        const [rows] = await pool.query(query, [workshopId]);

        // Transform the results into a structured format
        let workshop = null;



        workshop = {
            id: workshopId,
            name: rows[0].workshop_name,
            components: []
        };

        for (const row of rows) {

            let content = row.component_content;

            // If component type is 'afbeelding' (image), fetch image data
            if (row.component_type === 'afbeelding') {
                if (content.isUrl !== 'true') {
                    // Fetch image data asynchronously
                    const imageData = await fetchImage(content.path);
                    content = imageData;
                    content.fileName = row.component_content.fileName; // keep the original name
                }
            }
            workshop.components.push({
                id: row.component_id,
                type: row.component_type,
                content: content,
                position: row.component_position
            });
        }
        return workshop;

    } catch (err) {
        console.error('Error fetching workshops:', err);
    }
};

const ToggleArchive = async (workshopId) => {
    try {
        // Execute the UPDATE query to toggle the archived status
        const [result] = await pool.query('UPDATE workshop SET archived = NOT archived WHERE id = ?', [workshopId]);
        return result;
    } catch (error) {
        console.error('Error toggling archive status:', error);
        throw error;
    }
};

const fetchWorkshopsByCampIdWithFirstComponents = async (campId, onlyActive = false) => {
    try {
        let query = `
            SELECT
                w.id AS workshop_id,
                w.name AS workshop_name,
                w.archived AS workshop_archived,
                c.id AS component_id,
                c.type AS component_type,
                c.content AS component_content,
                wc.position AS component_position,
                cw.position AS workshop_position,
                ROW_NUMBER() OVER (PARTITION BY w.id ORDER BY wc.position) AS component_row_num
            FROM
                camp_workshop cw
            JOIN
                workshop w ON cw.workshop_id = w.id
            LEFT JOIN
                workshop_component wc ON w.id = wc.workshop_id
            LEFT JOIN
                component c ON wc.component_id = c.id
            WHERE
                cw.camp_id = ? `;

        if (onlyActive) {
            query += ` AND w.archived = false `;
        }

        query += ` ORDER BY cw.position ASC, w.id, wc.position;`;

        const [rows] = await pool.query(query, [campId]);

        // Transform the results into a structured format
        const workshops = {};

        for (const row of rows) {
            const workshopId = row.workshop_id;
            if (!workshops[workshopId]) {
                workshops[workshopId] = {
                    id: workshopId,
                    name: row.workshop_name,
                    archived: row.workshop_archived,
                    components: [],
                    position: row.workshop_position,
                    hasAfbeelding: false // Track if we have an 'afbeelding' type
                };
            }

            // If we already have 3 components and one of them is 'afbeelding', skip adding more
            if (workshops[workshopId].components.length >= 3 && workshops[workshopId].hasAfbeelding) {
                continue;
            }

            if (row.component_id) {
                let content = row.component_content;
                // If component type is 'afbeelding' (image), fetch image data
                if (row.component_type === 'afbeelding') {
                    if (content.isUrl !== 'true') {
                        // Fetch image data asynchronously
                        const imageData = await fetchImage(content.path);
                        content = imageData;
                        content.fileName = row.component_content.fileName; // keep the original name
                    }
                    workshops[workshopId].hasAfbeelding = true; // Mark that this workshop has an 'afbeelding' type
                }

                workshops[workshopId].components.push({
                    id: row.component_id,
                    type: row.component_type,
                    content: content,
                    position: row.component_position
                });
            }

            // If we have added 3 components and one of them is 'afbeelding', stop adding more
            if (workshops[workshopId].components.length >= 3 && workshops[workshopId].hasAfbeelding) {
                continue;
            }
        }

        // Convert the workshops object into an array and sort by position
        const workshopArray = Object.values(workshops);
        workshopArray.sort((a, b) => a.position - b.position);

        return workshopArray;

    } catch (err) {
        console.error('Error fetching workshops by camp ID:', err);
    }
};


export default {
    fetchWorkshops,
    fetchWorkshopsByCampId,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    fetchWorkshopById,
    ToggleArchive,
    fetchWorkshopsIdAndName,
    fetchWorkshopsByCampIdWithFirstComponents,
};