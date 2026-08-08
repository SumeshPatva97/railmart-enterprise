import { formatCurrency, formatDate } from './utils';

export function generateInvoiceHTML(order: any): string {
  const itemsRows = order.items
    .map(
      (item: any, index: number) => `
      <tr>
        <td style="text-align: center;">${index + 1}</td>
        <td>
          <strong>${item.product?.name || 'Railway Equipment'}</strong><br/>
          <small style="color: #64748b;">SKU: ${item.product?.sku || 'N/A'}</small>
        </td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatCurrency(item.price)}</td>
        <td style="text-align: right; font-weight: bold;">${formatCurrency(item.price * item.quantity)}</td>
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
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 40px; background: #fff; }
        .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-b: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
        .company-title { font-size: 24px; font-weight: 800; color: #026fc3; margin: 0; }
        .invoice-title { font-size: 20px; font-weight: bold; text-align: right; color: #0f172a; margin: 0; }
        .details-grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .details-block { width: 48%; }
        .details-block h4 { margin: 0 0 8px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .details-block p { margin: 0; font-size: 13px; line-height: 1.5; color: #334155; }
        table.items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
        table.items-table th { background: #f8fafc; color: #475569; font-weight: bold; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
        table.items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .totals { display: flex; justify-content: flex-end; }
        .totals-table { width: 300px; font-size: 13px; }
        .totals-table td { padding: 6px 0; }
        .footer-note { margin-top: 40px; border-t: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div>
          <h1 class="company-title">D ENTERPRISE TEAM</h1>
          <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Official IRCTC Tatkal Software & Extension Portal</p>
        </div>
        <div>
          <h2 class="invoice-title">OFFICIAL INVOICE</h2>
          <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0; text-align: right;">Invoice #: <strong>${order.orderNumber}</strong></p>
          <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0; text-align: right;">Date: ${formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div class="details-grid">
        <div class="details-block">
          <h4>Billed To / Shipping Site</h4>
          <p><strong>${order.shippingAddress?.fullName || order.user?.name}</strong></p>
          <p>${order.shippingAddress?.street || 'Site Dispatch Address'}</p>
          <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}</p>
          <p>Phone: ${order.shippingAddress?.phone || order.user?.email}</p>
        </div>
        <div class="details-block" style="text-align: right;">
          <h4>Order Specifications</h4>
          <p>Payment Method: <strong>${order.paymentMethod}</strong></p>
          <p>Payment Status: <strong>${order.paymentStatus}</strong></p>
          <p>Fulfillment Status: <strong>${order.status}</strong></p>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th>Item Description</th>
            <th style="width: 60px; text-align: center;">Qty</th>
            <th style="width: 100px; text-align: right;">Unit Price</th>
            <th style="width: 100px; text-align: right;">Amount</th>
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
          <tr style="font-weight: bold; font-size: 16px; border-top: 2px solid #026fc3;">
            <td style="padding-top: 10px;">Grand Total:</td>
            <td style="padding-top: 10px; text-align: right; color: #026fc3;">${formatCurrency(
              order.totalAmount
            )}</td>
          </tr>
        </table>
      </div>

      <div class="footer-note">
        <p>This is a computer-generated invoice. Thank you for choosing D ENTERPRISE TEAM.</p>
        <p>Support: +66805849689 | Domain: denterpriese.softvps.in</p>
      </div>
    </body>
    </html>
  `;
}
