import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import HenderAuth from "./header-auth";
import SearchInput from "./search-input";
import { Suspense } from "react";

// application's navigation bar
export default function Header() {
  return (
    <Navbar className="shadow mb-6">
      {/* Displays the application logo or name, linking back to the home page */}
      <NavbarBrand>
        <Link href="/" className="font-bold">
          Discuss
        </Link>
      </NavbarBrand>
      {/* The center area of the header, displays the search input */}
      <NavbarContent justify="center">
        <NavbarItem>
          <Suspense>
            <SearchInput />
          </Suspense>
        </NavbarItem>
      </NavbarContent>
      {/* The right-side area of the header, displays user authentication options */}
      <NavbarContent justify="end">
        <HenderAuth />
      </NavbarContent>
    </Navbar>
  );
}
