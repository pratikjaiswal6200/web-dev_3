const errorHandler = (err, req, res, next) => {

    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");
    }

    // Invalid MongoDB ID
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid Product ID";
    }

    // Duplicate SKU Error
    if (err.code === 11000) {
        statusCode = 400;
        message = "SKU already exists";
    }

    res.status(statusCode).json({
        success: false,
        message: message
    });
};

module.exports = errorHandler;