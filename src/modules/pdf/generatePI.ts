import { FastifyReply, FastifyRequest } from "fastify";
import { piGeneratorPayload } from "../../types/types";
import PDFDocument from "pdfkit";

export const generatePI = async (
  req: FastifyRequest<{ Body: piGeneratorPayload }>,
  reply: FastifyReply
) => {
  const { buyerName } = req.body;
  console.log(buyerName);

  try {
    const doc = new PDFDocument({ margin: 50 });

    // Set headers
    reply
      .header("Content-Type", "application/pdf")
      .header(
        "Content-Disposition",
        `attachment; filename=${encodeURIComponent(buyerName || "PI")}.pdf`
      );

    // Send the stream via Fastify's reply (not reply.raw!)
    reply.send(doc);

    // Build the PDF content
    doc.fontSize(20).text("PROFORMA INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Buyer Name: ${buyerName}`);
    doc.moveDown();
    doc.text("This is a sample PI generated via PDFKit.");

    // Finalize the PDF
    doc.end();
  } catch (err) {
    req.log.error({ err }, "PI generation failed");
    // Only send error response if headers haven't been sent yet
    if (!reply.sent) {
      reply.status(500).send({
        success: false,
        message: "Failed to generate PI.",
      });
    }
  }
};