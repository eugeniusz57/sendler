import Joi from "joi";

export const schemaCreateNewUser = Joi.object({
  user_login: Joi.string().required().min(3),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  user_name: Joi.string().required().min(3),
  tel: Joi.string()
    .pattern(/^\+\d{10,}$/)
    .required()
    .messages({
      "string.pattern.base":
        'Phone number must start with "+" and have at least 10 digits',
    }),
  user_password: Joi.string()
    .required()
    .min(8)
    .max(20)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const schemaNewDateUser = Joi.object({
  user_login: Joi.string().optional().allow("").min(3),
  tel: Joi.number().optional().allow(null),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .optional()
    .allow(""),
  user_name: Joi.string().optional().allow("").min(3),
});

export const schemaUpdateUserPassword = Joi.object({
  oldPassword: Joi.string().required().min(8),
  newPassword: Joi.string()
    .required()
    .min(8)
    .max(20)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
