import nodemailer from "nodemailer";

const emailResetPassword = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const {name, email, token} = datos;

    const info = await transport.sendMail({
        from: "APV - Veterinary Patients Manager",
        to: email,
        subject: 'Reset your password in APV',
        text: 'Reset your password in APV',
        html: `<p>Hello ${name}, you have requested to reset your password. Please click the following link to reset your password: <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a></p>
        
        <p>If you didn't request this password reset, you can ignore this message</p>
        `,
    })

    console.log("Message send: %s", info.messageId)
    
}

export default emailResetPassword