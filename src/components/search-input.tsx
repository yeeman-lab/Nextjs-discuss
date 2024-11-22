"use client";

import { Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import * as actions from "@/actions";

// client-side component that renders a search bar for submitting queries.
export default function SearchInput() {
  // useSearchParams is used to access the current URL search parameters
  const searchParams = useSearchParams();

  return (
    // submits search queries to server action
    <form action={actions.search}>
      <Input name="term" defaultValue={searchParams.get("term") || ""} />
    </form>
  );
}
