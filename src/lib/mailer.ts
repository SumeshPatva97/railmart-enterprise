import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendOTPEmail(to: string, otp: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"RailMart Security" <auth@railmart.com>',
    to,
    subject: 'RailMart Account Verification - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #0c8de4; padding-bottom: 15px;">
          <h1 style="color: #0c8de4; margin: 0;">RailMart Enterprise</h1>
          <p style="color: #666; font-size: 14px;">Next-Gen Railway E-Commerce & Logistics</p>
        </div>
        <div style="padding: 20px 0;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p style="color: #555; font-size: 16px;">Use the following One-Time Password (OTP) to verify your account or authorize your login:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0c8de4; background: #e0effe; padding: 12px 28px; border-radius: 6px; border: 1px dashed #0c8de4;">${otp}</span>
          </div>
          <p style="color: #888; font-size: 14px;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
        </div>
        <div style="border-top: 1px solid #eeeeee; padding-top: 15px; text-align: center; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} RailMart Enterprise. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[SMTP MOCK EMAIL] OTP for ${to}: ${otp}`);
    }
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(to: string, orderDetails: any) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"RailMart Orders" <orders@railmart.com>',
    to,
    subject: `Order Confirmation - #${orderDetails.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #0c8de4;">Thank you for your order!</h2>
        <p>Order Number: <strong>${orderDetails.orderNumber}</strong></p>
        <p>Total Amount: <strong>₹${orderDetails.totalAmount}</strong></p>
        <p>Payment Method: <strong>${orderDetails.paymentMethod}</strong></p>
        <p>We are processing your order for dispatch. You can track your order status live on your RailMart account dashboard.</p>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[SMTP MOCK EMAIL] Order Confirmation sent to ${to} for #${orderDetails.orderNumber}`);
    }
    return true;
  } catch (error) {
    console.error('Error sending Order email:', error);
    return false;
  }
}
