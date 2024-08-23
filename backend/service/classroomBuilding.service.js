import ClassroomBuildingDb from "../domain/data-access/classroomBuilding.db.js";

const addRelation = async (classroomId, buildingId) => {
    return await ClassroomBuildingDb.addRelation(classroomId, buildingId);
}

const existsRelation = async (classroomId, buildingId) => {
    const result = await ClassroomBuildingDb.fetchRelationForClassroomAndBuilding(classroomId, buildingId);
    if (result && result.length > 0) {
        return true;
    }
    return false;
}

export default {
    addRelation,
    existsRelation,
}