import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { mongodb } from '../models/mongodb.js'
import { ObjectId } from 'mongodb'
import AWS from 'aws-sdk';


// Configure AWS S3
AWS.config.update({
    region: 'ap-southeast-2',
    accessKeyId: 'AKIAZQ3DSBFCFCHRWM63',
    secretAccessKey: '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'
});

const s3 = new AWS.S3();

const __dirname = dirname(fileURLToPath(import.meta.url))

export const createUser = async (req, res) => {
    let data = req.body;
    const fileArray = [];

    if (req.files) {

        await Promise.all(req.files.map(file => {
            const awsdestinationPath = data.id + '_' + file.originalname;
            const keyPath = `public/user/${awsdestinationPath}`;

            const params = {
                Bucket: 'blog-cms-telecmi',
                Key: keyPath,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            return s3.upload(params).promise()
                .then(s3Data => {
                    console.log('File uploaded successfully:', s3Data.Location);
                    fileArray.push({ "field": file.fieldname, "filename": '/' + keyPath });
                })
                .catch(err => {
                    console.error('Error uploading file:', err);
                    throw err;
                });
        }));
    }

    // Update data paths for uploaded files
    fileArray.forEach(({ field, filename }) => {
        const paths = field.split(/[\[\].]+/).filter(p => p);
        let ref = data;
        for (let i = 0; i < paths.length - 1; i++) {
            ref = ref[paths[i]];
            if (Array.isArray(ref)) {
                ref = ref[parseInt(paths[++i], 10)];
            }
        }
        ref[paths[paths.length - 1]] = filename;
    });

    // Save to MongoDB
    try {
        const dbName = await mongodb();
        const collection = dbName.collection('users');
        const result = await collection.insertOne(data);
        res.send({ code: 200, msg: 'success' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send({ code: 500, msg: 'Failed to create user' });
    }
}



export const readUsers = async (req, res) => {

    let dbName = await mongodb();
    let collection = dbName.collection('users')

    let userList = await collection.find({}).toArray()

    res.send({ code: 200, count: userList.length, users: userList })
}


export const updateUser = async (req, res) => {
    console.log(req.body);

    let data = req.body;
    let _id = req.body._id;

    let fileArray = [];
    let filesToKeep = [];

    function collectPaths(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'string' && obj[key].includes('/public/user')) {
                let filename = obj[key].split('/public/user/')[1];
                filesToKeep.push(filename);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                collectPaths(obj[key]);
            }
        }
    }

    collectPaths(data);

    try {
        const listParams = {
            Bucket: 'blog-cms-telecmi',
            Prefix: `public/user/${data.id}_`
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        const deleteParams = {
            Bucket: 'blog-cms-telecmi',
            Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
            if (!filesToKeep.includes(Key.split('/public/user/')[1])) {
                deleteParams.Delete.Objects.push({ Key });
            }
        });

        if (deleteParams.Delete.Objects.length > 0) {
            await s3.deleteObjects(deleteParams).promise();
            console.log('Unused files deleted successfully');
        }
    } catch (err) {
        console.error('Error processing files on S3:', err);
        return res.send({ code: 500, msg: 'Failed to process files' });
    }

    if (req.files) {
        const uploadPromises = req.files.map(file => {
            const awsdestinationPath = data.id + '_' + file.originalname;
            const keyPath = `public/user/${awsdestinationPath}`;

            const params = {
                Bucket: 'blog-cms-telecmi',
                Key: keyPath,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            return s3.upload(params).promise().then(s3Data => {
                console.log('File uploaded successfully:', s3Data.Location);
                fileArray.push({ "field": file.fieldname, "filename": '/' + keyPath });
            }).catch(err => {
                console.error('Error uploading file:', err);
                throw err;
            });
        });

        await Promise.all(uploadPromises);
    }

    fileArray.forEach(({ field, filename }) => {
        const paths = field.split(/[\[\].]+/).filter(p => p);
        let ref = data;
        for (let i = 0; i < paths.length - 1; i++) {
            ref = ref[paths[i]];
            if (Array.isArray(ref)) {
                ref = ref[parseInt(paths[++i], 10)];
            }
        }
        ref[paths[paths.length - 1]] = filename;
    });

    delete data._id;

    let dbName = await mongodb();
    let collection = dbName.collection('users');
    let update = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: data });

    res.send({ code: 200, msg: 'User updated successfully' });
};



export const deleteUser = async (req, res) => {

    const id = req.params.id;
    const deleteFileID = req.body.id;
    console.log(deleteFileID)

    let dir = path.join(__dirname, '../../public/user')

    const dbName = await mongodb()
    const collection = dbName.collection('users')

    let deleteBlog = await collection.deleteOne({ _id: new ObjectId(id) })

    if (deleteBlog.deletedCount > 0) {

        fs.readdir(dir, (err, files) => {
            if (err) {
                res.send({ code: 400, message: 'Blog not deleted' });
                return;
            }

            files.forEach(file => {
                if (file.includes(deleteFileID)) {
                    fs.unlink(path.join(dir, file), err => {
                        if (err) {
                            // res.send({ code: 400, message: 'Unable to delete blog files' });
                        } else {
                            // res.send({ code: 200, message: 'Blog deleted successfully' });
                        }
                    });
                }
            });
        });

        res.send({ code: 200, message: 'Blog deleted successfully' });

    } else {
        res.send({ code: 400, message: 'Blog not deleted' });
    }
}