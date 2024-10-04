import React, { useState, useEffect } from "react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fonction pour détecter le défilement et afficher ou masquer le bouton
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <button
      className={`fixed bottom-4 right-4 p-2 rounded-full bg-blue-500 text-white shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ display: isVisible ? "block" : "none" }}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
