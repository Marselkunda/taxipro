// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize");
// const { body, validationResult } = require("express-validator");
// const axios = require("axios");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// // Sanitize input
// app.use((req, res, next) => {
//   if (req.body) req.body = mongoSanitize.sanitize(req.body);
//   if (req.params) req.params = mongoSanitize.sanitize(req.params);
//   next();
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB error:", err));

// // Schema
// const clientSchema = new mongoose.Schema({
//   firstName: String,
//   surname: String,
//   companyName: String,
//   organizationNumber: String,
//   address: String,
//   postalNumber: String,
//   city: String,
//   tel: String,
//   email: { type: String, unique: true },
//   membershipType: { type: String, enum: ["basic", "standard", "professional", "premium"] },
//   paymentMethod: String,
//   message: String,
//   acceptTerms: Boolean,
//   receiveNews: Boolean,
// });

// const Client = mongoose.model("Client", clientSchema);

// // Registration + Email
// app.post(
//   "/api/register",
//   [
//     body("email").isEmail().normalizeEmail(),
//     body("firstName").trim().notEmpty().escape(),
//     body("surname").trim().notEmpty().escape(),
//     body("companyName").trim().notEmpty().escape(),
//     body("organizationNumber").trim().notEmpty().escape(),
//     body("address").trim().notEmpty().escape(),
//     body("postalNumber").trim().notEmpty().escape(),
//     body("city").trim().notEmpty().escape(),
//     body("tel").trim().notEmpty().escape(),
//     body("membershipType").isIn(["basic", "standard", "professional", "premium"]),
//     body("paymentMethod").trim().notEmpty().escape(),
//     body("acceptTerms").equals("true"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log("Validation errors:", errors.array());  // <-- Added for debugging
//       return res.status(400).json({ message: "Invalid input", errors: errors.array() });
//     }

//     try {
//       const { email } = req.body;

//       // 1️⃣ Check if client already exists
//       const existingClient = await Client.findOne({ email });
//       if (existingClient) {
//         return res.status(400).json({ message: "Client with this email already exists" });
//       }

//       // 2️⃣ Save to DB
//       const client = new Client({
//         ...req.body,
//         acceptTerms: true,  // store as boolean true
//         receiveNews: req.body.receiveNews === true || req.body.receiveNews === "true",
//       });
//       await client.save();

//       // 3️⃣ Prepare Email Payload
//       const v = req.body;

//       const emailData = {
//   subject: "New customer",
//   body: `
//     <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9; border-radius: 8px;">
//       <h2 style="color: #ffc001; margin-bottom: 20px;">New Customer Registration</h2>
//       <table style="width: 100%; border-collapse: collapse;">
//         <tbody>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; width: 180px;">First Name:</td>
//             <td style="padding: 8px;">${v.firstName}</td>
//           </tr>
//           <tr style="background-color: #fff;">
//             <td style="padding: 8px; font-weight: bold;">Last Name:</td>
//             <td style="padding: 8px;">${v.surname}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold;">Company Name:</td>
//             <td style="padding: 8px;">${v.companyName}</td>
//           </tr>
//           <tr style="background-color: #fff;">
//             <td style="padding: 8px; font-weight: bold;">Organization Number:</td>
//             <td style="padding: 8px;">${v.organizationNumber}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold;">Address:</td>
//             <td style="padding: 8px;">${v.address}</td>
//           </tr>
//           <tr style="background-color: #fff;">
//             <td style="padding: 8px; font-weight: bold;">Postal Number:</td>
//             <td style="padding: 8px;">${v.postalNumber}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold;">City:</td>
//             <td style="padding: 8px;">${v.city}</td>
//           </tr>
//           <tr style="background-color: #fff;">
//             <td style="padding: 8px; font-weight: bold;">Telephone:</td>
//             <td style="padding: 8px;">${v.tel}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold;">Email:</td>
//             <td style="padding: 8px;">${v.email}</td>
//           </tr>
//           <tr style="background-color: #fff;">
//             <td style="padding: 8px; font-weight: bold;">Subscription:</td>
//             <td style="padding: 8px; text-transform: capitalize;">${v.membershipType}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold;">Payment Method:</td>
//             <td style="padding: 8px;">${v.paymentMethod}</td>
//           </tr>
//           <tr style="background-color: #fff;">
//             <td style="padding: 8px; font-weight: bold;">Comment:</td>
//             <td style="padding: 8px;">${v.message || "N/A"}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold;">Accept Emails:</td>
//             <td style="padding: 8px;">${v.receiveNews ? "Yes" : "No"}</td>
//           </tr>
//         </tbody>
//       </table>
//       <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
//         This email was automatically generated by TaxiPro.
//       </p>
//     </div>
//   `,
//   emails: ["Kund@taxipro.se"],
// };


