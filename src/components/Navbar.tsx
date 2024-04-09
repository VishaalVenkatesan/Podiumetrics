"use client"
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between pt-8">
        <a href = "/" className="text-3xl font-extrabold">Podiumetrics</a>
    <div className="flex flex-row justify-around gap-x-9">
        <a href = "/drivers" className="p-2">Drivers</a>
        <a href = "/constructors" className="p-2">Constructors</a>
        <a href = "/records" className="p-2">Records</a>
      <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
        >
          Open Menu
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Action event example" 
        onAction={(key) => alert(key)}
      >
        <DropdownItem key="drivers" href="/driver-standings">Drivers</DropdownItem>
        <DropdownItem key="constructors" href="constructor-standings">Constructors</DropdownItem>
      </DropdownMenu>
      </Dropdown>
        <a href = "/calender" className="p-2 pr-8">Calender</a>
    </div>
    </div>
  )
}

export default Navbar