import Link from 'next/link'
import { Button } from '@nextui-org/react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            as={Link}
            href="/"
            color="primary"
            size="lg"
            className="w-full"
          >
            Retour à l'accueil
          </Button>
          
          <div className="flex gap-4 justify-center">
            <Button
              as={Link}
              href="/about"
              variant="bordered"
              size="sm"
            >
              À propos
            </Button>
            <Button
              as={Link}
              href="/contact"
              variant="bordered"
              size="sm"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
