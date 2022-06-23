import { Router } from "express";
import OrderController from "../controllers/Order-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";

const router = Router();

//Get all Orders
router.get("/",
    OrderController.findOrderPending
);

// Get one Order
router.get(
    "/:id"
);

//Create a new Orders
router.post("/",
    OrderController.createOrder
);

//Edit one Orders
router.patch(
    "/:id",
    OrderController.updatedOrderAndUpdatedMedicines
);

//Delete one Orders
router.delete(
    "/:id",
    OrderController.repprovedOrder
);

export default router;