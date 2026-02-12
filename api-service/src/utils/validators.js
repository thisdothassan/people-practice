const Joi = require("joi");
const { ValidationError } = require("./errors");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location_id: Joi.number().integer().positive().required(),
  first_name: Joi.string().max(100).allow("", null),
  last_name: Joi.string().max(100).allow("", null),
  shipping_address: Joi.string().allow("", null),
  billing_address: Joi.string().allow("", null),
  phone: Joi.string().max(50).allow("", null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createCustomerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location_id: Joi.number().integer().positive().required(),
  first_name: Joi.string().max(100).allow("", null),
  last_name: Joi.string().max(100).allow("", null),
  shipping_address: Joi.string().allow("", null),
  billing_address: Joi.string().allow("", null),
  phone: Joi.string().max(50).allow("", null),
});

const updateCustomerSchema = Joi.object({
  first_name: Joi.string().max(100).allow("", null),
  last_name: Joi.string().max(100).allow("", null),
  shipping_address: Joi.string().allow("", null),
  billing_address: Joi.string().allow("", null),
  phone: Joi.string().max(50).allow("", null),
  location_id: Joi.number().integer().positive(),
}).min(1);

const createOrderSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  location_id: Joi.number().integer().positive().required(),
  status: Joi.string().max(50).default("pending"),
  total_amount: Joi.number().min(0),
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        price: Joi.number().min(0).required(),
      }),
    )
    .default([]),
});

const createLocationSchema = Joi.object({
  name: Joi.string().max(255).required(),
  code: Joi.string().max(50).required(),
  country: Joi.string().max(100).allow("", null),
});

const updateLocationSchema = Joi.object({
  name: Joi.string().max(255),
  code: Joi.string().max(50),
  country: Joi.string().max(100).allow("", null),
}).min(1);

const createProductSchema = Joi.object({
  name: Joi.string().max(255).required(),
  sku: Joi.string().max(100).required(),
  product_line: Joi.string().max(100).allow("", null),
  price: Joi.number().min(0).allow(null),
});

const updateProductSchema = Joi.object({
  name: Joi.string().max(255),
  sku: Joi.string().max(100),
  product_line: Joi.string().max(100).allow("", null),
  price: Joi.number().min(0).allow(null),
}).min(1);

const createManagerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  type: Joi.string().valid("super", "location", "product").required(),
  location_ids: Joi.when("type", {
    is: "location",
    then: Joi.array()
      .items(Joi.number().integer().positive())
      .min(1)
      .required(),
    otherwise: Joi.array().items(Joi.number().integer().positive()),
  }),
  product_ids: Joi.when("type", {
    is: "product",
    then: Joi.array()
      .items(Joi.number().integer().positive())
      .min(1)
      .required(),
    otherwise: Joi.array().items(Joi.number().integer().positive()),
  }),
});

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message).join("; ");
      return next(new ValidationError(message));
    }
    req.body = value;
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  createCustomerSchema,
  updateCustomerSchema,
  createOrderSchema,
  createManagerSchema,
  createLocationSchema,
  updateLocationSchema,
  createProductSchema,
  updateProductSchema,
  validate,
};
