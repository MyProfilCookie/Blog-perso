"use client";

import { Button } from '@nextui-org/react';
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
    <div className="w-full flex justify-start mb-4 px-4">
      <Button
        variant="light"
        onPress={() => router.back()}
        className="bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow"
        startContent={<FontAwesomeIcon icon={faArrowLeft} className="text-xl" />}
        size="md"
      >
        {label || "Retour"}
      </Button>
    </div>
  );
}
