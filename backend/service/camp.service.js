import CampDb from '../domain/data-access/camp.db.js';
import { CustomException } from '../domain/model/customException.js';
import { ErrorEnum } from '../domain/model/errorEnum.js';
import { Camp } from '../domain/model/camp.js';
import { ValidationError } from '../domain/model/validationError.js';

const fetchCamps = async (token) => {
    if (token) {
        return await CampDb.fetchCamps();
    } else {
        return await CampDb.fetchCamps(true);
    }
}

const createCamp = async (camp, files) => {
    try {
        // Validate the camp data
        const validatedCamp = new Camp(camp);
        // Proceed to create the camp in the database
        const newCamp = await CampDb.createCamp(validatedCamp, files);
        for (const [key, value] of Object.entries(camp.workshopRelations)) {
            if (value) {
                CampDb.addRelation(newCamp.insertId, key);
            } else {
                CampDb.deleteRelation(newCamp.insertId, key);
            }
        }

        return newCamp;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new CustomException(ErrorEnum.ValidationFailed, error.errors);
        }
        throw error;
    }
}

const updateCamp = async (camp, files) => {
    const existingCamp = await CampDb.fetchCampById(camp.id);
    if (!existingCamp) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen camp met id ${camp.id}.`);
    }

    try {
        // Validate the updated camp data
        const validatedCamp = new Camp(camp);
        // Proceed to update the camp in the database
        for (const [key, value] of Object.entries(camp.workshopRelations)) {
            if (value) {
                CampDb.addRelation(camp.id, key);
            } else {
                CampDb.deleteRelation(camp.id, key);
            }
        }

        return await CampDb.updateCamp(validatedCamp, files);
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new CustomException(ErrorEnum.ValidationFailed, error.errors);
        }
        throw error;
    }
}

const deleteCamp = async (campId) => {
    const camp = await CampDb.fetchCampById(campId);
    if (!camp) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen camp met id ${campId}.`);
    }
    return await CampDb.deleteCamp(campId);
}

const searchCamps = async (title, startDate, endDate, age, location) => {
    return await CampDb.searchCamps(title, startDate, endDate, age, location);
}

const fetchRelationsForCamp = async (campId) => {
    return await CampDb.fetchRelationsForCamp(campId);
};

const ToggleArchive = async (campId) => {
    return await CampDb.ToggleArchive(campId);
};

const switchPosition = async (campId, workshopId, moveUp) => {
    return await CampDb.switchPosition(campId, workshopId, moveUp);
};

const fetchCampById = async (campId) => {
    return await CampDb.fetchCampById(campId);
};

export default {
    fetchCamps,
    createCamp,
    updateCamp,
    deleteCamp,
    searchCamps,
    fetchRelationsForCamp,
    ToggleArchive,
    switchPosition,
    fetchCampById,
}
