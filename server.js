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

// // // Serve public folder for logo
// // app.use('/public', express.static('public'));

// const path = require('path');
// app.use('/public', express.static(path.join(__dirname, 'public')));

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
// // app.post(
// //   "/api/register",
// //   [
// //     body("email").isEmail().normalizeEmail(),
// //     body("firstName").trim().notEmpty().escape(),
// //     body("surname").trim().notEmpty().escape(),
// //     body("companyName").trim().notEmpty().escape(),
// //     body("organizationNumber").trim().notEmpty().escape(),
// //     body("address").trim().notEmpty().escape(),
// //     body("postalNumber").trim().notEmpty().escape(),
// //     body("city").trim().notEmpty().escape(),
// //     body("tel").trim().notEmpty().escape(),
// //     body("membershipType").isIn([
// //       "TaxiPro S",
// //       "TaxiPro M",
// //       "TaxiPro L",
// //       "Obegränsad",
// //     ]),
// //     body("paymentMethod").trim().notEmpty().escape(),
// //     body("acceptTerms").equals("true"),
// //   ],
// //   async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       console.log("Validation errors:", errors.array());
// //       return res
// //         .status(400)
// //         .json({ message: "Invalid input", errors: errors.array() });
// //     }

// //     try {
// //       const {
// //         email,
// //         firstName,
// //         surname,
// //         companyName,
// //         organizationNumber,
// //         address,
// //         postalNumber,
// //         city,
// //         tel,
// //         membershipType,
// //         paymentMethod,
// //       } = req.body;

// //       // Check for existing client
// //       const existingClient = await Client.findOne({ email });
// //       if (existingClient) {
// //         return res
// //           .status(400)
// //           .json({ message: "Client with this email already exists" });
// //       }

// //       // Save client
// //       const client = new Client({
// //         ...req.body,
// //         acceptTerms: true,
// //         receiveNews:
// //           req.body.receiveNews === true || req.body.receiveNews === "true",
// //       });
// //       await client.save();

// //       // Style config
// //       const brandColor = "#ffc001"; // banner background
// //       const headerTextColor = "#fff"; // light text on banner
// //       const textColor = "#555"; // normal text
// //       const bgColor = "#f8f8f8";

// //       // Responsive style block
// //       const emailStyles = `
// //         <style>
// //           @media only screen and (max-width: 600px) {
// //             .main { width: 100% !important; }
// //             .content { padding: 15px !important; font-size: 15px !important; }
// //             .header { font-size: 18px !important; padding: 12px !important; }
// //             .logo { max-width: 140px !important; }
// //           }
// //         </style>
// //       `;

// //       const customerEmailHTML = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>${emailStyles}</head>
// //       <body style="margin:0; padding:0; background:${bgColor}; font-family: Arial, sans-serif;">
// //         <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">
// //           <tr>
// //             <td class="header" style="background: ${brandColor}; color: ${headerTextColor}; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">
// //               Welcome to TaxiPro
// //             </td>
// //           </tr>
// //           <tr>
// //             <td class="content" style="padding: 25px; font-size: 16px; color: ${textColor}; line-height: 1.6;">
// //               <p>Hi <span style="font-weight:500;">${firstName}</span>,</p>
// //               <p>Thank you for joining <span style="font-weight:500;">TaxiPro</span>! 🚖</p>
// //               <p>Your membership: <span style="color:${brandColor}; font-weight:600;">${membershipType}</span></p>
// //               <p>We’re excited to support you in managing your taxi services efficiently.</p>
// //               <p style="margin-top: 25px;">Best regards,<br>The TaxiPro Team</p>
// //             </td>
// //           </tr>
// //           <tr>
// //             <td style="text-align:center; padding: 20px; background:#fff;">
// //               <img class="logo" src="https://taxipro-psi.vercel.app/public/TaxiPro.png" alt="TaxiPro Logo" style="max-width:160px; height:auto;" />
// //             </td>
// //           </tr>
// //           <tr>
// //             <td style="background:#fafafa; padding: 15px; font-size: 12px; color: #888; text-align: center;">
// //               © ${new Date().getFullYear()} TaxiPro. All rights reserved.
// //             </td>
// //           </tr>
// //         </table>
// //       </body>
// //       </html>
// //       `;

