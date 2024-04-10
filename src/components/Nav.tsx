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
      <NavbarContent className="hidden space-x-[30px] sm:flex justify-center">
        <NavbarItem>
          <Link color="foreground" href="/drivers">Drivers</Link>
        </NavbarItem>
        <NavbarItem >
          <Link href="/constructors" >Constructors</Link>
        </NavbarItem>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Standings</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Action event example" className="text-black bg-white">
            <DropdownItem key="drivers" href="/driver-standings">Drivers</DropdownItem>
            <DropdownItem key="constructors" href="/constructor-standings">Constructors</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <Link color="foreground" href="/calender">Calender</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="space-y-4">
        <NavbarMenuItem>
          <Link className="py-2 pt-8 text-2xl font-extrabold font-mutuka" href="/drivers">Drivers</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/constructors">Constructors</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/driver-standings">Driver Standings</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/constructor-standings">Constructor Standings</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="py-2 text-2xl font-extrabold font-mutuka" href="/calender">Calender</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}

export default Nav;