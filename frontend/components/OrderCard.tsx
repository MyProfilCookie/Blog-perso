/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
// Composant OrderCard intégré avec style AutiStudy
import React, { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faHistory,
  faShippingFast,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Type OrderItem
interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

// Type Order
interface Order {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  date?: string;
  orderDate?: string;
  createdAt?: string;
  total?: number;
  totalAmount?: number;
  status: string;
  items?: OrderItem[];
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string;
}

// Composant de progression des commandes
const OrderProgress = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();

  const isRegistered = true; // Première étape toujours complétée
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

  // Si la commande est annulée, afficher un style spécial
  if (isCancelled) {
    return (
      <div className="mt-4 w-full">
        {/* Indicateurs d'étape */}
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

        {/* Barre de progression pour commande annulée */}
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

  // Progression normale
  return (
    <div className="mt-4 w-full">
      {/* Indicateurs d'étape */}
      <div className="flex justify-between mb-2">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-1",
              isRegistered
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
            )}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isRegistered
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            Enregistrement
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-1",
              isProcessed
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
            )}
          >
            {isProcessed ? <FontAwesomeIcon icon={faCheck} /> : <span>2</span>}
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isProcessed
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            Préparation
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-1",
              isShipped
                ? "bg-pink-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
            )}
          >
            {isShipped ? <FontAwesomeIcon icon={faCheck} /> : <span>3</span>}
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isShipped
                ? "text-pink-500 dark:text-pink-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            Expédition
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-1",
              isDelivered
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
            )}
          >
            {isDelivered ? <FontAwesomeIcon icon={faCheck} /> : <span>4</span>}
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isDelivered
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            Livraison
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-3 flex w-full rounded-full overflow-hidden">
        <div className="bg-indigo-500 h-full" style={{ width: "25%" }} />
        <div
          className={cn(
            "h-full",
            isProcessed ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700",
          )}
          style={{ width: "25%" }}
        />
        <div
          className={cn(
            "h-full",
            isShipped ? "bg-pink-500" : "bg-gray-200 dark:bg-gray-700",
          )}
          style={{ width: "25%" }}
        />
        <div
          className={cn(
            "h-full",
            isDelivered ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700",
          )}
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

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-yellow-500";
  let textColor = "text-white";

  if (status === "Pending" || status === "En attente") {
    bgColor = "bg-indigo-500";
  } else if (status === "Shipped" || status === "Expédié") {
    bgColor = "bg-pink-500";
  } else if (status === "Delivered" || status === "Livrée") {
    bgColor = "bg-emerald-500";
  } else if (status === "Processing" || status === "En cours") {
    bgColor = "bg-blue-500";
  } else if (status === "Cancelled" || status === "Annulée") {
    bgColor = "bg-red-500";
  }

  return (
    <span
      className={`${bgColor} ${textColor} py-1 px-4 rounded-full text-sm font-medium`}
    >
      {status}
    </span>
  );
};

// Fonction pour extraire les initiales du client
const getInitials = (firstName: string = "", lastName: string = "") => {
  if (!firstName && !lastName) return "?";

  return `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}`.toUpperCase();
};

