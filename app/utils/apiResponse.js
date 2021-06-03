exports.successResponse = (res, msg, statusCode) => {
    const data = {
        status: "SUCCESS",
        statusCode: statusCode,
        message: msg
    };
    return res.status(200).json(data);
};

exports.successResponseWithData = (res, msg, data, statusCode) => {
    const resData = {
        status: "SUCCESS",
        statusCode: statusCode,
        message: msg,
        data: data
    };
    return res.status(200).json(resData);
};


exports.successResponseWithError = (res, msg, statusCode) => {
    const resData = {
        status: "ERROR",
        statusCode: statusCode,
        message: msg
    };
    return res.status(200).json(resData);
};

exports.successResponseWithDataWithPage = (res, msg, data, statusCode, page) => {
    const resData = {
        status: "SUCCESS",
        statusCode: statusCode,
        message: msg,
        data: data,
        page: page
    };
    return res.status(200).json(resData);
};

exports.errorResponse = (res, msg, statusCode) => {
    const data = {
        status: "ERROR",
        statusCode: statusCode,
        message: msg
    };
    return res.status(500).json(data);
};

exports.errorResponseWithError = (res, msg, statusCode, error) => {
    const data = {
        status: "ERROR",
        statusCode: statusCode,
        message: msg,
        error: error
    };
    return res.status(500).json(data);
};

exports.notFoundResponse = (res, msg, statusCode) => {
    const data = {
        status: "ERROR",
        statusCode: statusCode,
        message: msg
    };
    return res.status(200).json(data);
};

exports.badRequest = (res, msg, statusCode) => {
    const resData = {
        status: "ERROR",
        statusCode: statusCode,
        message: msg,
    };
    return res.status(400).json(resData);
};

exports.unauthorizedResponse = (res, msg, statusCode) => {
    const data = {
        status: "ERROR",
        statusCode: statusCode,
        message: msg,
    };
    return res.status(401).json(data);
};