import { FastifyReply, FastifyRequest } from "fastify";
import PDFDocument from "pdfkit";
import { piGeneratorPayload } from "../../types/types";

export const generatePI = async (
  req: FastifyRequest<{ Body: piGeneratorPayload }>,
  reply: FastifyReply
) => {
  const { buyerName, date, items, hsCode, piNo } = req.body;

  if (!buyerName || !Array.isArray(items) || items.length === 0) {
    return reply.status(400).send({ error: "buyerName and non-empty items required" });
  }

  // Parse quantities and prices FROM FRONTEND (they're strings!)
  const parsedItems = items.map((item: any) => {
    // Trim and convert "55" → 55, "2.10" → 2.1
    const qty = parseFloat(String(item.qty).trim()) || 0;
    const unitPrice = parseFloat(String(item.unitPrice).trim()) || 0;
    return {
      description: String(item.description || "").trim(),
      qty,
      unitPrice,
      amount: parseFloat((qty * unitPrice).toFixed(2)),
    };
  });

  const grandTotal = parsedItems.reduce((sum, i) => sum + i.amount, 0);

  const PI_NUMBER = piNo;
  const PI_DATE = date; // from LC F45A
  const HS_CODE = hsCode
  const GOODS_DESC = "ACCESSORIES FOR 100% EXPORT ORIENTED READYMADE GARMENTS INDUSTRY";

  // Generate PDF
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const pageWidth = doc.page.width;
  const left = 40;
  const right = pageWidth - 40;

  reply
    .header("Content-Type", "application/pdf")
    .header(
      "Content-Disposition",
      `attachment; filename=${encodeURIComponent(buyerName || "PI")}.pdf`
    )
    .send(doc);

  try {
    // Header
    doc.font("Helvetica-Bold").fontSize(16).text("SOUTH DRAGON DYEING AND WASHING LTD.", { align: "center" });
    doc.font("Helvetica").fontSize(10).text("South Kabirpur, Ashulia, Savar, Dhaka-1349, Bangladesh", { align: "center" });
    doc.moveDown(0.5);
    doc.moveTo(left, doc.y).lineTo(right, doc.y).stroke();
    doc.moveDown();

    // Title & PI Reference (from LC)
    doc.font("Helvetica-Bold").fontSize(18).text("PROFORMA INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(11).text(`Proforma Invoice No.: ${PI_NUMBER}      Date: ${PI_DATE}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Buyer: ${buyerName}`);
    doc.font("Helvetica").fontSize(11).text(GOODS_DESC);

    if (date) doc.text(`Invoice Date: ${date}`);
    doc.moveDown();

    // Goods Description (LC F45A)
    doc.font("Helvetica-Bold").text("Description of Goods:", { underline: true });
    doc.text(`HS CODE NO. ${HS_CODE}`);
    doc.moveDown();

    // Table columns
    const colSl = left;
    const colDesc = colSl + 40;
    const colQty = colDesc + 180;
    const colUnitPrice = colQty + 70;
    const colAmount = colUnitPrice + 80;

    // Table header
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("Sl.", colSl, y);
    doc.text("Description", colDesc, y);
    doc.text("Qty", colQty, y, { width: 60, align: "right" });
    doc.text("Unit Price (USD)", colUnitPrice, y, { width: 80, align: "right" });
    doc.text("Amount (USD)", colAmount, y, { width: 80, align: "right" });
    doc.moveDown();

    // Table rows (DYNAMIC from frontend!)
    doc.font("Helvetica").fontSize(10);
    parsedItems.forEach((item, i) => {
      const y = doc.y;
      doc.text(`${i + 1}.`, colSl, y);
      doc.text(item.description, colDesc, y, { width: 170 });
      doc.text(item.qty.toString(), colQty, y, { width: 60, align: "right" });
      doc.text(item.unitPrice.toFixed(2), colUnitPrice, y, { width: 80, align: "right" });
      doc.text(item.amount.toFixed(2), colAmount, y, { width: 80, align: "right" });
      doc.moveDown();
    });

    // Grand Total
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Grand Total (USD):", colAmount - 100, doc.y, { width: 100, align: "right" });
    doc.text(grandTotal.toFixed(2), colAmount, doc.y, { width: 80, align: "right" });

    // Footer
    doc.moveDown(2);
    doc.fontSize(9).font("Helvetica").text(
      `This Proforma Invoice is issued in accordance with the terms referenced in ` +
      `LC No. 0000265250400284 and Proforma Invoice No. ${PI_NUMBER} dated ${PI_DATE}.\n` +
      `All shipments are subject to standard export compliance.`,
      { width: pageWidth - 80 }
    );

    doc.end();
  } catch (err) {
    req.log.error({ err }, "PI generation failed during rendering");
    // Do not send another reply
  }
};