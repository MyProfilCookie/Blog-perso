import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Créez un contexte d'authentification
const AuthContext = createContext(null);

// Exporter le contexte pour l'utiliser dans d'autres composants
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Configurer les intercepteurs Axios pour ajouter automatiquement le token et gérer les erreurs 401
  useEffect(() => {
    // Intercepteur de requête pour ajouter le token
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("userToken") || localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Intercepteur de réponse pour gérer les erreurs 401 et tenter le refresh
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si l'erreur est 401 et qu'on n'a pas déjà tenté de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Tenter de rafraîchir le token
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              console.log("🔄 Tentative de rafraîchissement du token...");

              const apiUrl = (
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
              ).replace(/\/$/, "");

              const refreshResponse = await axios.post(`${apiUrl}/auth/refresh-token`, {
                refreshToken: refreshToken
              });

              if (refreshResponse.data?.accessToken) {
                // Sauvegarder les nouveaux tokens
                localStorage.setItem("userToken", refreshResponse.data.accessToken);
                localStorage.setItem("accessToken", refreshResponse.data.accessToken);

                if (refreshResponse.data.refreshToken) {
                  localStorage.setItem("refreshToken", refreshResponse.data.refreshToken);
                }

                // Mettre à jour l'en-tête de la requête originale
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

                console.log("✅ Token rafraîchi avec succès");

                // Relancer la requête originale
                return axios(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error("❌ Échec du rafraîchissement du token:", refreshError);

            // Si le refresh échoue, déconnecter l'utilisateur
            logout();
            return Promise.reject(refreshError);
          }
        }

        // Si ce n'est pas une erreur 401 ou si le refresh a échoué, rejeter l'erreur
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Charger l'utilisateur et vérifier le token au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("userToken");

      if (storedUser && token) {
        try {
          // Vérifier si le token est valide en faisant une requête au backend
          const apiUrl = (
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
          ).replace(/\/$/, "");
          const response = await axios.get(`${apiUrl}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data && response.data.user) {
            setUser(response.data.user);
            // Mettre à jour les données utilisateur stockées
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            // Si la réponse ne contient pas d'utilisateur, nettoyer le stockage
            logout();
          }
        } catch (error) {
          console.error("Erreur de vérification du token:", error);
          // Si le token est invalide ou expiré, déconnecter l'utilisateur
          logout();
        }
      }

      setLoading(false);
      setInitialized(true);
    };

    initializeAuth();
  }, []);

  // Fonction pour se connecter
  const login = async (email, password) => {
    setLoading(true);
    try {
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");
      const response = await axios.post(`${apiUrl}/users/login`, {
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        // Stocker le token
        localStorage.setItem("userToken", response.data.accessToken);

        // Stocker les informations utilisateur
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        Swal.fire({
          title: "Connexion réussie",
          text: "Vous êtes maintenant connecté",
          icon: "success",
          confirmButtonText: "OK",
        });

        return true;
      } else {
        Swal.fire({
          title: "Erreur",
          text: "Échec de connexion: informations manquantes",
          icon: "error",
          confirmButtonText: "OK",
        });

        return false;
      }
    } catch (error) {
      let errorMessage = "Une erreur est survenue lors de la connexion.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Cet email n'existe pas.";
        } else if (error.response.status === 401) {
          errorMessage = "Mot de passe incorrect.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      Swal.fire({
        title: "Erreur de connexion",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour s'inscrire
  const signup = async (userData) => {
    setLoading(true);
    try {
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");
      const response = await axios.post(`${apiUrl}/users/signup`, userData);

      if (response.data && response.data.accessToken) {
        // Stocker le token
        localStorage.setItem("userToken", response.data.accessToken);

        // Stocker les informations utilisateur
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        Swal.fire({
          title: "Inscription réussie",
          text: "Votre compte a été créé avec succès",
          icon: "success",
          confirmButtonText: "OK",
        });

        return true;
      } else {
        Swal.fire({
          title: "Erreur",
          text: "Échec de l'inscription: informations manquantes",
          icon: "error",
          confirmButtonText: "OK",
        });

        return false;
      }
    } catch (error) {
      let errorMessage = "Une erreur est survenue lors de l'inscription.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: "Erreur d'inscription",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setUser(null);
    // Nettoyer tous les tokens et données utilisateur
    localStorage.removeItem("userToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userRole");

    console.log("🚪 Déconnexion effectuée - Redirection vers login");

    // Rediriger vers la page de connexion
    router.push("/users/login");
  };

  // Fonction pour vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("userToken");
  };

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user && (user.isAdmin || user.role === "admin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        initialized,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

// Composant pour protéger les routes
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && !isAuthenticated()) {
      Swal.fire({
        title: "Accès restreint",
        text: "Vous devez être connecté pour accéder à cette page",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/users/login");
      });
    }
  }, [initialized, loading, isAuthenticated, router]);

  if (loading || !initialized) {
    return <div>Chargement...</div>;
  }

  return isAuthenticated() ? children : null;
};

// Composant pour protéger les routes admin
export const AdminRoute = ({ children }) => {
  const { isAdmin, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && !isAdmin()) {
      Swal.fire({
        title: "Accès restreint",
        text: "Vous devez être administrateur pour accéder à cette page",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    }
  }, [initialized, loading, isAdmin, router]);

  if (loading || !initialized) {
    return <div>Chargement...</div>;
  }

  return isAdmin() ? children : null;
};
