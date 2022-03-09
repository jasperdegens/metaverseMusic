import { Entity } from 'aframe'
// @ts-ignore
import ConfettiGenerator from 'confetti-js'
import { InstrumentController } from './components/instrument'

require('aframe')
require('./components/movable')
require('./components/musicPlayerUi')
require('./components/walletUi')
require('./components/instrument')
require('./main.css')
require('./components/ui')

const explainerText = "Welcome to the wonderful world of spatial audio! You are currently listening to the XXXXX track, which features a PIANO, DRUMS, VOCALS, and DRUMS."

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

        // fill in explainer text
        const explainerElem = document.getElementById('explainer-text') as Entity<any>
        explainerElem?.setAttribute('text', {
            'value' : explainerText
        })

        
    }
    
    const instrumentControllerEl = document.getElementById('instrument-controller') as Entity<any>
    // add event listener to buttons for positioning of instruments
    const posBtns = document.getElementsByClassName('instrument-position-btn')
    for(let i = 0; i < posBtns.length; i++) {
        const btn = posBtns[i]
        btn.addEventListener('click', () => {
            const instrumentController = instrumentControllerEl.components['instrument-controller'] as InstrumentController
            // @ts-ignore
            instrumentController.positionTracks(btn.dataset.postype)
        })
    }
})

