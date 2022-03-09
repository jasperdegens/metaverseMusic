import { Component, ComponentDefinition, Entity, ObjectMap, System } from "aframe";


interface IButtonProps {
    // labelContainer?: Entity<ObjectMap<Component<any, System<any>>>>,
    // textEntity?: Entity<ObjectMap<Component<any, System<any>>>>,
}


type ButtonComponent = ComponentDefinition<IButtonProps>


const buttonComponent: ButtonComponent = {
    schema: {
        text: {type: 'string', default: ''},
        width: {type: 'number', default: '0.7'},
        height: {type: 'number', default: '0.25'},
        depth: {type: 'number', default: '0.02'},
        color: {type: 'color', default: '#fff'},
        colorHover: {type: 'color', default: '#344955'},
        bgColor: {type: 'color', default: '#344955'},
        bgColorHover: {type: 'color', default: '#F9AA33'},
    },
    update: function () {
        this.el.setAttribute('text', {
            value: this.data.text,
            align: 'center',
            anchor: 'center',
            color: this.data.color,
            // prevent z-fighting
            zOffset: this.data.depth / 2 + 0.01,
            wrapCount: this.data.text.length + 8
        })

        // can replace this with better geom later
        this.el.setAttribute('geometry', {
            primitive: 'box',
            height: this.data.height,
            width: this.data.width,
            depth: this.data.depth,
        })

        this.el.setAttribute('material', {
            color: this.data.bgColor
        })

        this.el.setAttribute('animation__hoverStart', {
            property: 'components.material.material.color',
            type: 'color',
            to: this.data.bgColorHover,
            startEvents: 'mouseenter',
            dur: 125,
        })
        this.el.setAttribute('animation__hoverEnd', {
            property: 'components.material.material.color',
            type: 'color',
            to: this.data.bgColor,
            startEvents: 'mouseleave',
            dur: 125
        })

        this.el.setAttribute('animation__hoverStartText', {
            property: 'text.color',
            type: 'color',
            to: this.data.colorHover,
            startEvents: 'mouseenter',
            dur: 125,
        })
        this.el.setAttribute('animation__hoverEndText', {
            property: 'text.color',
            type: 'color',
            to: this.data.color,
            startEvents: 'mouseleave',
            dur: 125
        })
    },
    
}


AFRAME.registerComponent('button', buttonComponent)