const express = require("express");
const router = express.Router();

const Note = require("../models/Note");
const appEvents = require("../events/eventEmitter");

const { protect } = require("../middleware/authMiddleware");

// All note routes require authentication
router.use(protect);

// 1. CREATE NOTE
router.post("/", async (req, res, next) => {

    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const note = await Note.create({
            title,
            content,
            user: req.user.id
        });

        // Emit Note Created Event
        appEvents.emit("note:created", {
            noteId: note._id,
            userId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });

    } catch (error) {
        next(error);
    }
});

// 2. GET ALL PERSONAL NOTES
router.get("/", async (req, res, next) => {

    try {

        const notes = await Note.find({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });

    } catch (error) {
        next(error);
    }
});


// 3. GET NOTE BY ID
router.get("/:id", async (req, res, next) => {

    try {

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });

    } catch (error) {
        next(error);
    }
});


// 4. UPDATE NOTE
router.put("/:id", async (req, res, next) => {

    try {

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note
        });

    } catch (error) {
        next(error);
    }
});


// 5. DELETE NOTE
router.delete("/:id", async (req, res, next) => {

    try {

        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;