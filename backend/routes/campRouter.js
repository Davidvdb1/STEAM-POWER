import express from 'express';
import multer from 'multer';
import CampService from "../service/camp.service.js";
import { UnauthorizedError } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { CustomException } from '../domain/model/customException.js';
import { ErrorEnum } from '../domain/model/errorEnum.js';

const campRouter = express.Router();

campRouter.get('/', async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        let teacher = false;
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) return;

            if (user.teacher) {
                teacher = user.teacher;
            }
        });

        const camps = await CampService.fetchCamps(teacher);
        res.status(200).json(camps);
    } catch (error) {
        next(error);
    }
});


campRouter.get('/id/:id', async (req, res, next) => {
    try {
        const campId = req.params.id;
        const camp = await CampService.fetchCampById(campId);

        res.status(200).json(camp);
    } catch (error) {
        next(error);
    }
});

// Configure multer for file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

campRouter.post('/create', upload.any(), async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const campInput = JSON.parse(req.body.campData);
        const files = req.files; // The uploaded files
        const uniqueIdentifiers = JSON.parse(req.body.fileIdentifiers); // this is an array of unique identifiers for the files
        const fileswithIdentifiers = files.map((file, index) => { return { file, identifier: uniqueIdentifiers[index] } });

        const camp = await CampService.createCamp(campInput, fileswithIdentifiers);
        res.status(200).json(camp);
    } catch (error) {
        next(error);
    }
});

campRouter.put('/update/:id', upload.any(), async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const campId = req.params.id;
        const updatedData = JSON.parse(req.body.campData);
        updatedData.id = campId;
        const files = req.files; // The uploaded files

        const uniqueIdentifiers = JSON.parse(req.body.fileIdentifiers); // this is an array of unique identifiers for the files
        const fileswithIdentifiers = files.map((file, index) => { return { file, identifier: uniqueIdentifiers[index] } });

        const camp = await CampService.updateCamp(updatedData, fileswithIdentifiers);
        res.status(200).json(camp);
    } catch (error) {
        next(error);
    }
});

campRouter.delete('/delete/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const campId = req.params.id;
        const camp = await CampService.deleteCamp(campId);
        res.status(200).json(camp);
    } catch (error) {
        next(error);
    }
});

campRouter.get('/search', async (req, res, next) => {
    try {
        const { title, startDate, endDate, age, location } = req.query;
        const camps = await CampService.searchCamps(title, startDate, endDate, age, location);
        res.status(200).json(camps);
    } catch (error) {
        next(error);
    }
});

campRouter.get('/relations/:campId', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const campId = req.params.campId;
        const relations = await CampService.fetchRelationsForCamp(campId);
        res.status(200).json(relations);
    } catch (error) {
        next(error);
    }
});

campRouter.put('/toggle-archive/:campId', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const campId = req.params.campId;
        const result = await CampService.ToggleArchive(campId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

campRouter.put('/:campId/workshops/:workshopId', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const campId = req.params.campId;
        const workshopId = req.params.workshopId;
        const moveUp = req.body.moveUp;

        if (typeof moveUp !== 'boolean') {
            throw new CustomException(ErrorEnum.InvalidInput, 'moveUp must be a boolean');
        }

        const result = await CampService.switchPosition(campId, workshopId, moveUp);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export default campRouter;