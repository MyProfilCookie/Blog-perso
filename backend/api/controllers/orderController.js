const Order = require("../models/order");
const PaymentConfirmation = require('../models/paymentConfirmation');

exports.checkout = async (req, res) => {
    try {
        const { orderId, paymentMethod, transactionId } = req.body;

        // 1. Trouver la commande
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        // 2. Vérifier si la commande a déjà été payée
        if (order.paymentStatus === "Completed") {
            return res.status(400).json({ message: "Commande déjà payée" });
        }

        // 3. Mettre à jour la commande
        order.paymentStatus = "Completed";
        order.status = "Processed";
        order.updatedAt = Date.now();

        // 4. Enregistrer la confirmation de paiement
        const paymentConfirmation = new PaymentConfirmation({
            orderId: order._id,
            userId: order.userId, // Assurez-vous que l'objet `Order` contient `userId`
            transactionId,
            paymentStatus: "Completed",
            amount: order.totalAmount,
            paymentMethod,
        });

        await paymentConfirmation.save();
        await order.save();

        res.status(200).json({
            message: "Paiement validé et confirmation enregistrée.",
            order,
            paymentConfirmation,
        });
    } catch (error) {
        console.error("Erreur lors de la validation du paiement :", error);
        res.status(500).json({ message: "Erreur serveur lors de la validation du paiement.", error });
    }
};

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body); // Assurez-vous que le body contient toutes les infos nécessaires
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Commande créée avec succès", order: savedOrder });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la commande",
      error: error.message || error,
    });
  }
};

// Obtenir toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: "Liste des commandes récupérée avec succès", orders });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error: error.message || error,
    });
  }
};

// Obtenir une commande spécifique par ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Commande non trouvée" });
//     }

//     res.status(200).json({ message: "Commande récupérée avec succès", order });
//   } catch (error) {
//     res.status(500).json({
//       message: "Erreur lors de la récupération de la commande",
//       error: error.message || error,
//     });
//   }
// };

// Mettre à jour une commande par ID
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({ message: "Commande mise à jour avec succès", order: updatedOrder });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la commande",
      error: error.message || error,
    });
  }
};

// Supprimer une commande par ID
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la commande",
      error: error.message || error,
    });
  }
};

// 
exports.getOrderById = async (req, res) => {
  try {
      const order = await Order.findById(req.params.id).populate('paymentConfirmation');

      if (!order) {
          return res.status(404).json({ message: "Commande non trouvée" });
      }

      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de la commande", error });
  }
};


// // Effectuer un paiement pour une commande
// exports.checkout = async (req, res) => {
//   try {
//     const { orderId, payerID, paymentID, orderID } = req.body;

//     // 1. Trouver la commande
//     const order = await Order.findById(orderId);

//     // 2. Vérifier si la commande existe
//     if (!order) {
//       return res.status(404).json({ message: "Commande non trouvée" });
//     }

//     // 3. Vérifier si la commande a déjà été payée
//     if (order.isPaid) {
//       return res.status(400).json({ message: "Cette commande a déjà été payée." });
//     }

//     // 4. Mettre à jour la commande avec les informations de paiement
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.payment = {
//       paymentMethod: "paypal",
//       paymentResult: {
//         payerID,
//         paymentID,
//         orderID,
//       },
//     };

//     // 5. Enregistrer les modifications
//     const updatedOrder = await order.save();

//     res.status(200).json({
//       message: "Paiement effectué avec succès",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Erreur lors du paiement de la commande",
//       error: error.message || error,
//     });
//   }
// };

