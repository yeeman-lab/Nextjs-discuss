import { redirect } from "next/navigation";
import PostList from "@/components/posts/post-list";
import { fetchPostsBySearchTerm } from "@/db/queries/posts";

// This page displays search results based on a search term provided in the query parameters.
interface SearchPageProps {
  searchParams: {
    term: string;
  };
}

export default async function SerachPage({ searchParams }: SearchPageProps) {
  const { term } = searchParams;

  // If no search term is provided, redirect to the home page
  if (!term) {
    redirect("/");
  }

  return (
    <div>
      <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
    </div>
  );
}
