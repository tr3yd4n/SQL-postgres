import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import authorsRoutes from "./authors/index.js"
import { notFound, forbidden, catchAllErrorHandler } from "./errorHandlers.js"
import blogsRoutes from "./blogs/index.js"
import mongoose from 'mongoose'

import { Sequelize } from "sequelize"

const server = express()
const port = process.env.PORT
console.log(process.env)


const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    { host: process.env.PGHOST, dialect: "postgres" }
);

server.use(cors())

server.use(express.json())

// ROUTES

server.use("/authors", authorsRoutes)

server.use("/blogs", blogsRoutes)

//  next(err) --> ERROR HANDLERS
server.use(notFound)

server.use(forbidden)

server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

// mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, })
//     .then(server.listen(port, () => { console.log("Running on port", port) }))
//     .catch((err) => console.log(err))

// server.listen(port, () => console.log('server is running on PORT ', port))
sequelize.authenticate().then(() => console.log("Connection has been established")).catch((e) => console.log("Unable to establish connection:", e));

server.on("error", (error) => console.log(`server is not running due to ${error}`))