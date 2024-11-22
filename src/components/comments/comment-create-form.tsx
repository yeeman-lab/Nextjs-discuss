"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
import FormButton from "@/components/common/form-button";
import * as actions from "@/actions";

interface CommentCreateFormProps {
  postId: string;
  parentId?: string;
  startOpen?: boolean;
}

// allows users to create comments or replies to posts or other comments.
export default function CommentCreateForm({ postId, parentId, startOpen }: CommentCreateFormProps) {
  // State to control whether the form is open or closed
  const [open, setOpen] = useState(startOpen);
  // Reference to the form element to reset it after successful submission
  const ref = useRef<HTMLFormElement | null>(null);

  const [formState, action] = useFormState(
    // Passes the necessary params to the createComment action
    actions.createComment.bind(null, { postId, parentId }),
    { errors: {} }
  );

  // useEffect hook to handle side effects when form submission is successful
  useEffect(() => {
    if (formState.success) {
      // Reset the form fields after a successful submission
      ref.current?.reset();

      // no startOpen props passed to the CommentCreateForm under nested replies
      if (!startOpen) {
        setOpen(false);
      }
    }
  }, [formState, startOpen]);

  const form = (
    <form action={action} ref={ref}>
      <div className="space-y-2 px-1">
        <Textarea name="content" label="Reply" placeholder="Enter your comment" isInvalid={!!formState.errors.content} errorMessage={formState.errors.content?.join(", ")} />

        {/* Displays general form-level errors, if any */}
        {formState.errors._form ? <div className="p-2 bg-red-200 border rounded border-red-400">{formState.errors._form?.join(", ")}</div> : null}

        <FormButton>Create Comment</FormButton>
      </div>
    </form>
  );

  return (
    <div>
      <Button size="sm" variant="light" onClick={() => setOpen(!open)}>
        Reply
      </Button>
      {open && form}
    </div>
  );
}
