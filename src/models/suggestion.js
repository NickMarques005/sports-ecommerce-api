const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    suggestion: { type: String, required: true }
});

const Suggestions = mongoose.model('suggestion', suggestionSchema, 'suggestions_data');

module.exports = Suggestions;