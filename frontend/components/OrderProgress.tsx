import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const OrderProgress = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();

  const isRegistered = true;
  const isProcessed = [
    "processing",
    "processed",
    "en cours",
    "shipped",
    "expédié",
    "delivered",
    "livrée",
  ].includes(normalizedStatus);
  const isShipped = ["shipped", "expédié", "delivered", "livrée"].includes(
    normalizedStatus,
  );
  const isDelivered = ["delivered", "livrée"].includes(normalizedStatus);
  const isCancelled = ["cancelled", "annulée", "canceled"].includes(
    normalizedStatus,
  );

  if (isCancelled) {
    return (
      <div className="mt-4 w-full">
        <div className="flex justify-between mb-2">
          {["Enregistrement", "Préparation", "Expédition", "Livraison"].map(
            (step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-red-100 dark:bg-red-900/30">
                  <FontAwesomeIcon
                    className="text-red-500 dark:text-red-400"
                    icon={faTimes}
                  />
                </div>
                <span className="text-sm text-center text-red-500 dark:text-red-400">
                  {step}
                </span>
              </div>
            ),
          )}
        </div>
        <div className="h-3 flex w-full rounded-full overflow-hidden">
          <div className="bg-red-500 dark:bg-red-600 h-full w-full opacity-50" />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-base font-medium text-red-600 dark:text-red-400">
            Commande annulée
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-between mb-2">
        {/* Étape 1 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isRegistered
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <span
            className={`text-sm text-center ${
              isRegistered
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Enregistrement
          </span>
        </div>

        {/* Étape 2 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isProcessed
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            {isProcessed ? <FontAwesomeIcon icon={faCheck} /> : <span>2</span>}
          </div>
          <span
            className={`text-sm text-center ${
              isProcessed
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Préparation
          </span>
        </div>

        {/* Étape 3 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isShipped
                ? "bg-pink-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            {isShipped ? <FontAwesomeIcon icon={faCheck} /> : <span>3</span>}
          </div>
          <span
            className={`text-sm text-center ${
              isShipped
                ? "text-pink-500 dark:text-pink-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Expédition
          </span>
        </div>

        {/* Étape 4 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isDelivered
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            {isDelivered ? <FontAwesomeIcon icon={faCheck} /> : <span>4</span>}
          </div>
          <span
            className={`text-sm text-center ${
              isDelivered
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Livraison
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-3 flex w-full rounded-full overflow-hidden">
        <div className="bg-indigo-500 h-full" style={{ width: "25%" }} />
        <div
          className={`h-full ${isProcessed ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"}`}
          style={{ width: "25%" }}
        />
        <div
          className={`h-full ${isShipped ? "bg-pink-500" : "bg-gray-200 dark:bg-gray-700"}`}
          style={{ width: "25%" }}
        />
        <div
          className={`h-full ${isDelivered ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
          style={{ width: "25%" }}
        />
      </div>

      {/* Pourcentage */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Statut: <span className="font-medium">{status}</span>
        </span>
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {isDelivered
            ? "100%"
            : isShipped
              ? "75%"
              : isProcessed
                ? "50%"
                : "25%"}
        </span>
      </div>
    </div>
  );
};

export default OrderProgress;
