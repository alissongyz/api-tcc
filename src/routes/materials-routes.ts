import { Router } from "express";
import materialController from "../controllers/material-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";

const router = Router();

//Get all materials
router.get("/",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  materialController.getAll);

// Get one material
router.get(
  "/:id",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  materialController.getById
);

//Create a new material
router.post("/",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  materialController.createMaterial);

//Edit one material
router.patch(
  "/:id",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  materialController.updateMaterial
);

//Delete one material
router.delete(
  "/:id",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  materialController.deleteMaterial
);

export default router;