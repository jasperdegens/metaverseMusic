import { ComponentDefinition } from "aframe";

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

            track.setAttribute('moveable', '')

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

        this.el.setAttribute('geometry', {
            primitive: geom,
            radius: 1,
            width: 1,
            depth: 1,
            height: 1
        })
        
        const labelDepth = 0.02
        const instrumentLabel = document.createElement('a-entity')
        instrumentLabel.setAttribute('text', {
            value: this.data.name,
            align: 'center',
            anchor: 'center',
            color: "#000",
            zOffset: labelDepth / 2 + 0.01
        })
        instrumentLabel.setAttribute('width', '1')
        instrumentLabel.setAttribute('height', '1')
        instrumentLabel.setAttribute('geometry', {
            primitive: 'box',
            height: 0.5,
            width: 1,
            depth: 0.02,
        })
        instrumentLabel.setAttribute('position', `0 1.5 0`)
        instrumentLabel.addEventListener('click', () => {
            console.log(instrumentLabel.getAttribute('text'))
        })
        this.el.appendChild(instrumentLabel)

    }
}


AFRAME.registerComponent('instrument', instrumentComponemt)
AFRAME.registerComponent('instrument-ui', instrumentUi)
AFRAME.registerComponent('instrument-controller', instrumentController)