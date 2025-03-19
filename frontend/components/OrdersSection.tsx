/* eslint-disable react/no-unescaped-entities */
// Updated OrdersSection Component that matches the AutiStudy design
import React from "react";
import Image from "next/image";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";

// ShadCN Components
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

// Define TypeScript interfaces
interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  date?: string;
  createdAt?: string;
  total?: number;
  totalAmount?: number;
  status: string;
  items?: OrderItem[];
  deliveryCost?: number;
  paymentMethod?: string;
  paymentStatus?: string;
}

interface User {
  _id: string;
  pseudo: string;
  email: string;
  role: string;
  // ...other user properties
}

// Order Progress tracker component
const OrderProgress = ({ status }: { status: string }) => {
  const isRegistered = true; // First step is always completed
  const isProcessed = [
    "Processed",
    "En cours",
    "Shipped",
    "Expédié",
    "Delivered",
    "Livrée",
  ].includes(status);
  const isShipped = ["Shipped", "Expédié", "Delivered", "Livrée"].includes(
    status,
  );
  const isDelivered = ["Delivered", "Livrée"].includes(status);

  const getProgressPercentage = () => {
    if (isDelivered) return 100;
    if (isShipped) return 75;
    if (isProcessed) return 50;
    if (isRegistered) return 25;

    return 0;
  };

  return (
    <div className="mt-4 w-full">
      {/* Step indicators */}
      <div className="flex justify-between mb-2">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-1",
              isRegistered
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-500",
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isRegistered ? "text-indigo-500" : "text-gray-500",
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
                : "bg-gray-200 text-gray-500",
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isProcessed ? "text-indigo-500" : "text-gray-500",
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
                : "bg-gray-200 text-gray-500",
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isShipped ? "text-pink-500" : "text-gray-500",
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
                : "bg-gray-200 text-gray-500",
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <span
            className={cn(
              "text-sm text-center",
              isDelivered ? "text-emerald-500" : "text-gray-500",
            )}
          >
            Livraison
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 flex w-full rounded-full overflow-hidden">
        <div className="bg-indigo-500 h-full" style={{ width: "25%" }} />
        <div
          className={cn(
            "h-full",
            isProcessed ? "bg-indigo-500" : "bg-gray-200",
          )}
          style={{ width: "25%" }}
        />
        <div
          className={cn("h-full", isShipped ? "bg-pink-500" : "bg-gray-200")}
          style={{ width: "25%" }}
        />
        <div
          className={cn(
            "h-full",
            isDelivered ? "bg-emerald-500" : "bg-gray-200",
          )}
          style={{ width: "25%" }}
        />
      </div>

      {/* Percentage display */}
      {isDelivered && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-medium text-emerald-600">
            Livraison
          </span>
          <span className="text-lg font-medium text-emerald-600">100%</span>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-yellow-500";
  let textColor = "text-white";

  if (status === "Pending" || status === "En attente") {
    bgColor = "bg-red-400";
  } else if (status === "Shipped" || status === "Expédié") {
    bgColor = "bg-red-500";
  } else if (status === "Delivered" || status === "Livrée") {
    bgColor = "bg-black";
  } else if (status === "Processed" || status === "En cours") {
    bgColor = "bg-blue-500";
  }

  return (
    <span
      className={`${bgColor} ${textColor} py-1 px-4 rounded-full text-sm font-medium`}
    >
      {status}
    </span>
  );
};

// Main OrdersSection Component
const OrdersSection = ({
  orders,
  user,
}: {
  orders: Order[];
  user: User | null;
}) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Vos Commandes</h3>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Vous n'avez pas encore passé de commande.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-bold mb-4">Vos Commandes</h3>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="overflow-hidden">
            <Accordion collapsible className="w-full" type="single">
              <AccordionItem className="border-0" value={order._id}>
                {/* Order Header */}
                <AccordionTrigger className="px-4 py-4 hover:no-underline focus:no-underline">
                  <div className="w-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center w-full">
                        <p className="font-semibold text-base">
                          Commande #{order._id.substring(0, 8)}...
                        </p>
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                          />
                        </svg>
                      </div>

                      <p className="text-gray-500 text-sm">
                        {dayjs(order.date || order.createdAt).format(
                          "DD/MM/YYYY",
                        )}
                      </p>

                      <div className="flex justify-between items-center w-full flex-wrap">
                        <StatusBadge status={order.status} />

                        {user && user.role === "admin" ? (
                          <div className="flex items-center">
                            <span className="line-through mr-2">
                              {order.total || order.totalAmount || 0}€
                            </span>
                            <span className="bg-gray-200 text-gray-800 rounded-full px-4 py-1 text-sm font-medium">
                              Gratuit • Admin
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">
                            {order.total || order.totalAmount || 0}€
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Order Details */}
                <AccordionContent className="px-4 pb-6">
                  {/* Order Progress */}
                  <OrderProgress status={order.status} />

                  <Separator className="my-6" />

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <>
                      <h4 className="font-medium text-lg mb-4">
                        Articles commandés
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => {
                          // Get image URL from various possible properties
                          const imageUrl =
                            item.image ||
                            (item as any).imageUrl ||
                            (item as any).img ||
                            (item as any).photo ||
                            (item as any).thumbnail;

                          return (
                            <div
                              key={idx}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <div className="flex gap-4">
                                {/* Product image */}
                                <div className="flex-shrink-0">
                                  {imageUrl ? (
                                    <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                                      <Image
                                        fill
                                        alt={`Image de ${item.title}`}
                                        className="object-contain"
                                        src={imageUrl}
                                        onError={(e) => {
                                          (
                                            e.target as HTMLImageElement
                                          ).style.display = "none";
                                          (
                                            e.target as HTMLImageElement
                                          ).parentElement!.innerHTML =
                                            '<div class="h-24 w-24 flex items-center justify-center bg-gray-100"><span class="text-xs text-gray-400">Image indisponible</span></div>';
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-md border">
                                      <span className="text-xs text-gray-400">
                                        Pas d'image
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Product info */}
                                <div className="flex-1 space-y-1 min-w-0">
                                  <p className="font-medium break-words">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-gray-500 break-all">
                                    Réf: {item.productId}
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center mt-2">
                                    <span className="text-sm">
                                      {item.quantity} × {item.price}€
                                    </span>

                                    {user && user.role === "admin" ? (
                                      <div className="flex items-center gap-2">
                                        <span className="line-through font-medium">
                                          {(item.quantity * item.price).toFixed(
                                            2,
                                          )}
                                          €
                                        </span>
                                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                          Gratuit
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="font-medium">
                                        {(item.quantity * item.price).toFixed(
                                          2,
                                        )}
                                        €
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Order Summary */}
                  <div className="mt-6 space-y-2">
                    {order.deliveryCost && (
                      <div className="flex justify-between items-center flex-wrap">
                        <span className="text-sm text-gray-600">
                          Frais de livraison:
                        </span>
                        {user && user.role === "admin" ? (
                          <div className="flex items-center gap-2">
                            <span className="line-through">
                              {order.deliveryCost}€
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Gratuit
                            </span>
                          </div>
                        ) : (
                          <span>{order.deliveryCost}€</span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center flex-wrap font-medium">
                      <span>Total:</span>
                      {user && user.role === "admin" ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through">
                            {order.total || order.totalAmount || 0}€
                          </span>
                          <span className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm">
                            Gratuit • Admin
                          </span>
                        </div>
                      ) : (
                        <span>{order.total || order.totalAmount || 0}€</span>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;
