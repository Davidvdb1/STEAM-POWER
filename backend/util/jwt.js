import jwt from 'jsonwebtoken';

const generateJwtToken = (input) => {
    const options = {
        expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`,
        issuer: `TWA inc.`
    };

    try {
        return jwt.sign(input, process.env.JWT_SECRET, options);
    } catch (error) {
        console.log(error);
        throw new Error(`Error generating JWT token, see server log for details`);
    }

}

export { generateJwtToken };