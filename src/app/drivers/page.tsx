"use client"

import axios from 'axios';
import { useEffect, useState } from 'react';

interface Driver {
  GivenName: string[];
  FamilyName: string[];
  Nationality: string[];
  DateOfBirth: string[];
  $: {
    url: string;
  };
}

const Page = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  var xml2js = require('xml2js');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://ergast.com/api/f1/${year}/drivers`);
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);

      // Extract the drivers data from the parsed JSON
      const drivers = result.MRData.DriverTable[0].Driver;
      setDrivers(drivers);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
        fetchData();
        }, []); // Empty dependency array means this effect runs once on mount
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedYear = parseInt(year);
    if (parsedYear < 1950 || parsedYear > new Date().getFullYear()) {
      setError('Please enter a valid year between 1950 and the current year.');
    } else {
      setError('');
      fetchData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (value === '' || (!isNaN(parseInt(value)))) {
    setError('');
    setYear(value);
  } else {
    setError('Please enter a valid year.'); 
  }
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
      <div className="pt-[40px]">
        <h1>ENTER YOUR DESIRED YEAR</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={year}
            name="year"
            onChange={handleChange}
            className='w-auto p-2 text-xl text-black rounded'
          />
          {error && <span className="ml-2 text-red-500">{error}</span>}
          <button type="submit" className='w-auto p-2 ml-3 text-xl font-extrabold text-black bg-blue-200 border-white rounded hover:bg-blue-400'>SUBMIT</button>
        </form>
      </div>
      <div className="grid grid-cols-3 gap-4 font-roboto">
        {drivers.map((driver, index) => (
          <div key={index} className='p-6 text-xl text-black bg-white rounded-[20px] m-3'>
            <h2>{driver.GivenName[0]} {driver.FamilyName[0]}</h2>
            <p>Nationality: {driver.Nationality[0]}</p>
            <p>Date of Birth: {driver.DateOfBirth[0]}</p>
            <a href={driver.$.url} className='text-blue-700'>More info</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;