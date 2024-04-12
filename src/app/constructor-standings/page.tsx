"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import CountryImage from '@/components/CountryImage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { handleYearChange } from '../utils/handleYearChange';
import { fetchRound, Race } from '../utils/fetchRound';
interface ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  name: string;
  nationality: string;
}

const Page = () => {
  const xml2js = require('xml2js');
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [round, setRound] = useState('1');
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [circuits, setCircuits] = useState<Race[]>([]);

  const fetchConstructorData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://ergast.com/api/f1/${year}/${round}/constructorStandings`);
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);
      const standingsList = result.MRData.StandingsTable[0].StandingsList[0].ConstructorStanding;
      const constructorStandings: ConstructorStanding[] = standingsList.map((standing: any) => ({
        position: parseInt(standing.$.position),
        points: parseInt(standing.$.points),
        wins: parseInt(standing.$.wins),
        name: standing.Constructor[0].Name[0],
        nationality: standing.Constructor[0].Nationality[0]
      }));

      setConstructorStandings(constructorStandings);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    const fetchCircuitData = async () => {
      const circuitData = await fetchRound(setError, year);
      if (circuitData) {
        setCircuits(circuitData);
        setSelectedRace(circuitData[0]); // Select the first race by default
      }
    };

    fetchCircuitData();
  }, [year, setError]);

  useEffect(() => {
    fetchConstructorData(); // Fetch data whenever the round changes
  }, [round]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (year >= '1950' && year <= currentYear.toString()) {
      fetchConstructorData();
    } else {
      setError('Please enter a year between 1950 and the current year.');
    }
  };
  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedRound = e.target.value;
  const selectedRace = circuits.find(
    (circuit) => circuit.round.toString() === selectedRound
  );
  setSelectedRace(selectedRace || null);
  setRound(selectedRound); // Set the round according to the selected race
};


  const handleRoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRound(e.target.value);
  };

  return(
    <div>
       <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md p-8 mx-auto rounded-lg shadow-md gap-y-6"
      >
           <select 
                value={year} 
                onChange={(e) => {setYear(e.target.value)}}
                className='w-full p-2 font-mono text-xl font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
                >
              {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
               ))}
            </select>
          <select
           id="race"
           value={selectedRace ? selectedRace.round : ''}
           onChange={handleRaceChange}
            className='w-full p-4 font-mono font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
          >
            {circuits.map((race) => (
              <option key={race.round} value={race.round}>
                {race.RaceName[0]} ({race.Circuit[0].CircuitName[0]})
              </option>
           ))}
          </select>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
     {error ? (
  <div className="text-center text-red-500">{error}</div>
) : loading ? (
  <div className="flex items-center justify-center">
    <LoadingSpinner />
  </div>
) : (
  <div className="mt-10">
    <h1 className='mb-4 text-3xl font-extrabold text-center font-mutuka' >World Constructor Championship </h1>
    <Table className='font-mono text-2xl text-center mt-7'>
      <TableHeader>
        <TableColumn className='text-center'>Position</TableColumn>
        <TableColumn className='text-center'> </TableColumn>
        <TableColumn className='text-center'>Team</TableColumn>
        <TableColumn className='text-center'>Points</TableColumn>
        <TableColumn className='text-center'>Wins</TableColumn>
      </TableHeader>
      <TableBody className=''>
        {constructorStandings.map((standing, index) => (
          <TableRow key={index}>
            <TableCell className='text-center'>{standing.position}</TableCell>
            <TableCell className='flex items-center justify-center align-center'> 
              <CountryImage nationality={standing.nationality} size={30}/>
            </TableCell>
            <TableCell className='text-center'>{standing.name}</TableCell>
            <TableCell className='text-center'>{standing.points}</TableCell>
            <TableCell className='text-center'>{standing.wins}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}
</div>
  );
}

export default Page;