import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const verificationMail = async ({ email, name }, otp) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verification OTP for EMS",
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">EMS</a>
                        </div>
                        <p style="font-size:1.1em">Hi, <b>${name}</b></p>
                        <p>Thank you for choosing EMS. Use the following OTP to complete your Sign Up procedures. OTP is valid for 3 minutes.</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;border: solid 2px black">${otp}</h2>
                        <p style="font-size:0.9em;">Regards,<br />EMS</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>EMS Ltd</p>
                            <p>1600 Amphitheatre Parkway</p>
                            <p>California</p>
                        </div>
                    </div>
                </div>`,
  };

  await transporter.sendMail(mailOptions);
};
