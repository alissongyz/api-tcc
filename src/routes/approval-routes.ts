import { Router } from "express";
import approvalController from "../controllers/approval-controller";
import { checkJwt } from "../middlewares/check-jwt";
import { checkRole } from "../middlewares/check-role";

const router = Router();

//Get all approvals
router.get("/",
    approvalController.findApprovalPending
);

// Get one approval
router.get(
    "/:id"
);

//Create a new approvals
router.post("/",
    approvalController.createApproval
);

//Edit one approvals
router.patch(
    "/:id"
);

//Delete one approvals
router.delete(
    "/:id"
);

export default router;