import { Enemy } from './Enemy'

export class Slime extends Enemy {

    constructor (scene, spawnPoint) {
        super(scene, spawnPoint, 'slime')
    }
}
