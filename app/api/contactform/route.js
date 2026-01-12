import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, spam_detection } = body;

    if (spam_detection && spam_detection.length > 0) {
      // Detected as bot
      return NextResponse.json({ message: "Spam detected" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // Using 'service' is easier for Gmail
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${name}" <${process.env.SMPT_USER}>`, // Best practice: send from your own authenticated email
      to: "u2023243@giki.edu.pk", // Usually, you want the contact form to email YOU
      replyTo: email, // This allows you to click 'Reply' to the user's email
      subject: `Contact Form: ${subject}`,
      text: message,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json(
      { message: "Email sent successfully", id: info.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
