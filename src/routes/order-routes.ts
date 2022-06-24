import { Router } from "express";
import OrderController from "../controllers/Order-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";

const router = Router();

//Get all Orders
router.get("/",
    [checkJwt],
    OrderController.findOrderPending
);

// Get one Order
router.get(
    "/:id",
    [checkJwt],
);

//Create a new Orders
router.post("/",
    [checkJwt],
    OrderController.createOrder
);

//Edit one Orders
router.patch(
    "/:id",
    [checkJwt],
    OrderController.updatedOrderAndUpdatedMedicines
);

//Delete one Orders
router.delete(
    "/:id",
    [checkJwt],
    OrderController.repprovedOrder
);

export default router;