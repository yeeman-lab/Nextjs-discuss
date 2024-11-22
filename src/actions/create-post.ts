"use server";

import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";

// Schema validation for creating a post
const createPostSchema = z.object({ title: z.string().min(3), content: z.string().min(10) });

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

// Handles the creation of a new post within a specific topic
export async function createPost(slug: string, formState: CreatePostFormState, formData: FormData): Promise<CreatePostFormState> {
  // Validate the form data against the schema
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
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
        _form: ["You need to sign in to do this"],
      },
    };
  }

  const topic = await db.topic.findFirst({ where: { slug } });

  if (!topic) {
    // Return an error if the related topic cannot be found
    return {
      errors: {
        _form: ["Not Found"],
      },
    };
  }

  let post: Post;
  try {
    // Save the new post to the database
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
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
          _form: ["Failed to create post"],
        },
      };
    }
  }

  // Revalidate the cache for the topic page
  revalidatePath(paths.topicShow(slug));
  // Redirect to the newly created post's page
  redirect(paths.postShow(slug, post.id));
}
