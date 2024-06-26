"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import CountryImage from '@/components/NationalityFlag';
import dynamic from 'next/dynamic';
const DynamicLoadingSpinner = dynamic(() => import('@/components/LoadingSpinner.client'), {
  ssr: false, // This will load the component only on client side
});
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
       setError('If this is 2024, I wish I could predict the future or else there is an error fetching the data. Please check your internet connection or try again later.');
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

const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedYear = e.target.value;
  setYear(selectedYear);
  const fetchedRaces = await fetchRound(setError, selectedYear);
  setRaces(fetchedRaces || []);
};

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-y-4 mt-[50px]">
        <h1 className='mb-6 font-mono text-4xl font-bold text-center mt-[30px]'>World Drivers Championship</h1>
           <select 
                value={year} 
                onChange={handleYearChange}
                    className='md:w-[400px] w-[300px] p-2 font-mono text-xl font-bold text-center rounded-md  focus:outline-none focus:shadow-outline'
                >
              {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
               ))}
            </select>
          <select
           id="race"
           value={selectedRace ? selectedRace.round : ''}
           onChange={handleRaceChange}
           name='round' 
            className='md:w-[400px] w-[300px] p-4 font-mono font-bold text-center rounded-md focus:outline-none focus:shadow-outline mb-4'
          >
            {circuits.map((race) => (
              <option  key={race.round} value={race.round}>
                {race.RaceName[0]} ({race.Circuit[0].CircuitName[0]})
              </option>
           ))}
          </select>
           </div>
      <div>
      {error ? (
        <div className="mb-4 ml-2 text-3xl text-center text-red-600 font-mutuka md:ml-[100px] md:mr-[100px] mt-[120px]">{error}</div>
      )
        :loading ? (
          <div className="flex items-center justify-center">
            <DynamicLoadingSpinner />
            </div>
          ):(
       <div className="mt-[20px]">
        
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