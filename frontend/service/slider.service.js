import { API_URL } from "../config.js";

const getSliderValue = async (id) => {
    const teacherToken = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/sliders/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${teacherToken}`
        },
    });
}

const setNewSliderValue = async (id, value) => {
    const teacherToken = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/sliders/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${teacherToken}`
        },
        body: JSON.stringify({ value: value })
    });
}

export default {
    getSliderValue,
    setNewSliderValue,
}