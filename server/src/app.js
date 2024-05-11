import express from 'express'
import fs from 'fs'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import multer from 'multer'
import { login } from './routes/login.js'
import { createBlog, readBlogs, readBlogOne, readBlogCount, frpBlogs, relatedBlogs, updateBlog, deleteBlog } from './routes/blog.js'
import { createUser, readUsers, updateUser, deleteUser } from './routes/user.js'
import { createCategory, readCategories, updateCategory, deleteCategory } from './routes/category.js'
import { loginPage, homePage, blogHomePage, blogInnerPage, pageNotFound } from './page/page.js'
import { newsletter } from './routes/newsletter.js'

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors())
app.use(express.json({ limit: '1024mb' }))
app.use(express.urlencoded({ limit: '1024mb', extended: true }))
app.use(express.static(path.join(__dirname, '../')))
app.use(express.static(path.join(__dirname, '../public/build/login/')))
app.use(express.static(path.join(__dirname, '../public/build/home/')))



const upload = multer({ limits: { fileSize: 1073741824, fieldSize: 1073741824 } })

// page
app.get('/', loginPage);
app.get('/home', homePage);


// api
app.post('/login', login)

app.post('/blogAdd', upload.any(), createBlog)
app.get('/blogGet', readBlogs)
app.get('/blog/:slug', readBlogOne)
app.post('/blogReadCount', readBlogCount)
app.post('/blogFrp', frpBlogs)
app.post('/blogRelated', relatedBlogs)
app.put('/blogEdit', upload.any(), updateBlog)
app.delete('/blogDelete/:id', deleteBlog)

app.post('/userAdd', upload.any(), createUser)
app.get('/userList', readUsers)
app.put('/userEdit', upload.any(), updateUser)
app.delete('/userDelete/:id', deleteUser)

app.post('/categoryAdd', createCategory)
app.get('/categoryList', readCategories)
app.put('/categoryUpdate', updateCategory)
app.delete('/categoryDelete/:id', deleteCategory)


// website
app.get('/blog', blogHomePage)
app.get('/blog-inner', blogInnerPage)
app.post('/newsletter', newsletter)


app.get('*', pageNotFound)


app.listen(4000)