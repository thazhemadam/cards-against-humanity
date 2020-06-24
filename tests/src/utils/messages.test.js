const { generateMessage } = require('../../../src/utils/messages')

test('Message (object) with retrieved correctly', ()=> {
    const testMessage = 'The generateMessage function generates a message object to be dynamically rendered.';
    expect(generateMessage(testMessage)).toEqual({
        content: testMessage,
        createdAt: expect.any(Number)
    })
})
