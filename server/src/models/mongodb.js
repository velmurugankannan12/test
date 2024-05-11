import { MongoClient } from 'mongodb'
import { dbUrl } from '../config/config.js'


const client = new MongoClient(dbUrl);

const dbName = 'blog'

export const mongodb = async () => {
    try {
        await client.connect();
        return client.db(dbName)
    } catch (error) {
        throw error
    }
}
