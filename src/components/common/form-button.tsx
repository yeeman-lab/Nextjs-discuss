"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";
import React from "react";

interface FormButtonProps {
  children: React.ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    // - isLoading={pending}: Shows a loading indicator when the form is being submitted
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}
