import { ethPrivKey, infuraKey, lighthousePassword, pinataKey, pinataSecret } from './.keys'

const lp = process.env.LIGHTHOUSE || lighthousePassword
const pk = process.env.PINATA_KEY || pinataKey
const ps = process.env.PINATA_SECRET || pinataSecret
const ethPK = process.env.ETH_KEY || ethPrivKey
const ik = process.env.INFURA || infuraKey

export {
    lp as lighthousePassword,
    pk as pinataKey,
    pinataSecret,
    ethPK as ethPrivKey,
    ik as infuraKey,
}