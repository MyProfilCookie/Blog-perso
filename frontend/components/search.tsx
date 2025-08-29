"use client";
import React, { useState } from "react";
import { Input } from '@nextui-org/react'
import { Kbd } from '@nextui-org/react';
import { useRouter } from "next/navigation"; // Utilisé pour la redirection

import { SearchIcon } from "@/components/icons"; // Assurez-vous que l'icône est importée correctement

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const router = useRouter(); // Utilisé pour la navigation
  const [results, setResults] = useState<string[]>([]); // Stocke les résultats de recherche simulés

  // Simulation de résultats de recherche pour cet exemple
  const allContent = [
    "Comment aider un enfant autiste à se concentrer",
    "Créer un environnement calme pour les enfants autistes",
    "Les bienfaits des routines pour les enfants autistes",
    "Accompagnement des enfants et adultes autistes",
    "Ressources pour les familles d'enfants autistes",
  ];

  // Fonction pour filtrer les résultats
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredResults = allContent.filter((content) =>
        content.toLowerCase().includes(query.toLowerCase()),
      );

      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  // Fonction pour mettre en évidence le terme de recherche avec un fond rose pâle
  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} style={{ backgroundColor: "rgba(255, 182, 193, 0.5)" }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  // Fonction pour gérer la redirection lors du clic sur un résultat
  const handleResultClick = (result: string) => {
    // Vous pouvez remplacer cette redirection par une vraie page liée au résultat
    router.push(`/search-results?query=${encodeURIComponent(result)}`);
  };

  return (
    <div>
      {/* Champ de recherche */}
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="flex-shrink-0 text-base pointer-events-none text-default-400" />
        }
        type="search"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)} // Gestion de la recherche
      />

      {/* Résultats de recherche */}
      {results.length > 0 && (
        <div className="p-4 mt-2 bg-cream rounded-lg shadow-md">
          {results.map((result, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <button
              key={index}
              className="p-0 mb-2 text-left text-blue-600 bg-transparent border-none cursor-pointer hover:underline"
              onClick={() => handleResultClick(result)} // Redirection lors du clic
            >
              {highlightSearchTerm(result, searchQuery)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
