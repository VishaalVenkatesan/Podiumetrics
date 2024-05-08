"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchRound, Race } from '../utils/fetchRound';
import CountryImage from '@/components/NationalityFlag';
import greenTri from '../../../public/green-tri.png';
import redTri from '../../../public/red-tri.png';
import Image from 'next/image';
interface Result {
    position: number;
    points: number;
    driver: {
        permanentNumber: number;
        givenName: string;
        familyName: string;
        nationality: string;
    };
    constructor: {
        name: string;
    };
    grid: number;
    laps: number;
    status: {
        statusId: string;
        status: string;
    };
    time: {
        time: string;
    };
    fastestLap: {
        rank: number;
        lap: number;
        time: string;
        averageSpeed: {
            units: string;
            speed: number;
        };
    };
}



const Page = () => {
  const xml2js = require('xml2js');
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [round, setRound] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
   const [circuits, setCircuits] = useState<Race[]>([]);
   const [result, setResult] = useState<Result[]>([]);

const fetchData = async () => {
  setLoading(true);
  setError('');
  const url = `https://ergast.com/api/f1/${year}/${round}/results`;
  console.log('URL:', url);
  console.log('Year:', year);
  console.log('Round:', round);
  try {
    const response = await axios.get(url);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    console.log(result);
    const raceResults = result.MRData.RaceTable[0].Race[0].ResultsList[0].Result;
  const endResult: Result[] = raceResults.map((eresult: any) => {
    const driver = eresult.Driver && eresult.Driver[0] ? eresult.Driver[0] : {};
    const constructor = eresult.Constructor && eresult.Constructor[0] ? eresult.Constructor[0] : {};
    const status = eresult.Status && eresult.Status[0] ? eresult.Status[0] : {};
    const fastestLap = eresult.FastestLap && eresult.FastestLap[0] ? eresult.FastestLap[0] : {};
    const averageSpeed = fastestLap.AverageSpeed && fastestLap.AverageSpeed[0] ? fastestLap.AverageSpeed[0] : {};

    return {
      position: eresult.$.position,
      points: eresult.$.points,
      driver: {
        permanentNumber: driver.PermanentNumber ? driver.PermanentNumber[0] : '',
        givenName: driver.GivenName ? driver.GivenName[0] : '',
        familyName: driver.FamilyName ? driver.FamilyName[0] : '',
        nationality: driver.Nationality ? driver.Nationality[0] : '',
      },
      constructor: {
        name: constructor.Name ? constructor.Name[0] : '',
      },
      grid: eresult.Grid ? eresult.Grid[0] : '',
      laps: eresult.Laps ? eresult.Laps[0] : '',
      status: {
        statusId: status.$ ? status.$.statusId : '',
        status: status._ ? status._ : '',
      },
      time: {
        time: eresult.Time ? eresult.Time[0]._ : '',
      },
      fastestLap: {
        rank: fastestLap.$ ? fastestLap.$.rank : '',
        lap: fastestLap.$ ? fastestLap.$.lap : '',
        time: fastestLap.Time ? fastestLap.Time[0] : '',
        averageSpeed: {
          units: averageSpeed.$ ? averageSpeed.$.units : '',
          speed: averageSpeed._ ? averageSpeed._ : '',
        },
      },
    };
  });

    setResult(endResult);
  } catch (error) {
    setError('If this is 2024, I wish I could predict the future or else there is an error fetching the data. Please check your internet connection or try again later.');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchData(); // Fetch data whenever the round changes
}, [round]);

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
 
const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedYear = e.target.value;
  setYear(selectedYear);
  const fetchedRaces = await fetchRound(setError, selectedYear);
  setSelectedRace(fetchedRaces ? fetchedRaces[0] : null);
};

const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRound = e.target.value;
    const selectedRace = circuits.find(
      (circuit) => circuit.round.toString() === selectedRound
    );
    setSelectedRace(selectedRace || null);
    setRound(selectedRound); // Set the round according to the selected race
  };
    
return (
  <div>
    <div className="flex flex-col items-center justify-center gap-y-4 mt-[50px]">
       <h1 className='mb-3 font-mono text-4xl font-bold text-center mt-[30px]'>RACE RESULT</h1>
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
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
         <div className="mb-4 ml-2 text-3xl text-center text-red-600 font-mutuka md:ml-[100px] md:mr-[100px] mt-[120px]">{error}</div>
      ) : selectedRace ? (
        <div className="overflow-auto">
         
          <Table aria-label="Standings table" className='p-1 text-center font-carlson'>
            <TableHeader>
              <TableColumn className='text-center'>Net</TableColumn>
              <TableColumn className='text-center'>Position</TableColumn>
              <TableColumn className='text-center'>Nationality</TableColumn>
              <TableColumn className='text-center'>Name</TableColumn>
              <TableColumn className='text-center'>Constructor</TableColumn>
              <TableColumn className='text-center'>Laps</TableColumn>
              <TableColumn className='text-center'>Status</TableColumn>
              <TableColumn className='text-center'>Time</TableColumn>
              <TableColumn className='text-center'>Fastest Lap Time</TableColumn>
              <TableColumn className='text-center'>Points</TableColumn>
              <TableColumn className='text-center'>Average Speed</TableColumn>
            </TableHeader>
            <TableBody>
              {result.map((standing, index) => (
                <TableRow key={index}>
                  <TableCell className='text-center'>
                   {
                  standing.grid - standing.position > 0 ? 
                    <div className="flex flex-row">               
                      <Image src={greenTri} alt='green-tri' width={20} height={10}/>
                      <h1 className='pl-3 font-bold'>{standing.grid - standing.position}</h1>
                    </div> :
                  standing.grid - standing.position < 0 ?
                    <div className="flex flex-row">
                     <Image src={redTri} alt='red-tri' width={20} height={20}/>
                      <h1 className='pl-3 font-bold '>{Math.abs(standing.grid - standing.position)}</h1>
                    </div> :
                  <h1 className='text-xl font-bold font-mutuka'>-</h1>
                }
                      
                    </TableCell>
                  <TableCell className='text-center'>{standing.position}</TableCell>
                  <TableCell className='flex items-center justify-center align-center'>
                    <CountryImage nationality={standing.driver.nationality} size={30}/>
                  </TableCell>
                  <TableCell className='text-center'>{standing.driver.givenName} {standing.driver.familyName}</TableCell>
                  <TableCell className='text-center'>{standing.constructor.name}</TableCell>  
                  <TableCell className='text-center'>{standing.laps}</TableCell>
                  <TableCell className='text-center'>{standing.status.status}</TableCell>
                  <TableCell className='text-center'>{standing.time.time}</TableCell>
                  <TableCell className='text-center'>{standing.fastestLap.time}</TableCell>
                  <TableCell className='text-center'>{standing.points}</TableCell>
                  <TableCell className='text-center'>{standing.fastestLap.averageSpeed.speed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>  
  </div>
);
}
export default Page;