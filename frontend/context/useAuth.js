import { createContext, useState, useContext, useEffect } from "react";

// Créez un seul contexte d'authentification/utilisateur
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Charger l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fonction pour se connecter
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};
