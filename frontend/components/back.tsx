"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="light"
      onPress={() => router.back()}
      className="absolute top-4 left-4 z-50"
      startContent={<FontAwesomeIcon icon={faArrowLeft} className="text-xl" />}
    >
      {label}
    </Button>
  );
}
