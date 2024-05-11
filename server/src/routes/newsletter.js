import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { mongodb } from '../models/mongodb.js'


const __dirname = dirname(fileURLToPath(import.meta.url))


export const newsletter = async (req, res) => {

    let data = req.body

    let dbName = await mongodb()
    let collection = dbName.collection('newsletter')

    const email = await collection.findOne({ newsletterEmail: data.newsletterEmail })

    if (email) {
        res.send({ code: 409, msg: 'email already exists' })
    } else {
        await collection.insertOne(data)

        res.send({ code: 200, msg: 'success' })
    }

}