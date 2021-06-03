exports.saveUserValidations = [{ param: 'firstName', location: 'body', isRequired: true }, { param: 'lastName', location: 'body', isRequired: true },
    { param: 'email', location: 'body', isRequired: true }, { param: 'phone', location: 'body', isRequired: true }, { param: 'password', location: 'body', isRequired: true }
];

exports.loginValidations = [{ param: 'email', location: 'body', isRequired: true }, { param: 'password', location: 'body', isRequired: true }];

exports.verifyEmailValidations = [{ param: 'userId', location: 'params', isRequired: true }, { param: 'otp', location: 'body', isRequired: true }];

exports.updateUserValidations = [{ param: 'userId', location: 'params', isRequired: true }, { param: 'firstName', location: 'body', isRequired: true }, { param: 'lastName', location: 'body', isRequired: true },
    { param: 'email', location: 'body', isRequired: true }, { param: 'phone', location: 'body', isRequired: true }
];

exports.getUserIdValidations = [{ param: 'userId', location: 'params', isRequired: true }];

exports.deleteUserValidations = [{ param: 'userId', location: 'params', isRequired: true }];