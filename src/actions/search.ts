"use server";

import { redirect } from "next/navigation";

export async function search(formData: FormData) {
  // Extract the 'term' value from the provided form data
  const term = formData.get("term");

  // If the term is missing or not a valid string, redirect the user to the home page
  if (typeof term !== "string" || !term) {
    redirect("/");
  }

  // Redirect the user to the search results page with the query parameter
  redirect(`/search?term=${term}`);
}
