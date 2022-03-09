import { Component, ComponentDefinition, Entity, ObjectMap, System } from "aframe";


interface ITextPanelProps {
    // labelContainer?: Entity<ObjectMap<Component<any, System<any>>>>,
    // textEntity?: Entity<ObjectMap<Component<any, System<any>>>>,
}


type TextPanelComponent = ComponentDefinition<ITextPanelProps>


const panelComponent: TextPanelComponent = {
    schema: {
        text: {type: 'string', default: ''},
        width: {type: 'number', default: '0.7'},
        height: {type: 'number', default: '0.7'},
        depth: {type: 'number', default: '0.02'},
        color: {type: 'color', default: '#000'},
        colorHover: {type: 'color', default: '#344955'},
        bgColor: {type: 'color', default: '#344955'},
        bgColorHover: {type: 'color', default: '#F9AA33'},
        
    },
    update: function () {
        this.el.setAttribute('text', {
            value: this.data.text,
            align: 'left',
            anchor: 'left',
            color: this.data.color,
            // prevent z-fighting
            zOffset: this.data.depth / 2 + 0.01,
        })

        // can replace this with better geom later
        this.el.setAttribute('geometry', {
            primitive: 'box',
            height: this.data.height,
            width: this.data.width,
            depth: this.data.depth,
        })

        this.el.setAttribute('material', {
            // transparent: true,
            // opacity: 0,
            // depthTest: false
        })

       
    },
    
}


AFRAME.registerComponent('text-panel', panelComponent)
