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

// // Trust the first proxy (Vercel) to get correct client IP
// app.set('trust proxy', 1);

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(express.json());

// // Sanitize input to prevent NoSQL injection
// app.use((req, res, next) => {
//   if (req.body) req.body = mongoSanitize.sanitize(req.body);
//   if (req.params) req.params = mongoSanitize.sanitize(req.params);
//   next();
// });

// // Rate limiter to limit repeated requests
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// // Connect to MongoDB once
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
//   membershipType: { type: String, enum: ["basic", "standard", "professional", "premium"] },
//   paymentMethod: String,
//   message: String,
//   acceptTerms: Boolean,
//   receiveNews: Boolean,
// });

// const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

// // Registration route with validation
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
//       console.log("Validation errors:", errors.array());
//       return res.status(400).json({ message: "Invalid input", errors: errors.array() });
//     }

//     try {
//       const { email, firstName } = req.body;

//       // Check for existing client by email
//       const existingClient = await Client.findOne({ email });
//       if (existingClient) {
//         return res.status(400).json({ message: "Client with this email already exists" });
//       }

//       // Save new client
//       const client = new Client({
//         ...req.body,
//         acceptTerms: true,
//         receiveNews: req.body.receiveNews === true || req.body.receiveNews === "true",
//       });
//       await client.save();

//       // Optional email notifications
//       const v = req.body;
//       const companyEmailData = {
//         subject: "New customer",
//         body: `<p>New customer: ${v.firstName} ${v.surname}</p>`,
//         emails: ["Kund@taxipro.se"],
//       };

//       const thankYouEmailData = {
//         subject: "Thank You for Registering with TaxiPro",
//         body: `<p>Hi ${firstName}, thank you for registering with TaxiPro!</p>`,
//         emails: [email],
//       };

//       let companyEmailSent = false;
//       let customerEmailSent = false;

//       try {
//         const companyResponse = await axios.post(process.env.TAXIPRO_EMAIL_API, companyEmailData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         if (companyResponse.status === 200) companyEmailSent = true;
//       } catch (err) {
//         console.error("Company email send error:", err.message);
//       }

//       try {
//         const customerResponse = await axios.post(process.env.TAXIPRO_EMAIL_API, thankYouEmailData, {
//           headers: { "Content-Type": "application/json" },
//         });
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

// // Only start server locally, skip when deployed serverless (e.g. Vercel)
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
const path = require("path");

const app = express();

// Serve static files (logo, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Sanitize input
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Schema
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
  membershipType: { type: String, enum: ["basic", "standard", "professional", "premium"] },
  paymentMethod: String,
  message: String,
  acceptTerms: Boolean,
  receiveNews: Boolean,
});

const Client = mongoose.model("Client", clientSchema);

// Registration Route
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
    body("membershipType").isIn(["basic", "standard", "professional", "premium"]),
    body("paymentMethod").trim().notEmpty().escape(),
    body("acceptTerms").equals("true"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }

    try {
      const { email, firstName, surname } = req.body;

      // Check for existing client
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res.status(400).json({ message: "Client with this email already exists" });
      }

      // Save to DB
      const client = new Client({
        ...req.body,
        acceptTerms: true,
        receiveNews: req.body.receiveNews === true || req.body.receiveNews === "true",
      });
      await client.save();

      const v = req.body;

      // Company email HTML
      const companyEmailData = {
        subject: "New Customer Registration",
        body: `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #ffc001; margin-bottom: 20px;">New Customer Registration</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td style="padding:8px; font-weight:bold;">First Name:</td><td style="padding:8px;">${v.firstName}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Last Name:</td><td style="padding:8px;">${v.surname}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Company Name:</td><td style="padding:8px;">${v.companyName}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Organization Number:</td><td style="padding:8px;">${v.organizationNumber}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Address:</td><td style="padding:8px;">${v.address}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Postal Number:</td><td style="padding:8px;">${v.postalNumber}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">City:</td><td style="padding:8px;">${v.city}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Telephone:</td><td style="padding:8px;">${v.tel}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Email:</td><td style="padding:8px;">${v.email}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Subscription:</td><td style="padding:8px; text-transform:capitalize;">${v.membershipType}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Payment Method:</td><td style="padding:8px;">${v.paymentMethod}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Comment:</td><td style="padding:8px;">${v.message || "N/A"}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">Accept Emails:</td><td style="padding:8px;">${v.receiveNews ? "Yes" : "No"}</td></tr>
              </tbody>
            </table>
          </div>
        `,
        emails: ["Kund@taxipro.se"],
      };

      // Customer email HTML
      const logoUrl =
        process.env.NODE_ENV === "production"
          ? "https://yourdomain.com/TaxiPro.png"
          : "http://localhost:5000/TaxiPro.png";

      const customerEmailData = {
        subject: "Tack för din registrering hos TaxiPro",
        body: `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #ffffff; border-radius: 8px;">
            <p>Hej ${firstName},</p>
            <p>Tack för er ansökan om att bli kund hos oss.<br>
            Vi har mottagit er förfrågan och återkommer med besked inom 24 timmar.</p>
            <p>Vid frågor är ni välkomna att kontakta oss på <a href="mailto:info@taxipro.se">info@taxipro.se</a>.</p>
            <p>Med vänlig hälsning,<br>Taxipro.se</p>
            <div style="margin-top: 20px; text-align: center;">
              <img src="${logoUrl}" alt="TaxiPro Logo" style="max-width: 200px;">
            </div>
          </div>
        `,
        emails: [email],
      };

      // Send both emails
      let companyEmailSent = false;
      let customerEmailSent = false;

      try {
        const res1 = await axios.post(process.env.TAXIPRO_EMAIL_API, companyEmailData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res1.status === 200) companyEmailSent = true;
      } catch (err) {
        console.error("Company email send error:", err.message);
      }

      try {
        const res2 = await axios.post(process.env.TAXIPRO_EMAIL_API, customerEmailData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res2.status === 200) customerEmailSent = true;
      } catch (err) {
        console.error("Customer email send error:", err.message);
      }

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

// Start server locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;

