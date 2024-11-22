// Importing the Comment type from Prisma Client
// ensures our data structures match the schema defined in the Prisma model
import type { Comment } from "@prisma/client";
import { db } from "@/db";
import { cache } from "react";

// Extending the Comment type to include user information (name and image)
export type CommentWithAuthor = Comment & {
  user: { name: string | null; image: string | null };
};

// fetch all comments for a specific post, optimized with memoization using `cache`.
export const fetchCommentsByPostId = cache((postId: string): Promise<CommentWithAuthor[]> => {
  return db.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
});
