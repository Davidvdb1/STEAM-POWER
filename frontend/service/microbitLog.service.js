import {FILE_LIST_URL, LOCAL_BLUETOOTH_LOG_URL} from "../config.js";


const getFiles = async () => {
  const response = await fetch(LOCAL_BLUETOOTH_LOG_URL + FILE_LIST_URL, {
    method: 'GET'
  });

  if (response && response.status === 200) {
    return await response.json();
  } else {
    throw Error('Failed to fetch files');
  }
}

const getFileContent = async (fileName) => {
  const response = await fetch(LOCAL_BLUETOOTH_LOG_URL + `/${fileName}`, {
    method: 'GET'
  });

  if (response && response.status === 200) {
    return await response.text();
  } else {
    throw Error('Failed to fetch files');
  }
}

export default {
  getFiles,
  getFileContent,
}
