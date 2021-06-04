module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const userValidation = require("../validations/user.validation.js");
    const authorization = require('../utils/jwtAuthorisation.js');
    const { validator } = require('expressjs-field-validator');

    // Login User
    app.post("/login", validator(userValidation.loginValidations, { mode: 'reject', errorCode: '422' }), users.login);

    // Email Verify
    app.post("/user/:userId/verifyEmail", validator(userValidation.verifyEmailValidations, { mode: 'reject', errorCode: '422' }), users.verifyEmail);

    // Save a User
    app.post("/users", validator(userValidation.saveUserValidations, { mode: 'reject', errorCode: '422' }), users.saveUser);

    // Retrieve all Users
    app.get("/users", users.getAllUsers);

    // Retrieve a single User with userId
    app.get("/users/:userId", validator(userValidation.getUserIdValidations, { mode: 'reject', errorCode: '422' }), users.getUserById);

    // Update a User with userId
    app.put("/users/:userId", validator(userValidation.updateUserValidations, { mode: 'reject', errorCode: '422' }), users.updateUser);

    // Delete a User with userId
    app.delete("/users/:userId", validator(userValidation.deleteUserValidations, { mode: 'reject', errorCode: '422' }), users.deleteUser);

    // Delete All User
    app.delete("/users", users.deleteAll);
};