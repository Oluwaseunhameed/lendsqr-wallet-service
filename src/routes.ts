import { Router } from "express";

import { authRoutes } from "./modules/auth/auth.routes";
import { walletRoutes } from "./modules/wallets/wallet.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/wallets", walletRoutes);

export { router };
