import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import { ThemeSwitch } from "./theme-switch"; // Assurez-vous que ce fichier existe

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-16 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center sm:text-left">
        {/* 🏠 À propos */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            À propos
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left leading-relaxed">
            Découvrez notre plateforme dédiée à l’apprentissage et au partage de
            connaissances.
          </p>
        </div>

        {/* 🔗 Liens rapides */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Liens rapides
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {["Blog", "Courses", "Shop", "Contact"].map((item) => (
              <li key={item}>
                <NextLink
                  className="hover:text-violet-500 transition-colors duration-300"
                  href={`/${item.toLowerCase()}`}
                >
                  {item}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 📞 Contact */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FontAwesomeIcon
                className="text-violet-500"
                icon={faMapMarkerAlt}
              />
              <span>Paris, France</span>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon className="text-violet-500" icon={faPhone} />
              <span>+33 1 23 45 67 89</span>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon className="text-violet-500" icon={faEnvelope} />
              <span>contact@notreplateforme.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 🎨 Theme Switch et Copyright */}
      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        <ThemeSwitch />
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Tous droits réservés | AutiStudy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
