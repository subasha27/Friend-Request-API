const mongoose = require("mongoose");

const InboxSchema = new mongoose.Schema({
    My_id: {
        type: String,
        required: true
    },
    sendId: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    Accept: {
        type: Boolean,
        required:false
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("Inbox", InboxSchema);