// //       const companyEmailHTML = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>${emailStyles}</head>
// //       <body style="margin:0; padding:0; background:${bgColor}; font-family: Arial, sans-serif;">
// //         <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">
// //           <tr>
// //             <td class="header" style="background: ${brandColor}; color: ${headerTextColor}; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">New Customer Registration</td>
// //           </tr>
// //           <tr>
// //             <td class="content" style="padding: 20px; font-size: 15px; color: ${textColor}; line-height: 1.6;">
// //               <p>A new customer has registered:</p>
// //               <ul style="padding-left:18px;">
// //                 <li><span style="font-weight:500;">First Name:</span> ${firstName}</li>
// //                 <li><span style="font-weight:500;">Surname:</span> ${surname}</li>
// //                 <li><span style="font-weight:500;">Company:</span> ${companyName}</li>
// //                 <li><span style="font-weight:500;">Org Number:</span> ${organizationNumber}</li>
// //                 <li><span style="font-weight:500;">Address:</span> ${address}, ${postalNumber}, ${city}</li>
// //                 <li><span style="font-weight:500;">Phone:</span> ${tel}</li>
// //                 <li><span style="font-weight:500;">Email:</span> ${email}</li>
// //                 <li><span style="font-weight:500;">Membership:</span> ${membershipType}</li>
// //                 <li><span style="font-weight:500;">Payment Method:</span> ${paymentMethod}</li>
// //                 <li><span style="font-weight:500;">Message:</span> ${message ? message : "(none provided)"}</li>
// //                 <li><span style="font-weight:500;">Receive Newsletters:</span> ${receiveNews ? "Yes" : "No"}</li>
// //                 <li><span style="font-weight:500;">Accepted Terms:</span> Yes</li>
// //               </ul>
// //             </td>
// //           </tr>
// //         </table>
// //       </body>
// //       </html>
// //       `;

// //       // Send emails
// //       let companyEmailSent = false;
// //       let customerEmailSent = false;
// //       try {
// //         const companyResponse = await axios.post(
// //           process.env.TAXIPRO_EMAIL_API,
// //           { subject: "New TaxiPro Registration", body: companyEmailHTML, emails: ["Kund@taxipro.se"] },
// //           { headers: { "Content-Type": "application/json" } }
// //         );
// //         if (companyResponse.status === 200) companyEmailSent = true;
// //       } catch (err) { console.error("Company email error:", err.message); }

// //       try {
// //         const customerResponse = await axios.post(
// //           process.env.TAXIPRO_EMAIL_API,
// //           { subject: "Welcome to TaxiPro", body: customerEmailHTML, emails: [email] },
// //           { headers: { "Content-Type": "application/json" } }
// //         );
// //         if (customerResponse.status === 200) customerEmailSent = true;
// //       } catch (err) { console.error("Customer email error:", err.message); }

// //       return res.status(201).json({
// //         message: "Registration successful",
// //         companyEmailSent,
// //         customerEmailSent,
// //       });
// //     } catch (error) {
// //       console.error("Registration error:", error);
// //       res.status(500).json({ message: "Internal server error" });
// //     }
// //   }
// // );


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

//       try {
//         await client.save();
//       } catch (err) {
//         if (err.code === 11000 && err.keyPattern.email) {
//           // Duplicate email error
//           return res
//             .status(400)
//             .json({ message: "Client with this email already exists" });
//         }
//         throw err; // rethrow other errors
//       }

//       // Respond immediately for faster frontend experience
//       res.status(201).json({ message: "Registration successful" });

//       // --- Send emails asynchronously in background ---
//       (async () => {
//         const brandColor = "#ffc001";
//         const headerTextColor = "#fff";
//         const textColor = "#555";
//         const bgColor = "#f8f8f8";

//         const emailStyles = `
//           <style>
//             @media only screen and (max-width: 600px) {
//               .main { width: 100% !important; }
//               .content { padding: 15px !important; font-size: 15px !important; }
//               .header { font-size: 18px !important; padding: 12px !important; }
//               .logo { max-width: 140px !important; }
//             }
//           </style>
//         `;

