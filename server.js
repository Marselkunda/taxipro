// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize");
// const { body, validationResult } = require("express-validator");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(express.json());

// // Rate Limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// // Manual mongoSanitize on req.body and req.params
// app.use((req, res, next) => {
//   if (req.body) {
//     req.body = mongoSanitize.sanitize(req.body);
//   }
//   if (req.params) {
//     req.params = mongoSanitize.sanitize(req.params);
//   }
//   next();
// });

// // MongoDB connection (no authentication)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB error:", err));

// // Schema
// const clientSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   surname: { type: String, required: true },
//   companyName: { type: String, required: true },
//   organizationNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   postalNumber: { type: String, required: true },
//   city: { type: String, required: true },
//   tel: { type: String, required: true },
//   email: { type: String, required: true },
//   membershipType: { type: String, enum: ["basic", "standard", "professional", "premium"], required: true },
//   paymentMethod: { type: String, required: true },
//   message: { type: String },
//   acceptTerms: { type: Boolean, required: true },
//   receiveNews: { type: Boolean },
// });

// const Client = mongoose.model("Client", clientSchema);

// // API Route
// app.post("/api/register", [
//   body("email").isEmail().normalizeEmail(),
//   body("firstName").trim().notEmpty().escape(),
//   body("surname").trim().notEmpty().escape(),
//   body("companyName").trim().notEmpty().escape(),
//   body("organizationNumber").trim().notEmpty().escape(),
//   body("address").trim().notEmpty().escape(),
//   body("postalNumber").trim().notEmpty().escape(),
//   body("city").trim().notEmpty().escape(),
//   body("tel").trim().notEmpty().escape(),
//   body("membershipType").isIn(["basic", "standard", "professional", "premium"]),
//   body("paymentMethod").trim().notEmpty().escape(),
//   body("acceptTerms").equals("true"),
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ message: "Invalid input", errors: errors.array() });
//   }

//   try {
//     const client = new Client(req.body);
//     await client.save();
//     res.status(201).json({ message: "Registration successful" });
//   } catch (error) {
//     console.error("Error saving client:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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
//         subject: "New customer",
//         body: `
//           New customer <br>
//           First name: ${v.firstName} <br>
//           Last name: ${v.surname} <br>
//           Company name: ${v.companyName} <br>
//           Organization Number: ${v.organizationNumber} <br>
//           Address: ${v.address} <br>
//           Post number: ${v.postalNumber} <br>
//           Ort: ${v.city} <br>
//           Tel: ${v.tel} <br>
//           E-post: ${v.email} <br>
//           Subscription: ${v.membershipType} <br>
//           Quarterly invoice: ${v.paymentMethod.includes("Quarterly") ? "Yes" : "No"} <br>
//           Annual Invoice: ${v.paymentMethod.includes("Annual") ? "Yes" : "No"} <br>
//           Comment: ${v.message || "N/A"} <br>
//           Accept getting emails: ${v.receiveNews ? "Yes" : "No"}
//         `,
//         emails: ["Kund@taxipro.se"],
//       };

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

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


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

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


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
// mongoose
//   .connect(process.env.MONGO_URI)
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
//       console.log("Validation errors:", errors.array());
//       return res.status(400).json({ message: "Invalid input", errors: errors.array() });
//     }

//     try {
//       const { email, firstName } = req.body;

//       // 1️⃣ Check if client already exists
//       const existingClient = await Client.findOne({ email });
//       if (existingClient) {
//         return res.status(400).json({ message: "Client with this email already exists" });
//       }

//       // 2️⃣ Save to DB
//       const client = new Client({
//         ...req.body,
//         acceptTerms: true,
//         receiveNews: req.body.receiveNews === true || req.body.receiveNews === "true",
//       });
//       await client.save();

//       // 3️⃣ Email to company
//       const v = req.body;
//       const companyEmailData = {
//         subject: "New customer",
//         body: `
//           <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
//             <h2 style="color: #ffc001;">New Customer Registration</h2>
//             <p><b>First Name:</b> ${v.firstName}</p>
//             <p><b>Last Name:</b> ${v.surname}</p>
//             <p><b>Company:</b> ${v.companyName}</p>
//             <p><b>Organization Number:</b> ${v.organizationNumber}</p>
//             <p><b>Address:</b> ${v.address}</p>
//             <p><b>Postal Number:</b> ${v.postalNumber}</p>
//             <p><b>City:</b> ${v.city}</p>
//             <p><b>Tel:</b> ${v.tel}</p>
//             <p><b>Email:</b> ${v.email}</p>
//             <p><b>Subscription:</b> ${v.membershipType}</p>
//             <p><b>Payment Method:</b> ${v.paymentMethod}</p>
//             <p><b>Message:</b> ${v.message || "N/A"}</p>
//             <p><b>Accept Emails:</b> ${v.receiveNews ? "Yes" : "No"}</p>
//           </div>
//         `,
//         emails: ["Kund@taxipro.se"],
//       };

//       // 4️⃣ Email to customer (Thank You)
//       const thankYouEmailData = {
//         subject: "Thank You for Registering with TaxiPro",
//         body: `
//           <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
//             <h2 style="color: #ffc001;">Hi ${firstName},</h2>
//             <p>Thank you for registering with <b>TaxiPro</b>. We are excited to have you onboard!</p>
//             <p>Our team will review your information and get in touch with you soon.</p>
//             <br/>
//             <p style="color: #555;">Best regards,<br/>TaxiPro Team</p>
//           </div>
//         `,
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
//         console.error("Company email failed:", err.response?.data || err.message);
//       }

//       try {
//         const customerResponse = await axios.post(process.env.TAXIPRO_EMAIL_API, thankYouEmailData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         if (customerResponse.status === 200) customerEmailSent = true;
//       } catch (err) {
//         console.error("Customer email failed:", err.response?.data || err.message);
//       }

//       return res.status(201).json({
//         message: "Registration successful",
//         companyEmailSent,
//         customerEmailSent,
//       });
//     } catch (error) {
//       console.error("Error:", error.response?.data || error.message);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


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

// Connect to MongoDB (only once)
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));
}

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

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

// Routes
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
      const { email, firstName } = req.body;

      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res.status(400).json({ message: "Client with this email already exists" });
      }

      const client = new Client({
        ...req.body,
        acceptTerms: true,
        receiveNews: req.body.receiveNews === true || req.body.receiveNews === "true",
      });
      await client.save();

      const v = req.body;
      const companyEmailData = {
        subject: "New customer",
        body: `<p>New customer: ${v.firstName} ${v.surname}</p>`,
        emails: ["Kund@taxipro.se"],
      };

      const thankYouEmailData = {
        subject: "Thank You for Registering with TaxiPro",
        body: `<p>Hi ${firstName}, thank you for registering with TaxiPro!</p>`,
        emails: [email],
      };

      let companyEmailSent = false;
      let customerEmailSent = false;

      try {
        const companyResponse = await axios.post(process.env.TAXIPRO_EMAIL_API, companyEmailData, {
          headers: { "Content-Type": "application/json" },
        });
        if (companyResponse.status === 200) companyEmailSent = true;
      } catch {}

      try {
        const customerResponse = await axios.post(process.env.TAXIPRO_EMAIL_API, thankYouEmailData, {
          headers: { "Content-Type": "application/json" },
        });
        if (customerResponse.status === 200) customerEmailSent = true;
      } catch {}

      return res.status(201).json({
        message: "Registration successful",
        companyEmailSent,
        customerEmailSent,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Export for Vercel
module.exports = app;
