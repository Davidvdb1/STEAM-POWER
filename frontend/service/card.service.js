import { API_URL } from "../config.js";

const fetchAllCards = async () => {
  const response = await fetch(`${API_URL}/cards`, {
    method: "GET",
    headers: {
    },
      "Content-Type": "application/json",
  });

  if (!response.ok) {
    throw new Error('Error fetching cards: ' + response.statusText);
  }

  return await response.json();
}

const createCard = async (card) => {
  const token = sessionStorage.getItem('token');
  return await fetch(`${API_URL}/cards/create`, {

    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: card,
  });
}

const deleteCard = async (cardId) => {
  const token = sessionStorage.getItem('token');

  console.log('Deleting card:', cardId); // Log the cardId
  console.log('Token:', token); // Log the token
  console.log('URL:', `${API_URL}/cards/delete/${cardId}`); // Log the URL

  return await fetch(`${API_URL}/cards/delete/${cardId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
}




export default {
  fetchAllCards,
  createCard,
  deleteCard,
}
