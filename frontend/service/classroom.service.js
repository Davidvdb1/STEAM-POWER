import { API_URL } from "../config.js";

const fetchAllClassrooms = async () => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${API_URL}/classrooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

const fetchClassroomById = async () => {
  const group = JSON.parse(sessionStorage.getItem('currentGroup'));

  if (group) {
    return await fetch(`${API_URL}/classrooms/id`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${group.token}`,
      },
    });
  } else {
    return null;
  }
}

const deleteClassroom = async (classroomId) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${API_URL}/classrooms/delete/${classroomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

const createClassroom = async (classroom) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${API_URL}/classrooms/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(classroom),
  });
}

const updateClassroom = async (classroomId, classroom) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${API_URL}/classrooms/update/${classroomId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(classroom),
  });
}

const joinClassroom = async (code) => {
  return await fetch(`${API_URL}/classrooms/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "code": code }),
  });
}

const resetClassrooms = async () => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${API_URL}/classrooms/reset`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
}


const increaseEnergy = async (amount) => {
  const group = sessionStorage.getItem('currentGroup');
  if (!group) {
    const response = await fetch(API_URL + '/classrooms/check-energy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount })
    });
    return await response.json();
  }

  const token = await JSON.parse(group).token;
  const response = await fetch(API_URL + '/classrooms/increase-energy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: amount })
  });
  if (response.status === 201) {
    return await response.json();
  } else {
    return null;
  }
}

const getAll = async () => {
  const teacherToken = sessionStorage.getItem('token');
  const groupToken = sessionStorage.getItem('currentGroup');

  const token = teacherToken || (groupToken ? JSON.parse(groupToken).token : null);

  const response = await fetch(API_URL + '/classrooms/get-all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (response.status === 200) {
    return await response.json();
  } else {
    return null;
  }
}

const getAllChargedBuildings = async () => {
  const group = sessionStorage.getItem('currentGroup');
  if (!group) {
    return null;
  }

  const token = await JSON.parse(group).token;

  const result = await fetch(API_URL + '/classrooms/get-charged-buildings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (result && result.status === 200) {
    return await result.json();
  }
  return [];
}

const getLeaderBoard = async (classroom) => {
  const teacherToken = sessionStorage.getItem('token');
  const groupToken = sessionStorage.getItem('currentGroup');

  const token = teacherToken || (groupToken ? JSON.parse(groupToken).token : null);

  return await fetch(`${API_URL}/classrooms/leaderboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
}

export default {
  fetchAllClassrooms,
  deleteClassroom,
  createClassroom,
  updateClassroom,
  joinClassroom,
  resetClassrooms,
  increaseEnergy,
  getAll,
  getLeaderBoard,
  fetchClassroomById,
  getAllChargedBuildings,
}
