import { API_URL } from "../config.js";

const fetchAllWorkshops = async () => {
    const teacherToken = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${teacherToken}`
        },
    });
}

const fetchAllWorkshopsIdAndName = async () => {
    const teacherToken = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/id/name`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${teacherToken}`
        },
    });
}

const fetchWorkshopsByCampId = async (campId) => {
    const teacherToken = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/camp/${campId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${teacherToken}`
        },
    });
}

const deleteWorkshop = async (workshopId) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/delete/${workshopId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
}

const createWorkshop = async (workshop) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/create`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: workshop,
    });
}

const updateWorkshop = async (workshopId, workshop) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/update/${workshopId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: workshop,
    });
}

const toggleArchiveForWorkshop = async (workshopId) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/toggle-archive/${workshopId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

const fetchWorkshopById = async (workshopId) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/${workshopId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

const fetchWorkshopsByCampIdWithFirstComponents = async (campId) => {
    const teacherToken = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/workshops/camp/${campId}/first`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${teacherToken}`
        },
    });
}

export default {
    fetchAllWorkshops,
    fetchWorkshopsByCampId,
    deleteWorkshop,
    createWorkshop,
    updateWorkshop,
    toggleArchiveForWorkshop,
    fetchAllWorkshopsIdAndName,
    fetchWorkshopById,
    fetchWorkshopsByCampIdWithFirstComponents,
}
