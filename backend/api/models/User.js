const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// ADMIN_EMAIL est l'email de l'administrateur
const ADMIN_EMAIL = "virginie.ayivor@yahoo.fr";

// Regex pour valider le pseudo sans caractères spéciaux
const pseudoRegex = /^[a-zA-Z0-9]{8,}$/; // Seulement lettres et chiffres, minimum 8 caractères

// Regex pour valider un email
const emailRegex = /^\S+@\S+\.\S+$/; // Validation de base d'un email

// Regex pour valider le mot de passe
const passwordRegex = /.{8,}/; // Minimum 8 caractères (peut être modifié pour d'autres contraintes)

const userSchema = new Schema(
  {
    pseudo: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
      maxlength: 100,
      unique: true, // Pseudo doit être unique
      validate: {
        validator: function(v) {
          return pseudoRegex.test(v); // Valide que le pseudo n'a pas de caractères spéciaux et fait 8 caractères
        },
        message: "Le pseudo doit comporter au moins 8 caractères et ne contenir que des lettres et des chiffres."
      }
    },
    nom: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    prenom: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 200,
      unique: true, // Email doit être unique
      validate: {
        validator: function(v) {
          return emailRegex.test(v); // Valide que l'email est bien formé
        },
        message: "Email invalide."
      }
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
      maxlength: 200,
      validate: {
        validator: function(v) {
          return passwordRegex.test(v); // Valide que le mot de passe a au moins 8 caractères
        },
        message: "Le mot de passe doit comporter au moins 8 caractères."
      }
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isAdmin: { type: Boolean, default: false },
    image: {
      type: String,
      default: '/uploads/default_profile.jpg', // Image par défaut si non fournie
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    // Ajout du champ optionnel 'age de l'enfant ou l'adulte autiste'
    ageEnfantOuAdulteAutiste: {
      type: Number,
      min: 1,
      required: false, // Ce champ est optionnel
    },
  },
  { timestamps: true }
);

/// Crypte le mot de passe de l'utilisateur avant de l'enregistrer dans la base de données
// userSchema.pre("save", async function (next) {
//   const user = this;

//   // Assigne le rôle 'admin' à l'utilisateur si l'email correspond à l'administrateur
//   if (user.email === ADMIN_EMAIL) {
//     user.role = "admin";
//     user.isAdmin = true;
//   }

//   // Crypter le mot de passe s'il a été modifié
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 10);
//   }

//   next();
// });

/// Vérifie le rôle lors de la mise à jour
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Assigne le rôle 'admin' si l'email correspond à l'administrateur
  if (update.email === ADMIN_EMAIL || (update.$set && update.$set.email === ADMIN_EMAIL)) {
    if (update.$set) {
      update.$set.role = "admin";
      update.$set.isAdmin = true;
    } else {
      update.role = "admin";
      update.isAdmin = true;
    }
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
