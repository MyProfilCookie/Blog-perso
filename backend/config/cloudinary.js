let cloudinary;

try {
  cloudinary = require('cloudinary').v2;
} catch (error) {
  console.error("❌ Erreur lors du chargement de Cloudinary:", error.message);
  // Créer un mock pour éviter les crashs
  cloudinary = {
    config: () => {},
    uploader: {
      upload: () => Promise.reject(new Error("Cloudinary non disponible")),
      upload_stream: () => ({ end: () => {} }),
      destroy: () => Promise.resolve()
    }
  };
}

// Configuration Cloudinary
// Supporte deux formats:
// 1. Variable unique CLOUDINARY_URL (format: cloudinary://api_key:api_secret@cloud_name)
// 2. Variables séparées: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

let isConfigured = false;

if (process.env.CLOUDINARY_URL) {
  try {
    const url = process.env.CLOUDINARY_URL;
    console.log("☁️ Tentative de configuration via CLOUDINARY_URL...");
    
    // Parser l'URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    // Utiliser URL parsing pour être plus robuste
    const withoutProtocol = url.replace('cloudinary://', '');
    const atIndex = withoutProtocol.lastIndexOf('@');
    
    if (atIndex !== -1) {
      const credentials = withoutProtocol.substring(0, atIndex);
      const cloudName = withoutProtocol.substring(atIndex + 1);
      const colonIndex = credentials.indexOf(':');
      
      if (colonIndex !== -1) {
        const apiKey = credentials.substring(0, colonIndex);
        const apiSecret = credentials.substring(colonIndex + 1);
        
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true
        });
        
        console.log("☁️ Cloudinary configuré via CLOUDINARY_URL - cloud_name:", cloudName);
        isConfigured = true;
      } else {
        console.error("❌ Format CLOUDINARY_URL invalide: pas de ':' trouvé dans les credentials");
      }
    } else {
      console.error("❌ Format CLOUDINARY_URL invalide: pas de '@' trouvé");
    }
  } catch (error) {
    console.error("❌ Erreur parsing CLOUDINARY_URL:", error.message);
  }
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    console.log("☁️ Cloudinary configuré via variables séparées");
    isConfigured = true;
  } catch (error) {
    console.error("❌ Erreur configuration Cloudinary:", error.message);
  }
} else {
  console.warn("⚠️ Cloudinary non configuré - aucune variable d'environnement trouvée");
}

/**
 * Upload une image vers Cloudinary depuis un chemin de fichier
 * @param {string} filePath - Chemin du fichier temporaire
 * @param {object} options - Options d'upload (folder, public_id, etc.)
 * @returns {Promise<object>} - Résultat de l'upload avec secure_url
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  const defaultOptions = {
    folder: 'avatars',
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good', fetch_format: 'auto' }
    ],
    ...options
  };

  return cloudinary.uploader.upload(filePath, defaultOptions);
};

/**
 * Upload une image vers Cloudinary depuis un buffer (pour memoryStorage)
 * @param {Buffer} buffer - Le buffer de l'image
 * @param {object} options - Options d'upload (folder, public_id, etc.)
 * @returns {Promise<object>} - Résultat de l'upload avec secure_url
 */
const uploadBufferToCloudinary = async (buffer, options = {}) => {
  const defaultOptions = {
    folder: 'avatars',
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good', fetch_format: 'auto' }
    ],
    ...options
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    // Écrire le buffer dans le stream
    uploadStream.end(buffer);
  });
};

/**
 * Supprime une image de Cloudinary
 * @param {string} publicId - L'identifiant public de l'image
 * @returns {Promise<object>} - Résultat de la suppression
 */
const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Extrait le public_id d'une URL Cloudinary
 * @param {string} url - URL Cloudinary complète
 * @returns {string|null} - Le public_id ou null
 */
const extractPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }
  
  try {
    // Format typique: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.ext
    const matches = url.match(/\/v\d+\/(.+)\.[a-z]+$/i);
    if (matches && matches[1]) {
      return matches[1]; // retourne folder/filename
    }
    return null;
  } catch (error) {
    console.error('Erreur extraction public_id:', error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl
};
