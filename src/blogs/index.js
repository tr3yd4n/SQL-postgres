import express from "express"
// import fs from "fs"
// import { join, dirname, parse } from "path"
// import { fileURLToPath } from "url"
// import uniqid from 'uniqid'
import fs from "fs"
import { join, dirname, parse } from "path"
import { fileURLToPath } from "url"
import uniqid from 'uniqid'
import { CheckBlogPostSchema, CheckValidationResult } from './validation.js'


//create an express function declared as a router
const router = express.Router()
// folder path containing src converts path to url including json
const blogsPath = join(dirname(fileURLToPath(import.meta.url)), "blogs.json")

// // Question 1 - DONE
router.get('/', (req, res) => { // /blogs

    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)
    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)
    //3. send back to the front as response
    res.send(parsedblogs)
    console.log(parsedblogs)

})

router.get('/search', (req, res) => { // http://localhost:3001/blogs/search?title=blog1

    const { title } = req.query
    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)
    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)
    const filteredBlogs = parsedblogs.filter(blog => blog.title.toLowerCase().includes(title.toLowerCase()))
    //3. send back to the front as response
    res.send(filteredBlogs)
    console.log(filteredBlogs)

})

// Question 2
router.get('/:id', (req, res) => {

    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)

    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)

    //3. select blog based on uniqid value
    const blog = parsedblogs.find(a => a.id === req.params.id) //req/params.id = to end of url search ie /blogs/sdkfgbjksdhbgkdjfbgjb

    //4. send back to the front as response
    res.status(200).send(blog)
    console.log(blog)

})

// // Question 3 - DONE  
router.post('/', CheckBlogPostSchema, CheckValidationResult, async (req, res) => {
    try {
        //1. read the body of the request
        const newBlog = { ...req.body, comments: [{ authorName: "", text: "" }], createdAt: new Date(), id: uniqid() }
        console.log(newBlog)

        //2. read content of chosen json file (Blogs.json)
        const BlogsJSON = fs.readFileSync(blogsPath)
        const BlogsList = JSON.parse(BlogsJSON)

        //3. push the new Blog into the Blogs.json array
        BlogsList.push(newBlog)

        //4. write the array back into the JSON file as a string
        fs.writeFileSync(blogsPath, JSON.stringify(BlogsList))

        //5. provide a response 201 = created
        console.log(BlogsList)
        res.status(201).send(newBlog.id)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

// router.post('/:id/comments', CheckBlogPostSchema, CheckValidationResult, async (req, res) => {
//     try {
//         //1. read the body of the request
//         const postNewComment = { ...req.body.comments }
//         console.log(postNewComment)

// //2. read content of chosen json file (Blogs.json)
// const BlogsJSON = fs.readFileSync(blogsPath)
// const BlogsList = JSON.parse(BlogsJSON)

// //3. push the new Blog into the Blogs.json array
// BlogsList.push(newBlog)

// //4. write the array back into the JSON file as a string
// fs.writeFileSync(blogsPath, JSON.stringify(BlogsList))

// //5. provide a response 201 = created
// console.log(BlogsList)
// res.status(201).send(newBlog.id)
//     }
//     catch (err) {
//         console.log(err)
//         res.send(err)
//     }
// })

// Question 4
router.put('/:id', CheckBlogPostSchema, CheckValidationResult, async (req, res) => { //queries
    try {
        console.log("hello")
        //1. target blogs.json grab entire list of blogs from blogs.json
        const blogs = fs.readFileSync(blogsPath)

        //2. convert into readable array
        const parsedblogs = JSON.parse(blogs)

        //3. modify specified blog and add to new array
        const remainingBlogs = parsedblogs.filter(blog => blog.id !== req.params.id)
        const updatedblog = { ...req.body, id: req.params.id }
        remainingBlogs.push(updatedblog)

        //4. write (save) file with modified blog
        fs.writeFileSync(blogsPath, JSON.stringify(remainingBlogs))

        //5. send response
        res.send(updatedblog)
        console.log(err)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }

})

// Question 5
router.delete('/:id', (req, res) => { //TREAT THIS AS AN INPUT CHECK!!!!!

    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)

    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)

    //3. filter out specified id
    const remainingblogs = parsedblogs.filter(blog => blog.id !== req.params.id)

    //4. write the array back into the JSON file as a string
    fs.writeFileSync(blogsPath, JSON.stringify(remainingblogs))
    console.log("deleted") && res.status(204).send("deleted") // cant get this to log text or remaining on deletion but delete works

})

export default router