export default function HomePage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          AutiStudy
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plateforme éducative pour enfants autistes
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-green-600 font-semibold">
            ✅ Le site fonctionne !
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Déploiement Vercel réussi
          </p>
        </div>
      </div>
    </div>
  );
}