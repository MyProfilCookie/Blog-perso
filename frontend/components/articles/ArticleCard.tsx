"use client";

import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  id: number;
  title: string;
  subtitle: string;
  img: string;
}

export default function ArticleCard({ id, title, subtitle, img }: ArticleCardProps) {
  return (
    <Link href={`/articles/${id}`}>
      <Card 
        className="h-full bg-cream dark:bg-gray-800 border border-transparent dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        isPressable
      >
        <CardBody className="p-0">
          <div className="relative w-full h-48">
            <Image
              alt={title}
              className="object-cover"
              fill
              src={img}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-violet-600 dark:text-violet-400 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
} 