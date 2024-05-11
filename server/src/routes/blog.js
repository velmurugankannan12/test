import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { mongodb } from '../models/mongodb.js'
import { ObjectId } from 'mongodb'
import { renderHtml, renderHtml404 } from '../ssr/blogInner.js'
import AWS from 'aws-sdk';

const __dirname = dirname(fileURLToPath(import.meta.url))


// Configure AWS S3
AWS.config.update({
    region: 'ap-southeast-2',
    accessKeyId: 'AKIAZQ3DSBFCFCHRWM63',
    secretAccessKey: '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'
});

const s3 = new AWS.S3();

export const createBlog = async (req, res) => {


    let data = req.body;
    let fileArray = [];

    if (req.files && req.files.length > 0) {
        try {
            await Promise.all(req.files.map(file => {
                const awsdestinationPath = data.id + '_' + file.originalname;
                const keyPath = `public/blog/${awsdestinationPath}`;

                const params = {
                    Bucket: 'blog-cms-telecmi',
                    Key: keyPath,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };

                return s3.upload(params).promise()
                    .then(awsdata => {
                        fileArray.push({ "field": file.fieldname, "filename": '/' + keyPath });
                    })
                    .catch(err => {
                        throw new Error("Failed to upload file to S3");
                    });
            }));
        } catch (error) {
            return res.status(500).send({ code: 500, msg: 'Failed to upload one or more files', error: error.message });
        }
    }

    // Process fileArray to update data object
    fileArray.forEach(({ field, filename }) => {
        const segments = field.split(/[\[\].]+/).filter(p => p);
        let ref = data;
        for (let i = 0; i < segments.length - 1; i++) {
            if (Array.isArray(ref[segments[i]])) {
                ref = ref[segments[i]][parseInt(segments[++i], 10)];
            } else {
                ref = ref[segments[i]];
            }
        }
        ref[segments[segments.length - 1]] = filename;
    });

    // Save the updated data to MongoDB
    try {
        const dbName = await mongodb()
        const collection = dbName.collection('blogs');
        await collection.insertOne(data);
        res.send({ code: 200, msg: 'success' });
    } catch (error) {
        res.status(500).send({ code: 500, msg: 'Database operation failed' });
    }
}

export const readBlogs = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('blogs')


    let search = req.query.search && JSON.parse(req.query.search)

    if (search) {

        let paginatedItems = await collection.find({
            $or: [
                { "blog_intro.blog_title": { $regex: search, $options: "i" } },
                { "category": { $regex: search, $options: "i" } },
                { "sub_category": { $regex: search, $options: "i" } }
            ]
        }).sort({ _id: -1 }).toArray()

        res.send({ code: 200, count: paginatedItems.length, blog: paginatedItems })

    }
    else if (req.query.filterCat) {

        let subCategory = req.query.filterSubCat && JSON.parse(req.query.filterSubCat)

        // let data = await collection.find({ sub_category: { $in: ["Tech Talk"] } }).toArray()

        if (subCategory && subCategory.length > 0) {
            let paginatedItems = await collection.find({ category: req.query.filterCat, sub_category: { $in: JSON.parse(req.query.filterSubCat) } }).sort({ _id: -1 }).toArray()
            res.send({ code: 200, count: paginatedItems.length, blog: paginatedItems })
        }
        else {
            let paginatedItems = await collection.find({ category: req.query.filterCat }).sort({ _id: -1 }).toArray()
            res.send({ code: 200, count: paginatedItems.length, blog: paginatedItems })
        }

    } else {
        const page = parseInt(req.query.page) || 1;

        const limit = 12;

        const startIndex = (page - 1) * limit;

        const endIndex = page * limit;


        let paginatedItems = await collection.find().sort({ _id: -1 }).skip(startIndex).limit(endIndex).toArray()

        let countDocuments = await collection.countDocuments({})

        res.send({ code: 200, count: countDocuments, blog: paginatedItems })
    }

}

export const readBlogCount = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('blogs')

    const blog = await collection.findOne({ id: '1711341128891_5qucd8osrg' });

    if (blog) {
        let count = blog.count ? blog.count + 1 : 1
        let _id = blog._id

        delete blog._id

        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: { count: count } })

        res.send({ code: 200, msg: "Blog read count updated" })

    } else {
        res.send({ code: 200, msg: "Unable to update Blog read count" })
    }
}

export const frpBlogs = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('blogs')

    const blogs = await collection.find({}).toArray()

    let currentBlogID = req.body._id
    let removeCurrentBlog = blogs.filter(item => item._id !== currentBlogID)

    removeCurrentBlog.sort((a, b) => b.count - a.count)

    let topThreeblogs = blogs.slice(0, 3)

    if (blogs) {
        res.send({ code: 200, blogs: topThreeblogs })
    }
}

