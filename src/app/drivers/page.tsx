"use client"
import axios from 'axios';
import {Link} from "@nextui-org/react";
import { useEffect, useState } from 'react';
import CountryImage  from "../../components/CountryImage";
import LoadingSpinner from '@/components/LoadingSpinner';
import {reverseDate} from '../utils/ageUtils'

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
  const [showAge, setShowAge] = useState(true);
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
  },[]); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
  },[drivers]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedYear = parseInt(year);
    fetchData();
    setShowAge(true);
  };

  const calculateAge = (dateOfBirth: string) => {
    const age = Number(year) - new Date(dateOfBirth).getFullYear()
    return age;
  }

  return (
    <div>
      <div className="pt-[40px]">
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md p-8 mx-auto rounded-lg shadow-md">
            <h1 className='mb-6 text-3xl font-bold text-center font-mutuka'>DRIVERS</h1>
              <select 
                value={year} 
                onChange={(e) => {setYear(e.target.value); setShowAge(false);}}
                className='p-2 font-mono text-xl font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
                >
              {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
               ))}
            </select>
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
            {showAge && <p>Age: {calculateAge(driver.DateOfBirth[0])}</p>}
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