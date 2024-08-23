export class Classroom {
    constructor(classroom) {
        this.validate(classroom);
        this.id = classroom.id;
        this.name = classroom.name.trim().toLowerCase();
        this.code = classroom.code.trim();
        this.energy_watt = classroom.energy_watt;
        this.score = classroom.score;
    }

    equals({ id, name, code, energy_watt, score }) {
        return (
            this.id === id &&
            this.name === name &&
            this.code === code &&
            this.energy_watt === energy_watt &&
            this.score === score
        );
    }

    validate(classroom) {
        if (!classroom.name?.trim()) throw Error('Name is required');
        if (classroom.name.trim().length < 4) throw Error('Your Name must be at least 4 characters long');
        if (classroom.name.trim().length > 20) throw Error('Your Name must be less than 4 characters long');
        if (!classroom.code?.trim()) throw Error('Code is required');
        if (classroom.code.trim().length < 4) throw Error('Your Code must be at least 4 characters long');
    }

    generateRandomString = async () => {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    static from(obj) {
        return new Classroom({
            name: obj.name,
            code: obj.code,
            id: obj.id,
            energy_watt: obj.energy_watt,
            score: obj.score
        });
    }
}
