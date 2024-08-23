import { API_URL } from "../config.js";

const fetchAllBuildings = async () => {
  const response = await fetch(API_URL + '/buildings/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.status === 200) {
    return await response.json();
  } else {
    return null;
  }
}


const chargeBuilding = async (building) => {
  const group = JSON.parse(sessionStorage.getItem('currentGroup'));

  if (group) {
    return await fetch(API_URL + '/buildings/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${group.token}`
      },
      body: JSON.stringify({ 'groupId': group.id, 'buildingId': building.id })
    });
  } else {
    return null;
  }
}

export default {
  fetchAllBuildings,
  chargeBuilding,
}
