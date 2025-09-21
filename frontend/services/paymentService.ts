/* eslint-disable no-console */
import Swal from "sweetalert2";

interface SaveOrderParams {
  items: any[];
  total: number;
  transactionId: string;
  selectedTransporter: string;
  deliveryCost: number;
  router: { push: (path: string) => void };
}

export async function saveOrderService({
  items,
  total,
  transactionId,
  selectedTransporter,
  deliveryCost,
  router,
}: SaveOrderParams): Promise<{ createdOrder: any; user: any } | null> {
  const token = localStorage.getItem("userToken");

  // Validation checks
  if (!selectedTransporter) {
    Swal.fire({
      title: "Erreur",
      text: "Veuillez sélectionner un transporteur avant de continuer.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return null;
  }

  if (!token) {
    Swal.fire({
      title: "Erreur",
      text: "Votre session a expiré. Veuillez vous reconnecter.",
      icon: "error",
      confirmButtonText: "Se reconnecter",
    }).then(() => {
      localStorage.removeItem("userToken");
      window.location.href = "/users/login";
    });
    return null;
  }

  if (!items || items.length === 0) {
    Swal.fire({
      title: "Erreur",
      text: "Le panier est vide. Ajoutez des articles avant de passer commande.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return null;
  }

  try {
    // Get user data first to validate required fields
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userResponse.ok) {
      throw new Error("Erreur lors de la récupération des informations utilisateur.");
    }

    const userData = await userResponse.json();
    const user = userData.user;
    console.log("✅ Données utilisateur récupérées :", userData);

    // Validation des champs obligatoires
    const missingFields: string[] = [];

    if (!user.phone || user.phone.trim() === "") {
      missingFields.push("numéro de téléphone");
    }

    if (!user.deliveryAddress) {
      missingFields.push("adresse de livraison");
    } else {
      const address = user.deliveryAddress;
      if (!address.street || !address.city || !address.postalCode || !address.country) {
        missingFields.push("adresse de livraison complète");
      }
    }

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Informations manquantes",
        html: `
          <p>Veuillez compléter votre profil avec les informations suivantes :</p>
          <ul style="text-align: left; margin: 10px 0;">
            ${missingFields.map((f) => `<li>• ${f}</li>`).join("")}
          </ul>
          <p>Vous pouvez les ajouter dans votre <strong>profil utilisateur</strong>.</p>
        `,
        icon: "warning",
        confirmButtonText: "Aller au profil",
        showCancelButton: true,
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/profile");
        }
      });
      return null;
    }

    // Format order items
    const formattedItems = items.map((item: any) => ({
      productId: item.productId || item._id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    }));

    // Prepare order data
    const orderData = {
      firstName: user.prenom,
      lastName: user.nom,
      email: user.email,
      phone: user.phone || "Non renseigné",
      userId: user._id,
      deliveryAddress: user.deliveryAddress,
      items: formattedItems,
      totalAmount: total,
      transactionId,
      paymentMethod: "card",
      deliveryMethod: selectedTransporter,
      deliveryCost,
    };

    // Create order
    console.log("📤 Envoi de la commande à l'API:", JSON.stringify(orderData, null, 2));

    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json().catch(() => ({}));
      console.error("❌ Erreur API:", orderResponse.status, errorData);
      let errorMessage = "Erreur lors de la création de la commande.";
      if (errorData.error) errorMessage = errorData.error;
      else if (errorData.message) errorMessage = errorData.message;
      else if (errorData.details) errorMessage = errorData.details;
      throw new Error(errorMessage);
    }

    const createdOrder = await orderResponse.json();
    console.log("✅ Commande créée avec succès:", createdOrder);

    // Extract and store orderId
    let orderId: string | null = null;
    if (createdOrder.order && createdOrder.order._id) orderId = createdOrder.order._id;
    else if (createdOrder._id) orderId = createdOrder._id;
    else if (createdOrder.id) orderId = createdOrder.id;

    if (orderId) {
      localStorage.setItem("orderId", orderId);
      console.log("ID de commande stocké dans localStorage:", localStorage.getItem("orderId"));
    } else {
      console.error("Impossible de stocker l'ID de commande: ID non trouvé");
    }

    // Clear cart data
    localStorage.removeItem(`cartItems_${user.pseudo}`);
    localStorage.removeItem("totalPrice");
    window.dispatchEvent(new Event("cartUpdated"));

    return { createdOrder, user };
  } catch (error: any) {
    console.error("❌ Erreur lors de l'enregistrement de la commande :", error);
    Swal.fire({
      title: "Erreur",
      text: error.message || "Impossible d'enregistrer votre commande et le paiement.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return null;
  }
}

export async function confirmPaymentService(
  user: any,
  orderId: string,
  transactionId: string,
  amount: number,
  paymentMethod: string,
) {
  if (!user || !user._id || !orderId || !transactionId || !amount || !paymentMethod) {
    console.error("❌ Erreur : Données manquantes pour la confirmation de paiement.");
    return null;
  }

  const confirmationData = {
    orderId,
    userId: user._id,
    transactionId,
    paymentMethod: paymentMethod === "card" ? "Credit Card" : paymentMethod,
    paymentStatus: "Paid",
    amount,
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-confirmations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      body: JSON.stringify(confirmationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur lors de l'envoi de la confirmation de paiement :", errorData);
      throw new Error(errorData.message || "Erreur lors de la confirmation du paiement.");
    }

    const result = await response.json();
    console.log("✅ Confirmation de paiement enregistrée avec succès :", result);
    return result;
  } catch (error: any) {
    console.error("❌ Erreur lors de l'enregistrement de la confirmation de paiement :", error.message);
    return null;
  }
}
