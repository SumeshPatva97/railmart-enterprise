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
    from: process.env.EMAIL_FROM || '"D ENTERPRISE TEAM" <denterprisesteam@gmail.com>',
    to,
    subject: 'D ENTERPRISE TEAM - Password Reset OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
        <div style="text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 15px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">D <span style="color: #f59e0b;">ENTERPRISE</span> TEAM</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">Official IRCTC High-Speed Tatkal Ticket Booking Software & Extensions</p>
        </div>
        <div style="padding: 24px 0;">
          <h2 style="color: #f8fafc; font-size: 18px;">Hello ${name},</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">You requested a password reset or security verification for your account. Please use the following 6-digit One-Time Password (OTP) code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #f59e0b; background: #1e293b; padding: 14px 32px; border-radius: 10px; border: 1px dashed #f59e0b; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">This OTP code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        </div>
        <div style="border-top: 1px solid #1e293b; padding-top: 15px; text-align: center; color: #64748b; font-size: 12px;">
          &copy; ${new Date().getFullYear()} D ENTERPRISE TEAM (denterpriese.softvps.in). All rights reserved.<br/>
          Support Desk: +91 8521012621 | denterprisesteam@gmail.com
        </div>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[SMTP MOCK EMAIL] OTP for ${to}: ${otp} (From: D ENTERPRISE TEAM <denterprisesteam@gmail.com>)`);
    }
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(to: string, orderDetails: any) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"D ENTERPRISE TEAM" <denterprisesteam@gmail.com>',
    to,
    subject: `D ENTERPRISE TEAM - Order Confirmation #${orderDetails.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
        <div style="text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 15px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">D <span style="color: #f59e0b;">ENTERPRISE</span> TEAM</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">Order Receipt & Instant Activation</p>
        </div>
        <div style="padding: 24px 0;">
          <h2 style="color: #10b981;">Thank you for your order!</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Order Number: <strong style="color: #ffffff;">#${orderDetails.orderNumber}</strong></p>
          <p style="color: #cbd5e1; font-size: 14px;">Total Amount: <strong style="color: #f59e0b;">₹${orderDetails.totalAmount}</strong></p>
          <p style="color: #cbd5e1; font-size: 14px;">Payment Method: <strong style="color: #ffffff;">${orderDetails.paymentMethod}</strong></p>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 15px;">Your Tatkal software license key and installation instructions are active in your D ENTERPRISE TEAM account dashboard.</p>
        </div>
        <div style="border-top: 1px solid #1e293b; padding-top: 15px; text-align: center; color: #64748b; font-size: 12px;">
          &copy; ${new Date().getFullYear()} D ENTERPRISE TEAM (denterpriese.softvps.in). All rights reserved.<br/>
          Support Desk: +91 8521012621 | denterprisesteam@gmail.com
        </div>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[SMTP MOCK EMAIL] Order Confirmation sent to ${to} for #${orderDetails.orderNumber} (From: D ENTERPRISE TEAM)`);
    }
    return true;
  } catch (error) {
    console.error('Error sending Order email:', error);
    return false;
  }
}
