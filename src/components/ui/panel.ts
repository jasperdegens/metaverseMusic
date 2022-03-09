import { Component, ComponentDefinition, Entity, ObjectMap, System } from "aframe";


interface IPanelProps {
    // labelContainer?: Entity<ObjectMap<Component<any, System<any>>>>,
    // textEntity?: Entity<ObjectMap<Component<any, System<any>>>>,
}


type PanelComponent = ComponentDefinition<IPanelProps>


const panelComponent: PanelComponent = {
    schema: {
        paddingX: {type: 'number', default: '0.1'},
        paddingY: {type: 'number', default: '0.1'},
        hasBg: {type: 'boolean', default: 'true'},
        bgColor: {type: 'color', default: '#000'}
    },
    update: function () {
        
        if(this.data.hasBg) {

            // can replace this with better geom later
            this.el.setAttribute('geometry', {
                primitive: 'box',
                height: this.data.height,
                width: this.data.width,
                depth: this.data.depth,
            })
        }

        this.el.setAttribute('material', {
            // transparent: true,
            // opacity: 0,
            // depthTest: false
        })

       
    },
    
}


AFRAME.registerComponent('panel', panelComponent)
