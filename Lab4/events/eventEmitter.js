const EventEmitter = require("events");

const appEvents = new EventEmitter();


// Note Created Event
appEvents.on("note:created", (data) => {

    console.log("New Note Created!");
    console.log("Note ID:", data.noteId);
    console.log("User ID:", data.userId);

});


// Chat Message Event
appEvents.on("chat:message", (data) => {

    console.log("New Chat Message!");
    console.log("User:", data.name);
    console.log("Message:", data.message);

});


module.exports = appEvents;