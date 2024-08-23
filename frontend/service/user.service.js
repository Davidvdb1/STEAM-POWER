import { API_URL } from "../config.js";

const login = async (user) => {
  return await fetch(API_URL + '/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
}

const register = async (user) => {
  const token = sessionStorage.getItem('token');

  return await fetch(API_URL + '/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(user)
  });
}

const RecoverPassword = async (email) => {
  return await fetch(API_URL + '/mails/send-recover-mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
}

const updatePassword = async (token, newPassword) => {
  return await fetch(API_URL + '/users/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token, newPassword })
  });
}

const fetchUsers = async () => {
  const token = sessionStorage.getItem('token');

  return await fetch(API_URL + '/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  });
}

const deleteUser = async (id) => {
  const token = sessionStorage.getItem('token');

  return await fetch(API_URL + `/users/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  });
}

const toggleUserArchived = async (id) => {
  const token = sessionStorage.getItem('token');

  return await fetch(API_URL + `/users/toggle-archive/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  });
}

export default {
  login,
  register,
  RecoverPassword,
  updatePassword,
  fetchUsers,
  deleteUser,
  toggleUserArchived,
}
