import pool from '../../db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fetchImage } from '../../util/img.js';
import { CustomException } from '../model/customException.js';
import { ErrorEnum } from '../model/errorEnum.js';
import mysql from "mysql2";

const fetchCards = async () => {
    try {
        let query = `
            SELECT
                c.id AS card_id,
                c.energy_requirement AS card_energy_requirement,
                c.name AS card_title,
                c.description AS card_description,
                c.multiplier AS card_multiplier,
                c.powered_device AS card_powered_device,
                c.image1 AS card_image1,
                c.image2 AS card_image2
            FROM
                cards c
        `;

        query += ` ORDER BY c.id `;

        const cards = {};
        const [rows] = await pool.query(query);
        for (const row of rows) {
            const cardId = row.card_id;
            if (!cards[cardId]) {
                cards[cardId] = {
                    id: cardId,
                    energyRequirement: row.card_energy_requirement,
                    title: row.card_title,
                    description: row.card_description,
                    multiplier: row.card_multiplier,
                    poweredDevice: row.card_powered_device,
                };
            }
            //fetch images
            let image1 = row.card_image1;
            let image2 = row.card_image2;
            if (image1.isUrl !== true){
                if(image1 && image1.path){
                    const image1Data = await fetchImage(image1.path);
                    image1 = image1Data;
                    image1.fileName = row.card_image1.fileName;
                }

            }
            if (image2.isUrl !== true){
                if(image2 && image2.path){
                    const image2Data = await fetchImage(image2.path);
                    image2 = image2Data;
                    image2.fileName = row.card_image2.fileName;
                }
            }
            cards[cardId].image1 = image1;
            cards[cardId].image2 = image2;
        }
        const cardsArray = Object.values(cards);
        return cardsArray;
    } catch (err) {
        console.error('Error fetching cards', err);
    }
};

const createCard = async (card, files) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const query = `
            INSERT INTO cards (energy_requirement, name, description, multiplier, powered_device, image1, image2)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        // const [cardResult] = `
        //     INSERT INTO cards (energy_requirement, name, description, multiplier, powered_device, image1, image2)
        //     VALUES (?, ?, ?, ?, ?, ?, ?)',
        //     [card.energyRequirement, card.title, card.description, card.multiplier, card.poweredDevice, 'img/solarpanel.jpg', card.image2]);
        // `;

        // Always set image1 to 'img/solarpanel.jpg'
        const params = [card.energyRequirement, card.title, card.description, card.multiplier, card.poweredDevice, 'img/solarpanel.jpg', JSON.stringify(card.image2 ?? {})];

        const [result] = await connection.query(query, params);

        const cardId = result.insertId;

        // Directory to save images
        const imgDir = `./img/cards/${cardId}`;
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }

        // If image2 is a file, save it in the imgDir
        if (card.image2 && card.image2.fileUid) {
            const file = files.find(file => file.identifier === card.image2.fileUid);
            if (file) {
                // Generate a random seed for the image name
                const randomSeed = crypto.randomBytes(16).toString('hex');
                const fileExtension = path.extname(file.file.originalname);
                const newFileName = `${randomSeed}${fileExtension}`;
                const filePath = path.join(imgDir, newFileName);

                fs.writeFileSync(filePath, file.file.buffer);

                // Update image2 in the database to the new file path
                await connection.query('UPDATE cards SET image2 = ? WHERE id = ?', [filePath, result.insertId]);
            }
        }

        await connection.commit();

        return result.insertId;
    } catch (err) {
        await connection.rollback();
        console.error('Error creating card', err);
        throw err;
    } finally {
        connection.release();
    }
};

const updateCard = async (card, files) => {
    // Implement the logic to update a card in the database
    // ...
};

const deleteCard = async (cardId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Remove the card
        await connection.query('DELETE FROM cards WHERE id = ?', [cardId]);

        await connection.commit();

        // Delete the card's image folder
        const dirPath = `./img/cards/${cardId}`;
        fs.rm(dirPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error("Failed to delete directory!", err);
            } else {
                console.log("Successfully deleted directory!");
            }
        });
    } catch (err) {
        await connection.rollback();
        console.error('Error deleting card:', err);
    } finally {
        connection.release();
    }
};

const fetchCard = async (cardId) => {
    const [rows] = await pool.query('SELECT * FROM cards WHERE id = ?', [cardId]);
    return rows;
}

const searchCards = async (title) => {
    // Implement the logic to search cards by title in the database
    // ...
};

const ToggleArchive = async (cardId) => {
    // Implement the logic to toggle the archive status of a card in the database
    // ...
};

export default {
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
    fetchCard,
    searchCards,
    ToggleArchive,
};