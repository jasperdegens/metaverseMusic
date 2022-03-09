// @ts-ignore
import ConfettiGenerator from 'confetti-js'

require('aframe')
require('./components/movable')
require('./components/musicPlayerUi')
require('./components/walletUi')
require('./components/instrument')
require('./main.css')
require('./components/ui/button')


// add threemeshui update block
window.addEventListener('load', () => {
    var confettiSettings = { target: 'confetti-canvas',
        props: [
            {type: 'svg', src: 'assets/quarterNote.svg'},
            {type: 'svg', src: 'assets/quarterNotes.svg'}
        ],
        rotate: true,
        size: 3,
        
    };
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    const startButtons = document.getElementsByClassName('experience-start')
    for(const b of startButtons) {
        b.addEventListener('click', (e) => {
            console.log(e)
            
            confetti.clear()
        })
    }

})
