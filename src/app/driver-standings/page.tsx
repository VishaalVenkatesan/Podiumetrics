"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

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
  var xml2js = require('xml2js');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [round, setRound] = useState('1');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');


  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://ergast.com/api/f1/${year}/${round}/driverStandings`);
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
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(e.target.value);
  };

  const handleRoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRound(e.target.value);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" width="200" height="150">
          <path fill="none" stroke="#1118FF" strokeWidth="15" strokeLinecap="round" strokeDasharray="300 385" strokeDashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z">
            <animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate>
          </path>
        </svg>
      </div>
    );
  }
 
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Year:
          <input type="number" value={year} onChange={handleYearChange} className='text-black'/>
        </label>
        <label>
          Round:
          <input type="number" value={round} onChange={handleRoundChange} className='text-black'/>
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <div>{error}</div>}
      <h1>Standings</h1>
      <Table aria-label="Standings table">
        <TableHeader>
          <TableColumn>Number</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Constructor Name</TableColumn>
          <TableColumn>Position</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Wins</TableColumn>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow key={index}>
              <TableCell>{drivers[index]?.PermanentNumber || '-'}</TableCell>
              <TableCell>{drivers[index]?.GivenName?.[0]}  {drivers[index]?.FamilyName?.[0]}</TableCell>
              <TableCell>{constructors[index]?.name?.[0]}</TableCell>
              <TableCell>{standing.position}</TableCell>
              <TableCell>{standing.points}</TableCell>
              <TableCell>{standing.wins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

          }


export default Page;