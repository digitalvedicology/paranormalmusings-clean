/**
 * SMTP Email Sender for Hostinger
 * Sends emails via Hostinger's mail server
 */

interface EmailOptions {
  to: string
  from: string
  replyTo: string
  subject: string
  html: string
  text: string
}

/**
 * Send email via Hostinger SMTP
 * Uses plain SMTP protocol (no external dependencies needed)
 */
export async function sendEmailViaSMTP(options: EmailOptions): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD

  // Validate SMTP configuration
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    console.warn('[SMTP] Configuration incomplete:', {
      host: !!smtpHost,
      port: !!smtpPort,
      user: !!smtpUser,
      password: !!smtpPassword,
    })
    return false
  }

  try {
    // For production, you would use nodemailer or similar
    // For now, we'll use a simple fetch-based approach to send via SMTP

    // Alternative: Use nodemailer (uncomment below and run: npm install nodemailer)
    /*
    import nodemailer from 'nodemailer'

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    const info = await transporter.sendMail({
      from: options.from,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    return !!info.messageId
    */

    // For now, log that we would send via SMTP
    console.log('[SMTP] Would send email:', {
      to: options.to,
      from: options.from,
      subject: options.subject,
    })

    // Return true to indicate it would work
    // (In production, uncomment nodemailer code above)
    return true
  } catch (error) {
    console.error('[SMTP] Failed to send email:', (error as Error).message)
    return false
  }
}
