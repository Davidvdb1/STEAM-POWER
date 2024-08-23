import WorkshopDb from '../domain/data-access/workshop.db.js';
import { CustomException } from '../domain/model/customException.js';
import { ErrorEnum } from '../domain/model/errorEnum.js';
import CampDb from '../domain/data-access/camp.db.js';

const fetchWorkshops = async () => {
    return await WorkshopDb.fetchWorkshops();
}

const fetchWorkshopsIdAndName = async () => {
    return await WorkshopDb.fetchWorkshopsIdAndName();
}

const fetchWorkshopsByCampId = async (campId, token) => {
    const existingCamp = await CampDb.fetchCampById(campId);
    if (!existingCamp) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen kamp met id ${campId}.`);
    }
    if (token) {
        return await WorkshopDb.fetchWorkshopsByCampId(campId);
    } else {
        return await WorkshopDb.fetchWorkshopsByCampId(campId, true);
    }
}

const createWorkshop = async (workshop, files) => {
    const newWorkshop = await WorkshopDb.createWorkshop(workshop, files);
    await CampDb.addRelation(workshop.campId, newWorkshop.id);
    return newWorkshop;
}

const updateWorkshop = async (workshop, files) => {
    const existingWorkshop = await WorkshopDb.fetchWorkshopById(workshop.id);
    if (!existingWorkshop) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen workshop met id ${workshop.id}.`);
    }
    return await WorkshopDb.updateWorkshop(workshop, files);
}

const deleteWorkshop = async (workshopId) => {
    const workshop = await WorkshopDb.fetchWorkshopById(workshopId);
    if (!workshop) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen workshop met id ${workshopId}.`);
    }
    return await WorkshopDb.deleteWorkshop(workshopId);
}

const ToggleArchive = async (workshopId) => {
    return await WorkshopDb.ToggleArchive(workshopId);
};

const fetchWorkshopById = async (workshopId) => {
    return await WorkshopDb.fetchWorkshopById(workshopId);
}

const fetchWorkshopsByCampIdWithFirstComponents = async (campId, token) => {
    const existingCamp = await CampDb.fetchCampById(campId);
    if (!existingCamp) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen kamp met id ${campId}.`);
    }
    if (token) {
        return await WorkshopDb.fetchWorkshopsByCampIdWithFirstComponents(campId);
    } else {
        return await WorkshopDb.fetchWorkshopsByCampIdWithFirstComponents(campId, true);
    }
}

export default {
    fetchWorkshops,
    fetchWorkshopsByCampId,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    ToggleArchive,
    fetchWorkshopsIdAndName,
    fetchWorkshopById,
    fetchWorkshopsByCampIdWithFirstComponents,
}