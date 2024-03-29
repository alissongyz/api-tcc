import { Router } from "express";
import medicinesController from "../controllers/medicines-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";
import { UserRole } from "../models/User";


const router = Router();

//Get all medicines
router.get("/",
    [checkJwt],
    medicinesController.getAll);

// Get one medicines
router.get(
    "/:id",
    [checkJwt],
  medicinesController.getById
);

//Create a new medicines
router.post("/",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
  medicinesController.createMedicine);

//Edit one medicine
router.patch(
    "/:id",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
  medicinesController.updateMedicine
);

//Delete one medicine
router.delete(
    "/:id",
    [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
  medicinesController.deleteMedicine
);

export default router;