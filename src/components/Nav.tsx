"use client"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import React from "react";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar shouldHideOnScroll className="pt-3" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand >
          <Link href="/" className="font-mono text-2xl font-bold">Podiumetrics</Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden space-x-[50px] sm:flex justify-center font-mono text-[15px] font-bold">
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
      <NavbarMenu className="space-y-2">
        <NavbarMenuItem>
          <Link className="py-2 pt-8 text-2xl font-extrabold font-mutuka" href="/drivers">Drivers</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/constructors">Constructors</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/results">Results</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/driver-standings">Driver Standings</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/constructor-standings">Constructor Standings</Link>
        </NavbarMenuItem>
         <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/results">Results</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/tracks">Tracks</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}

export default Nav;