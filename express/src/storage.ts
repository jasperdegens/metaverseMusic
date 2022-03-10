
import { pinataKey, pinataSecret, web3StorageApiKey } from './.keys'
import fs from 'fs'
import pinataSDK, { PinataOptions, PinataPinOptions, PinataPinResponse } from '@pinata/sdk'

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



const tableLandStore = async () => {

}





export {
    storePinata
}

