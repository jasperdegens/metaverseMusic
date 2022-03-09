
require('aframe')
require('./components/movable')
require('./components/musicPlayerUi')
require('./components/walletUi')
require('./components/instrument')
require('./main.css')


// add threemeshui update block
window.addEventListener('load', () => {

    const startButtons = document.getElementsByClassName('experience-start')
    for(const b of startButtons) {
        b.addEventListener('click', (e) => {
            console.log(e)
        })
    }

})