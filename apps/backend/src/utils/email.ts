/**
 * @file email.ts
 * @description Nodemailer email sender with HTML templates for:
 *   - Email verification
 *   - Password reset
 *   - Order confirmation
 *
 * Uses a transport singleton to reuse SMTP connections efficiently.
 */

import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/env';
import { logger } from './logger';

// ── Transport Singleton ─────────────────────────────────────────────────────

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }
  return transporter;
}

// ── Base HTML Template ──────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LuxeCart</title>
    </head>
    <body style="margin:0;padding:0;background:#0F0F13;font-family:'Inter',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#1A1A24;border-radius:16px;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#6366F1,#4F46E5);padding:32px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-1px;">✨ LuxeCart</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Premium E-Commerce Platform</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px 32px;color:#E5E7EB;font-size:15px;line-height:1.7;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;color:rgba(255,255,255,0.3);font-size:12px;">
                  © ${new Date().getFullYear()} LuxeCart Inc. All rights reserved.
                  <br>If you didn't request this email, please ignore it.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim();
}

// ── Email Interface ─────────────────────────────────────────────────────────

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  try {
    const info = await getTransporter().sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });
    logger.info(`[Email] Sent to ${to}: ${info.messageId}`);
  } catch (err) {
    logger.error(`[Email] Failed to send to ${to}:`, err);
    throw err;
  }
}

// ── Email Templates ─────────────────────────────────────────────────────────

/**
 * Send account email verification link.
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string
): Promise<void> {
  const html = baseTemplate(`
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;">Welcome to LuxeCart, ${name}! 🎉</h2>
    <p style="margin:0 0 24px;">
      Thank you for creating your account. Please verify your email address to unlock
      all features including order tracking, wishlists, and exclusive member offers.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${verificationUrl}"
        style="display:inline-block;background:linear-gradient(135deg,#6366F1,#4F46E5);
               color:#ffffff;font-weight:700;font-size:16px;text-decoration:none;
               padding:14px 36px;border-radius:12px;letter-spacing:0.3px;">
        Verify Email Address
      </a>
    </div>
    <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">
      This link expires in <strong style="color:#F59E0B;">24 hours</strong>.
      If you didn't create an account, you can safely ignore this email.
    </p>
  `);

  await sendEmail({
    to,
    subject: 'Verify your LuxeCart account',
    html,
  });
}

/**
 * Send password reset link.
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
): Promise<void> {
  const html = baseTemplate(`
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;">Password Reset Request 🔐</h2>
    <p style="margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
    <p style="margin:0 0 24px;">
      We received a request to reset the password for your LuxeCart account.
      Click the button below to set a new password. This link is valid for <strong style="color:#F59E0B;">1 hour</strong>.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}"
        style="display:inline-block;background:linear-gradient(135deg,#F59E0B,#D97706);
               color:#ffffff;font-weight:700;font-size:16px;text-decoration:none;
               padding:14px 36px;border-radius:12px;">
        Reset My Password
      </a>
    </div>
    <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">
      If you didn't request a password reset, please ignore this email. Your account is safe.
    </p>
  `);

  await sendEmail({
    to,
    subject: 'Reset your LuxeCart password',
    html,
  });
}

/**
 * Send order confirmation email.
 */
export async function sendOrderConfirmationEmail(
  to: string,
  name: string,
  orderId: string,
  orderTotal: string
): Promise<void> {
  const html = baseTemplate(`
    <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;">Order Confirmed! 📦</h2>
    <p style="margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
    <p style="margin:0 0 24px;">
      Thank you for your purchase! Your order <strong style="color:#6366F1;">#${orderId}</strong>
      has been confirmed and is being processed.
    </p>
    <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:20px;margin:24px 0;">
      <table width="100%">
        <tr>
          <td style="color:rgba(255,255,255,0.6);font-size:13px;">Order ID</td>
          <td style="color:#ffffff;font-weight:700;text-align:right;">#${orderId}</td>
        </tr>
        <tr>
          <td style="color:rgba(255,255,255,0.6);font-size:13px;padding-top:8px;">Total Amount</td>
          <td style="color:#F59E0B;font-weight:800;font-size:18px;text-align:right;padding-top:8px;">${orderTotal}</td>
        </tr>
      </table>
    </div>
    <p style="color:rgba(255,255,255,0.5);font-size:13px;">
      You'll receive another email when your order ships with tracking information.
    </p>
  `);

  await sendEmail({
    to,
    subject: `Order Confirmed — #${orderId} | LuxeCart`,
    html,
  });
}
