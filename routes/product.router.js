import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
import { productSchema } from "../validations/product.validation.js";
import { validateBody } from "../middlewares/validateJoi.middleware.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// כך שולחים את הסכמה של מוצר לבדיקת תקינות
const validateProduct = validateBody(productSchema);
router.post('/', validateProduct, addProduct);

// כך שולחים את הסכמה של מוצר לבדיקת תקינות
// בשורה אחת
router.put('/:id', auth, authAdmin, validateBody(productSchema), updateProduct);      // עדכון מלא
// router.patch('/:id', () => { }); // עדכון חלקי

router.delete('/:id', auth, authAdmin, deleteProduct);

export default router;