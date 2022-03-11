import { Entity } from 'aframe'
// @ts-ignore
import ConfettiGenerator from 'confetti-js'
import { InstrumentController, InstrumentType, ITrackData } from './components/instrument'

require('aframe')
require('./components/movable')
require('./components/musicPlayerUi')
require('./components/walletUi')
require('./components/instrument')
require('./main.css')
require('./components/ui')

const explainerText = (title: string, artist: string, stems: ITrackData[]) => `Welcome to the wonderful world of spatial audio! You are currently listening to ${title} by ${artist}, which features ${stems.map(s => s.name).slice(0, stems.length - 1).join(", ")} and ${stems[stems.length - 1].name} stems. Press play below to start the track!`

const apiEndpoint = 'https://enigmatic-coast-18734.herokuapp.com'
const getSongsUrl = `${apiEndpoint}/songs`
const getSongDetails = `${apiEndpoint}/song`
const baseGateway = 'https://gateway.pinata.cloud/ipfs'


let songTitle = ''
let songSelected = false


async function tryLoadSong () {

    const XHR = new XMLHttpRequest();

    // Define what happens on successful data submission
    XHR.addEventListener( "load", function(event) {
        
        const activeTracks: ITrackData[] = []

        try {
            console.log(XHR.response)
            const data = JSON.parse(XHR.response)
            console.log(data)
            const details = data.data

            // load in all stems
            for(let i = 1; i <= 7; i++) {
                const stemCID = details[`stem${i}cid`]
                if(stemCID) {
                    const stemType = (details[`stem${i}type`] as string).toLowerCase()
                    activeTracks.push({
                        name: stemType.charAt(0).toUpperCase() + stemType.slice(1),
                        src: `${baseGateway}/${stemCID}`,
                        instrument: stemType as InstrumentType
                    })
                }
            }

            // setup component

            console.log(activeTracks)
            const controller = document.querySelector('[instrument-controller]')
            const instumentController = controller.components['instrument-controller'] as InstrumentController
            instumentController.setupTracks(activeTracks)

            // fill in explainer text
            const explainerElem = document.getElementById('explainer-text') as Entity<any>
            explainerElem?.setAttribute('text', {
                'value' : explainerText(details.title, details.artist, activeTracks)
            })

        } catch (error) {
            
        }
    } );

    // Define what happens in case of error
    XHR.addEventListener( "error", function( event ) {
      alert( 'Oops! Something went wrong getting songs.' );
    } );

    // Set up our request
    XHR.open( "GET", `${getSongDetails}?title=${songTitle}`);

    // The data sent is what the user provided in the form
    XHR.send();
}




function htmlToElement(html: string) {
    var template = document.createElement('template') as unknown as HTMLTemplateElement
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild!;
}

const songRow = (title: string, artist: string) => {

    const html = `
    <tr class="relative cursor-pointer">
    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">${title}</td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${artist}</td>
    </td>
    </tr>`
  console.log(html)

  return htmlToElement(html)

}

const handleRowClick = (row: HTMLElement, table: HTMLElement) => {

    // allow start buttons to be visible
    const startButtons = document.getElementsByClassName('experience-start')
    for(const b of startButtons) {
        b.classList.remove('hidden')
    }

    // first remove all avtive class
    for(let i = 0; i < table.children.length; i++) {
        table.children[i].children[0].classList.remove('rainbow-bg', 'text-white')
    }

    row.children[0].classList.add('rainbow-bg', 'text-white')
    songTitle = row.children[0].innerHTML;
}

// retreive valid songs and populate table
const reqSongs = async () => {
    const XHR = new XMLHttpRequest();

    // Define what happens on successful data submission
    XHR.addEventListener( "load", function(event) {
        
        // get table elem
        const songTable = document.getElementById('song-table')
        console.log(songTable)
        songTable!.innerHTML = ''
        try {
            console.log(XHR.response)
            const data = JSON.parse(XHR.response)
            console.log(data)
            const songs = data.songs

            for(let i = 0; i < songs.length; i++) {
                const song = songs[i]
                // create song elem
                const songElem = songRow(song[0], song[1])
                songTable?.appendChild(songElem)

                // add event listener
                songElem.addEventListener('click', () => {
                    handleRowClick(songElem as HTMLElement, songTable!)
                })
            }


        } catch (error) {
            
        }
    } );

    // Define what happens in case of error
    XHR.addEventListener( "error", function( event ) {
      alert( 'Oops! Something went wrong getting songs.' );
    } );

    // Set up our request
    XHR.open( "GET", getSongsUrl );

    // The data sent is what the user provided in the form
    XHR.send();

}

reqSongs()


// add threemeshui update block
window.addEventListener('load', () => {
    var confettiSettings = { target: 'confetti-canvas',
        props: [
            {type: 'svg', src: 'assets/quarterNote.svg'},
            {type: 'svg', src: 'assets/quarterNotes.svg'},
            {type: 'svg', src: 'assets/trumpet.svg'},
            {type: 'svg', src: 'assets/piano.svg'}
        ],
        rotate: true,
        size: 3,
        
    };
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    const startButtons = document.getElementsByClassName('experience-start')
    for(const b of startButtons) {
        b.addEventListener('click', (e) => {

            // hide overlay
            document.getElementById('overlay-wrapper')?.classList.add('hidden')


            console.log(e)
            
            confetti.clear()

            // load song data
            tryLoadSong()

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

    // setup play button
    const a = document.querySelector('a-entity')
    const playButton = document.getElementById('play-btn') as Entity<any>

    // start play button as disabled
    playButton?.setAttribute('button', 'text', 'Loading Tracks...')

    document.querySelector('a-scene').addEventListener('songs-loaded', () => {
        playButton?.setAttribute('button', 'text', 'Play!')

        playButton?.addEventListener('click', () => {
            const sounds = document.querySelectorAll('[sound]')
            for(const s of sounds) {
                // @ts-ignore
                s.components.sound.playSound()
            }
        })
    })

})

