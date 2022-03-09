import { ComponentDefinition, DetailEvent } from "aframe";

const defaultFont = 'assets/Plaster-Regular.ttf'

interface IInstrumentProps {

}

type InstrumentComponent = ComponentDefinition<IInstrumentProps>

type InstrumentType = 'keys' | 'guitar' | 'bass' | 'vocals' | 'drums' | 'other'

interface ITrackData {
    name: string, 
    instrument: InstrumentType,
    src: string
}

const sampleTrackData: ITrackData[] = [
    {
        name: 'Vocals',
        instrument: "vocals",
        src: 'assets/violin1AMono.mp3'
    },
    {
        name: 'Keys',
        instrument: "keys",
        src: 'assets/chelloAMono.mp3'
    },
    {
        name: 'Drums',
        instrument: "drums",
        src: 'assets/violaAMono.mp3'
    },
    {
        name: 'Bass',
        instrument: "bass",
        src: 'assets/violin2AMono.mp3'
    }
]

interface IInstrumentControllerProps {
    setupTracks: (tracks: ITrackData[]) => void
}

const instrumentController: ComponentDefinition<IInstrumentControllerProps> = {
    init: function () {
        this.setupTracks(sampleTrackData)
    },
    setupTracks: function(tracks: ITrackData[]) {
        for (let i = 0; i < tracks.length; i++) {
            const trackData = tracks[i];

            const track = document.createElement('a-entity')
            track.setAttribute('sound', 'src', `url(${trackData.src})`)

            track.setAttribute('instrument', {
                'instrumentType': trackData.instrument,
                name: trackData.name
            })

            track.setAttribute('position', `${-(tracks.length / 2) * 2 + i * 2 } 1 -1`)

            const id = `track-${i}`
            track.setAttribute('id', id)
            track.setAttribute('moveable', {
                moveEl: id
            })

            this.el.appendChild(track)
        }
    }
}

const instrumentUi: ComponentDefinition<IInstrumentControllerProps> = {
    init: function () {
        this.setupTracks(sampleTrackData)
    },
    setupTracks: function (tracks) {
        
        // build base panel
        const container = document.createElement('a-entity')
        container.setAttribute('geometry', {
            primitive: 'plane',
            height: 3,
            width: 1
        })
        container.setAttribute('position', '0 2.5 -3')

        for (let i = 0; i < tracks.length; i++) {
            const trackData = tracks[i];
            
        }

        this.el.appendChild(container)
    }
}


const instrumentComponemt: InstrumentComponent = {
    dependencies: ['sound'],
    schema: {
        instrumentType: {type: 'string'},
        name: {type: 'string'}
    },
    update: function () {
        // create geom depending on instrument type
        const instrumentType = this.data.instrumentType as InstrumentType
        
        let geom
        switch (instrumentType) {
            case 'bass':
                geom = 'cone'
                break;
            case 'drums':
                geom = 'box'
                break;
            case 'guitar':
                geom = 'cylinder'
                break;
            case 'keys':
                geom = 'dodecahedron'
                break;
            case 'vocals':
                geom = 'sphere'
                break;
            default:
                geom = 'torus'
                break;
        }

        // create geom elem
        const geomEl = document.createElement('a-entity')
        geomEl.setAttribute('geometry', {
            primitive: geom,
            radius: 1,
            width: 1,
            depth: 1,
            height: 1
        })

        // add in hover anims -- needs to be initted first because of aframe error
        setTimeout(() => {
            geomEl.setAttribute('animation__hoverStartScale', {
                property: 'scale',
                to: '1.1 1.1 1.1s',
                startEvents: 'mouseenter',
                dur: 125,
            })

            geomEl.setAttribute('animation__hoverStopScale', {
                property: 'scale',
                to: '1 1 1',
                startEvents: 'mouseleave',
                dur: 125
            })
        }, 100)

        
        this.el.appendChild(geomEl)
        
        
        const instrumentLabel = document.createElement('a-entity')
        instrumentLabel.setAttribute('button', {
            text: this.data.name
        })
        instrumentLabel.setAttribute('position', `0 1.5 0`)
        
        instrumentLabel.addEventListener('click', () => {
            console.log(instrumentLabel.getAttribute('text'))
        })
        this.el.appendChild(instrumentLabel)
        
        // hook up mouseover to trigger label mouseover
        geomEl.addEventListener('mouseenter', (evt) => {
            const e = evt as CustomEvent<any>
            if(e.bubbles)
                instrumentLabel.emit('mouseenter', e.detail, false)
        })
        geomEl.addEventListener('mouseleave', (evt) => {
            const e = evt as CustomEvent<any>
            if(e.bubbles)
                instrumentLabel.emit('mouseleave', e.detail, false)
        })
        // hook up mouseover to trigger label mouseover
        instrumentLabel.addEventListener('mouseenter', (evt) => {
            const e = evt as CustomEvent<any>
            if(e.bubbles)
                geomEl.emit('mouseenter', e.detail, false)
        })
        instrumentLabel.addEventListener('mouseleave', (evt) => {
            const e = evt as CustomEvent<any>
            if(e.bubbles)
                geomEl.emit('mouseleave', e.detail, false)
        })
    }
}


AFRAME.registerComponent('instrument', instrumentComponemt)
AFRAME.registerComponent('instrument-ui', instrumentUi)
AFRAME.registerComponent('instrument-controller', instrumentController)
