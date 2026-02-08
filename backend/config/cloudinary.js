const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary
// Supporte deux formats:
// 1. Variable unique CLOUDINARY_URL (format: cloudinary://api_key:api_secret@cloud_name)
// 2. Variables séparées: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

if (process.env.CLOUDINARY_URL) {
  // Le SDK Cloudinary parse automatiquement CLOUDINARY_URL
  console.log("☁️ Cloudinary configuré via CLOUDINARY_URL");
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log("☁️ Cloudinary configuré via variables séparées");
}

/**
 * Upload une image vers Cloudinary
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
  deleteFromCloudinary,
  extractPublicIdFromUrl
};
