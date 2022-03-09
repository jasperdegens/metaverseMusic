import { Component, ComponentDefinition, DetailEvent, Entity, ObjectMap, System } from "aframe";

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

export type TrackPositionType = 'surround' | 'stage'

interface IInstrumentControllerProps {
    setupTracks: (tracks: ITrackData[]) => void
    tracks: Entity<ObjectMap<Component<any, System<any>>>>[],
    positionTracks: (posType: TrackPositionType) => void
}

const posRadius = 2
const stageRadiansSpread = 120 / 180 * Math.PI

export type InstrumentController = ComponentDefinition<IInstrumentControllerProps>

const instrumentController: InstrumentController = {
    init: function () {
        this.setupTracks(sampleTrackData)
    },
    tracks: [],
    positionTracks: function (posType: TrackPositionType) {
        for(const track of this.tracks) {
            track.emit(`position-${posType}`, {}, false)
        }
    },
    setupTracks: function(tracks: ITrackData[]) {

        const radianInc = Math.PI * 2 / tracks.length
        const radianOffset = radianInc * 0.5
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

            const radians = radianInc * i + radianOffset
            const targetX = Math.cos(radians) * posRadius
            const targetZ = Math.sin(radians) * posRadius
            // setup animations
            track.setAttribute('animation__pos_surround', {
                property: 'position',
                to: `${targetX} 1 ${targetZ}`,
                startEvents: 'position-surround',
                dur: 750,
                easing: 'easeInOutCubic'
            })

            const stageRadians = stageRadiansSpread / 2 - radians / 3.0
            const stageX = Math.cos(stageRadians) * posRadius * 2 * -1
            const stageZ = Math.sin(stageRadians) * posRadius * 3
            track.setAttribute('animation__pos_stage', {
                property: 'position',
                to: `${stageZ} 1 ${stageX}`,
                startEvents: 'position-stage',
                dur: 750,
                easing: 'easeInOutCubic'
            })

            this.el.appendChild(track)
            this.tracks.push(track)
        }
    }
}



// const instrumentUi: ComponentDefinition<IInstrumentControllerProps> = {
//     init: function () {
//         this.setupTracks(sampleTrackData)
//     },
//     setupTracks: function (tracks) {
        
//         // build base panel
//         const container = document.createElement('a-entity')
//         container.setAttribute('geometry', {
//             primitive: 'plane',
//             height: 3,
//             width: 1
//         })
//         container.setAttribute('position', '0 2.5 -3')

//         for (let i = 0; i < tracks.length; i++) {
//             const trackData = tracks[i];
            
//         }

//         this.el.appendChild(container)
//     }
// }


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
// AFRAME.registerComponent('instrument-ui', instrumentUi)
AFRAME.registerComponent('instrument-controller', instrumentController)
