import ThreeMeshUI from 'three-mesh-ui'


require('aframe')
require('./components/movable')
require('./components/musicPlayerUi')
require('./components/walletUi')
require('./components/instrument')


// add threemeshui update block
window.addEventListener('load', () => {
    const meshUILoop = () => {
        ThreeMeshUI.update()
        requestAnimationFrame(meshUILoop)
    }

    requestAnimationFrame(meshUILoop)
})