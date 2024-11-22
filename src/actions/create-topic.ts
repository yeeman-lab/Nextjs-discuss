"use server";

import type { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";
import { revalidatePath } from "next/cache";

// Schema validation for creating a topic
const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Must be lowercase or dashes without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

// Handles the creation of a new topic
export async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {
  // Validate the form data against the schema
  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
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
        _form: ["You need to sign in to do this."],
      },
    };
  }

  let topic: Topic;
  try {
    // Save the new topic to the database
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
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
          _form: ["Something went wrong."],
        },
      };
    }
  }

  // Revalidate the cache for the home page
  revalidatePath("/");
  // Redirect to the newly created topic's page
  redirect(paths.topicShow(topic.slug));

  // redirect will throw error, code below that will not run
  // return {
  //   errors: {},
  // };
}
