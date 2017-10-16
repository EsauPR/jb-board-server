const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    name: { type: String, trim: true, required: true },
    avatar: { type: String, trim: true, required: true },
    scores: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Score', required: true }],
}, { collection: 'user', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Mongoose.model('User', UserSchema);
