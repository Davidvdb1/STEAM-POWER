import express from 'express';
import sliderService from '../service/slider.service.js';
import { UnauthorizedError } from 'express-jwt';

const sliderRouter = express.Router();

sliderRouter.get('/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const id = req.params.id;
        const value = await sliderService.getSliderValue(id);
        res.json(value);
    } catch (error) {
        next(error);
    }
});

sliderRouter.post('/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const id = req.params.id;
        const value = req.body.value;
        const result = await sliderService.setNewSliderValue(id, value);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default sliderRouter;