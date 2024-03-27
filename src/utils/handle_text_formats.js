
const removeAccents = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const removeAccentsFromProducts = (value) => {
    if (value.name) {
        return removeAccents(value.name.toLowerCase())
    }
    else {
        return removeAccents(value.suggestion.toLowerCase())
    }
}

module.exports = { removeAccents, removeAccentsFromProducts };