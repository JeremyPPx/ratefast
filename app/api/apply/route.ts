import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, company, email, phone, city, message } = await request.json();

    if (!name || !company || !email || !city) {
      return NextResponse.json(
        { error: 'Name, company, email and city are required fields' },
        { status: 400 }
      );
    }

    // Log the application details on the server console
    console.log('==================================================');
    console.log('NEW PARTNER APPLICATION RECEIVED (RateFast)');
    console.log(`Company: ${company}`);
    console.log(`Contact: ${name} (${email})`);
    console.log(`Phone: ${phone || 'Not provided'}`);
    console.log(`Location: ${city}`);
    console.log(`Message: ${message || 'No message'}`);
    console.log('==================================================');

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || '587';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'admin@tekkersclub.de';

    // Verify SMTP settings are configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('⚠️ SMTP settings are missing. Email cannot be sent.');
      console.warn('Set SMTP_HOST, SMTP_USER, and SMTP_PASS in environment variables.');
      
      // Return success gracefully to avoid blocking the frontend
      return NextResponse.json({
        success: true,
        sent: false,
        message: 'Application logged. SMTP environment variables not configured.'
      });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const emailSubject = `Neue RateFast Partner-Bewerbung von ${company}`;
    const emailBodyHtml = `
      <div style="font-family: sans-serif; max-width: 600px; color: #333;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Neue RateFast Partner-Bewerbung</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 180px;">Unternehmen:</td>
            <td style="padding: 8px 0;">${company}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Ansprechpartner:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">E-Mail:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Telefon:</td>
            <td style="padding: 8px 0;">${phone || 'Nicht angegeben'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Stadt:</td>
            <td style="padding: 8px 0;">${city}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; padding: 15px; bg-color: #f9f9f9; border-radius: 8px; border: 1px solid #eaeaea;">
          <h4 style="margin-top: 0; color: #555;">Nachricht / Wünsche:</h4>
          <p style="margin-bottom: 0; white-space: pre-wrap; font-style: italic;">${message || 'Keine Nachricht hinterlassen.'}</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin-top: 40px;" />
        <p style="font-size: 11px; color: #888; text-align: center;">Diese Mail wurde automatisch von RateFast generiert.</p>
      </div>
    `;

    // Dispatch the email
    await transporter.sendMail({
      from: smtpFrom,
      to: 'admin@tekkersclub.de',
      subject: emailSubject,
      html: emailBodyHtml,
    });

    console.log('✅ Application email sent successfully to admin@tekkersclub.de');
    return NextResponse.json({
      success: true,
      sent: true,
    });

  } catch (error: any) {
    console.error('❌ Error processing application form:', error);
    return NextResponse.json(
      { error: 'Server error processing application' },
      { status: 500 }
    );
  }
}
