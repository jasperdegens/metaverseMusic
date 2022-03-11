
import { ethPrivKey, infuraKey, pinataKey, pinataSecret } from './keys'
import fs from 'fs'
import pinataSDK, { PinataOptions, PinataPinOptions, PinataPinResponse } from '@pinata/sdk'
import { Wallet, providers } from "ethers";
import { connect, Connection } from "@textile/tableland";
import { SongData } from './types';
import './fetch-polyfill'

const pinata = pinataSDK(pinataKey, pinataSecret)


// const client = new Web3Storage({token: web3StorageApiKey})

// const storeWeb3 = async (filePath: string) => {

//     const files = await getFilesFromPath(filePath)

//     console.log(files)


// }

const pinataPinPromise = (readStream: any, options?: PinataPinOptions): Promise<PinataPinResponse> => {
    const prom = new Promise<PinataPinResponse>((res, rej) => {
        pinata.pinFileToIPFS(readStream, options).then(d => res(d)).catch(rej)
    })

    return prom
}

const storePinata = async (filePath: string, name: string) => {
    const readStream = fs.createReadStream(filePath)

    const options = {
        pinataMetadata: {
            name,
            // keyvalues: {
            //     app: 'metaverse-music'
            // }
        },
        // pinataOptions: {
        //     cidVersion: 0
        // }
    }

    try {
        const res = await pinataPinPromise(readStream, options)
        console.log(res)

        return res.IpfsHash
        
    } catch (error) {
        console.log(error)
    }

    return 'ERROR'

}

const wallet = new Wallet(ethPrivKey)
// We also need an RPC provider to connect to
const provider = new providers.InfuraProvider("rinkeby", infuraKey);
const signer = wallet.connect(provider);


const tableBaseName = 'metaversemusicv2'

let musicTableId: string | undefined

const createMusicTable = async (tbl: Connection): Promise<string> => {
    const musicTableRes = await tbl.create(
        `CREATE TABLE ${tableBaseName} (title text, artist text, description text, stem1cid text, stem1type text, stem2cid text, stem2type text, stem3cid text, stem3type text, stem4cid text, stem4type text, stem5cid text, stem5type text, stem6cid text, stem6type text, stem7cid text, stem7type text, primary key (title));`, 
        {description: 'Metaverse Music Table'}
    )
    console.log('CREATED METAVERSE MUSIC TABLE')

    return musicTableRes.name
}


const getMusicTable = async (tbl: Connection): Promise<string> => {
    if(musicTableId)
        return musicTableId

    // for now query tables and look for match
    const currTables = await tbl.list()

    const musicTbl = currTables.find(t => t.name!.includes(tableBaseName))

    if(!musicTbl) {
        musicTableId = await createMusicTable(tbl)
    } else {
        musicTableId = musicTbl.name!
    }

    return musicTableId

}




const addSong = async (songData: SongData) => {
    const tbl = await connect({ network: "testnet", signer }); 
    
    const tblName = await getMusicTable(tbl)

    try {
        const req = `INSERT INTO ${tblName} (title, artist, description, stem1cid, stem1type, stem2cid, stem2type, stem3cid, stem3type, stem4cid, stem4type, stem5cid, stem5type, stem6cid, stem6type, stem7cid, stem7type) VALUES ('${songData.title}', '${songData.artist}', '${songData.description}', '${songData.stem1cid}', '${songData.stem1type}', '${songData.stem2cid}', '${songData.stem2type}', '${songData.stem3cid}', '${songData.stem3type}', '${songData.stem4cid}', '${songData.stem4type}', '${songData.stem5cid}', '${songData.stem5type}', '${songData.stem6cid}', '${songData.stem6type}', '${songData.stem7cid}', '${songData.stem7type}');`

        const insert = await tbl.query(req)
    } catch (error) {
        console.log(error)
    }

}

async function tblInit() {
    const tbl = await connect({ network: "testnet", signer });  
    const tblid = await getMusicTable(tbl)
    
    console.log(tblid)
}

// create table if does not exist on startup
tblInit()


const getSongs = async() => {
    const tbl = await connect({ network: "testnet", signer }); 


    const tblName = await getMusicTable(tbl)

    const query = `SELECT title, artist FROM ${tblName};`

    const q = await tbl.query(query)

    // @ts-ignore
    return q.data.rows


}

const getSongData = async(songTitle: string): Promise<SongData | undefined> => {
    
    const tbl = await connect({ network: "testnet", signer }); 


    const tblName = await getMusicTable(tbl)

    const query = `SELECT * FROM ${tblName} WHERE title='${songTitle}';`

    const q = await tbl.query(query)
    
    // @ts-ignore
    const songCast = q.data.rows[0]

    const song = songCast as string[]

    if(!song || song.length == 0) {
        return undefined
    }

    return {
        title: song[0],
        artist: song[1],
        description: song[2],
        stem1cid: song[3],
        stem1type: song[4],
        stem2cid: song[5],
        stem2type: song[6],
        stem3cid: song[7],
        stem3type: song[8],
        stem4cid: song[9],
        stem4type: song[10],
        stem5cid: song[11],
        stem5type: song[12],
        stem6cid: song[13],
        stem6type: song[14],
        stem7cid: song[15],
        stem7type: song[16],
    }
}


export {
    storePinata,
    addSong,
    getSongs,
    getSongData,
}

