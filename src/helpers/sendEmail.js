const nodemailer = require("nodemailer");

const sendEmail = async(mail,subject,text)=>{
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.user,
        pass: process.env.pass
        },
        });
        await transporter.sendMail({
            from: process.env.user,
            to: mail,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
}

module.exports = sendEmail;