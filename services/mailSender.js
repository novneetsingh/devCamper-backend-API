const nodemailer = require("nodemailer");

// Function to send an email
exports.mailSender = async ({ email, subject, body }) => {
  try {
    // Create a transporter object for sending emails
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // SMTP server hostname
      auth: {
        user: process.env.MAIL_USER, // User for authentication
        pass: process.env.MAIL_PASS, // Password for authentication
      },
    });

    // Send the email
    let info = await transporter.sendMail({
      from: `"DevCamper Api by Novneet" <${process.env.MAIL_USER}>`, // Sender's email address
      to: `${email}`, // Recipient's email address
      subject: `${subject}`, // Email subject
      html: `${body}`, // HTML content of the email body
    });

    // Return information about the sent email
    return info;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
