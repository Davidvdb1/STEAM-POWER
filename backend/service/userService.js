import bcrypt from 'bcrypt';
import { userDB } from '../domain/data-access/user.db.js';
import mailDB from '../domain/data-access/mail.db.js';
import { CustomException } from '../domain/model/customException.js';
import { ErrorEnum } from '../domain/model/errorEnum.js';
import { User } from '../domain/model/user.js';
import { ValidationError } from '../domain/model/validationError.js';
import { generateJwtToken } from '../util/jwt.js';

const authenticate = async (userInput) => {

    const user = await userDB.getUserByEmail(userInput.email);

    if (!user) {
        throw new CustomException(ErrorEnum.InvalidCredentials, 'user does not exist.');
    }
    const isValidPassword = await bcrypt.compare(userInput.password, user.password);
    if (!isValidPassword) {
        throw new CustomException(ErrorEnum.InvalidCredentials, 'incorrect password.');
    }

    return generateJwtToken({ id: user.id, email: userInput.email, teacher: true });
}

const getUserByEmail = async (email) => {
    return await userDB.getUserByEmail(email);
}

const addUser = async (user) => {
    try {
        user.teacher = true;
        let errors = User.validate(user);
        const existingUser = await userDB.getUserByEmail(user.email);
        if (existingUser) {
            errors.email = 'Email address is already in use.';
        }
        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors);
        }

        const newUser = await User.create(user);
        return await userDB.addUser(newUser);
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new CustomException(ErrorEnum.InvalidCredentials, error.errors);
        }
        throw error;
    }
}

const updateUserPassword = async (token, newPassword) => {
    const passwordReset = await mailDB.getPasswordResetByToken(token);
    if (!passwordReset) {
        throw new CustomException(ErrorEnum.InvalidToken, 'The time has expired or invalid token provided.');
    }

    if (newPassword.length < 6) {
        throw new CustomException(ErrorEnum.InvalidCredentials, 'Password must be at least 6 characters long.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt());

    const result = await userDB.updateUserPassword(passwordReset.email, hashedPassword);
    await mailDB.removePasswordResetByToken(token);
    return result;
}

const fetchUsers = async (email) => {
    return await userDB.fetchUsers(email);
}

const deleteUser = async (id) => {
    const user = await userDB.getUserById(id);
    if (!user) {
        throw new CustomException(ErrorEnum.DoesntExist, `User with id ${id} does not exist.`);
    }
    return await userDB.deleteUser(id);
}

const toggleUserArchived = async (id) => {
    const user = await userDB.getUserById(id);
    if (!user) {
        throw new CustomException(ErrorEnum.DoesntExist, `User with id ${id} does not exist.`);
    }
    return await userDB.toggleUserArchived(id);
}

export const userService = {
    authenticate,
    getUserByEmail,
    addUser,
    updateUserPassword,
    fetchUsers,
    deleteUser,
    toggleUserArchived,
};

