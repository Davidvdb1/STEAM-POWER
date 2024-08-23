import { API_URL } from "../config.js";

const fetchAllcamps = async () => {
    const teacherToken = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${teacherToken}`
        },
    });
}

const deleteCamp = async (campId) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps/delete/${campId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
}

const createCamp = async (camp) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps/create`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: camp,
    });
}

const updateCamp = async (campId, camp) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps/update/${campId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: camp,
    });
}

const searchCamps = async (title, startDate, age, location, endDate) => {
    const token = sessionStorage.getItem('token');


    const queryParams = new URLSearchParams();
    if (title) queryParams.append('title', title);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (age) queryParams.append('age', age);
    if (location) queryParams.append('location', location);

    const url = `${API_URL}/camps/search?${queryParams.toString()}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch filtered camps');
        }

        const camps = await response.json();
        return camps;
    } catch (error) {
        console.error('Error fetching filtered camps:', error);
        throw error;
    }
}

const fetchRelationsForCamp = async (campId) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps/relations/${campId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

const toggleArchiveForCamp = async (campId) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps/toggle-archive/${campId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

const switchPosition = async (campId, workshopId, moveUp) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps/${campId}/workshops/${workshopId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ moveUp })
    });
}

const fetchCampById = async (campId) => {
    const token = sessionStorage.getItem('token');

    return await fetch(`${API_URL}/camps/id/${campId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
}


export default {
    fetchAllcamps,
    deleteCamp,
    createCamp,
    updateCamp,
    searchCamps,
    fetchRelationsForCamp,
    toggleArchiveForCamp,
    switchPosition,
    fetchCampById,
}
