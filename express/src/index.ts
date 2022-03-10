import express from 'express'
import cors from 'cors'
import fileUpload, { UploadedFile } from 'express-fileupload'
import bodyParser from 'body-parser';
import _ from 'lodash'
import { addSong, getSongData, getSongs, storePinata } from './storage';
import path from 'path';
import fs from 'fs'
import { SongData } from './types';

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

        const songData: SongData = {
            title: req.body['song-title'],
            artist: req.body['song-artist'],
            description: req.body['song-description'],
            stem1cid: req.body['stem-1-cid'],
            stem1type: req.body['stem-1-type'],
            stem2cid: req.body['stem-2-cid'],
            stem2type: req.body['stem-2-type'],
            stem3cid: req.body['stem-3-cid'],
            stem3type: req.body['stem-3-type'],
            stem4cid: req.body['stem-4-cid'],
            stem4type: req.body['stem-4-type'],
            stem5cid: req.body['stem-5-cid'],
            stem5type: req.body['stem-5-type'],
            stem6cid: req.body['stem-6-cid'],
            stem6type: req.body['stem-6-type'],
            stem7cid: req.body['stem-7-cid'],
            stem7type: req.body['stem-7-type'],
        }

        await addSong(songData)

        res.send({
            status: true,
            message: 'Song Created!!!',
            songId: songData.title
        })


    } catch (err) {
        res.status(500).send(err);
    }
})

// get all songs
app.get('/songs', async (req, res) => {
    const songs = await getSongs()
    console.log(songs)
    res.send({
        status: true,
        songs: songs
    })

})

app.get('/song', async(req, res) => {
    const title = req.query.title as string

    if(!title) {
        res.send({
            message: 'No title provided!'
        })
        return
    }

    const songData = await getSongData(title)

    if(!songData) {
        res.send({
            message: 'Song does not exist!'
        })
        return
    }

    res.send({
        message: 'success',
        data: songData
    })
})