//       // 4️⃣ Send Email
//       let emailSent = false;
//       try {
//         const emailResponse = await axios.post(
//           process.env.TAXIPRO_EMAIL_API,
//           emailData,
//           { headers: { "Content-Type": "application/json" } }
//         );
//         if (emailResponse.status === 200) {
//           emailSent = true;
//           console.log("✅ Email sent successfully.");  // <-- Added success log here
//         }
//       } catch (emailError) {
//         console.error("Email sending failed:", emailError.response?.data || emailError.message);
//       }

//       // 5️⃣ Respond based on result
//       if (emailSent) {
//         return res.status(201).json({ message: "Registration successful & email sent" });
//       } else {
//         return res.status(201).json({ message: "Registration successful, but email could not be sent" });
//       }
//     } catch (error) {
//       console.error("Error:", error.response?.data || error.message);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );



// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize");
// const { body, validationResult } = require("express-validator");
// const axios = require("axios");

// const app = express();

// // Trust the first proxy (Vercel)
// app.set("trust proxy", 1);

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(express.json());

// // Sanitize input
// app.use((req, res, next) => {
//   if (req.body) req.body = mongoSanitize.sanitize(req.body);
//   if (req.params) req.params = mongoSanitize.sanitize(req.params);
//   next();
// });

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// // Connect to MongoDB
// if (!mongoose.connection.readyState) {
//   mongoose
//     .connect(process.env.MONGODB_URI)
//     .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.error("MongoDB connection error:", err));
// }

// // Client schema
// const clientSchema = new mongoose.Schema({
//   firstName: String,
//   surname: String,
//   companyName: String,
//   organizationNumber: String,
//   address: String,
//   postalNumber: String,
//   city: String,
//   tel: String,
//   email: { type: String, unique: true },
//   membershipType: {
//     type: String,
//     enum: ["TaxiPro S", "TaxiPro M", "TaxiPro L", "Obegränsad"],
//   },
//   paymentMethod: String,
//   message: String,
//   acceptTerms: Boolean,
//   receiveNews: Boolean,
// });

// const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

// // Registration route
// app.post(
//   "/api/register",
//   [
//     body("email").isEmail().normalizeEmail(),
//     body("firstName").trim().notEmpty().escape(),
//     body("surname").trim().notEmpty().escape(),
//     body("companyName").trim().notEmpty().escape(),
//     body("organizationNumber").trim().notEmpty().escape(),
//     body("address").trim().notEmpty().escape(),
//     body("postalNumber").trim().notEmpty().escape(),
//     body("city").trim().notEmpty().escape(),
//     body("tel").trim().notEmpty().escape(),
//     body("membershipType").isIn([
//       "TaxiPro S",
//       "TaxiPro M",
//       "TaxiPro L",
//       "Obegränsad",
//     ]),
//     body("paymentMethod").trim().notEmpty().escape(),
//     body("acceptTerms").equals("true"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log("Validation errors:", errors.array());
//       return res
//         .status(400)
//         .json({ message: "Invalid input", errors: errors.array() });
//     }

//     try {
//       const {
//         email,
//         firstName,
//         surname,
//         companyName,
//         organizationNumber,
//         address,
//         postalNumber,
//         city,
//         tel,
//         membershipType,
//         paymentMethod,
//       } = req.body;

//       // Check for existing client
//       const existingClient = await Client.findOne({ email });
//       if (existingClient) {
//         return res
//           .status(400)
//           .json({ message: "Client with this email already exists" });
//       }

//       // Save client
//       const client = new Client({
//         ...req.body,
//         acceptTerms: true,
//         receiveNews:
//           req.body.receiveNews === true || req.body.receiveNews === "true",
//       });
//       await client.save();

//       // Email styling
//       const primaryColor = "#ffc001";
//       const borderRadius = "8px";

//       // Responsive style block
//       const emailStyles = `
//         <style>
//           @media only screen and (max-width: 600px) {
//             table[class="main"] {
//               width: 100% !important;
//             }
//             td[class="content"] {
//               padding: 15px !important;
//               font-size: 14px !important;
//             }
//             td[class="header"] {
//               font-size: 18px !important;
//               padding: 10px !important;
//             }
//             img[class="logo"] {
//               max-width: 150px !important;
//             }
//           }
//         </style>
//       `;

