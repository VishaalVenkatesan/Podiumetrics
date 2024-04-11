"use client"

import axios from 'axios';
import {Link} from "@nextui-org/react";
import { useEffect, useState } from 'react';
import CountryImage  from "../../components/CountryImage";
import {Input} from "@nextui-org/react";
import { warning } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import { handleYearChange } from '../utils/handleYearChange';
import {reverseDate, calculateAge} from '../utils/ageUtils'

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
   const [imageURL, setImageURL] = useState<string>('');

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
  },[]); // Empty dependency array means this effect runs once on mount

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

  return (
    <div>
      <div className="pt-[40px]">
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md p-8 mx-auto rounded-lg shadow-md">
          <div className="mb-4">
            <h1 className='mb-6 text-3xl font-bold text-center font-mutuka'>DRIVERS</h1>
            <label className="block mb-2 font-bold text-11 font-mutuka" htmlFor="year">
              Enter the Year:
            </label>
            <Input
              type="number"
              id="year"
              value={year}
              onChange={(e) => handleYearChange(e, setYear, setError)}
            />
          </div>
          <div className="pt-2 pb-5 text-center">
          {error && <span className="text-red-500 ">{error}</span>}
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded ont-bold hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      </div>
      
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ):(
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 font-roboto">
          
        {drivers.map((driver, index) => (
          <div key={index} className='p-6 text-center text-xl bg-gray-900 rounded-[20px] m-3 flex flex-col gap-y-7 focus:outline-none focus:shadow-outline' >
            <h2 className='text-3xl font-bold font-mutuka'>{driver.GivenName[0]} {driver.FamilyName[0]}</h2>
              <CountryImage nationality={driver.Nationality[0]} />
            <p>Date of Birth: {reverseDate(driver.DateOfBirth[0])}</p>
            <p>Age: {calculateAge(driver.DateOfBirth[0])}</p>
            <div className="flex items-center justify-center">
            <Link isExternal href={driver.$.url} className='font-mono font-bold text-center'
              showAnchorIcon
              isBlock
              >
              More info</Link>
              </div>
              </div>
        ))}
        </div>
      )}
      </div>

    
  );
}

export default Page;