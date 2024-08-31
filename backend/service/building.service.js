import ClassroomBuildingDb from "../domain/data-access/classroomBuilding.db.js";
import SliderDb from "../domain/data-access/slider.db.js";
import { CustomException } from "../domain/model/customException.js";
import { ErrorEnum } from "../domain/model/errorEnum.js";
import {ValidationError} from "../domain/model/validationError.js";

const fetchAllBuildings = async () => {
    const result = await ClassroomBuildingDb.fetchAllBuildings();
    const sliderResult = await SliderDb.getSliderValue(1);
    for (let i = 0; i < result.length; i++) {
        result[i].cost_watt = parseInt(result[i].cost_watt * (sliderResult.multiplier / 100));
    }
    return result;
}
const fetchBuilding = async (buildingId) => {
    const result = await ClassroomBuildingDb.fetchBuilding(buildingId);
    const sliderResult = await SliderDb.getSliderValue(1);
    if (result === undefined || result === null || result.length < 1) {
        throw new CustomException(ErrorEnum.NotEnoughEnergy, 'Failed to fetch building with id=' + buildingId);
    }
    result[0].cost_watt = parseInt(result[0].cost_watt * (sliderResult.multiplier / 100));
    return result[0];
}

const createBuilding = async (building, files) => {
    try {
        //const validatedBuilding = new Building(building);
        console.log('Building object:', building);
        return await ClassroomBuildingDb.createBuilding(building, files);

    } catch (error) {
        if (error instanceof ValidationError) {
            throw new CustomException(ErrorEnum.ValidationFailed, error.errors);
        }
        throw error;
    }
}

const deleteBuilding = async (buildingId) => {
    const building = await ClassroomBuildingDb.fetchBuilding(buildingId);
    if (!building) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen building met id ${buildingId}.`);
    }
    return await ClassroomBuildingDb.deleteBuilding(buildingId);
}

export default {
    fetchAllBuildings,
    fetchBuilding,
    createBuilding,
    deleteBuilding,
}