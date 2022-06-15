import { Router } from "express";
import userController from "../controllers/user-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";

const router = Router();

//Get all users
router.get("/",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  userController.getAll);

// Get one user
router.get(
  "/:id",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  userController.getById
);

//Create a new user
router.post("/",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  userController.createUser);

//Edit one user
router.patch(
  "/:id",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  userController.updateUser
);

//Delete one user
router.delete(
  "/:id",
  /*[checkJwt, checkRole(["ADMIN"])],*/
  userController.delelteUser
);

export default router;