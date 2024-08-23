import express from 'express';
import { userService } from '../service/userService.js';
import { UnauthorizedError } from 'express-jwt';
import { CustomException } from '../domain/model/customException.js';
import { ErrorEnum } from '../domain/model/errorEnum.js';

const userRouter = express.Router();

userRouter.post('/login', async (req, res, next) => {
    try {
        const userInput = req.body.user;
        const token = await userService.authenticate(userInput);
        console.log(token);
        res.status(200).json({ message: 'auth successful', token });
    } catch (error) {
        next(error)
    }
});

userRouter.post('/signup', async (req, res, next) => {
    try {
        const { email, teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        } else if (email !== 'twaleuvennoreply@gmail.com') {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const userInput = req.body.user;

        const user = await userService.addUser(userInput);
        const token = await userService.authenticate(userInput);

        return res.status(201).json({ user, token });
    } catch (error) {
        next(error)
    }
});

userRouter.post('/reset-password', async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const result = await userService.updateUserPassword(token, newPassword);

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

userRouter.get('/', async (req, res, next) => {
    try {
        const { teacher, email } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        } else if (email !== 'twaleuvennoreply@gmail.com') {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const users = await userService.fetchUsers(email);

        const result = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

userRouter.delete('/delete/:id', async (req, res, next) => {
    try {
        const { id, email, teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        } else if (email !== 'twaleuvennoreply@gmail.com') {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        } else if (id === req.params.id) {
            throw new CustomException(ErrorEnum.InvalidInput, "You can not delete the account you are logged in with.");
        }

        const userId = req.params.id;
        const user = await userService.deleteUser(userId);
        const { password, ...userWithoutPassword } = user;

        return res.status(201).json(userWithoutPassword);
    } catch (err) {
        next(err);
    }
});

userRouter.put('/toggle-archive/:id', async (req, res, next) => {
    try {
        const { id, email, teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        } else if (email !== 'twaleuvennoreply@gmail.com') {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        } else if (id === req.params.id) {
            throw new CustomException(ErrorEnum.InvalidInput, "You can not archive the account you are logged in with.");
        }

        const userId = req.params.id;
        await userService.toggleUserArchived(userId);

        return res.status(200).json({ message: 'User archived status toggled successfully.' });
    } catch (err) {
        next(err);
    }
});

export default userRouter;