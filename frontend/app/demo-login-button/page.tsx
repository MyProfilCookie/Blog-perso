"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import LoginButton, { LoginButtonExamples } from "@/components/LoginButton";
import BackButton from "@/components/back";

export default function DemoLoginButtonPage() {
  const codeExample = `<LoginButton 
  variant="outline"
  size="lg"
  fullWidth
  showIcon={false}
  onClick={() => console.log("Connexion personnalisée")}
/>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <BackButton />
          <div className="text-center mt-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Démonstration du Bouton de Connexion
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez les différentes variantes et options du composant LoginButton
            </p>
          </div>
        </motion.div>

        {/* Démonstration principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-full">
                <h2 className="text-2xl font-semibold text-center mb-2">
                  Bouton de Connexion Interactif
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Un composant moderne et réutilisable pour l&apos;authentification
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="pt-6">
              <LoginButtonExamples />
            </CardBody>
          </Card>
        </motion.div>

        {/* Section d'utilisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold">Comment utiliser le composant</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Import du composant :</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <code className="text-sm">
                      import LoginButton from &quot;@/components/LoginButton&quot;;
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Utilisation basique :</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <code className="text-sm">
                      &lt;LoginButton /&gt;
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Avec des props personnalisées :</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Props disponibles :</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Prop</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Défaut</th>
                          <th className="text-left p-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-mono">variant</td>
                          <td className="p-2">&quot;default&quot; | &quot;outline&quot; | &quot;ghost&quot; | &quot;icon&quot;</td>
                          <td className="p-2">&quot;default&quot;</td>
                          <td className="p-2">Style du bouton</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">size</td>
                          <td className="p-2">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                          <td className="p-2">&quot;md&quot;</td>
                          <td className="p-2">Taille du bouton</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">showIcon</td>
                          <td className="p-2">boolean</td>
                          <td className="p-2">true</td>
                          <td className="p-2">Afficher l&apos;icône</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">fullWidth</td>
                          <td className="p-2">boolean</td>
                          <td className="p-2">false</td>
                          <td className="p-2">Bouton pleine largeur</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">loading</td>
                          <td className="p-2">boolean</td>
                          <td className="p-2">false</td>
                          <td className="p-2">État de chargement</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">disabled</td>
                          <td className="p-2">boolean</td>
                          <td className="p-2">false</td>
                          <td className="p-2">Bouton désactivé</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono">onClick</td>
                          <td className="p-2">() =&gt; void</td>
                          <td className="p-2">-</td>
                          <td className="p-2">Fonction personnalisée</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Section des fonctionnalités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold">Fonctionnalités</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">✅ Inclus</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Animations fluides avec Framer Motion</li>
                    <li>• Intégration NextUI pour un design cohérent</li>
                    <li>• Support du mode sombre</li>
                    <li>• Icônes FontAwesome</li>
                    <li>• Navigation automatique vers /users/login</li>
                    <li>• États de chargement et désactivé</li>
                    <li>• Responsive design</li>
                    <li>• TypeScript pour la sécurité des types</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-600">🎨 Styles</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Variant par défaut (bouton plein)</li>
                    <li>• Variant outline (bordure)</li>
                    <li>• Variant ghost (transparent)</li>
                    <li>• Variant icon (icône seule)</li>
                    <li>• 3 tailles disponibles</li>
                    <li>• Effets hover et focus</li>
                    <li>• Ombres et transitions</li>
                    <li>• Classes CSS personnalisables</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}