import { createTransport } from "nodemailer";
import sanitizeHtml from "sanitize-html";

require("dotenv").config();
const from = `Form - ${process.env.EMAIL_ADRESS}`;
const history = new Map();

function getTransporter() {
  return createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

const rateLimit = (ip, limit) => {
  if (!history.has(ip)) {
    history.set(ip, 0);
  }
  if (history.get(ip) > limit) {
    throw new Error();
  }
  history.set(ip, history.get(ip) + 1);
};

async function sendMail(options) {
  try {
    const transport = getTransporter();
    await transport.sendMail(options);
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
}

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

module.exports = async (req, res) => {
  try {
    validation(req.body);
  } catch (e) {
    return res.status(402).json({
      errors: ["Validation error"],
    });
  }

  try {
    rateLimit(req.headers["x-real-ip"], 5);
  } catch (e) {
    return res.status(429).json({
      error: ["Too many requests"],
    });
  }
  const result = await formSubmit(req.body);
  return res.json({ result });
};

function validation(formData) {
  const email = formData.email;
  const pword = formData.password;
  const confpword = formData.confirmPassword;
  const number = formData.number;
  if (!emailValidation(email)) throw new Error("bad email");
  if (!pwordValidation(pword, confpword)) throw new Error("pword");
  if (!numberValidation(number)) throw new Error("number");
  return true;
}

function emailValidation(email) {
  const re =
    // eslint-disable-next-line max-len
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function pwordValidation(pword, confpword) {
  if (pword === confpword) return true;
  return false;
}

function numberValidation(number) {
  // eslint-disable-next-line no-useless-escape
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(String(number));
}
