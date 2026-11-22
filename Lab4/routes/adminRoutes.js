const express = require("express");
const router = express.Router();

const User = require("../models/User");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// Only Admin Can Access
router.use(protect);
router.use(authorize("admin"));


// Get All Users
router.get("/users", async (req, res, next) => {

    try {

        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;