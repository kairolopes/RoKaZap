import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import PDFDocument from "pdfkit";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { requireRole } from "./middlewares/requireRole";
import { firestore } from "../firebase/firebaseAdmin";

export const pdfReportsRouter = Router();

pdfReportsRouter.get(
  "/messages.pdf",
  requireRole("admin"),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
      return;
    }
    const since = new Date(Date.now() - 7 * 864e5);
    const snap = await firestore
      .collectionGroup("messages")
      .where("tenantId", "==", tenantId)
      .where("createdAt", ">=", since)
      .get();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="messages.pdf"'
    );

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);
    doc.fontSize(16).text("Relatório de Mensagens", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Período: desde ${since.toISOString()}`);
    doc.moveDown();
    snap.forEach((d) => {
      const data: any = d.data();
      doc.text(
        `${data.createdAt?.toDate?.().toISOString?.() || ""} | ${data.direction?.toUpperCase?.() || ""} | ${data.toPhone || ""} | ${data.fromName || ""}`
      );
    });
    doc.end();
  }
);

