import bcrypt from 'bcrypt';

export class User {
    constructor(email, password, username, teacher) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.teacher = teacher;
    }

    static async create(user) {
        const teacher = user.teacher || false;
        const email = user.email.trim();
        const password = await bcrypt.hash(user.password.trim(), await bcrypt.genSalt());
        const username = user.username.trim();

        return new User(email, password, username, teacher);
    }

    static validate(user) {
        const errors = {};

        // Validate email
        if (!user.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            errors.email = 'Email must be a valid email address';
        }

        // Validate password
        if (!user.password?.trim()) {
            errors.password = 'Password is required';
        } else if (user.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }

        // Validate username
        if (!user.username?.trim()) {
            errors.username = 'Username is required';
        }

        // Validate teacher
        if (typeof user.teacher !== 'boolean') {
            errors.teacher = 'Teacher must be a boolean value';
        }

        return errors;
    }
}