//         const customerEmailHTML = `
//           <!DOCTYPE html>
//           <html>
//           <head>${emailStyles}</head>
//           <body style="margin:0; padding:0; background:${bgColor}; font-family: Arial, sans-serif;">
//             <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">
//               <tr>
//                 <td class="header" style="background: ${brandColor}; color: ${headerTextColor}; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">
//                   Welcome to TaxiPro
//                 </td>
//               </tr>
//               <tr>
//                 <td class="content" style="padding: 25px; font-size: 16px; color: ${textColor}; line-height: 1.6;">
//                   <p>Hi <span style="font-weight:500;">${firstName}</span>,</p>
//                   <p>Thank you for joining <span style="font-weight:500;">TaxiPro</span>! 🚖</p>
//                   <p>Your membership: <span style="color:${brandColor}; font-weight:600;">${membershipType}</span></p>
//                   <p>We’re excited to support you in managing your taxi services efficiently.</p>
//                   <p style="margin-top: 25px;">Best regards,<br>The TaxiPro Team</p>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="text-align:center; padding: 20px; background:#fff;">
//                   <img class="logo" src="https://taxipro-psi.vercel.app/public/TaxiPro.png" alt="TaxiPro Logo" style="max-width:160px; height:auto;" />
//                 </td>
//               </tr>
//               <tr>
//                 <td style="background:#fafafa; padding: 15px; font-size: 12px; color: #888; text-align: center;">
//                   © ${new Date().getFullYear()} TaxiPro. All rights reserved.
//                 </td>
//               </tr>
//             </table>
//           </body>
//           </html>
//         `;

//         const companyEmailHTML = `
//           <!DOCTYPE html>
//           <html>
//           <head>${emailStyles}</head>
//           <body style="margin:0; padding:0; background:${bgColor}; font-family: Arial, sans-serif;">
//             <table class="main" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">
//               <tr>
//                 <td class="header" style="background: ${brandColor}; color: ${headerTextColor}; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">New Customer Registration</td>
//               </tr>
//               <tr>
//                 <td class="content" style="padding: 20px; font-size: 15px; color: ${textColor}; line-height: 1.6;">
//                   <p>A new customer has registered:</p>
//                   <ul style="padding-left:18px;">
//                     <li><span style="font-weight:500;">First Name:</span> ${firstName}</li>
//                     <li><span style="font-weight:500;">Surname:</span> ${surname}</li>
//                     <li><span style="font-weight:500;">Company:</span> ${companyName}</li>
//                     <li><span style="font-weight:500;">Org Number:</span> ${organizationNumber}</li>
//                     <li><span style="font-weight:500;">Address:</span> ${address}, ${postalNumber}, ${city}</li>
//                     <li><span style="font-weight:500;">Phone:</span> ${tel}</li>
//                     <li><span style="font-weight:500;">Email:</span> ${email}</li>
//                     <li><span style="font-weight:500;">Membership:</span> ${membershipType}</li>
//                     <li><span style="font-weight:500;">Payment Method:</span> ${paymentMethod}</li>
//                     <li><span style="font-weight:500;">Message:</span> ${req.body.message || "(none provided)"}</li>
//                     <li><span style="font-weight:500;">Receive Newsletters:</span> ${req.body.receiveNews ? "Yes" : "No"}</li>
//                     <li><span style="font-weight:500;">Accepted Terms:</span> Yes</li>
//                   </ul>
//                 </td>
//               </tr>
//             </table>
//           </body>
//           </html>
//         `;

//         try {
//           await axios.post(
//             process.env.TAXIPRO_EMAIL_API,
//             { subject: "New TaxiPro Registration", body: companyEmailHTML, emails: ["Kund@taxipro.se"] },
//             { headers: { "Content-Type": "application/json" } }
//           );
//         } catch (err) { console.error("Company email error:", err.message); }

