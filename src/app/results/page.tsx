"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
interface RaceResult {
  name: string;
  RaceName: string;
  circuitName: string;
  location: string;
  date: string;
  number: number;
  winner: {
    name: string;
    dob: string;
    nationality: string;
    team: {
      name: string;
      nationality: string;
    };
  };
  laps: number;
  status: string;
  time: string;
  'fastest-lap': string;
  speed: number;
}


const Page = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [round, setRound] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRaceResults = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://ergast.com/api/f1/${year}/${round}/results`);
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);
      const resultsList = result.MRData.RaceTable[0].Race[0].ResultsList[0].Result;
      const results: Result[] = resultsList.map((result: any) => ({
        position: parseInt(result.$.position),
        points: parseInt(result.$.points),
        driverName: `${result.Driver[0].GivenName[0]} ${result.Driver[0].FamilyName[0]}`,
        constructorName: result.Constructor[0].Name[0]
      }));

      setResults(results);
    } catch (error) {
      setError('Error fetching data. Please check your internet connection or try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaceResults(); // Fetch data whenever the round changes
  }, [round]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (year >= '1950' && year <= currentYear.toString()) {
      fetchRaceResults();
    } else {
      setError('Please enter a year between 1950 and the current year.');
    }
  };

  const handleRoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRound(e.target.value);
  };

  // Render your component here...
};

export default Page;