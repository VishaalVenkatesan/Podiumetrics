"use client"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import React from "react";
import { ThemeSwitcher } from "@/app/themeSwitcher";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="flex flex-row justify-between pt-5">
      <div className="flex flex-row gap-x-4">
       <Link href="/" className="text-3xl font-bold font-rockwell pl-[20px]">Podiumetrics</Link>
          <ThemeSwitcher />
          </div>
          <div className="">
      <Navbar shouldHideOnScroll  onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="flex items-end justify-end pb-2 md:hidden"
        />
       
      </NavbarContent>
      <NavbarContent className="hidden space-x-[50px] md:flex justify-center font-mutuka text-[20px]">
        <NavbarItem>
          <Link color="foreground" href="/drivers">Drivers</Link>
        </NavbarItem>
        <NavbarItem >
          <Link href="/constructors" >Constructors</Link>
        </NavbarItem>
         <NavbarItem>
          <Link color="foreground" href="/results">Results</Link>
        </NavbarItem>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Standings</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Action event example" className="text-[18px] text-black bg-red-600 rounded font-mutuka">
            <DropdownItem key="drivers" href="/driver-standings" className="font-extrabold hover:text-zinc-800 hover:underline">Drivers</DropdownItem>
            <DropdownItem key="constructors" href="/constructor-standings" className="hover:text-zinc-800 hover:underline">Constructors</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <Link color="foreground" href="/tracks">Tracks</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="space-y-5">
        <NavbarMenuItem>
          <Link className="p-2 pt-10 text-2xl font-bold transition duration-150 rounded-lg font-rockwell hover:text-indigo-600 hover:bg-gray-100" href="/drivers">Drivers</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="p-2 text-2xl font-bold transition duration-150 rounded-lg font-rockwell hover:text-indigo-600 hover:bg-gray-100" href="/constructors">Constructors</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="p-2 text-2xl font-bold transition duration-150 rounded-lg font-rockwell hover:text-indigo-600 hover:bg-gray-100" href="/results">Results</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="p-2 text-2xl font-bold transition duration-150 rounded-lg font-rockwell hover:text-indigo-600 hover:bg-gray-100" href="/driver-standings">Driver Standings</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="p-2 text-2xl font-bold transition duration-150 rounded-lg font-rockwell hover:text-indigo-600 hover:bg-gray-100" href="/constructor-standings">Constructor Standings</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="p-2 text-2xl font-bold transition duration-150 rounded-lg font-rockwell hover:text-indigo-600 hover:bg-gray-100" href="/tracks">Tracks</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
    </div>
    </div>
  )
}

export default Nav;