import { Component, ComponentDefinition, DetailEvent, Entity, ObjectMap, System } from "aframe";

const defaultFont = 'assets/Plaster-Regular.ttf'

interface IInstrumentProps {

}

export type InstrumentComponent = ComponentDefinition<IInstrumentProps>

export type InstrumentType = 'keys' | 'strings' | 'bass' | 'vocals' | 'drums' | 'other'

export interface ITrackData {
    name: string, 
    instrument: InstrumentType,
    src: string
}

const baseScale = '0.5 0.5 0.5'
let modelConfig = {
    keys: {
        id: '#keys',
        scale: [1.25, 1, 0.5],
        position: '0 0 0'
},
    drums: {
        id: '#drums',
        scale: [1.4, 1, 1],
        position: '0 -0.5 0'
    },
    bass: {
        id: '#bass',
        scale: [1, 1.5, 0.5],
        position: '0 -0.5 0'
    },
    strings: {
        id: '#strings',
        scale: [1, 1.3, 0.5],
        position: '0 -0.4 0'
    },
    vocals: {
        id: '#vocals',
        scale: [0.5, 1.3, 0.5],
        position: '0 -0.5 0'
    },
    other: {
        id: '#drums',
        scale: [1, 1.4, 1],
        position: '0 -0.5 0'
    },
}

const sampleTrackData: ITrackData[] = [
    {
        name: 'Vocals',
        instrument: "vocals",
        src: 'assets/ngce/vocals.mp3'
    },
    {
        name: 'Keys',
        instrument: "keys",
        src: 'assets/ngce/keys.mp3'
    },
    {
        name: 'Drums',
        instrument: "drums",
        src: 'assets/ngce/drums.mp3'
    },
    {
        name: 'Bass',
        instrument: "bass",
        src: 'assets/ngce/bass.mp3'
    },
    {
        name: 'Strings',
        instrument: "strings",
        src: 'assets/ngce/strings.mp3'
    }
]

export type TrackPositionType = 'surround' | 'stage' | 'mono' | 'stereo'

interface IInstrumentControllerProps {
    setupTracks: (tracks: ITrackData[]) => void
    tracks: Entity<ObjectMap<Component<any, System<any>>>>[],
    positionTracks: (posType: TrackPositionType) => void
}

const posRadius = 3
const stageRadiansSpread = 120 / 180 * Math.PI

export type InstrumentController = ComponentDefinition<IInstrumentControllerProps>

const instrumentController: InstrumentController = {
    init: function () {
        // this.setupTracks(sampleTrackData)
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
        let numLoaded = 0
        const thisEl = this.el
        for (let i = 0; i < tracks.length; i++) {
            const trackData = tracks[i];

            const track = document.createElement('a-entity')
            track.setAttribute('sound', {
                'src': `url(${trackData.src})`,
                rolloffFactor: 0.2,
            })

            track.addEventListener('sound-loaded', (e) => {
                console.log(e)
                numLoaded += 1
                console.log(numLoaded)
                if(numLoaded == tracks.length) {
                    thisEl.sceneEl?.emit('songs-loaded')
                }
            })

            track.setAttribute('instrument', {
                'instrumentType': trackData.instrument,
                name: trackData.name
            })

            track.setAttribute('position', `${1 + -(tracks.length / 2) * 2 + i * 2 } 0 -3`)

            const id = `track-${i}`
            track.setAttribute('id', id)
            track.setAttribute('moveable', {
                moveEl: id
            })

            const radians = radianInc * i + radianOffset
            const targetX = Math.cos(radians) * posRadius
            const targetZ = Math.sin(radians) * posRadius
            console.log(`${targetX} 1 ${targetZ}`)
            // setup animations
            track.setAttribute('animation__pos_surround', {
                property: 'position',
                to: `${targetX.toFixed(2)} 0 ${targetZ.toFixed(2)}`,
                startEvents: 'position-surround',
                dur: 750,
                easing: 'easeInOutCubic'
            })

            const stageRadians = stageRadiansSpread / 2 - radians / 3.0
            const stageX = Math.cos(stageRadians) * posRadius * 2 * -1
            const stageZ = Math.sin(stageRadians) * posRadius * 3
            track.setAttribute('animation__pos_stage', {
                property: 'position',
                to: `${stageZ.toFixed(2)} 0 ${stageX.toFixed(2)}`,
                startEvents: 'position-stage',
                dur: 750,
                easing: 'easeInOutCubic'
            })

            track.setAttribute('animation__pos_mono', {
                property: 'position',
                to: `${Math.random() * 2} 0 -3`,
                startEvents: 'position-mono',
                dur: 750,
                easing: 'easeInOutCubic'
            })

            track.setAttribute('animation__pos_stereo', {
                property: 'position',
                to: `${i % 2 == 0 ? `${Math.random() * -2 + -1}` : `${Math.random() * 2 + 1}`} 0 -3`,
                startEvents: 'position-stereo',
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


const instrBaseScale = '1.5 1.5 1.5'
const instrHoverScale = '1.65 1.65 1.65'

const instrumentComponemt: InstrumentComponent = {
    dependencies: ['sound'],
    schema: {
        instrumentType: {type: 'string'},
        name: {type: 'string'}
    },
    update: function () {
        // create geom depending on instrument type
        const instrumentType = this.data.instrumentType as InstrumentType
        
        let geom = modelConfig[instrumentType]
        

        // create geom elem
        const geomEl = document.createElement('a-entity')
        // add collider for geomEl
        geomEl.setAttribute('geometry', {
            primitive: 'box',
            width: geom.scale[0],
            height: geom.scale[1],
            depth: geom.scale[2],
        })
        geomEl.setAttribute('material', {
            'shader': 'flat',
            depthTest: 'false',
            opacity: '0',
        })
        geomEl.setAttribute('scale', instrBaseScale)
        geomEl.classList.add('collidable')

        // add model as child so can scale and avoid hit detection
        const instrumentModel = document.createElement('a-entity')

        instrumentModel.setAttribute('gltf-model', geom.id)
        instrumentModel.setAttribute('scale', baseScale)
        instrumentModel.setAttribute('position', geom.position)
        geomEl.appendChild(instrumentModel)


        // add in hover anims -- needs to be initted first because of aframe error
        setTimeout(() => {
            geomEl.setAttribute('animation__hoverStartScale', {
                property: 'scale',
                to: instrHoverScale,
                startEvents: 'mouseenter',
                dur: 125,
            })

            geomEl.setAttribute('animation__hoverStopScale', {
                property: 'scale',
                to: instrBaseScale,
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
