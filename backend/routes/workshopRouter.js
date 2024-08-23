import express from 'express';
import multer from 'multer';
import workshopService from "../service/workshop.service.js";
import { UnauthorizedError } from 'express-jwt';
import jwt from 'jsonwebtoken';

const workshopRouter = express.Router();

workshopRouter.get('/', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const workshops = await workshopService.fetchWorkshops();
        res.status(200).json(workshops);
    } catch (error) {
        next(error);
    }
});

workshopRouter.get('/:id', async (req, res, next) => {
    try {
        const workshopId = req.params.id;
        const workshop = await workshopService.fetchWorkshopById(workshopId);
        res.status(200).json(workshop);
    } catch (error) {
        next(error);
    }
});


workshopRouter.get('/id/name', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const workshops = await workshopService.fetchWorkshopsIdAndName();
        res.status(200).json(workshops);
    } catch (error) {
        next(error);
    }
});

workshopRouter.get('/camp/:id', async (req, res, next) => {
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

        const campId = req.params.id;
        const workshops = await workshopService.fetchWorkshopsByCampId(campId, teacher);
        res.status(200).json(workshops);
    } catch (error) {
        next(error);
    }
});

// Configure multer for file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

workshopRouter.post('/create', upload.any(), async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const workshopInput = JSON.parse(req.body.workshopData);

        const files = req.files; // The uploaded files

        const uniqueIdentifiers = JSON.parse(req.body.fileIdentifiers); // this is an array of unique identifiers for the files
        const fileswithIdentifiers = files.map((file, index) => { return { file, identifier: uniqueIdentifiers[index] } });
        const workshop = await workshopService.createWorkshop(workshopInput, fileswithIdentifiers);
        res.status(200).json(workshop);
    } catch (error) {
        next(error);
    }
});

workshopRouter.put('/update/:id', upload.any(), async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const workshopId = req.params.id;
        const updatedData = JSON.parse(req.body.workshopData);
        updatedData.id = workshopId;

        const files = req.files; // The uploaded files

        const uniqueIdentifiers = JSON.parse(req.body.fileIdentifiers); // this is an array of unique identifiers for the files
        const fileswithIdentifiers = files.map((file, index) => { return { file, identifier: uniqueIdentifiers[index] } });

        const workshop = await workshopService.updateWorkshop(updatedData, fileswithIdentifiers);
        res.status(200).json(workshop);
    } catch (error) {
        next(error);
    }
});

workshopRouter.delete('/delete/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const workshopId = req.params.id;
        const workshop = await workshopService.deleteWorkshop(workshopId);
        res.status(200).json(workshop);
    } catch (error) {
        next(error);
    }
});

workshopRouter.put('/toggle-archive/:workshopId', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const workshopId = req.params.workshopId;
        const result = await workshopService.ToggleArchive(workshopId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

workshopRouter.get('/camp/:id/first', async (req, res, next) => {
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

        const campId = req.params.id;
        const workshops = await workshopService.fetchWorkshopsByCampIdWithFirstComponents(campId, teacher);
        res.status(200).json(workshops);
    } catch (error) {
        next(error);
    }
});

export default workshopRouter;