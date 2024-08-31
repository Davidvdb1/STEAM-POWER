import { API_URL } from "../config.js";

const uploadImage = async (imageFile) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${API_URL}/upload-image-endpoint`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: imageFile
  });
};

export default {
  uploadImage,
};
