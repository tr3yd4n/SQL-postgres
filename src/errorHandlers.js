export const notFound = (steve, req, res, next) => {
    console.log(steve)
    if (steve && steve.status === 400) {
        res.status(400).send({ message: steve.message || "Not found!", errors: steve.messageList })
    } else {
        next(steve)

    }
}

export const forbidden = (err, req, res, next) => {
    if (err.status === 403) {
        res.status(403).send({ message: err.message || "Forbidden!" })
    } else {
        next(err)

    }
}

export const catchAllErrorHandler = (err, req, res, next) => {
    if (err) {
        if (!req.headersSent) {
            res.status(err.status || 500).send({ message: err.message || "Something went wrong!" })
        }
    }
    next()
}