// debug.js
const fs = require("fs");

// Intercepter les appels à fs.readFile, fs.writeFile, etc.
const originalReadFile = fs.readFile;

fs.readFile = function () {
  console.log("fs.readFile appelé avec arguments:", arguments);
  if (arguments[0] === undefined) {
    console.trace("Traceback pour appel avec undefined:");
  }

  return originalReadFile.apply(this, arguments);
};

// Faire de même pour d'autres fonctions fs couramment utilisées
