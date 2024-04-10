"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

interface ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  name: string;
  nationality: string;
}

const Page = () => {
  var xml2js = require('xml2js')
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [round, setRound] = useState('1');
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [error, setError] = useState('')

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
    fetchConstructorData();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (year >= '1950' && year <= currentYear.toString()) {
      fetchConstructorData();
    } else {
      setError('Please enter a year between 1950 and the current year.');
    }
  };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(parseInt(value)))) {
      setError('');
      setYear(value);
    } else {
      setError('Please enter a valid year.'); 
    }
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

  return(
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
            onChange={handleYearChange}
            className="w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline"
            min="1950"
            max={currentYear}
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-bold" htmlFor="round">
            Round:
          </label>
          <input
            type="number"
            id="round"
            value={round}
            onChange={handleRoundChange}
            className="w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
        {error && <div className="text-center text-red-500">{error}</div>}
        </div>
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
      
      <Table>
        <TableHeader>
          <TableColumn>Position</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Nationality</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Wins</TableColumn>
        </TableHeader>
        <TableBody>
          {constructorStandings.map((standing, index) => (
            <TableRow key={index}>
              <TableCell>{standing.position}</TableCell>
              <TableCell>{standing.name}</TableCell>
              <TableCell>{standing.nationality}</TableCell>
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