import ClassroomDb from '../domain/data-access/classroom.db.js';
import { generateJwtToken } from '../util/jwt.js';
import { CustomException } from '../domain/model/customException.js';
import { ErrorEnum } from '../domain/model/errorEnum.js';
import { Classroom } from '../domain/model/classroom.js';

const fetchClassroom = async (classroomId) => {
    return await ClassroomDb.fetchClassroomById(classroomId);
}
const fetchAllClassrooms = async () => {
    return await ClassroomDb.fetchAllClassrooms();
}

const generateRandomString = async () => {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const createClassroom = async (classroom) => {
    const existingClassroom = await ClassroomDb.fetchClassroomByName(classroom.name);
    if (existingClassroom) {
        throw new CustomException(ErrorEnum.NameAlreadyInUse, 'Er bestaat al een groep met deze naam.');
    }
    classroom.code = await generateRandomString();
    while (await ClassroomDb.fetchClassroomByCode(classroom.code)) {
        classroom.code = await generateRandomString();
    }
    const newClassroom = new Classroom(classroom);
    return await ClassroomDb.createClassroom(newClassroom);
}

const deleteClassroom = async (classroomId) => {
    const existingClassroom = await ClassroomDb.fetchClassroomById(classroomId);
    if (!existingClassroom) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen groep met id ${existingClassroom}.`);
    }
    return await ClassroomDb.deleteClassroom(classroomId);
}

const updateClassroom = async (classroomId, updatedData) => {
    const existingClassroom = await ClassroomDb.fetchClassroomByName(updatedData.name);
    if (existingClassroom && existingClassroom?.id != classroomId) {
        throw new CustomException(ErrorEnum.NameAlreadyInUse, 'Er bestaat al een groep met deze naam.');
    }
    const classroom = new Classroom(updatedData);
    return await ClassroomDb.updateClassroom(classroomId, classroom);
}

const joinClassroom = async (code) => {
    const classroom = await ClassroomDb.fetchClassroomByCode(code.code);
    if (!classroom) {
        throw new CustomException(ErrorEnum.InvalidCode, 'De ingegeven code is ongeldig.');
    }

    return {
        token: generateJwtToken({ id: classroom.id, code: classroom.code, teacher: false }),
        id: classroom.id,
        name: classroom.name,
        code: classroom.code,
    };
};

const deleteAllClassrooms = async () => {
    return await ClassroomDb.deleteAllClassrooms();
};

const increaseEnergy = async (classroom, amount) => {
    const result = await ClassroomDb.increaseEnergy(classroom, amount);
    if (result && result.affectedRows === 1) {
        return await ClassroomDb.getEnergy(classroom);
    }
    return null;
}

const getAll = async () => {
    return await ClassroomDb.getAll();
}

const getLeaderBoard = async () => {
    return await ClassroomDb.getLeaderBoard();
}

const fetchClassroomById = async (id) => {
    const classroom = await ClassroomDb.fetchClassroomById(id);
    if (!classroom) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen groep met id ${id}.`);
    }
    return classroom;
};

const getChargedBuildings = async (groupId) => {
    const result = await ClassroomDb.getChargedBuildings(groupId);
    return result.map(item => item.building_id);
}


export default {
    fetchClassroom,
    fetchAllClassrooms,
    createClassroom,
    deleteClassroom,
    updateClassroom,
    joinClassroom,
    deleteAllClassrooms,
    increaseEnergy,
    getAll,
    getLeaderBoard,
    fetchClassroomById,
    getChargedBuildings,
}