const mongoose = require('mongoose')

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
        default: ''
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
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Sites', Sites)