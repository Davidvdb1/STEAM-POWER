import ClassroomBuildingDb from "../domain/data-access/classroomBuilding.db.js";
import SliderDb from "../domain/data-access/slider.db.js";
import { CustomException } from "../domain/model/customException.js";
import { ErrorEnum } from "../domain/model/errorEnum.js";

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

export default {
    fetchAllBuildings,
    fetchBuilding,
}