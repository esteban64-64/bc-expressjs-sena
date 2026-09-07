import { Router } from "express";
import * as controlador from "../controladores/usuarios.controlador.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.use(authMiddleware);
router.get("/dashboard", controlador.obtenerDashboard);

export default router;
