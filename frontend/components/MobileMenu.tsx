"use client";

import React from "react";
import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faNewspaper,
  faCrown,
  faTachometerAlt,
  faUser,
  faHome,
  faInfoCircle,
  faBook,
  faGamepad,
  faShoppingCart,
  faGraduationCap,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { 
  PendingOrdersIcon,
  ShippedOrdersIcon,
  DeliveredOrdersIcon,
} from "@/components/icons";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  orderCount: any;
  handleLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  user,
  orderCount,
  handleLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-xl border-t border-gray-200 dark:border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto"
        style={{
          animation: 'slideDown 0.3s ease-out'
        }}
      >
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Section utilisateur */}
          {user && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 px-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-violet-600 dark:text-violet-400" />
                Mon compte
              </h3>
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 md:p-4 space-y-2 md:space-y-3 border border-violet-200 dark:border-gray-600">
                <NextLink
                  className="block w-full"
                  href="/orders"
                  onClick={onClose}
                >
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <PendingOrdersIcon 
                          size={24} 
                          className="text-yellow-600 dark:text-yellow-400"
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-yellow-600 dark:text-yellow-400 text-sm">
                            En cours
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Commandes en traitement
                          </div>
                        </div>
                      </div>
                      <span className="text-base md:text-lg font-semibold text-yellow-600 dark:text-yellow-400 min-w-[2rem] text-center">
                        {orderCount.pending || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border-2 border-violet-200 dark:border-violet-800 hover:bg-violet-50/30 dark:hover:bg-violet-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <ShippedOrdersIcon 
                          size={24} 
                          className="text-violet-600 dark:text-violet-400"
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-violet-600 dark:text-violet-400 text-sm">
                            Envoyées
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            En cours de livraison
                          </div>
                        </div>
                      </div>
                      <span className="text-base md:text-lg font-semibold text-violet-600 dark:text-violet-400 min-w-[2rem] text-center">
                        {orderCount.shipped || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border-2 border-green-200 dark:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <DeliveredOrdersIcon 
                          size={24} 
                          className="text-green-600 dark:text-green-400"
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-green-600 dark:text-green-400 text-sm">
                            Livrées
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Commandes terminées
                          </div>
                        </div>
                      </div>
                      <span className="text-base md:text-lg font-semibold text-green-600 dark:text-green-400 min-w-[2rem] text-center">
                        {orderCount.delivered || 0}
                      </span>
                    </div>
                  </div>
                </NextLink>

                {/* Dashboard */}
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  onClick={onClose}
                >
                  <FontAwesomeIcon
                    className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5"
                    icon={user.role === "admin" ? faCrown : faGraduationCap}
                  />
                  <span className="font-medium text-sm md:text-base">
                    {user.role === "admin" ? "Dashboard Admin" : "Dashboard"}
                  </span>
                </NextLink>

                {/* Contrôle */}
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href="/controle"
                  onClick={onClose}
                >
                  <FontAwesomeIcon
                    className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5"
                    icon={faGamepad}
                  />
                  <span className="font-medium text-sm md:text-base">Contrôle</span>
                </NextLink>

                {/* Déconnexion */}
                <button
                  className="flex items-center w-full px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  onClick={() => {
                    onClose();
                    handleLogout();
                  }}
                >
                  <FontAwesomeIcon
                    className="mr-2 md:mr-3 text-red-600 dark:text-red-400 w-4 md:w-5"
                    icon={faSignOutAlt}
                  />
                  <span className="font-medium text-sm md:text-base">Déconnexion</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation mobile pour les utilisateurs non connectés */}
          {!user && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 px-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faHome} className="text-violet-600 dark:text-violet-400" />
                Navigation
              </h3>
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 md:p-4 space-y-2 md:space-y-3 border border-violet-200 dark:border-gray-600">
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href="/"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5" />
                  <span className="font-medium text-sm md:text-base">Accueil</span>
                </NextLink>
                
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href="/about"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5" />
                  <span className="font-medium text-sm md:text-base">À propos</span>
                </NextLink>
                
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href="/articles"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faBook} className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5" />
                  <span className="font-medium text-sm md:text-base">Articles</span>
                </NextLink>
                
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href="/controle"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faGamepad} className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5" />
                  <span className="font-medium text-sm md:text-base">Contrôle</span>
                </NextLink>
                
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href="/shop"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5" />
                  <span className="font-medium text-sm md:text-base">Shop</span>
                </NextLink>
                
                <NextLink
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                  href="/contact"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faHeart} className="mr-2 md:mr-3 text-violet-600 dark:text-violet-400 w-4 md:w-5" />
                  <span className="font-medium text-sm md:text-base">Contact</span>
                </NextLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