//       const companyEmailHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>${emailStyles}</head>
//       <body style="margin:0; padding:0; background:#f8f8f8;">
//         <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: ${borderRadius}; overflow: hidden; border: 1px solid #ddd;">
//           <tr style="background: ${primaryColor}; color: #000; text-align: center;">
//             <td class="header" style="padding: 15px; font-size: 20px; font-weight: bold;">🚖 New TaxiPro Registration</td>
//           </tr>
//           <tr>
//             <td class="content" style="padding: 20px; font-size: 16px; color: #333;">
//               <p>A new customer has registered:</p>
//               <ul style="line-height: 1.6; padding-left: 20px;">
//                 <li><strong>Name:</strong> ${firstName} ${surname}</li>
//                 <li><strong>Company:</strong> ${companyName}</li>
//                 <li><strong>Org Number:</strong> ${organizationNumber}</li>
//                 <li><strong>Address:</strong> ${address}, ${postalNumber}, ${city}</li>
//                 <li><strong>Phone:</strong> ${tel}</li>
//                 <li><strong>Email:</strong> ${email}</li>
//                 <li><strong>Membership:</strong> ${membershipType}</li>
//                 <li><strong>Payment Method:</strong> ${paymentMethod}</li>
//               </ul>
//             </td>
//           </tr>
//         </table>
//       </body>
//       </html>
//       `;

//       const customerEmailHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>${emailStyles}</head>
//       <body style="margin:0; padding:0; background:#f8f8f8;">
//         <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: ${borderRadius}; overflow: hidden; border: 1px solid #ddd;">
//           <tr style="background: ${primaryColor}; color: #000; text-align: center;">
//             <td class="header" style="padding: 15px; font-size: 22px; font-weight: bold;">🚖 Welcome to TaxiPro</td>
//           </tr>
//           <tr>
//             <td class="content" style="padding: 20px; font-size: 16px; color: #333; text-align: left;">
//               <p>Hi <strong>${firstName}</strong>,</p>
//               <p>Thank you for registering with <strong>TaxiPro</strong>! We’re excited to have you onboard.</p>
//               <p>Your membership: <strong style="color:${primaryColor};">${membershipType.toUpperCase()}</strong></p>
//               <p>We look forward to helping you manage your taxi services smoothly and efficiently.</p>
//               <p style="margin-top: 20px;">🚕 Drive safe,<br>The TaxiPro Team</p>
//               <div style="text-align: center; margin-top: 30px;">
//                 <img class="logo" src="LOGO_URL_HERE" alt="TaxiPro Logo" style="max-width: 200px; width: 100%; height: auto;"/>
//               </div>
//             </td>
//           </tr>
//         </table>
//       </body>
//       </html>
//       `;

//       // Send company email
//       let companyEmailSent = false;
//       try {
//         const companyResponse = await axios.post(
//           process.env.TAXIPRO_EMAIL_API,
//           {
//             subject: "New TaxiPro Registration",
//             body: companyEmailHTML,
//             emails: ["Kund@taxipro.se"],
//           },
//           { headers: { "Content-Type": "application/json" } }
//         );
//         if (companyResponse.status === 200) companyEmailSent = true;
//       } catch (err) {
//         console.error("Company email send error:", err.message);
//       }

//       // Send customer email
//       let customerEmailSent = false;
//       try {
//         const customerResponse = await axios.post(
//           process.env.TAXIPRO_EMAIL_API,
//           {
//             subject: "Welcome to TaxiPro",
//             body: customerEmailHTML,
//             emails: [email],
//           },
//           { headers: { "Content-Type": "application/json" } }
//         );
//         if (customerResponse.status === 200) customerEmailSent = true;
//       } catch (err) {
//         console.error("Customer email send error:", err.message);
//       }

//       return res.status(201).json({
//         message: "Registration successful",
//         companyEmailSent,
//         customerEmailSent,
//       });
//     } catch (error) {
//       console.error("Registration error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

// // Local dev server
// if (require.main === module) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

// module.exports = app;

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { body, validationResult } = require("express-validator");
const axios = require("axios");

const app = express();

// Trust the first proxy (Vercel)
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Sanitize input
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Client schema
const clientSchema = new mongoose.Schema({
  firstName: String,
  surname: String,
  companyName: String,
  organizationNumber: String,
  address: String,
  postalNumber: String,
  city: String,
  tel: String,
  email: { type: String, unique: true },
  membershipType: {
    type: String,
    enum: ["TaxiPro S", "TaxiPro M", "TaxiPro L", "Obegränsad"],
  },
  paymentMethod: String,
  message: String,
  acceptTerms: Boolean,
  receiveNews: Boolean,
});

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

