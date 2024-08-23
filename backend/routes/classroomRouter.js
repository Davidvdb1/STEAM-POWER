import express from 'express';
import ClassroomService from "../service/classroom.service.js";
import { UnauthorizedError } from 'express-jwt';

const classroomRouter = express.Router();

const KEY = process.env.ENC_KEY;

classroomRouter.get('/', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const classrooms = await ClassroomService.fetchAllClassrooms();
        res.status(200).json(classrooms);
    } catch (error) {
        next(error);
    }
});

classroomRouter.get('/id', async (req, res, next) => {
    try {
        const { id } = req.auth;
        const classrooms = await ClassroomService.fetchClassroomById(id);
        res.status(200).json(classrooms);
    } catch (error) {
        next(error);
    }
});

classroomRouter.post('/create', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const classroomInput = req.body;
        const classroom = await ClassroomService.createClassroom(classroomInput);
        res.status(200).json(classroom);
    } catch (error) {
        next(error);
    }
});

classroomRouter.delete('/delete/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const classroomId = req.params.id;
        const classroom = await ClassroomService.deleteClassroom(classroomId);
        res.status(200).json(classroom);
    } catch (error) {
        next(error);
    }
});

classroomRouter.put('/update/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const classroomId = req.params.id;
        const updatedData = req.body;
        const classroom = await ClassroomService.updateClassroom(classroomId, updatedData);
        res.status(200).json(classroom);
    } catch (error) {
        next(error);
    }
});

classroomRouter.post('/join', async (req, res, next) => {
    try {
        const code = req.body;
        const result = await ClassroomService.joinClassroom(code);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

classroomRouter.delete('/reset', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const result = await ClassroomService.deleteAllClassrooms();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


classroomRouter.post('/increase-energy', async (req, res) => {
    try {
        const { teacher } = req.auth;
        if (teacher === true) {
            throw new UnauthorizedError('group_credentials_required', { message: "You are not logged in in a group so you can't access this resource." });
        }

        const { amount } = req.body;
        const groupId = req.auth.id;


        const decrypt = (value) => {

            let res = '';
            for (let i = 0; i < value.length; i++) {
                res += String.fromCharCode(value.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
            }
            return res;
        }

        const decryptedAmount = decrypt(new String(atob(amount)));
        const interval = 2; // every 2 seconds

        const U = decryptedAmount * 3.3;
        const I = 0.065; // 65mA

        const Wattage = (U * I) * (interval);
        const result = await ClassroomService.increaseEnergy(groupId, Wattage);
        res.status(201).json({'U': U, 'I': I, result: result});
    } catch (error) {
        res.status(500);
    }
});
classroomRouter.post('/check-energy', async (req, res) => {
    try {
        const { amount } = req.body;
        const decrypt = (value) => {

            let res = '';
            for (let i = 0; i < value.length; i++) {
                res += String.fromCharCode(value.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
            }
            return res;
        }

        const decryptedAmount = decrypt(new String(atob(amount)));
        const U = decryptedAmount * 3.3;
        const I = 0.065; // 65mA

        res.status(201).json({'U': U, 'I': I, result: 0.00});
    } catch (error) {
        res.status(500);
    }
});



classroomRouter.get('/get-all', async (req, res) => {
    try {
        const result = await ClassroomService.getAll();
        res.status(200).json(result);
    } catch (error) {
        res.status(500);
    }
});

classroomRouter.get('/leaderboard', async (req, res) => {
    try {
        const result = await ClassroomService.getLeaderBoard();
        res.status(200).json(result);
    } catch (error) {
        res.status(500);
    }
});
classroomRouter.get('/get-charged-buildings', async (req, res) => {
    try {
        const { teacher } = req.auth;
        if (teacher === true) {
            throw new UnauthorizedError('group_credentials_required', { message: "You are not logged in in a group so you can't access this resource." });
        }

        const groupId = req.auth.id;
        const result = await ClassroomService.getChargedBuildings(groupId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500);
    }
});


export default classroomRouter;