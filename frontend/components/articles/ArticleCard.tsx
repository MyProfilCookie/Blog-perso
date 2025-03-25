"use client";

import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  id: string;
  title: string;
  subtitle: string;
  img: string;
}

export default function ArticleCard({ id, title, subtitle, img }: ArticleCardProps) {
  return (
    <Link href={`/articles/${id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
} 