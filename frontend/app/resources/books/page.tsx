"use client";
import React from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Divider } from '@nextui-org/react'
import { Avatar } from '@nextui-org/react'
import { Button } from '@nextui-org/react';

import BackButton from "@/components/back";

// Define the type for a book
interface Book {
  title: string;
  author: string;
  amazonLink: string;
  fnacLink: string;
  culturaLink: string;
  avatar: string; // Add avatar property for each book
}

const BooksComponent: React.FC = () => {
  // Define an array of books
  const books: Book[] = [
    {
      title: "L'Autisme expliqué aux non-autistes",
      author: "Brigitte Harrisson et Lise St-Charles",
      amazonLink:
        "https://www.amazon.fr/s?k=L%27Autisme+expliqu%C3%A9+aux+non-autistes",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27Autisme+expliqu%C3%A9+aux+non-autistes",
      culturaLink:
        "https://www.cultura.com/recherche?q=L%27Autisme+expliqu%C3%A9+aux+non-autistes",
      avatar: "/path/to/avatar1.png", // Replace with the correct image path
    },
    {
      title: "Un autre regard : Ma vie d’autiste",
      author: "Josef Schovanec",
      amazonLink:
        "https://www.amazon.fr/s?k=Un+autre+regard+Ma+vie+d%27autiste",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=Un+autre+regard+Ma+vie+d%27autiste",
      culturaLink:
        "https://www.cultura.com/recherche?q=Un+autre+regard+Ma+vie+d%27autiste",
      avatar: "/path/to/avatar2.png", // Replace with the correct image path
    },
    {
      title: "La Différence invisible",
      author: "Julie Dachez et Mademoiselle Caroline",
      amazonLink: "https://www.amazon.fr/s?k=La+Diff%C3%A9rence+invisible",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=La+Diff%C3%A9rence+invisible",
      culturaLink:
        "https://www.cultura.com/recherche?q=La+Diff%C3%A9rence+invisible",
      avatar: "/path/to/avatar3.png", // Replace with the correct image path
    },
    {
      title: "L’autisme raconté aux enfants",
      author: "Pascale Boulay",
      amazonLink:
        "https://www.amazon.fr/s?k=L%27autisme+racont%C3%A9+aux+enfants",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27autisme+racont%C3%A9+aux+enfants",
      culturaLink:
        "https://www.cultura.com/recherche?q=L%27autisme+racont%C3%A9+aux+enfants",
      avatar: "/path/to/avatar4.png", // Replace with the correct image path
    },
    {
      title: "Comprendre l'autisme pour les nuls",
      author: "Stephen Shore",
      amazonLink:
        "https://www.amazon.fr/s?k=Comprendre+l%27autisme+pour+les+nuls",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=Comprendre+l%27autisme+pour+les+nuls",
      culturaLink:
        "https://www.cultura.com/recherche?q=Comprendre+l%27autisme+pour+les+nuls",
      avatar: "/path/to/avatar5.png", // Replace with the correct image path
    },
    {
      title: "L'Enfant autiste et sa famille",
      author: "Bernard Golse",
      amazonLink: "https://www.amazon.fr/s?k=L%27Enfant+autiste+et+sa+famille",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27Enfant+autiste+et+sa+famille",
      culturaLink:
        "https://www.cultura.com/recherche?q=L%27Enfant+autiste+et+sa+famille",
      avatar: "/path/to/avatar6.png", // Replace with the correct image path
    },
    {
      title: "L'Autisme, de la compréhension à l'intervention",
      author: "Isabelle Hénault",
      amazonLink:
        "https://www.amazon.fr/s?k=L%27Autisme+de+la+compr%C3%A9hension+%C3%A0+l%27intervention",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27Autisme+de+la+compr%C3%A9hension+%C3%A0+l%27intervention",
      culturaLink:
        "https://www.cultura.com/recherche?q=L%27Autisme+de+la+compr%C3%A9hension+%C3%A0+l%27intervention",
      avatar: "/path/to/avatar7.png", // Replace with the correct image path
    },
    {
      title: "Les clés de l'autisme",
      author: "Caroline Sole",
      amazonLink: "https://www.amazon.fr/s?k=Les+cl%C3%A9s+de+l%27autisme",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=Les+cl%C3%A9s+de+l%27autisme",
      culturaLink:
        "https://www.cultura.com/recherche?q=Les+cl%C3%A9s+de+l%27autisme",
      avatar: "/path/to/avatar8.png", // Replace with the correct image path
    },
    {
      title: "Comprendre l'autisme",
      author: "Sophie Le Callenec",
      amazonLink: "https://www.amazon.fr/s?k=Comprendre+l%27autisme",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=Comprendre+l%27autisme",
      culturaLink: "https://www.cultura.com/recherche?q=Comprendre+l%27autisme",
      avatar: "/path/to/avatar9.png", // Replace with the correct image path
    },
    {
      title: "L'Autisme au quotidien",
      author: "Élise Gravel",
      amazonLink: "https://www.amazon.fr/s?k=L%27Autisme+au+quotidien",
      fnacLink:
        "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27Autisme+au+quotidien",
      culturaLink:
        "https://www.cultura.com/recherche?q=L%27Autisme+au+quotidien",
      avatar: "/path/to/avatar10.png", // Replace with the correct image path
    },
  ];

  return (
    <div className="p-4">
      <h2
        className="mb-8 text-5xl font-extrabold text-center"
        style={{
          color: "#6A1B9A", // A rich violet color
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Adds a subtle shadow effect
        }}
      >
        Livres Recommandés sur l&apos;Autisme
      </h2>
      <BackButton label="Retour" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <Card key={index} className="shadow-md">
            <CardBody>
              <div className="flex items-center mb-4">
                <Avatar alt="Book Avatar" className="mr-4" src={book.avatar} />
                <div>
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-500">par {book.author}</p>
                </div>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-around mt-2">
                <Button
                  as="a"
                  className="text-white"
                  href={book.amazonLink}
                  style={{ backgroundColor: "#FF9900", color: "#FFFFFF" }} // Amazon color
                  target="_blank"
                >
                  Amazon
                </Button>
                <Button
                  as="a"
                  className="text-white"
                  href={book.fnacLink}
                  style={{ backgroundColor: "#E2231A", color: "#FFFFFF" }} // Fnac color
                  target="_blank"
                >
                  Fnac
                </Button>
                <Button
                  as="a"
                  className="text-white"
                  href={book.culturaLink}
                  style={{ backgroundColor: "#1A237E", color: "#FFFFFF" }} // Cultura color
                  target="_blank"
                >
                  Cultura
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BooksComponent;
