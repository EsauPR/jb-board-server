const Mongoose = require('mongoose');

const scoreSchema = new Mongoose.Schema({
    type: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    points: { type: Number, required: true },
    date: { type: Date, require: true },
    user_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { collection: 'scores', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Mongoose.model('Score', scoreSchema);
