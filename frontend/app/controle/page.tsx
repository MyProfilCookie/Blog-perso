"use client";
import { Card, CardBody, Input, Chip, Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGraduationCap, 
  faBookOpen, 
  faFlask, 
  faCalculator, 
  faLanguage, 
  faPalette, 
  faLandmark, 
  faGlobe, 
  faTrophy, 
  faClipboardList, 
  faMicrochip,
  faSearch,
  faFilter,
  faChartBar,
  faStar,
  faClock,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

import { title } from "@/components/primitives";
import BackButton from "@/components/back";

const courseThemes = [
  {
    id: 1,
    title: "Leçons du jour",
    description: "Apprends les leçons du jour.",
    image: "/assets/lessons.jpg",
    route: "/controle/lessons",
    bgColor: "bg-blue-200 dark:bg-blue-900/30",
    icon: faBookOpen,
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Sciences",
    description: "Explore le monde des sciences.",
    image: "/assets/sciences.jpg",
    route: "/controle/sciences",
    bgColor: "bg-green-200 dark:bg-green-900/30",
    icon: faFlask,
    iconColor: "text-green-500 dark:text-green-400",
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Apprends les bases des mathématiques.",
    image: "/assets/math.jpg",
    route: "/controle/math",
    bgColor: "bg-yellow-200 dark:bg-yellow-900/30",
    icon: faCalculator,
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
  {
    id: 4,
    title: "Français",
    description: "Améliore ton français avec des exercices adaptés.",
    image: "/assets/french.jpg",
    route: "/controle/french",
    bgColor: "bg-red-200 dark:bg-red-900/30",
    icon: faLanguage,
    iconColor: "text-red-500 dark:text-red-400",
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Découvre l'art et exprime ta créativité.",
    image: "/assets/art.jpg",
    route: "/controle/art",
    bgColor: "bg-purple-200 dark:bg-purple-900/30",
    icon: faPalette,
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    id: 6,
    title: "Langues",
    description: "Apprends les langues.",
    image: "/assets/language.jpg",
    route: "/controle/language",
    bgColor: "bg-pink-200 dark:bg-pink-900/30",
    icon: faLanguage,
    iconColor: "text-pink-500 dark:text-pink-400",
  },
  {
    id: 7,
    title: "Histoire",
    description: "Apprends l'histoire.",
    image: "/assets/history.jpg",
    route: "/controle/history",
    bgColor: "bg-indigo-200 dark:bg-indigo-900/30",
    icon: faLandmark,
    iconColor: "text-indigo-500 dark:text-indigo-400",
  },
  {
    id: 8,
    title: "Geographie",
    description: "Apprends la geographie.",
    image: "/assets/geography.jpg",
    route: "/controle/geography",
    bgColor: "bg-teal-200 dark:bg-teal-900/30",
    icon: faGlobe,
    iconColor: "text-teal-500 dark:text-teal-400",
  },
  {
    id: 9,
    title: "Trimestres",
    description: "Résultat de l'examen de fin d'étude.",
    image: "/assets/trimestres.webp",
    route: "/controle/trimestres",
    bgColor: "bg-orange-200 dark:bg-orange-900/30",
    icon: faTrophy,
    iconColor: "text-orange-500 dark:text-orange-400",
  },
  {
    id: 10,
    title: "Rapport Hebdo",
    description: "Rapport hebdomadaire.",
    image: "/assets/rapport_hebdo.webp",
    route: "/controle/rapportHebdo",
    bgColor: "bg-gray-200 dark:bg-gray-900/30",
    icon: faClipboardList,
    iconColor: "text-gray-500 dark:text-gray-400",
  },
  {
    id: 11,
    title: "Technologie",
    description: "Apprends la technologie.",
    image: "/assets/technology.jpg",
    route: "/controle/technology",
    bgColor: "bg-cyan-200 dark:bg-cyan-900/30",
    icon: faMicrochip,
    iconColor: "text-cyan-500 dark:text-cyan-400",
  },
];

const stats = [
  {
    icon: faStar,
    label: "Moyenne Générale",
    value: "15.5/20",
    color: "text-yellow-500 dark:text-yellow-400",
  },
  {
    icon: faClock,
    label: "Temps d'étude",
    value: "2h/jour",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: faUsers,
    label: "Élèves actifs",
    value: "24",
    color: "text-green-500 dark:text-green-400",
  },
  {
    icon: faChartBar,
    label: "Progression",
    value: "+12%",
    color: "text-purple-500 dark:text-purple-400",
  },
];

const BlogPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const filteredThemes = courseThemes.filter(theme => {
    const matchesSearch = theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || theme.bgColor.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-4">
      <BackButton />
      
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon 
            icon={faGraduationCap} 
            className="text-4xl text-primary-500 dark:text-primary-400" 
          />
          <h1 className={`${title()} text-center`}>Les contrôles</h1>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center"
            >
              <FontAwesomeIcon 
                icon={stat.icon} 
                className={`text-2xl mb-2 ${stat.color}`}
              />
              <h3 className="text-lg font-semibold">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
          <Input
            placeholder="Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
            className="w-full"
          />
          <Button
            color="primary"
            variant="flat"
            startContent={<FontAwesomeIcon icon={faFilter} />}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filtres
          </Button>
        </div>

        {/* Filter Chips */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 justify-center w-full max-w-4xl"
            >
              <Chip
                variant={selectedCategory === null ? "solid" : "bordered"}
                color="primary"
                onClick={() => setSelectedCategory(null)}
                className="cursor-pointer"
              >
                Tous
              </Chip>
              {["blue", "green", "yellow", "red", "purple", "pink", "indigo", "teal", "orange", "gray", "cyan"].map((color) => (
                <Chip
                  key={color}
                  variant={selectedCategory === color ? "solid" : "bordered"}
                  color={color as any}
                  onClick={() => setSelectedCategory(color)}
                  className="cursor-pointer"
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Chip>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {filteredThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleCardClick(theme.route)}
            >
              <Card
                className={`w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${theme.bgColor} backdrop-blur-sm`}
                isPressable
              >
                <CardBody className="flex flex-col items-center p-0 overflow-hidden">
                  <div className="relative w-full h-[200px]">
                    <Image
                      alt={theme.title}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      fill
                      src={theme.image}
                      onPointerDown={(e) => e.preventDefault()}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <FontAwesomeIcon 
                        icon={theme.icon} 
                        className={`text-2xl mb-2 ${theme.iconColor}`}
                      />
                      <h4 className="font-bold text-xl text-white">{theme.title}</h4>
                      <small className="text-white/80">
                        {theme.description}
                      </small>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Message */}
      {filteredThemes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <FontAwesomeIcon 
            icon={faSearch} 
            className="text-4xl text-gray-400 mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Essayez de modifier vos critères de recherche
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BlogPage;
