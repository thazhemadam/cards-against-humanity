const generateMessage = (content) => {
    return {
        content,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}