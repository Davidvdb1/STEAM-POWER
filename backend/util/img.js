import fs from 'fs';

// Function to fetch image data asynchronously
export const fetchImage = async (imagePath) => {
    try {
        const imageData = await fs.promises.readFile(imagePath);
        const base64Image = imageData.toString('base64');
        const fileName = imagePath.split('/').pop(); // Extract file name from path
        return { data: base64Image, fileName: fileName };
    } catch (error) {
        console.error('Error fetching image data:', error);
        throw error;
    }
};