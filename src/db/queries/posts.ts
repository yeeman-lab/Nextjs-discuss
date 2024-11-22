// import Post type from Prisma Client
// ensures alignment with the schema defined in the Prisma model
import type { Post } from "@prisma/client";
import { db } from "@/db";

// Extending the Post type to include related data: topic slug, user name, and the comment count
export type PostWithData = Post & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

// alternative to define type PostWithData
// export type PostWithData = Awaited<
// ReturnType<typeof fetchPostsByTopicSlug>
// >[number]

// fetch posts belonging to a specific topic
export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: {
      topic: { slug },
    },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}

// fetch the top posts based on the number of comments
export function fetchTopPosts(): Promise<PostWithData[]> {
  return db.post.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
    take: 5,
  });
}

// fetch posts by a search term
// Searches the term in both the title and content of the posts
export function fetchPostsBySearchTerm(term: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: {
      OR: [{ title: { contains: term } }, { content: { contains: term } }],
    },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
  });
}
