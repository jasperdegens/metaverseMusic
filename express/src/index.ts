import express from 'express'
import cors from 'cors'
import fileUpload, { UploadedFile } from 'express-fileupload'
import bodyParser from 'body-parser';
import _ from 'lodash'
import { storePinata } from './storage';
import path from 'path';
import fs from 'fs'

const morgan = require('morgan')


const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB
    },
    abortOnLimit: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 4000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);


const allowedFileExtensions = ['.mp3', '.wav']

app.post('/upload-stem', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {

            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let stem = req.files.stem as UploadedFile;

            if(!(allowedFileExtensions.includes(path.extname(stem.name)))){
                throw new Error("invalid filetype")
            }
            
            const dest = 'uploads/' + stem.name
            await stem.mv(dest)
            const cid = await storePinata(dest, stem.name)
            fs.rm(dest, () => {})
            console.log(cid)

            res.send({
                status: true,
                message: 'upload is a success!',
                data: {
                    cid: cid
                }
            })
            return
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/post-song', async (req, res) => {
    try {

        console.log(req.body)


    } catch (err) {
        res.status(500).send(err);
    }
})