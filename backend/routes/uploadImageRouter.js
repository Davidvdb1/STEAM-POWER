import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {UnauthorizedError} from "express-jwt";

const uploadImageRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadImageRouter.post('/', upload.single('image'), (req, res, next) => {
    try {
        const {teacher} = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', {message: "You are not authorized to access this resource."});
        }

        const file = req.file;

        fs.writeFileSync('./img/city.jpeg', file.buffer);
        //response with status code 200 and the file name
        res.status(200).json({fileName: 'city.jpeg'});
    } catch (error) {
        next(error);
    }
});

export default uploadImageRouter;