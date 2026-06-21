import puppeteer from 'puppeteer'
import { Events } from "../../models/event.model.js";
import { Tickets } from "../../models/ticket.model.js";
import { ticketTemplate } from "./ticket.HTML.template.js";
import { generateQRCode } from "./QRcodeEncoding.js";

export const generateTicketPDF = async (ticketId, eventId, qrToken) => {
  const ticket = await Tickets.findById(ticketId);
  const event = await Events.findById(eventId);

  // Generate QR code
  const qrData = await generateQRCode(ticketId, qrToken);

  // Generate HTML template
  const template = ticketTemplate(ticket, event, qrData);

  try {
    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.setContent(template, {
      waitUntil: 'networkidle0'
    });

    await page.emulateMediaType('screen');

    const pdfData = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    return pdfData;
  }
  catch (error) {
    console.log("Error has occurred:", error);
    throw error;
  }
};