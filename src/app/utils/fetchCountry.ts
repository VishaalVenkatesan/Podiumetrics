import axios from 'axios';

export const fetchCountry = async (name: string) => {
    const nationalityIndex = name === 'French' ? 2 : (name === 'China' ? 1 : 0);
    if(name === 'UK') name = 'United Kingdom'; 
    if(name === 'United States') name = 'United States of America'; 
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
        return response.data[nationalityIndex].flags; // Access the flags of the first country
    } catch (error) {
        console.error("Error:", error);
        throw new Error('Failed to fetch country data');
    }
};