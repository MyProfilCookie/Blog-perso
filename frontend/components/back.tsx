"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => router.back()}
      className="absolute top-4 left-4 z-50"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
    </Button>
  );
}
