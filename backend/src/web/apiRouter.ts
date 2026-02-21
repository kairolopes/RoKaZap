import { Router } from "express";
import { authRouter } from "./authRouter";
import { messagesRouter } from "./messagesRouter";
import { webhookRouter } from "./webhookRouter";
import { notifyPurchaseRouter } from "./notifyPurchaseRouter";
import { authenticateJwt } from "./middlewares/authenticateJwt";
import { rateLimitByTenant } from "./middlewares/rateLimitByTenant";
import { docsRouter } from "./docsRouter";
import { templatesRouter } from "./templatesRouter";
import { reportsRouter } from "./reportsRouter";
import { devicesRouter } from "./devicesRouter";
import { conversationsRouter } from "./conversationsRouter";
import { groupsRouter } from "./groupsRouter";
import { customersRouter } from "./customersRouter";
import { kpisRouter } from "./kpisRouter";
import { pdfReportsRouter } from "./pdfReportsRouter";
import { usersRouter } from "./usersRouter";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/docs", docsRouter);

apiRouter.use(authenticateJwt, rateLimitByTenant);

apiRouter.use("/messages", messagesRouter);
apiRouter.use("/webhooks", webhookRouter);
apiRouter.use("/", notifyPurchaseRouter);
apiRouter.use("/templates", templatesRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/devices", devicesRouter);
apiRouter.use("/conversations", conversationsRouter);
apiRouter.use("/groups", groupsRouter);
apiRouter.use("/customers", customersRouter);
apiRouter.use("/kpis", kpisRouter);
apiRouter.use("/reports", pdfReportsRouter);
apiRouter.use("/users", usersRouter);
