import sliderDb from '../domain/data-access/slider.db.js';

const getSliderValue = async (id) => {
    return sliderDb.getSliderValue(id);
}

const setNewSliderValue = async (id, value) => {
    return sliderDb.setNewSliderValue(id, value);
}

export default {
    getSliderValue,
    setNewSliderValue,
}