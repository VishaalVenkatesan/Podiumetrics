import axios from 'axios';

export const fetchCountry = async (nationality: string) => {
    const nationalityIndex = nationality === 'French' ? 2 : 0;
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/demonym/${nationality}`);
        return response.data[nationalityIndex].flags; // Access the flags of the first country
    } catch (error) {
        console.error("Error:", error);
        throw new Error('Failed to fetch country data');
    }
};