
require('dotenv').config()

const lp = process.env.LIGHTHOUSE!
const pk = process.env.PINATA_KEY!
const ps = process.env.PINATA_SECRET!
const ethPK = process.env.ETH_KEY!
const ik = process.env.INFURA!


export {
    lp as lighthousePassword,
    pk as pinataKey,
    ps as pinataSecret,
    ethPK as ethPrivKey,
    ik as infuraKey,
}