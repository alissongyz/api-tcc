import { Router } from "express";
import userController from "../controllers/user-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";
import { UserRole } from "../models/User";

const router = Router();

//Get all users
router.get("/",
  [checkJwt],
  userController.getAll);

// Get one user
router.get(
  "/:id",
  [checkJwt], checkRole([UserRole.ADMIN.toString()]),
  userController.getById
);

//Create a new user
router.post("/",
  [checkJwt], checkRole([UserRole.ADMIN.toString()]),
  userController.createUser);

//Edit one user
router.patch(
  "/:id",
  [checkJwt], checkRole([UserRole.ADMIN.toString()]),
  userController.updateUser
);

//Delete one user
router.delete(
  "/:id",
  [checkJwt], checkRole([UserRole.ADMIN.toString()]),
  userController.delelteUser
);

export default router;