// Composant principal OrderCard
const OrderCard = ({
  order,
  showStatusHistory,
  updateOrderStatus,
  deleteOrder,
}: {
  order: Order;
  showStatusHistory: (id: string) => void;
  updateOrderStatus: (id: string, status: string) => void;
  deleteOrder: (id: string) => void;
}) => {
  const [statusValue, setStatusValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Fonction pour gérer le changement de statut
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setStatusValue(value);
    if (value) {
      updateOrderStatus(order._id, value);
      // Reset après sélection
      setTimeout(() => setStatusValue(""), 300);
    }
  };

  // Formattage de la date
  const formattedDate = dayjs(
    order.orderDate || order.date || order.createdAt,
  ).format("DD/MM/YYYY");

  // Détermine le statut pour le style
  const isCompleted = order.status === "Delivered" || order.status === "Livrée";
  const isShipped = order.status === "Shipped" || order.status === "Expédié";

  // ID court pour l'affichage
  const shortId = order._id.substring(0, 8);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* En-tête de la commande */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isCompleted
                  ? "bg-emerald-500"
                  : isShipped
                    ? "bg-pink-500"
                    : "bg-indigo-500",
              )}
            >
              <span className="text-white font-medium">
                {getInitials(order.firstName, order.lastName)}
              </span>
            </div>

            <div>
              <p className="font-semibold text-base">Commande #{shortId}...</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge status={order.status} />
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                showStatusHistory(order._id);
              }}
            >
              <FontAwesomeIcon
                className="text-gray-500 dark:text-gray-400"
                icon={faHistory}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Détails de la commande */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {/* Informations de la commande */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Email client
              </p>
              <p className="font-medium text-sm break-all">{order.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID Commande
              </p>
              <p className="font-mono text-sm" title={order._id}>
                {order._id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Paiement
              </p>
              <div className="flex items-center">
                <span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full mr-2",
                    order.paymentStatus === "Paid"
                      ? "bg-green-500"
                      : "bg-yellow-500",
                  )}
                />
                <span className="font-medium text-sm">
                  {order.paymentStatus}{" "}
                  {order.paymentMethod ? `(${order.paymentMethod})` : ""}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Montant
              </p>
              <p className="font-bold">
                {(order.total || order.totalAmount || 0).toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          <OrderProgress status={order.status} />

          {/* Numéro de suivi si expédié */}
          {isShipped && (
            <div className="mt-4">
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Numéro de suivi
              </label>
              <div className="flex gap-2">
                <input
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="N° de suivi"
                  type="text"
                  value={order.trackingNumber || ""}
                  onChange={(e) => {
                    console.log("Mise à jour numéro de suivi:", e.target.value);
                    // Implémentez ici la logique pour mettre à jour le numéro de suivi
                  }}
                />
                <Button size="sm" variant="outline">
                  <FontAwesomeIcon className="mr-2" icon={faShippingFast} />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}

          {/* Actions de commande */}
          <div className="flex gap-2 mt-4">
            <select
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"
              value={statusValue}
              onChange={handleStatusChange}
            >
              <option value="">Changer le statut...</option>
              {order.status !== "Pending" && (
                <option value="Pending">Enregistrée</option>
              )}
              {order.status !== "Processing" && (
                <option value="Processing">En préparation</option>
              )}
              {order.status !== "Shipped" && (
                <option value="Shipped">Expédiée</option>
              )}
              {order.status !== "Delivered" && (
                <option value="Delivered">Livrée</option>
              )}
              {order.status !== "Cancelled" && (
                <option value="Cancelled">Annulée</option>
              )}
            </select>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteOrder(order._id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>

          {/* Articles de la commande */}
          {order.items && order.items.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Articles commandés</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md flex gap-3 items-center"
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-md flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <div className="relative w-full h-full overflow-hidden rounded-md">
                          <Image
                            fill
                            alt={item.title}
                            className="object-cover"
                            sizes="48px"
                            src={item.image}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Image
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.title}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {item.quantity} × {item.price.toFixed(2)}€
                        </span>
                        <span className="font-medium">
                          {(item.quantity * item.price).toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Exemple d'utilisation
const AdminOrdersSection = ({ orders }: { orders: Order[] }) => {
  // Fonctions
  const showStatusHistory = (id: string) => {
    console.log("Afficher l'historique:", id);
    // Implémentez ici la logique pour afficher l'historique
  };

  const updateOrderStatus = (id: any, status: any) => {
    console.log("Mise à jour statut:", id, status);
    // Implémentez ici la logique pour mettre à jour le statut
  };

  const deleteOrder = (id: any) => {
    console.log("Supprimer commande:", id);
    // Implémentez ici la logique pour supprimer la commande
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Gestion des commandes</h2>

      {orders.map((order) => (
        <OrderCard
          key={order._id}
          deleteOrder={deleteOrder}
          order={order}
          showStatusHistory={showStatusHistory}
          updateOrderStatus={updateOrderStatus}
        />
      ))}
    </div>
  );
};

export { OrderCard, OrderProgress, StatusBadge, AdminOrdersSection };
