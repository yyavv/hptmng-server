// Request validation middleware

// Validate required fields
export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
    }

    next();
  };
};

// Validate email format
export const validateEmail = (field = "email") => {
  return (req, res, next) => {
    const email = req.body[field];

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        error: `Invalid email format: ${field}`,
      });
    }

    next();
  };
};

// Validate phone format (Turkish)
export const validatePhone = (field = "phone") => {
  return (req, res, next) => {
    const phone = req.body[field];

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        error: `Invalid phone format: ${field}. Expected format: 5XX XXX XX XX`,
      });
    }

    next();
  };
};

// Validate TC No (Turkish ID)
export const validateTCNo = (field = "tc_no") => {
  return (req, res, next) => {
    const tcNo = req.body[field];

    if (tcNo && !isValidTCNo(tcNo)) {
      return res.status(400).json({
        error: `Invalid TC No: ${field}. Must be 11 digits`,
      });
    }

    next();
  };
};

// Validate date format
export const validateDate = (field) => {
  return (req, res, next) => {
    const date = req.body[field];

    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({
        error: `Invalid date format: ${field}`,
      });
    }

    next();
  };
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  // Turkish phone format: 5XX XXX XX XX or 05XX XXX XX XX
  const phoneRegex = /^(0)?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const isValidTCNo = (tcNo) => {
  if (!tcNo || tcNo.length !== 11) return false;

  // TC No validation algorithm
  const digits = tcNo.split("").map(Number);

  // First digit cannot be 0
  if (digits[0] === 0) return false;

  // Calculate 10th digit
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = (oddSum * 7 - evenSum) % 10;

  if (digits[9] !== digit10) return false;

  // Calculate 11th digit
  const totalSum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const digit11 = totalSum % 10;

  return digits[10] === digit11;
};

// Sanitize input (remove dangerous characters)
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        // Remove potential SQL injection characters
        obj[key] = obj[key]
          .replace(/[<>]/g, "") // Remove < and >
          .trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    });
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};
