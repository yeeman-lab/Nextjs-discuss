"use client";

import { NavbarItem, Button, Avatar, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import * as actions from "@/actions";

// handles authentication display in the header
export default function HenderAuth() {
  // Get the current session state (loading, authenticated, or unauthenticated)
  const session = useSession();

  let authContent: React.ReactNode;

  // Case 1: Session is loading, show nothing (null)
  if (session.status === "loading") {
    authContent = null;

    // Case 2: User is authenticated, renders Popover with signout button
  } else if (session.data?.user) {
    authContent = (
      <Popover placement="left">
        <PopoverTrigger>
          <Avatar src={session.data.user.image || ""} />
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <form action={actions.signOut}>
              <Button type="submit">Sign Out</Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    );

    // Case 3: User is unauthenticated, renders sign in / up buttons
  } else {
    authContent = (
      <>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="secondary" variant="bordered">
              Sign In
            </Button>
          </form>
        </NavbarItem>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="primary" variant="flat">
              Sign Up
            </Button>
          </form>
        </NavbarItem>
      </>
    );
  }

  return authContent;
}
