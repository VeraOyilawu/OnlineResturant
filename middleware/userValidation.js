const Joi = require("@hapi/joi");

const validateUser = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required().messages(),
        lastName: Joi.string().required().messages(),
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required().messages({
            'string.pattern.base': 'This is a wrong email format',
            "string.empty": "Please provide an email ."
        }),

        phoneNumber: Joi.string()
        .length(11)
        .pattern(/^\d+$/)
        .required()
        .messages({
          "any.required": "Phone number is required.",
          "string.length": "Phone number must be exactly 11 digits.",
          "string.pattern.base": "Phone number must contain only numeric digits.",
        }),
    
        password: Joi.string().required().messages({
            "string.base": "Please provide a Password.",
            "string.empty": "Please provide a Password.",
        }),
        comfirmPassword: Joi.string(),
    });

    const {error} = schema.validate(req.body);

    if(error) {
        // Handle validator error
        const errorMessage = error.details.map(details => details.message).join(',');
        return res.status(400).json({error: errorMessage});
    }
    next();
};

const validateEmail = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required().messages({
            'string.pattern.base': 'This is a wrong email format',
            "string.empty": "Please provide an email ."
        }),
    })
    const {error} = schema.validate(req.body);

    if(error) {
        // Handle validator error
        const errorMessage = error.details.map(details => details.message).join(',');
        return res.status(400).json({error: errorMessage});
    }
    next();
}

const validatePassword = (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().required().messages({
            "string.base": "Please provide a Password.",
            "string.empty": "Please provide a Password.",
        }),
    })
    const {error} = schema.validate(req.body);

    if(error) {
        // Handle validator error
        const errorMessage = error.details.map(details => details.message).join(',');
        return res.status(400).json({error: errorMessage});
    }
    next();
}

const validateChangePassword = (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().required().messages({
            "string.base": "Please provide a Password.",
            "string.empty": "Please provide a Password.",
        }),
        oldPassword: Joi.string().required().messages({
            "string.base": "Please provide a Password.",
            "string.empty": "Please provide a Password.",
        })
    })
    const {error} = schema.validate(req.body);

    if(error) {
        // Handle validator error
        const errorMessage = error.details.map(details => details.message).join(',');
        return res.status(400).json({error: errorMessage});
    }
    next();
}

const validatelogIn = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required().messages({
            'string.pattern.base': 'This is a wrong email format',
            "string.empty": "Please provide an email ."
        }), 
        password: Joi.string().required().messages({
            'string.pattern.base': 'School Password must contain at least 6 characters with Capital or Small letters, or Number and spaces',
            "string.base": "Please provide a Password.",
            "string.empty": "Please provide a Password.",
        }),
    })
    const {error} = schema.validate(req.body);

    if(error) {
        // Handle validator error
        const errorMessage = error.details.map(details => details.message).join(',');
        return res.status(400).json({error: errorMessage});
    }
    next();
}

const validateUpdate = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().messages(),
        lastName: Joi.string().messages(),
        email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).messages({
            'string.pattern.base': 'This is a wrong email format',
        }),
      
        password: Joi.string().messages({
            'string.pattern.base': 'School Password must contain at least 6 characters with Capital or Small letters, or Number and spaces',
        }),
    })
    const {error} = schema.validate(req.body);

    if(error) {
        // Handle validator error
        const errorMessage = error.details.map(details => details.message).join(',');
        return res.status(400).json({error: errorMessage});
    }
    next();
}



module.exports = {
    validateUser,
    validateEmail,
    validatePassword,
    validateChangePassword,
    validatelogIn,
    validateUpdate
};