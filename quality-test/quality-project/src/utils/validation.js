const Joi = require('joi');

/**
 * Validation schemas for request data
 */
const schemas = {
    // User registration validation
    userRegistration: Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.alphanum': 'Username must contain only alphanumeric characters',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username must not exceed 30 characters',
                'any.required': 'Username is required'
            }),
        
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
        
        password: Joi.string()
            .min(6)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)'))
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                'any.required': 'Password is required'
            }),
        
        firstName: Joi.string()
            .max(50)
            .optional()
            .messages({
                'string.max': 'First name must not exceed 50 characters'
            }),
        
        lastName: Joi.string()
            .max(50)
            .optional()
            .messages({
                'string.max': 'Last name must not exceed 50 characters'
            })
    }),

    // User login validation
    userLogin: Joi.object({
        login: Joi.string()
            .required()
            .messages({
                'any.required': 'Email or username is required'
            }),
        
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required'
            })
    })
};

/**
 * Middleware factory for request validation
 * @param {string} schemaName - Name of the validation schema to use
 * @returns {Function} Express middleware function
 */
function validateRequest(schemaName) {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return res.status(500).json({
                success: false,
                message: 'Invalid validation schema'
            });
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context.value
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
}

module.exports = {
    schemas,
    validateRequest
};

/**
 * Added in iteration 1
 */
function newUtilityFunction() {
    return 'utility function added';
}

module.exports.newUtilityFunction = newUtilityFunction;