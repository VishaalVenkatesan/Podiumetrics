// "use client"
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
// import LoadingSpinner from '@/components/LoadingSpinner';
// import { fetchRound, Race } from '../utils/fetchRound';

// interface Result {
//   position: number;
//   points: number;
//   Driver: {
//     PermanentNumber: number;
//     GivenName: string[];
//     FamilyName: string[];
//     Nationality: string[];
//   };
//   Constructor : {
//   name: string;
// }
//   Grid: number;
//   Laps: number;
//   Status: string
//   Time: string;
//   FastestLap : {
//     Time: string
//     AverageSpeed: number
//   }
  
// }

// interface Standing {
//   position: number;
//   points: number;
//   wins: number;
// }


// const Page = () => {
//   const xml2js = require('xml2js');
//   const currentYear = new Date().getFullYear();
//   const [year, setYear] = useState(currentYear.toString());
//   const [round, setRound] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedRace, setSelectedRace] = useState<Race | null>(null);
//    const [circuits, setCircuits] = useState<Race[]>([]); 

// const fetchData = async () => {
//   setLoading(true);
//   setError('');

//   try {
//     const response = await axios.get(`https://ergast.com/api/f1/${year}/${round}/driverStandings`);
//     const parser = new xml2js.Parser({explicitArray: false});
//     const result = await parser.parseStringPromise(response.data);

//     const raceResults : Result[] = result.MRData.RaceTable.Race.ResultsList.Result.map((result: any) => ({
//       position: Number(result.$.position),
//       points: Number(result.$.points),
//       Driver: {
//         PermanentNumber: Number(result.Driver.PermanentNumber),
//         GivenName: result.Driver.GivenName,
//         FamilyName: result.Driver.FamilyName,
//         Nationality: result.Driver.Nationality,
//       },
//       Constructor: {
//         name: result.Constructor.Name,
//       },
//       Grid: Number(result.Grid),
//       Laps: Number(result.Laps),
//       Status: result.Status._,
//       Time: result.Time._,
//       FastestLap: {
//         Time: result.FastestLap.Time,
//         AverageSpeed: Number(result.FastestLap.AverageSpeed),
//       },
//     }));

//     setSelectedRace(raceResults);

//   } catch (error) {
//     setError('Please check your internet connection or try again later.');
//     console.error('Error:', error);
//   } finally {
//     setLoading(false);
//   }
// };
// useEffect(() => {
//   fetchData(); // Fetch data whenever the round changes
// }, []);


//   useEffect(() => {
//   const fetchCircuitData = async () => {
//     const circuitData = await fetchRound(setError, year);
//     if (circuitData) {
//       setCircuits(circuitData);
//       setSelectedRace(circuitData[0]); // Select the first race by default
//     }
//   };

//   fetchCircuitData();
// }, [year, setError]);
 

// const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   fetchData();
// };
// const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedRound = e.target.value;
//     const selectedRace = circuits.find(
//       (circuit) => circuit.round.toString() === selectedRound
//     );
//     setSelectedRace(selectedRace || null);
//     setRound(selectedRound); // Set the round according to the selected race
//   };




//   return (
//     <div className="">
//     <form
//         onSubmit={handleSubmit}
//         className="flex flex-col max-w-md p-8 mx-auto rounded-lg shadow-md gap-y-6"
//       >
//            <select 
//                 value={year} 
//                 onChange={(e) => {setYear(e.target.value)}}
//                 className='w-full p-2 font-mono text-xl font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
//                 >
//               {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map((year) => (
//               <option key={year} value={year}>{year}</option>
//                ))}
//             </select>
//           <select
//            id="race"
//            value={selectedRace ? selectedRace.round : ''}
//            onChange={handleRaceChange}
//            name='round' 
//            className='w-full p-4 font-mono font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
//           >
//             {circuits.map((race) => (
//               <option  key={race.round} value={race.round}>
//                 {race.RaceName[0]} ({race.Circuit[0].CircuitName[0]})
//               </option>
//            ))}
//           </select>
//         <button
//           type="submit"
//           className="py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
//         >
//           Submit
//         </button>
//       </form>
//   <div>
//     {loading ? (
//       <LoadingSpinner />
//     ) : error ? (
//       <div>{error}</div>
//     ) : selectedRace ? (
//       <Table>
//         <TableHeader>
//           <TableColumn>Position</TableColumn>
//           <TableColumn>Points</TableColumn>
//           <TableColumn>Permanent Number</TableColumn>
//           <TableColumn>Given Name</TableColumn>
//           <TableColumn>Family Name</TableColumn>
//           <TableColumn>Name</TableColumn>
//           <TableColumn>Grid</TableColumn>
//           <TableColumn>Laps</TableColumn>
//           <TableColumn>Status</TableColumn>
//           <TableColumn>Time</TableColumn>
//           <TableColumn>Fastest Lap Time</TableColumn>
//           <TableColumn>Average Speed</TableColumn>
//         </TableHeader>
//         <TableBody>
//   {selectedRace.map((race: Race, index: number) => (
//     <TableRow key={index}>
//       <TableCell>{race.position}</TableCell>
//       <TableCell>{race.points}</TableCell>
//       <TableCell>{race.Driver.GivenName}</TableCell>
//       <TableCell>{race.Driver.FamilyName}</TableCell>
//       <TableCell>{race.Driver.Nationality}</TableCell>
//       <TableCell>{race.Constructor.name}</TableCell>  
//       <TableCell>{race.Grid}</TableCell>
//       <TableCell>{race.Laps}</TableCell>
//       <TableCell>{race.Status}</TableCell>
//               <TableCell>{race.Time}</TableCell>
//               <TableCell>{race.FastestLap.Time}</TableCell>
//               <TableCell>{race.FastestLap.AverageSpeed}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     ) : null}
//   </div>
//   </div>
// );
// }

// export default Page;