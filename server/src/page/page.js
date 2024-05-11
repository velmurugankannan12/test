import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// app
export const loginPage = (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../../public/build/login') })
}

export const homePage = (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../../public/build/home') })
}

// website
export const blogHomePage = (req, res) => {
    res.sendFile('blogHome.html', { root: path.join(__dirname, '../views') })
}

export const blogInnerPage = (req, res) => {
    res.sendFile('blogInner.html', { root: path.join(__dirname, '../views') })
}

export const pageNotFound = (req, res) => {
    res.sendFile('page404.html', { root: path.join(__dirname, '../views') })
}