/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Suspense } from "react";
import { Card, CardBody, CardHeader } from "@/components/OptimizedNextUI";
import OptimizedImage from "@/components/OptimizedImage";
import { LazyWrapper } from "@/components/LazyComponents";
import Link from "next/link";

// Données des articles optimisées
const articles = [
  {
    id: 1,
    title: "Stratégies d'apprentissage pour enfants autistes",
    description: "Découvrez des méthodes adaptées pour faciliter l'apprentissage...",
    img: "/assets/images/autism-awareness.webp",
    link: "/articles/strategies-apprentissage"
  },
  {
    id: 2,
    title: "Ressources éducatives spécialisées",
    description: "Une collection d'outils et de matériels éducatifs...",
    img: "/assets/images/aba_therapy.webp",
    link: "/articles/ressources-educatives"
  },
  {
    id: 3,
    title: "Accompagnement parental",
    description: "Conseils et soutien pour les parents d'enfants autistes...",
    img: "/assets/images/family/family.webp",
    link: "/articles/accompagnement-parental"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AutiStudy
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plateforme éducative spécialisée pour les enfants autistes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/users/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Commencer
            </Link>
            <Link href="/about" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Articles récents</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <OptimizedImage
                    src={article.img}
                    alt={article.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                    priority={article.id === 1}
                  />
                </CardHeader>
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <Link href={article.link} className="text-blue-600 hover:underline">
                    Lire la suite →
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy Components */}
      <LazyWrapper>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Ressources éducatives</h3>
                <p className="text-gray-600">Matériels adaptés et spécialisés</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Accompagnement</h3>
                <p className="text-gray-600">Soutien personnalisé</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Support parental</h3>
                <p className="text-gray-600">Conseils et ressources</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Progression</h3>
                <p className="text-gray-600">Suivi des progrès</p>
              </div>
            </div>
          </div>
        </section>
      </LazyWrapper>
    </div>
  );
}