"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label }: BackButtonProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuChange = (e: CustomEvent) => {
      setIsMenuOpen(e.detail);
    };

    window.addEventListener('menuStateChange' as any, handleMenuChange);

    return () => {
      window.removeEventListener('menuStateChange' as any, handleMenuChange);
    };
  }, []);

  if (isMenuOpen) {
    return null;
  }

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
