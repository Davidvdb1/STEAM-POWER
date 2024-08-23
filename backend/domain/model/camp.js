import { ValidationError } from './validationError.js';

export class Camp {
    constructor(camp) {
        const errors = this.validate(camp);

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors);
        }

        this.id = camp.id;
        this.title = camp.title.trim();
        this.startDate = camp.startDate;
        this.endDate = camp.endDate;
        this.startTime = camp.startTime;
        this.endTime = camp.endTime;
        this.startAge = camp.startAge;
        this.endAge = camp.endAge;
        this.location = camp.location;
        this.content = camp.content;
        this.archived = camp.archived;
    }

    validate(camp) {
        const errors = {};

        // Validate title
        if (!camp.title?.trim()) {
            errors.title = 'Title is required';
        }

        // Validate start date
        const startDate = new Date(camp.startDate);
        const currentDate = new Date();
        if (isNaN(startDate)) {
            errors.startDate = 'Start date must be a valid date';
        } else if (startDate <= currentDate) {
            errors.startDate = 'Start date must be in the future';
        }

        // Validate end date
        const endDate = new Date(camp.endDate);
        if (isNaN(endDate)) {
            errors.endDate = 'End date must be a valid date';
        }

        // Check if end date is after start date
        if (endDate <= startDate) {
            errors.dateRange = 'End date must be after start date';
        }

        // Validate start time and end time format (HH:MM)
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(camp.startTime)) {
            errors.startTime = 'Start time must be in HH:MM format';
        }

        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(camp.endTime)) {
            errors.endTime = 'End time must be in HH:MM format';
        }

        // Validate start and end time
        const [startHours, startMinutes] = camp.startTime.split(':').map(Number);
        const [endHours, endMinutes] = camp.endTime.split(':').map(Number);
        if (isNaN(startHours) || isNaN(startMinutes) || startHours < 0 || startHours > 23 || startMinutes < 0 || startMinutes > 59) {
            errors.startTime = 'Start time must be a valid time in HH:MM format';
        }

        if (isNaN(endHours) || isNaN(endMinutes) || endHours < 0 || endHours > 23 || endMinutes < 0 || endMinutes > 59) {
            errors.endTime = 'End time must be a valid time in HH:MM format';
        }

        // Validate ages
        if (isNaN(camp.startAge) || camp.startAge < 0 || camp.startAge > 100) {
            errors.startAge = 'Start age must be a number between 0 and 100';
        }

        if (isNaN(camp.endAge) || camp.endAge < 0 || camp.endAge > 100) {
            errors.endAge = 'End age must be a number between 0 and 100';
        }

        // Validate that end age is greater than or equal to start age
        if (parseInt(camp.endAge) < parseInt(camp.startAge)) {
            errors.ageRange = 'End age must be greater than or equal to start age';
        }

        // Validate location
        if (!camp.location?.trim()) {
            errors.location = 'Location is required';
        }

        if (typeof camp.archived !== 'boolean') {
            errors.archived = 'Archived must be a boolean value';
        }

        return errors;
    }
}
