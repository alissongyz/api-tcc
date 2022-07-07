import { Router } from "express";
import materialController from "../controllers/material-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";

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
  [checkJwt],
  materialController.createMaterial);

//Edit one material
router.patch(
  "/:id",
  [checkJwt],
  materialController.updateMaterial
);

//Delete one material
router.delete(
  "/:id",
  [checkJwt],
  materialController.deleteMaterial
);

export default router;