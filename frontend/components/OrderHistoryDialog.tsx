/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Ajout du bouton pour recharger les données

interface StatusHistoryEntry {
    date: string | Date;
    status: string;
    notes?: string;
}

const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
        Pending: "bg-yellow-200 text-yellow-800",
        Processing: "bg-blue-200 text-blue-800",
        Shipped: "bg-purple-200 text-purple-800",
        Delivered: "bg-green-200 text-green-800",
        Cancelled: "bg-red-200 text-red-800",
        Enregistree: "bg-yellow-200 text-yellow-800",
    };

    return statusMap[status] || "bg-gray-200 text-gray-800";
};

const OrderHistoryDialog = ({
    isOpen,
    onClose,
    orderId
}: {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
}) => {
    const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderHistory = useCallback(async () => {
        if (!orderId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status-history`);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();

            setHistory(data.statusHistory || []);
        } catch (err) {
            console.error("Erreur lors de la récupération de l'historique:", err);
            setError("Impossible de charger l'historique des commandes.");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (isOpen) {
            fetchOrderHistory();
        }
    }, [isOpen, fetchOrderHistory]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Historique des statuts de commande</DialogTitle>
                    <DialogDescription>
                        Détails des changements de statut pour la commande #
                        {orderId ? orderId.substring(0, 8) : ""}...
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">
                        {error}
                        <Button className="mt-3" onClick={fetchOrderHistory}>
                            Réessayer
                        </Button>
                    </div>
                ) : history.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        Aucun historique disponible pour cette commande.
                    </div>
                ) : (
                    <ScrollArea className="h-[300px]">
                        <Table>
                            <TableCaption>Historique des statuts de commande</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((entry, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {dayjs(entry.date || new Date()).format("DD/MM/YYYY HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(entry.status || '')}>
                                                {entry.status || ''}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] break-words">
                                            {entry.notes || "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OrderHistoryDialog;