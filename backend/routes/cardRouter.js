import express from 'express';
import { UnauthorizedError } from 'express-jwt';
import cardService from "../service/card.service.js";
import multer from "multer";

const cardRouter = express.Router();

cardRouter.get('/', async (req, res, next) => {
    try {
        const cards = await cardService.fetchCards();
        console.log(cards);
        res.status(200).json(cards);
    } catch (err) {
        next(err);
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

cardRouter.post('/create', upload.any(), async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const cardInput = JSON.parse(req.body.cardData);
        const files = req.files;
        const uniqueIdentifiers = JSON.parse(req.body.fileIdentifiers);
        const fileswithIdentifiers = files.map((file, index) => { return { file, identifier: uniqueIdentifiers[index] } });

        const card = await cardService.createCard(cardInput, fileswithIdentifiers);
        res.status(200).json(card);
    } catch (err) {
        next(err);
    }
});

cardRouter.delete('/delete/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const cardId = req.params.id;
        const card = await cardService.deleteCard(cardId);
        res.status(200).json(card);
    } catch (error) {
        next(error);
    }
});

export default cardRouter;