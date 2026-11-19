import type { Order } from '../types'
import { inr } from './format'

export function openPrintableInvoice(order: Order, brandName = 'FORME®'): void {
 const win = window.open('', '_blank', 'width=850,height=900')
 if (!win) {
  alert('Please allow popups to view and download the invoice.')
  return
 }

 const invoiceNum = order.invoiceNumber || `INV-${order.id.replace(/\D/g, '') || Date.now().toString().slice(-6)}`
 const dateStr = new Date(order.date).toLocaleDateString('en-IN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
 })

 const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoiceNum} - ${brandName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; padding: 40px; font-size: 13px; line-height: 1.5; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 20px; }
    .brand-title { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 1px; margin-top: 2px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .invoice-title p { font-size: 12px; color: #555; margin-top: 4px; }
    .parties { display: flex; justify-content: space-between; margin-top: 28px; padding-bottom: 24px; border-bottom: 1px solid #eee; }
    .party-col { width: 48%; }
    .party-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 6px; }
    .party-name { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; color: #444; }
    td { padding: 12px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
    .text-right { text-align: right; }
    .totals { margin-top: 24px; display: flex; justify-content: flex-end; }
    .totals-table { width: 280px; }
    .totals-table div { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
    .totals-table .grand-total { font-size: 16px; font-weight: 800; border-top: 2px solid #111; border-bottom: 2px solid #111; padding: 10px 0; margin-top: 6px; }
    .badge { display: inline-block; padding: 3px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; border-radius: 4px; margin-top: 4px; }
    .badge-paid { background: #dcfce7; color: #166534; }
    .badge-cod { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #777; text-align: center; }
    .print-btn { background: #000; color: #fff; border: 0; padding: 10px 20px; border-radius: 9999px; font-size: 13px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
    @media print {
      .print-btn { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div style="text-align: right;">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand-title">${brandName}</div>
      <div class="brand-sub">Everyday Luxury & Heavyweight Essentials</div>
      <div style="font-size: 11px; color: #555; margin-top: 6px;">
        GSTIN: 07AAAFO1234F1Z5<br>
        Registered Warehouse: Okhla Industrial Area, Phase III, New Delhi 110020<br>
        contact@forme.example | +91 72919 19145
      </div>
    </div>
    <div class="invoice-title">
      <h1>TAX INVOICE</h1>
      <p><strong>Invoice No:</strong> ${invoiceNum}</p>
      <p><strong>Order Ref:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${dateStr}</p>
      <span class="badge ${order.payment.toLowerCase().includes('cod') ? 'badge-cod' : 'badge-paid'}">
        Payment: ${order.paymentStatus || 'Verified & Settled'}
      </span>
    </div>
  </div>

  <div class="parties">
    <div class="party-col">
      <div class="party-title">Billed & Shipped To:</div>
      <div class="party-name">${order.customer.name}</div>
      <div>${order.customer.address}</div>
      <div>${order.customer.city}, ${order.customer.state} — ${order.customer.pin}</div>
      <div style="margin-top: 4px; color: #555;">Phone: ${order.customer.phone} | Email: ${order.customer.email}</div>
    </div>
    <div class="party-col" style="text-align: right;">
      <div class="party-title">Shipping & Logistics:</div>
      <div><strong>Courier:</strong> ${order.shipment?.courierPartner || 'BlueDart Express Air'}</div>
      <div><strong>AWB / Tracking:</strong> ${order.shipment?.trackingNumber || `BD-${order.id.slice(-6)}`}</div>
      <div><strong>Status:</strong> ${order.status}</div>
      <div><strong>Dispatch Hub:</strong> North India Fulfillment Hub</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 45%;">Item Description</th>
        <th style="width: 15%;">Variant / Size</th>
        <th style="width: 10%; text-align: center;">Qty</th>
        <th style="width: 15%; text-align: right;">Unit Price</th>
        <th style="width: 15%; text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.lines.map(l => `
        <tr>
          <td>
            <strong>${l.name}</strong>
            ${l.sku ? `<div style="font-size: 10px; color: #888; font-family: monospace;">SKU: ${l.sku}</div>` : ''}
          </td>
          <td>${l.size || 'Standard'}</td>
          <td style="text-align: center;">${l.qty}</td>
          <td class="text-right">${inr(l.price)}</td>
          <td class="text-right"><strong>${inr(l.price * l.qty)}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-table">
      <div>
        <span>Subtotal</span>
        <span>${inr(order.subtotal)}</span>
      </div>
      ${order.discount > 0 ? `
        <div style="color: #b91c1c;">
          <span>Promotional Discount</span>
          <span>-${inr(order.discount)}</span>
        </div>
      ` : ''}
      <div>
        <span>Shipping & Handling</span>
        <span>${order.shipping > 0 ? inr(order.shipping) : 'FREE'}</span>
      </div>
      <div>
        <span>Integrated GST (12% Included)</span>
        <span>${inr(Math.round(order.total * 0.12))}</span>
      </div>
      <div class="grand-total">
        <span>Total Paid</span>
        <span>${inr(order.total)}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This is a computer-generated tax invoice. No physical signature is required.</p>
    <p style="margin-top: 4px;">Thank you for patronizing ${brandName}. For exchanges or support, visit forme.example/returns or WhatsApp us at +91 72919 19145.</p>
  </div>
</body>
</html>
 `

 win.document.open()
 win.document.write(html)
 win.document.close()
}
