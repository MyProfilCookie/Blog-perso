/* eslint-disable prettier/prettier */
"use client";
/* eslint-disable import/order */

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";

export function NavCartLink({ itemCount = 0 }) {
    return (
        <Link className="relative flex items-center gap-2 text-white" href="/shop">
            <span className="relative">
                <FontAwesomeIcon className="text-xl" icon={faShoppingCart} />
                {itemCount > 0 && (
                    <div className="absolute -top-3 -right-3">
                        <Badge className="bg-red-600 hover:bg-red-600 text-white font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full px-1.5 border-2 border-gray-900">
                            {itemCount}
                        </Badge>
                    </div>
                )}
            </span>
            <span>Shop</span>
        </Link>
    );
}

// Exemple d'utilisation dans une navbar:
// <NavCartLink itemCount={calculateTotalItems()} />
