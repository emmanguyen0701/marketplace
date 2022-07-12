/* mongoose validation error 
{ 
    message: 'Validation failed',
    name: 'ValidationError',
    errors: { 
        size: { 
            message: 'must be less than 20',
            name: 'ValidatorError',
            path: 'size',
            type: 'user defined',
            value: 14 } 
    } 
} */
const getErrorMessage = (err) => {
    let message = ''
    if (err.code) { //mongoose db violation (i.e unique)
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueMessageError(err)
                break
            default:
                message = 'Something went wrong'
        }
    } else { //mongoose validation fails
        for (let errorName in err.errors) {
            if (err.errors[errorName].message) {
                message = err.errors[errorName].message
                const newMsg = message.split(" ").slice(1)
                return newMsg.join(' ')
            }
        }
    }
    return message
}

const getUniqueMessageError = (err) => {
    let output
    try {
        output = err.keyValue.email + ' already exists'
    } catch(err) {
        output = "Unique field already exists"
    }
    return output
}

export default { getErrorMessage }