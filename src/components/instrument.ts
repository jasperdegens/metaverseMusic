import { ComponentDefinition } from "aframe";


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
        src: ''
    },
    {
        name: 'Vocals',
        instrument: "guitar",
        src: ''
    },
    {
        name: 'Vocals',
        instrument: "drums",
        src: ''
    }
]

interface IInstrumentControllerProps {
    setupTrack: (tracks: ITrackData[]) => void
}

const instrumentController: ComponentDefinition<IInstrumentControllerProps> = {
    init: function () {
        this.setupTrack(sampleTrackData)
    },
    setupTrack: function(tracks: ITrackData[]) {
        for (let i = 0; i < tracks.length; i++) {
            const trackData = tracks[i];

            const track = document.createElement('a-entity')
            track.setAttribute('sound', 'src', trackData.src)

            track.setAttribute('instrument', 'instrumentType', trackData.instrument)

            track.setAttribute('position', `${-(tracks.length / 2) * 2 + i * 2 } 1 -1`)

            track.setAttribute('moveable', '')

            this.el.appendChild(track)
        }
    }
}


const instrumentComponemt: InstrumentComponent = {
    dependencies: ['sound'],
    schema: {
        instrumentType: {type: 'string'}
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
    }
}


AFRAME.registerComponent('instrument', instrumentComponemt)
AFRAME.registerComponent('instrument-controller', instrumentController)
