import express from "express"
import fs from "fs-extra"
import { join, dirname, parse } from "path"
import { fileURLToPath } from "url"
import uniqid from 'uniqid'

//create an express function declared as a router
const authorsRoutes = express.Router()
// folder path containing src converts path to url including json
const authorsPath = join(dirname(fileURLToPath(import.meta.url)), "authors.json")

// // Question 1 - DONE
authorsRoutes.get('/', async (req, res) => { // /authors
    //1. target authors.json grab entire list of authors from authors.json
    const authors = fs.readFileSync(authorsPath)
    // console.log(authors.JSON)

    //2. convert into readable array
    let parsedAuthors = JSON.parse(authors)

    // ######## FILTER AUTHORS BY QUERIES
    // ### url = http://localhost:3001/authors?name=steve
    // ### url = http://localhost:3001/authors?age=42
    // ### url = http://localhost:3001/authors?
    console.log(req.query)
    if (req.query.name) {
        parsedAuthors = parsedAuthors.filter(author => author.name.toLowerCase().includes(req.query.name.toLowerCase()))
    }
    if (req.query.age) {
        parsedAuthors = parsedAuthors.filter(author => author.age === req.query.age)
    }
    if (req.query.surname) {
        parsedAuthors = parsedAuthors.filter(author => {
            if (author.surname) {
                return author.surname.toLowerCase().includes(req.query.surname.toLowerCase())
            } else {
                console.log('SURNAME NOT DEFINED: ', author)
            }
        })
    }
    res.send(parsedAuthors)
})

// // Question 3 - DONE 
authorsRoutes.post('/', (req, res) => {

    //1. read the body of the request
    const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
    console.log(newAuthor)

    //2. read content of chosen json file (authors.json)
    const authorsJSON = fs.readFileSync(authorsPath)
    const authorsList = JSON.parse(authorsJSON)

    //3. push the new author into the authors.json array
    authorsList.push(newAuthor)

    //4. write the array back into the JSON file as a string
    fs.writeFileSync(authorsPath, JSON.stringify(authorsList))

    //5. provide a response 201 = created
    console.log(authorsList)
    res.status(201).send(newAuthor.id)

})

// Question 2
authorsRoutes.get('/:id', (req, res) => {

    //1. target authors.json grab entire list of authors from authors.json
    const authors = fs.readFileSync(authorsPath)

    //2. convert into readable array
    const parsedAuthors = JSON.parse(authors)

    //3. select author based on uniqid value
    const author = parsedAuthors.find(a => a.id === req.params.id)

    //4. send back to the front as response
    res.status(200).send(author)
    console.log(author)

})

// Question 4
authorsRoutes.put('/:id', (req, res) => { //queries

    //1. target authors.json grab entire list of authors from authors.json
    const authors = fs.readFileSync(authorsPath)

    //2. convert into readable array
    const parsedAuthors = JSON.parse(authors)

    //3. modify specified author and add to new array
    const remainingAuthors = parsedAuthors.filter(author => author.id !== req.params.id)
    const updatedAuthor = { ...req.body, id: req.params.id }
    remainingAuthors.push(updatedAuthor)

    //4. write (save) file with modified author
    fs.writeFileSync(authorsPath, JSON.stringify(remainingAuthors))

    //5. send response
    res.send(updatedAuthor)

})

// Question 5
authorsRoutes.delete('/:id', (req, res) => { //TREAT THIS AS AN INPUT CHECK!!!!!

    //1. target authors.json grab entire list of authors from authors.json
    const authors = fs.readFileSync(authorsPath)

    //2. convert into readable array
    const parsedAuthors = JSON.parse(authors)

    //3. filter out specified id
    const remainingAuthors = parsedAuthors.filter(author => author.id !== req.params.id)

    //4. write the array back into the JSON file as a string
    fs.writeFileSync(authorsPath, JSON.stringify(remainingAuthors))
    res.status(200).send(remainingAuthors) // cant get this to log text or remaining on deletion but delete works

})

export default authorsRoutes