export const relatedBlogs = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('blogs');

    const blogs = await collection.find({}).toArray();

    let currentBlogID = req.body._id;
    let currentBlogSubCategory = req.body.sub_category;

    let removeCurrentBlog = blogs.filter(item => !item._id.equals(new ObjectId(currentBlogID)));

    let relatedBlogs = removeCurrentBlog.filter(item => item.sub_category === currentBlogSubCategory).slice(0, 4);

    if (blogs.length > 0) {
        res.send({ code: 200, blogs: relatedBlogs });
    }
}

export const readBlogOne = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('blogs')

    const slug = req.params.slug
    // const slug = req.params.slug && 'https:www.telecmi.com/blog/' + req.params.slug;

    const blog = await collection.findOne({ url_slug: slug });

    if (blog) {
        renderHtml(res, blog)
    } else {
        renderHtml404(res)
    }

}

export const updateBlog = async (req, res) => {



    let data = req.body
    let _id = req.body._id

    const uploadDir = '../../public/blog';
    let fileArray = []

    let filesToKeep = [];

    function collectPaths(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'string' && obj[key].includes('/public/blog')) {
                let remove_pub_blog = obj[key].replace('/public/blog/', '')
                filesToKeep.push(remove_pub_blog);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                collectPaths(obj[key]);
            }
        }
    }

    collectPaths(data);

    try {
        const listParams = {
            Bucket: 'blog-cms-telecmi',
            Prefix: `public/blog/${data.id}_` // assuming filename structure includes the id prefix
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        const deleteParams = {
            Bucket: 'blog-cms-telecmi',
            Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
            if (!filesToKeep.includes(Key.replace('public/blog/', ''))) {
                deleteParams.Delete.Objects.push({ Key });
            }
        });

        if (deleteParams.Delete.Objects.length > 0) {
            await s3.deleteObjects(deleteParams).promise();
        }
    } catch (err) {
        return res.send({ code: 500, msg: 'Failed to process files' });
    }


    if (req.files && req.files.length > 0) {
        try {
            await Promise.all(req.files.map(file => {
                const awsdestinationPath = data.id + '_' + file.originalname;
                const keyPath = `public/blog/${awsdestinationPath}`;

                const params = {
                    Bucket: 'blog-cms-telecmi',
                    Key: keyPath,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };

                return s3.upload(params).promise()
                    .then(awsdata => {
                        fileArray.push({ "field": file.fieldname, "filename": '/' + keyPath });
                    })
                    .catch(err => {
                        throw new Error("Failed to upload file to S3");
                    });
            }));
        } catch (error) {
            return res.status(500).send({ code: 500, msg: 'Failed to upload one or more files', error: error.message });
        }
    }


    fileArray.forEach(({ field, filename }) => {
        const segments = field.split(/[\[\].]+/).filter(p => p);
        let ref = data;
        for (let i = 0; i < segments.length - 1; i++) {
            if (Array.isArray(ref[segments[i]])) {
                ref = ref[segments[i]][parseInt(segments[++i], 10)];
            } else {
                ref = ref[segments[i]];
            }
        }
        ref[segments[segments.length - 1]] = filename;
    });

    delete data._id

    let dbName = await mongodb()
    let collection = dbName.collection('blogs')
    // await collection.insertOne(data)
    let update = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: data })

    // if (update.modifiedCount > 0) {
    res.send({ code: 200, msg: 'success' })
    // }else{
    //     res.send({ code: 400, msg: 'Blog not updated' })
    // }
}

export const deleteBlog = async (req, res) => {
    const id = req.params.id;
    const deleteFileID = req.body.id; // This is assumed to be part of the filename stored in S3

    const dbName = await mongodb();
    const collection = dbName.collection('blogs');

    let deleteBlog = await collection.deleteOne({ _id: new ObjectId(id) });

    if (deleteBlog.deletedCount > 0) {
        // Define the prefix to search for files in S3
        const prefix = `public/blog/${deleteFileID}`;

        try {
            // List all objects in the bucket with the specified prefix
            const listedObjects = await s3.listObjectsV2({
                Bucket: 'blog-cms-telecmi',
                Prefix: prefix,
            }).promise();

            if (listedObjects.Contents.length > 0) {
                // Delete the objects
                const deleteParams = {
                    Bucket: 'blog-cms-telecmi',
                    Delete: { Objects: [] }
                };

                listedObjects.Contents.forEach(({ Key }) => {
                    deleteParams.Delete.Objects.push({ Key });
                });

                await s3.deleteObjects(deleteParams).promise();
                res.send({ code: 200, message: 'Blog and files deleted successfully' });
            } else {
                res.send({ code: 200, message: 'Blog deleted, no files found' });
            }
        } catch (err) {
            res.send({ code: 400, message: 'Failed to delete files from S3' });
        }
    } else {
        res.send({ code: 400, message: 'Blog not deleted' });
    }
}
