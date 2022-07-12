import { Router } from "express";
import materialController from "../controllers/material-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";
import { UserRole } from "../models/User";

const router = Router();

//Get all materials
router.get("/",
  [checkJwt],
  materialController.getAll);

// Get one material
router.get(
  "/:id",
  [checkJwt],
  materialController.getById
);

//Create a new material
router.post("/",
  [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
  materialController.createMaterial);

//Edit one material
router.patch(
  "/:id",
  [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
  materialController.updateMaterial
);

//Delete one material
router.delete(
  "/:id",
  [checkJwt], checkRole([UserRole.FARMACEUTICO.toString()|| UserRole.ADMIN.toString()]),
  materialController.deleteMaterial
);

export default router;