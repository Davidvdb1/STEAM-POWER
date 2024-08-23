import express from 'express';
import ClassroomService from "../service/classroom.service.js";
import BuildingService from "../service/building.service.js";
import ClassroomBuildingService from "../service/classroomBuilding.service.js";
import { UnauthorizedError } from 'express-jwt';

const buildingRouter = express.Router();

buildingRouter.get('/all', async (req, res, next) => {
    try {
        const buildings = await BuildingService.fetchAllBuildings();
        res.status(200).json(buildings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'error': 'Failed to fetch the buildings' })
    }
});


buildingRouter.post('/charge', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === true) {
            throw new UnauthorizedError('group_credentials_required', { message: "You are not logged in in a group so you can't access this resource." });
        }

        const groupId = req.auth.id;
        const { buildingId } = req.body;

        const building = await BuildingService.fetchBuilding(buildingId);
        const classroom = await ClassroomService.fetchClassroom(groupId);

        if (!classroom) {
            res.status(404).json({ 'error': 'no classroom with this id' });
            return;
        }

        if (!building) {
            res.status(404).json({ 'error': 'no building with this id' });
            return;
        }

        if (await ClassroomBuildingService.existsRelation(classroom.id, building.id)) {
            res.status(500).json({ 'error': 'this building is already charged' });
            return;
        }
        if (parseFloat(classroom.energy_watt) >= parseFloat(building.cost_watt)) {
            classroom.score += building.reward;
            classroom.energy_watt -= building.cost_watt;
            await ClassroomService.updateClassroom(classroom.id, classroom);
            await ClassroomBuildingService.addRelation(classroom.id, building.id);
        } else {
            res.status(500).json({ 'error': 'not enough energy' });
            return;
        }
        res.status(200).json(classroom);
    } catch (error) {
        console.error(error)
        res.status(500).json({ 'error': 'Failed to fetch the buildings' })
    }
});

export default buildingRouter;