// Registration route
app.post(
  "/api/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("firstName").trim().notEmpty().escape(),
    body("surname").trim().notEmpty().escape(),
    body("companyName").trim().notEmpty().escape(),
    body("organizationNumber").trim().notEmpty().escape(),
    body("address").trim().notEmpty().escape(),
    body("postalNumber").trim().notEmpty().escape(),
    body("city").trim().notEmpty().escape(),
    body("tel").trim().notEmpty().escape(),
    body("membershipType").isIn([
      "TaxiPro S",
      "TaxiPro M",
      "TaxiPro L",
      "Obegränsad",
    ]),
    body("paymentMethod").trim().notEmpty().escape(),
    body("acceptTerms").equals("true"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res
        .status(400)
        .json({ message: "Invalid input", errors: errors.array() });
    }

    try {
      const {
        email,
        firstName,
        surname,
        companyName,
        organizationNumber,
        address,
        postalNumber,
        city,
        tel,
        membershipType,
        paymentMethod,
      } = req.body;

      // Check for existing client
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res
          .status(400)
          .json({ message: "Client with this email already exists" });
      }

      // Save client
      const client = new Client({
        ...req.body,
        acceptTerms: true,
        receiveNews:
          req.body.receiveNews === true || req.body.receiveNews === "true",
      });
      await client.save();

      // Style config
      const brandColor = "#ffc001";
      const textColor = "#555";
      const bgColor = "#f8f8f8";

      // Responsive style block
      const emailStyles = `
        <style>
          @media only screen and (max-width: 600px) {
            .main { width: 100% !important; }
            .content { padding: 15px !important; font-size: 15px !important; }
            .header { font-size: 18px !important; padding: 12px !important; }
            .logo { max-width: 140px !important; }
          }
        </style>
      `;

      const customerEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>${emailStyles}</head>
      <body style="margin:0; padding:0; background:${bgColor}; font-family: Arial, sans-serif;">
        <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">
          <tr>
            <td class="header" style="background: ${brandColor}; color: #fff4b2; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">Welcome to TaxiPro</td>
          </tr>
          <tr>
            <td class="content" style="padding: 25px; font-size: 16px; color: ${textColor}; line-height: 1.6;">
              <p>Hi <span style="font-weight:500;">${firstName}</span>,</p>
              <p>Thank you for joining <span style="font-weight:500;">TaxiPro</span>! 🚖</p>
              <p>Your membership: <span style="color:${brandColor}; font-weight:600;">${membershipType}</span></p>
              <p>We’re excited to support you in managing your taxi services efficiently.</p>
              <p style="margin-top: 25px;">Best regards,<br>The TaxiPro Team</p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center; padding: 20px; background:#fff;">
              <img class="logo" src="https://taxiprose.vercel.app/TaxiPro.png" alt="TaxiPro Logo" style="max-width: 160px; height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="background:#fafafa; padding: 15px; font-size: 12px; color: #888; text-align: center;">
              © ${new Date().getFullYear()} TaxiPro. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;

      const companyEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>${emailStyles}</head>
      <body style="margin:0; padding:0; background:${bgColor}; font-family: Arial, sans-serif;">
        <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">
          <tr>
            <td class="header" style="background: ${brandColor}; color: #222; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">New Customer Registration</td>
          </tr>
          <tr>
            <td class="content" style="padding: 20px; font-size: 15px; color: ${textColor}; line-height: 1.6;">
              <p>A new customer has registered:</p>
              <ul style="padding-left:18px;">
                <li><span style="font-weight:500;">Name:</span> ${firstName} ${surname}</li>
                <li><span style="font-weight:500;">Company:</span> ${companyName}</li>
                <li><span style="font-weight:500;">Org Number:</span> ${organizationNumber}</li>
                <li><span style="font-weight:500;">Address:</span> ${address}, ${postalNumber}, ${city}</li>
                <li><span style="font-weight:500;">Phone:</span> ${tel}</li>
                <li><span style="font-weight:500;">Email:</span> ${email}</li>
                <li><span style="font-weight:500;">Membership:</span> ${membershipType}</li>
                <li><span style="font-weight:500;">Payment Method:</span> ${paymentMethod}</li>
              </ul>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;

      // Send emails
      let companyEmailSent = false;
      let customerEmailSent = false;
      try {
        const companyResponse = await axios.post(
          process.env.TAXIPRO_EMAIL_API,
          { subject: "New TaxiPro Registration", body: companyEmailHTML, emails: ["Kund@taxipro.se"] },
          { headers: { "Content-Type": "application/json" } }
        );
        if (companyResponse.status === 200) companyEmailSent = true;
      } catch (err) { console.error("Company email error:", err.message); }

      try {
        const customerResponse = await axios.post(
          process.env.TAXIPRO_EMAIL_API,
          { subject: "Welcome to TaxiPro", body: customerEmailHTML, emails: [email] },
          { headers: { "Content-Type": "application/json" } }
        );
        if (customerResponse.status === 200) customerEmailSent = true;
      } catch (err) { console.error("Customer email error:", err.message); }

      return res.status(201).json({
        message: "Registration successful",
        companyEmailSent,
        customerEmailSent,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Local dev server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
