import axios from 'axios';

export const fetchNational = async (nationality: string) => {
    const nationalityIndex = nationality === 'Dutch' ? 1 : 0;
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/demonym/${nationality}`);
        return response.data[nationalityIndex].flags; // Access the flags of the first country
    } catch (error) {
        console.error("Error:", error);
        throw new Error('Failed to fetch country data');
    }
};