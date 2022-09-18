import { Router } from "express";
import OrderController from "../controllers/Order-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";
import { UserRole } from "../models/User";

const router = Router();

//Get all Orders
router.get("/",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
    OrderController.findOrderPending
);

//Get a authorized/not_authorized Orders
router.get("/status",
    [checkJwt],
    OrderController.findOrderStatus
);

// Get one Order
router.get(
    "/:id",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
);

//Create a new Orders
router.post("/",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
    OrderController.createOrder
);

router.post("/multiple",
    [checkJwt], //checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
    OrderController.createOrderMultiple
);

//Edit one Orders
router.patch(
    "/:id",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
    OrderController.updatedOrderAndItems
);

//Delete one Orders
router.delete(
    "/:id",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
    OrderController.repprovedOrder
);

export default router;