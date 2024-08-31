export class Card {
    constructor(card) {
        this.id = card.id;
        this.energyRequirement = card.energyRequirement;
        this.title = card.title;
        this.description = card.description;
        this.multiplier = card.multiplier;
        this.poweredDevice = card.poweredDevice;
        this.image1 = card.image1;
        this.image2 = card.image2;
    }

    validate(card) {
        const errors = {};

        // Validate id
        if (!Number.isInteger(card.id) || card.id <= 0) {
            errors.id = 'ID must be a positive integer';
        }

        // Validate energyRequirement
        if (typeof card.energyRequirement !== 'number' || card.energyRequirement < 0) {
            errors.energyRequirement = 'Energy requirement must be a non-negative number';
        }

        // Validate title
        if (!card.title?.trim()) {
            errors.title = 'Title is required';
        }

        // Validate description
        if (!card.description?.trim()) {
            errors.description = 'Description is required';
        }

        // Validate multiplier
        if (!Number.isInteger(card.multiplier) || card.multiplier <= 0) {
            errors.multiplier = 'Multiplier must be a positive integer';
        }

        // Validate poweredDevice
        if (card.poweredDevice && !card.poweredDevice.trim()) {
            errors.poweredDevice = 'Powered device must be a non-empty string';
        }

        // Validate image1
        /*if (!card.image1?.trim()) {
            errors.image1 = 'Image1 is required';
        }*/

        // Validate image2
        /*if (!card.image2?.trim()) {
            errors.image2 = 'Image2 is required';
        }*/

        return errors;
    }

}