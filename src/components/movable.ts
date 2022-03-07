import { Component, ComponentDefinition, Entity, ObjectMap, System, THREE, ThreeLib } from "aframe"

interface IMovable {
    moving: boolean,
    movePrevPos: THREE.Vector3,
    movePrevRot: THREE.Euler
    parentObject3D?: THREE.Object3D<THREE.Event>
    moveVectorHelper: THREE.Vector3
    startMoving: () => void,
    stopMoving: () => void,
    move: () => void,
}

export type MovableComponent = ComponentDefinition<IMovable>

const moveableComponent: MovableComponent = {
    schema: {
        isMoving: {type: 'boolean', default: false},
        parentElemId: {type: 'string', default: ''},
    },
    init: function () {
        const thisObj = this
        this.el.addEventListener('click', function (evt) {
            const targetEl = evt.target! as Entity<ObjectMap<Component<any, System<any>>>>
            targetEl.setAttribute('moveable', 'isMoving', !(targetEl.getAttribute('moveable').isMoving))
        })
    },
    moveVectorHelper: new THREE.Vector3(),
    moving : false,
    movePrevPos: (function () {
        const posVec = new THREE.Vector3()
        return posVec
    })(),
    movePrevRot: (function () {
        const rotVec = new THREE.Euler()
        return rotVec
    })(),
    startMoving: function () {
        console.log("move started")
        // set parent elem
        this.parentObject3D = (document.getElementById(this.data.parentElemId) as Entity<ObjectMap<Component<any, System<any>>>>).object3D
        this.movePrevPos.copy(this.parentObject3D.position)
        this.movePrevRot.copy(this.parentObject3D.rotation)
        this.moving = true
    },
    stopMoving: function() {
        this.moving = false
    },
    move: function () {
        // calculate position difference
        this.moveVectorHelper.copy(this.parentObject3D!.position).sub(this.movePrevPos)
        this.el.object3D.position.add(this.moveVectorHelper)
        this.movePrevPos.copy(this.parentObject3D!.position)

        // TODO: handle rotation
    },
    tick: function () {
        // handle move start
        if(this.data.isMoving && !this.moving) {
            this.startMoving()
            return
        }

        // handle move stop
        if(!this.data.isMoving && this.moving) {
            this.stopMoving()
            return
        }

        if(this.data.isMoving && this.moving) {
            this.move()
        }
    }
}



AFRAME.registerComponent('moveable', moveableComponent)