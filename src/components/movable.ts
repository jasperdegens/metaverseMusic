import { Component, ComponentDefinition, Entity, ObjectMap, System, THREE, ThreeLib } from "aframe"

interface IMovable {
    moving: boolean,
    movePrevPos: THREE.Vector3,
    movePrevRot: THREE.Euler
    parentObject3D?: THREE.Object3D<THREE.Event>
    moveTarget?: THREE.Object3D<THREE.Event>
    moveVectorHelper: THREE.Vector3
    offset: THREE.Vector3
    moveRotHelper: THREE.Euler
    startMoving: () => void,
    stopMoving: () => void,
    move: () => void,
}

export type MovableComponent = ComponentDefinition<IMovable>

const moveableComponent: MovableComponent = {
    schema: {
        isMoving: {type: 'boolean', default: false},
        parentElemId: {type: 'string', default: 'main-camera'},
        moveEl: {type: 'string', default: ''}
    },
    init: function () {
        const thisObj = this
        const moveElem = (document.getElementById(this.data.moveEl) as Entity<ObjectMap<Component<any, System<any>>>>)
        this.moveTarget = moveElem.object3D
        this.startMoving = this.startMoving.bind(this)
        this.stopMoving = this.stopMoving.bind(this)
        this.el.addEventListener('click', this.startMoving)

        
        this.el.addEventListener('mouseenter', () => {
            
        })
    },
    moveVectorHelper: new THREE.Vector3(),
    moveRotHelper: new THREE.Euler(),
    offset: new THREE.Vector3(),
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
        // set parent elem
        this.parentObject3D = (document.getElementById(this.data.parentElemId) as Entity<ObjectMap<Component<any, System<any>>>>).object3D
        const targetWorldPos = new THREE.Vector3()
        this.moveTarget!.getWorldPosition(targetWorldPos)
        this.movePrevPos.copy(this.parentObject3D!.position).sub(targetWorldPos)
        this.movePrevPos.copy(this.parentObject3D.position)
        this.movePrevRot.copy(this.parentObject3D.rotation)
        this.offset.copy(this.parentObject3D!.position).sub(targetWorldPos)
        this.offset.y = 0
        this.moving = true

        // add click handler to stop move when clicked next
        const thisElem = this
        setTimeout(() => {
            document.addEventListener('click', thisElem.stopMoving)
            document.addEventListener('pointerup', thisElem.stopMoving)
        }, 20)

        this.el.removeEventListener('click', this.startMoving)

    },
    stopMoving: function() {
        document.removeEventListener('click', this.stopMoving)
        document.removeEventListener('pointerup', this.stopMoving)
        this.moving = false
        const thisElem = this
        setTimeout(() => {
            thisElem.el.addEventListener('click', this.startMoving)
        }, 20)
    },
    move: function () {
        // calculate position difference
        // this.moveVectorHelper.copy(this.parentObject3D!.position).sub(this.movePrevPos)
        
        
        // this.el.object3D.position.add(this.moveVectorHelper)
        // this.movePrevPos.copy(this.parentObject3D!.position)
        
        // rotate forward vector to determine difference
        this.moveVectorHelper.set(0, 0, -1)

        // rotate with current camera xy angle
        this.moveRotHelper.copy(this.parentObject3D!.rotation)
        this.moveRotHelper.x = 0
        this.moveRotHelper.z = 0

        this.moveVectorHelper.applyEuler(this.moveRotHelper).multiplyScalar(this.offset.length()).add(this.parentObject3D!.position)
        this.moveTarget!.parent!.worldToLocal(this.moveVectorHelper)
        this.moveTarget?.position.set(this.moveVectorHelper.x, this.moveTarget?.position.y, this.moveVectorHelper.z);
        this.moveTarget?.rotation.copy(this.moveRotHelper)

        // TODO: handle rotation
        // this.moveRotHelper.copy(this.parentObject3D!.rotation)

    },
    tick: function () {
        // handle move start
        // if(this.data.isMoving && !this.moving) {
        //     this.startMoving()
        //     return
        // }

        // // handle move stop
        // if(!this.data.isMoving && this.moving) {
        //     this.stopMoving()
        //     return
        // }

        if(this.moving) {
            this.move()
        }
    }
}



AFRAME.registerComponent('moveable', moveableComponent)