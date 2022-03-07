import { ComponentDefinition, THREE } from "aframe";


const fontFam = require('../assets/Roboto-msdf.json')
const fontTex = require('../assets/Roboto-msdf.png')

console.log(fontTex)

interface IMusicPlayerUi {

}

export type MusicPlayerUi = ComponentDefinition<IMusicPlayerUi>

const musicPlayerUi: MusicPlayerUi = {
    schema: {

    },
    init: function() {
        
        const baseContainer = document.createElement('a-entity')
        baseContainer.setAttribute('geometry', {
            primitive: 'plane',
            width: '1',
            height: '1'
        })

        const button = document.createElement('a-entity')
        button.setAttribute('geometry', {
            primitive: 'plane',
            width: '0.9',
            height: '0.5',
        })
        button.setAttribute('text', {
            value: 'Hellp',
            align: 'center',
            anchor: 'center',

        })
        button.setAttribute('position', '0 0 0.02')

        button.addEventListener('mouseenter', (e) => {
            console.log('nsdfasd')
        })

        button.addEventListener('click', (e) => {
            var entities = document.querySelectorAll('[sound]');
            for(const entity of entities) {
                // @ts-ignore
                entity.components.sound.playSound();
            }
        })


        baseContainer.appendChild(button)

        this.el.appendChild(baseContainer)


        
    },
    update: function () {
    },
    tick: function () {
        

    }
}

AFRAME.registerComponent('music-player-ui', musicPlayerUi)