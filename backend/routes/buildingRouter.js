import express from 'express';
import ClassroomService from "../service/classroom.service.js";
import BuildingService from "../service/building.service.js";
import ClassroomBuildingService from "../service/classroomBuilding.service.js";
import { UnauthorizedError } from 'express-jwt';
import multer from "multer";

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

const storage = multer.memoryStorage();
const upload = multer({ storage });
buildingRouter.post('/create', upload.any(), async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }


        const buildingInput = JSON.parse(req.body.buildingData);
        console.log('Building data:', buildingInput);

        const files = req.files;
        console.log('Uploaded files:', files);

        const building = req.body;
        const newBuilding = await BuildingService.createBuilding(building, files);
        res.status(200).json(newBuilding);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'error': 'Failed to create the building' })
    }
});

buildingRouter.delete('/delete/:id', async (req, res, next) => {
    try {
        const { teacher } = req.auth;
        if (teacher === false) {
            throw new UnauthorizedError('credentials_required', { message: "You are not authorized to access this resource." });
        }

        const buildingId = req.params.id;
        const building = await BuildingService.deleteBuilding(buildingId);
        res.status(200).json(building);
    } catch (error) {
        next(error);
    }
});

export default buildingRouter;