//         try {
//           await axios.post(
//             process.env.TAXIPRO_EMAIL_API,
//             { subject: "Welcome to TaxiPro", body: customerEmailHTML, emails: [email] },
//             { headers: { "Content-Type": "application/json" } }
//           );
//         } catch (err) { console.error("Customer email error:", err.message); }
//       })();
//     } catch (error) {
//       console.error("Registration error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );



// // Local dev server
// if (require.main === module) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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

const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

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

app.post(
  "/api/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("firstName").trim().notEmpty().escape(),
    body("surname").trim().notEmpty().escape(),

    // Företagsnamn – allow letters, numbers, spaces, and special characters
    body("companyName")
      .trim()
      .matches(/^[a-zA-Z0-9\s'.,&()-]+$/)
      .withMessage("Invalid company name"),

    // Organisationsnummer, Postnummer, Telefon – allow numbers and "-"
    body("organizationNumber")
      .trim()
      .matches(/^[0-9-]+$/)
      .withMessage("Invalid organization number"),
    body("postalNumber")
      .trim()
      .matches(/^[0-9-]+$/)
      .withMessage("Invalid postal number"),
    body("tel")
      .trim()
      .matches(/^[0-9-]+$/)
      .withMessage("Invalid phone number"),

    body("address").trim().notEmpty().escape(),
    body("city").trim().notEmpty().escape(),
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

      try {
        await client.save();
      } catch (err) {
        if (err.code === 11000 && err.keyPattern.email) {
          return res
            .status(400)
            .json({ message: "Client with this email already exists" });
        }
        throw err;
      }

      res.status(201).json({ message: "Registration successful" });

      // --- Send emails asynchronously ---
      (async () => {
        const brandColor = "#ffc001";
        const headerTextColor = "#fff";
        const textColor = "#555";
        const bgColor = "#f8f8f8";

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
                <td class="header" style="background: ${brandColor}; color: ${headerTextColor}; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">
                  Welcome to TaxiPro
                </td>
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
                  <img class="logo" src="https://taxipro-psi.vercel.app/public/TaxiPro.png" alt="TaxiPro Logo" style="max-width:160px; height:auto;" />
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
                <td class="header" style="background: ${brandColor}; color: ${headerTextColor}; text-align: center; font-size: 20px; font-weight: 600; padding: 15px;">New Customer Registration</td>
              </tr>
              <tr>
                <td class="content" style="padding: 20px; font-size: 15px; color: ${textColor}; line-height: 1.6;">
                  <p>A new customer has registered:</p>
                  <ul style="padding-left:18px;">
                    <li><span style="font-weight:500;">First Name:</span> ${firstName}</li>
                    <li><span style="font-weight:500;">Surname:</span> ${surname}</li>
                    <li><span style="font-weight:500;">Company:</span> ${companyName}</li>
                    <li><span style="font-weight:500;">Org Number:</span> ${organizationNumber}</li>
                    <li><span style="font-weight:500;">Address:</span> ${address}, ${postalNumber}, ${city}</li>
                    <li><span style="font-weight:500;">Phone:</span> ${tel}</li>
                    <li><span style="font-weight:500;">Email:</span> ${email}</li>
                    <li><span style="font-weight:500;">Membership:</span> ${membershipType}</li>
                    <li><span style="font-weight:500;">Payment Method:</span> ${paymentMethod}</li>
                    <li><span style="font-weight:500;">Message:</span> ${req.body.message || "(none provided)"}</li>
                    <li><span style="font-weight:500;">Receive Newsletters:</span> ${req.body.receiveNews ? "Yes" : "No"}</li>
                    <li><span style="font-weight:500;">Accepted Terms:</span> Yes</li>
                  </ul>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        try {
          await axios.post(
            process.env.TAXIPRO_EMAIL_API,
            {
              subject: "New TaxiPro Registration",
              body: companyEmailHTML,
              emails: ["Kund@taxipro.se"],
            },
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (err) {
          console.error("Company email error:", err.message);
        }

        try {
          await axios.post(
            process.env.TAXIPRO_EMAIL_API,
            {
              subject: "Welcome to TaxiPro",
              body: customerEmailHTML,
              emails: [email],
            },
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (err) {
          console.error("Customer email error:", err.message);
        }
      })();
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
