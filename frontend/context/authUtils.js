/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
export const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };
  
  export const getAccessToken = () => localStorage.getItem("accessToken");
  export const getRefreshToken = () => localStorage.getItem("refreshToken");
  
  export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
  
  export const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("Refresh token manquant.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error("Échec du rafraîchissement du token.");
      }
  
      const data = await response.json();
      saveTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token :", error);
      throw error;
    }
  };
  