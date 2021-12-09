const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema(
    {
        message: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: false,
        },
    }
);

const Sites = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    lat: {
        type: String,
        trim: true,
        required: true
    },
    lng: {
        type: String,
        trim: true,
        required: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    description: {
        type: String,
        default: 'This is the text that is prepared for those leaders who have forgoted describing their sites.'
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    listofpeople: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Users",
        default: []
    },
    numberoftested: {
        type: Number,
        default: 0
    },
    notification:{
        type: NotificationSchema, 
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Sites', Sites)
