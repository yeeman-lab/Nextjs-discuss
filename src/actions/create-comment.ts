"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";

// Schema validation for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(3),
});

interface CreateCommentFormState {
  errors: {
    content?: string[];
    _form?: string[];
  };
  success?: boolean;
}

// Handles the creation of a comment for a specific post
// User could reply to another comment (via parentId)
export async function createComment({ postId, parentId }: { postId: string; parentId?: string }, formState: CreateCommentFormState, formData: FormData): Promise<CreateCommentFormState> {
  // Validate the form data against the schema
  const result = createCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!result.success) {
    // Return validation errors if the schema check fails
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    // Return an error if the user is not authenticated
    return {
      errors: {
        _form: ["You must sign in to do this."],
      },
    };
  }

  try {
    // Save the new comment to the database
    await db.comment.create({
      data: {
        content: result.data.content,
        postId: postId,
        parentId: parentId,
        userId: session.user.id,
      },
    });
  } catch (err) {
    // Handle database errors
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
  }

  const topic = await db.topic.findFirst({
    where: { posts: { some: { id: postId } } },
  });

  if (!topic) {
    // Return an error if the related topic cannot be found
    return {
      errors: {
        _form: ["Failed to find topic"],
      },
    };
  }

  // Revalidate the cache to update the UI
  revalidatePath(paths.postShow(topic.slug, postId));
  return {
    errors: {},
    success: true,
  };
}
