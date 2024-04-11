"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import CountryImage from '@/components/CountryImage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchRound, Race } from '../utils/fetchRound';

interface Driver {
  driverId: string[];
  code: string[];
  PermanentNumber: number;
  GivenName: string[];
  FamilyName: string[];
  DateOfBirth: string[];
  Nationality: string[];
  $: {
    url: string;
  };
}

interface Standing {
  position: number;
  points: number;
  wins: number;
}

interface Constructor {
  constructorId: string[];
  name: string;
  nationality: string;
  $: {
    url: string;
  };
}

const Page = () => {
  const xml2js = require('xml2js');
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [round, setRound] = useState('1');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [circuits, setCircuits] = useState<Race[]>([]);
  const [races, setRaces] = useState<Race[]>([]);


  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://ergast.com/api/f1/${year}/${round}/driverStandings`);
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);
      const standingsList = result.MRData.StandingsTable[0].StandingsList[0].DriverStanding;
      const drivers: Driver[] = standingsList.map((standing: any) => standing.Driver[0]);
      const constructors: Constructor[] = standingsList.map((standing: any) => ({
        constructorId: standing.Constructor[0].constructorId,
        name: standing.Constructor[0].Name,
        nationality: standing.Constructor[0].Nationality,
        $: standing.Constructor[0].$
      }));
      const standings: Standing[] = standingsList.map((standing: any) => ({
        position: parseInt(standing.$.position),
        points: parseInt(standing.$.points),
        wins: parseInt(standing.$.wins)
      }));

      setDrivers(drivers);
      setConstructors(constructors);
      setStandings(standings);
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

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!selectedRace) {
    setError('This Event has still not occurred');
    return;
  }
  fetchData();
};
const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedRound = e.target.value;
  const selectedRace = circuits.find(
    (circuit) => circuit.round.toString() === selectedRound
  );
  setSelectedRace(selectedRace || null);
  setRound(selectedRound); // Set the round according to the selected race
};

useEffect(() => {
  fetchData(); // Fetch data whenever the round changes
}, [round]);

const handleYearChange = async (e: React.ChangeEvent<HTMLInputElement>, setYear: React.Dispatch<React.SetStateAction<string>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
  const selectedYear = e.target.value;
  setYear(selectedYear);
  const fetchedRaces = await fetchRound(setError, selectedYear);
  setRaces(fetchedRaces || []);
};




  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md p-8 mx-auto rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-2 font-bold " htmlFor="year">
            Year:
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => handleYearChange(e, setYear, setError)}
            className="w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline"
            min="1950"
            max={currentYear}
          />
        </div>

         <label className="block mb-2 font-bold" htmlFor="race">
          Race:
          </label>
          <select
           id="race"
           value={selectedRace ? selectedRace.round : ''}
           onChange={handleRaceChange}
            className="w-full px-3 py-2 mb-3 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline"
          >
            {circuits.map((race) => (
              <option key={race.round} value={race.round}>
                {race.RaceName[0]} ({race.Circuit[0].CircuitName[0]})
              </option>
           ))}
          </select>
        <button
          type="submit"
          className="py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
      <div>
      {error ? (
        <div className="text-center text-red-500">{error}</div>
      )
        :loading ? (
          <div className="flex items-center justify-center">
           <LoadingSpinner />
            </div>
          ):(
       <div className="">
        <h1 className='mb-4 text-2xl font-extrabold text-center font-mutuka'>World Drivers Championship</h1>
      <Table isStriped aria-label="Standings table"  className='text-xl font-carlson '>
        <TableHeader>
          <TableColumn className='text-center'>Position</TableColumn>
          <TableColumn className='text-center'>Nationality</TableColumn>
          <TableColumn className='text-center'>Number</TableColumn>
          <TableColumn className='text-center'>Name</TableColumn>
          <TableColumn className='text-center'>Constructor Name</TableColumn>
          <TableColumn className='text-center'>Points</TableColumn>
          <TableColumn className='text-center'>Wins</TableColumn>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow key={index}>
              <TableCell className='text-center'>{standing.position}</TableCell>
              <TableCell className='flex items-center justify-center align-center'>
                <CountryImage
                  nationality={drivers[index]?.Nationality?.[0]} size={30}/>
                  </TableCell>
              <TableCell className='text-center'>{drivers[index]?.PermanentNumber || '-'}</TableCell>
              <TableCell className='text-center'>{drivers[index]?.GivenName?.[0]} {drivers[index]?.FamilyName?.[0]}</TableCell>
              <TableCell className='text-center'>{constructors[index]?.name?.[0]}</TableCell>
              <TableCell className='text-center'>{standing.points}</TableCell>
              <TableCell className='text-center'>{standing.wins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
          )}
          </div>
  </div>
  );
}

export default Page;