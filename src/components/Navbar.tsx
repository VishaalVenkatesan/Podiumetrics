const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between pt-8">
        <a href = "/" className="text-3xl font-extrabold">Podiumetrics</a>
    <div className="flex flex-row justify-around gap-x-9">
        <a href = "/drivers" className="p-2">Drivers</a>
        <a href = "/constructors" className="p-2">Constructors</a>
        <a href = "/records" className="p-2">Records</a>
        <a href = "/standings" className="p-2">Standings</a>
        <a href = "/calender" className="p-2 pr-8">Calender</a>
    </div>
    </div>
  )
}

export default Navbar