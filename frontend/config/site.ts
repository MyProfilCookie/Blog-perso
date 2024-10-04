export type SiteConfig = typeof siteConfig;
// Replace with the actual default value or fetch it dynamically
export const generateArticleIdByIp = (ip: string | string[]): string => {
  const ipStr = Array.isArray(ip) ? ip[0] : ip;

  return ipStr ? ipStr.replace(/\./g, "").substring(0, 6) : "1"; // Adapter ici selon votre logique d'ID
};

export const siteConfig = {
  name: "AutiStudy - Apprentissage adapté pour personnes autistes",
  description:
    "Plateforme d'apprentissage et d'aide aux devoirs adaptée pour les personnes autistes.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Articles",
      href: "/articles",
    },
    {
      label: "A propos de nous",
      href: "/about",
    },
    // {
    //   label: "Maeva",
    //   href: "/maeva",
    // },
  ],
  navMenuItems: [
    {
      label: "Mathématiques",
      href: "/controle/math",
    },
    {
      label: "Arts Plastiques",
      href: "/controle/art",
    },
    {
      label: "Français",
      href: "/controle/french",
    },
    {
      label: "Sciences",
      href: "/controle/sciences",
    },
    {
      label: "Leçon du jour",
      href: "/controle/lessons",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],

  author: "Virginie A.",
  links: {
    github: "https://github.com/MyProfilCookie",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://www.patreon.com/user?u=140173995",
    linkedin: "https://www.linkedin.com/in/virginie-a-7313792b5",
  },
};
