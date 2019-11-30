import { Achievement } from './Achievement'
import achievementsConfig from './achievements'

export class AchievementsManager {

    constructor (scene) {
        this.scene = scene
        this.achievementsConfig = achievementsConfig

        const events = new Set(this.achievementsConfig.reduce((result, achievementConfig) => result.concat(Object.keys(achievementConfig.conditions)), []))
        events.forEach((event) => {
            this.scene.events.on(event, (value) => {
                console.log(`Emitted ${event} event with value ${value}`)
                this.checkEvent(event, value)
            })
        })
    }

    checkEvent = (event, value) => {
        this.achievementsConfig.filter((achievementConfig) => !achievementConfig.unlocked && achievementConfig.conditions[event])
            .forEach((achievementConfig) => {
                if (this.checkCondition(achievementConfig.conditions[event], value)) {
                    this.onUnlock(achievementConfig)
                }
            })
    }

    checkCondition = (condition, param) => {
        const [operator, rawValue] = condition.split(' ')
        const value = parseInt(rawValue)
        switch (operator) {
            case '>':
                return param > value
            case '>=':
                return param >= value
            case '=':
                return param === value
            default:
                return false
        }
    }

    onUnlock = (achievement) => {
        // TODO: save
        this.achievementsConfig.find((a) => a.name === achievement.name).unlocked = true
        // TODO: multiple achievements
        this.scene.add.existing(new Achievement(this.scene, 'Achievement unlocked!', achievement.name, achievement.icon))
    }
}
