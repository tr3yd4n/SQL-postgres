import { checkSchema, validationResult } from "express-validator"

const schema = {
    title: {
        in: ['body'],
        isString: {
            errorMessage: 'title validation failed, type must be string!'
        }
    },
    category: {
        in: ['body'],
        isString: {
            errorMessage: 'category validation failed, type must be string!'
        }
    },
    content: {
        in: ['body'],
        isString: {
            errorMessage: 'content validation failed, type must be string!'
        }
    },
    'author.name': {
        in: ['body'],
        isString: {
            errorMessage: 'author.name validation failed, type must be string!'
        }
    },
    'author.avatar': {
        in: ['body'],
        isString: {
            errorMessage: 'author.avatar validation failed, type must be string!'
        }
    },
    'readTime.value': {
        in: ['body'],
        isString: {
            errorMessage: 'readTime.value validation failed, type must be numeric!'
        }
    },
    'readTime.unit': {
        in: ['body'],
        isString: {
            errorMessage: 'readTime.unit validation failed, type must be string!'
        }
    },
    cover: {
        in: ['body'],
        isString: {
            errorMessage: 'cover validation failed, type must be string!'
        }
    },

}

export const CheckBlogPostSchema = checkSchema(schema)

export const CheckValidationResult = (req, res, next) => {
    const errorsList = validationResult(req)
    if (!errorsList.isEmpty()) {
        const error = new Error('Blog post validation failed!')
        error.status = 400 // 400 === Bad Request
        error.messageList = errorsList.errors
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ', errorsList)
        next(error)
    } else {
        console.log("All good!")
        next()
    }
}