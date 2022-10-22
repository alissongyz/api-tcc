import { Router } from "express";
import AuthController from "../controllers/auth-controller";
import { checkJwt } from "../middlewares/check-jwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password",
    [checkJwt],
    AuthController.changePassword);

export default router;