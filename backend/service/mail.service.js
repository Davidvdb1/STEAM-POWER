import mailDb from '../domain/data-access/mail.db.js';

const getPasswordResets = async () => {
    return await mailDb.getPasswordResets();
}

const setPasswordReset = async (email, token, expires) => {
    return await mailDb.setPasswordReset(email, token, expires);
}

const removePasswordResetByToken = async (token) => {
    return await mailDb.removePasswordResetByToken(token);
}

export default {
    getPasswordResets,
    setPasswordReset,
    removePasswordResetByToken
};

