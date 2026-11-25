import { Router } from "express";
import { addOrder, getAllOrders, getOrderById } from "../controllers/order.controller.js";
import { validateBody } from "../middlewares/validateJoi.middleware.js";
import { orderSchema } from "../validations/order.validation.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(auth);
// אם יש טוקן
// req.userData מכיל קוד משתמש ותפקיד

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", validateBody(orderSchema), addOrder);

export default router;