// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: String,
    console: String,
    genre: String
}, {toJSON: {virtuals: true}});

GameSchema.virtual('_links').get(
    function () {
        return {
            self:{
                href:`${process.env.BASE_URI}games/${this._id}`
            },
            collections:{
                href:`${process.env.BASE_URI}games/`
            }

        }
    }
)

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Game", GameSchema);