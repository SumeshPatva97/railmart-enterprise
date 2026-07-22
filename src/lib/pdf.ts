import { formatCurrency, formatDate } from './utils';

export function generateInvoiceHTML(order: any): string {
  const shipping = JSON.parse(order.shippingAddress || '{}');
  const items = order.items || [];

  const itemsRows = items
    .map(
      (item: any, index: number) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${index + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.product?.name || 'Railway Spares'}</strong><br/>
          <small style="color: #666;">SKU: ${item.product?.sku || 'N/A'}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Tax Invoice - ${order.orderNumber}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 20px; font-size: 14px; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0c8de4; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #0c8de4; text-transform: uppercase; }
        .invoice-details { text-align: right; }
        .address-section { display: flex; justify-content: space-between; margin: 30px 0; }
        .address-box { width: 48%; background: #f8fafc; padding: 15px; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #0c8de4; color: #fff; padding: 10px; text-align: left; }
        .totals { margin-top: 20px; text-align: right; }
        .totals-table { width: 300px; margin-left: auto; }
        .footer { margin-top: 50px; text-align: center; border-top: 1px solid #eee; padding-top: 15px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="logo">RailMart Enterprise</div>
            <p style="margin: 5px 0 0; color: #666;">GSTIN: 07AAACR9821R1ZX | ISO 9001:2015 Certified</p>
          </div>
          <div class="invoice-details">
            <h2 style="margin:0; color: #0c8de4;">TAX INVOICE</h2>
            <p style="margin: 5px 0 0;"><strong>Invoice #:</strong> ${order.orderNumber}</p>
            <p style="margin: 5px 0 0;"><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div class="address-section">
          <div class="address-box">
            <h4 style="margin-top:0; color: #0c8de4;">Billed & Shipped To:</h4>
            <p style="margin: 3px 0;"><strong>${shipping.fullName || order.user?.name}</strong></p>
            <p style="margin: 3px 0;">${shipping.street || ''}</p>
            <p style="margin: 3px 0;">${shipping.city || ''}, ${shipping.state || ''} - ${shipping.zipCode || ''}</p>
            <p style="margin: 3px 0;">Phone: ${shipping.phone || ''}</p>
          </div>
          <div class="address-box">
            <h4 style="margin-top:0; color: #0c8de4;">Supplier Info:</h4>
            <p style="margin: 3px 0;"><strong>RailMart Equipment Pvt Ltd</strong></p>
            <p style="margin: 3px 0;">Plot 42, Railway Industrial Zone, Station Road</p>
            <p style="margin: 3px 0;">New Delhi, 110001, India</p>
            <p style="margin: 3px 0;">Support: +91 11 4567 8900</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: center;">#</th>
              <th>Item & Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="totals">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">${formatCurrency(order.subtotal)}</td>
            </tr>
            <tr>
              <td>GST (18%):</td>
              <td style="text-align: right;">${formatCurrency(order.taxAmount)}</td>
            </tr>
            <tr>
              <td>Shipping Charges:</td>
              <td style="text-align: right;">${formatCurrency(order.shippingFee)}</td>
            </tr>
            ${
              order.discountAmount > 0
                ? `<tr><td>Discount Applied:</td><td style="text-align: right; color: green;">-${formatCurrency(
                    order.discountAmount
                  )}</td></tr>`
                : ''
            }
            <tr style="font-weight: bold; font-size: 16px; border-top: 2px solid #0c8de4;">
              <td style="padding-top: 10px;">Grand Total:</td>
              <td style="padding-top: 10px; text-align: right; color: #0c8de4;">${formatCurrency(
                order.totalAmount
              )}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>This is a computer-generated tax invoice and requires no physical signature.</p>
          <p>RailMart Enterprise &bull; www.railmart-enterprise.com &bull; support@railmart.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
