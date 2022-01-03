import { createTransport } from "nodemailer";
import sanitizeHtml from "sanitize-html";
require("dotenv").config();

const transport = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendMail(options) {
  try {
    await transport.sendMail(options);
    return { success: true };
  } catch (error) {
    throw ApiError("Email wasn't sent", 500);
  }
}
const from = `Paul Vasssssss - ${process.env.EMAIL_ADRESS}`;
async function formSubmit(formData) {
  let html = "";
  for (const option in formData) {
    html += option + " : " + formData[option] + "<br/>";
  }
  return sendMail({
    from,
    to: process.env.EMAIL_TO_USER,
    subject: "New form submision",
    html: sanitizeHtml(html),
  });
}

const history = new Map();
const rateLimit = (ip, limit = 3) => {
  const count = history.get(ip) || 0;
  if (count >= limit) {
    throw ApiError("Rate limit", 429);
  }
  history.set(ip, count + 1);
};

const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameValid = /[a-zA-ZЁёА-я]+$/;

const validate = (body) => {
  const { email, name, password, confirmPassword } = body;
  if (!email || !name || !password || !confirmPassword) {
    throw ApiError("Fields empty", 400);
  }
  if (!emailValid.test(email)) {
    throw ApiError("Email is valid", 400);
  }
  if (!nameValid.test(name)) {
    throw ApiError("Name is not valid", 400);
  }
  if (password !== confirmPassword) {
    throw ApiError("Passwords not valid", 400);
  }
};

function ApiError(message, status) {
  const e = new Error(message);
  e.status = status;
  return e;
}

module.exports = async (req, res) => {
  try {
    rateLimit(req.headers["x-real-ip"], 2);
    validate(req.body);
    const result = await formSubmit(req.body);
    res.json({ result });
  } catch (e) {
    return res.status(e.status).json({
      status: e.status,
      errors: [e.message],
      result: {
        success: false,
      },
    });
  }
};
