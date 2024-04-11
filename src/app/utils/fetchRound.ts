  import axios from "axios";
  const xml2js = require('xml2js');

  export interface Race {
    round: number;
    RaceName: string[];
    Circuit: {
      CircuitName: string[];
    }[];
  }

export const fetchRound = async (
  setError: React.Dispatch<React.SetStateAction<string>>,
  year: string
): Promise<Race[] | undefined> => {
  try {
    const response = await axios.get(`https://ergast.com/api/f1/${year}.xml`);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    const races: Race[] = result.MRData.RaceTable[0].Race.map((race: any) => ({
      round: parseInt(race.$.round),
      RaceName: race.RaceName,
      Circuit: race.Circuit
    }));
    return races;
  } catch (error) {
    setError('Error fetching data. Please try again later.');
    console.error('Error:', error);
    return undefined;
  }
};