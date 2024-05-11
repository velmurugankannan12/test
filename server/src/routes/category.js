import { mongodb } from '../models/mongodb.js'
import { ObjectId } from 'mongodb'


export const createCategory = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('category')

    let data = req.body;

    let find = await collection.findOne({ category: data.category.toLowerCase() })

    if (find) {
        res.send({ code: 400, msg: 'category already exists' })
    } else {
        let add = await collection.insertOne({ category: data.category, subCategory: data.subCategory })

        if (add.acknowledged) {
            res.send({ code: 200, msg: 'category added successfully' })
        } else {
            res.send({ code: 400, msg: 'category not added' })
        }
    }

}

export const readCategories = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('category')

    let category = await collection.find({}).toArray()

    res.send({ code: 200, count: category.length, category: category })

}

export const updateCategory = async (req, res) => {

    let data = req.body;
    let _id = req.body._id

    let dbName = await mongodb();
    let collection = dbName.collection('category')


    delete data._id

    let update = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: data })

    res.send({ code: 200, msg: 'Category update successfully' })

}

export const deleteCategory = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('category')

    if (req.params.id) {
        let id = req.params.id
        let category = await collection.deleteOne({ _id: new ObjectId(id) })

        if (category.deletedCount > 0) {
            res.send({ code: 200, msg: 'Category deleted successfully' })
        } else {
            res.send({ code: 400, msg: 'User not delete' })
        }
    }
}