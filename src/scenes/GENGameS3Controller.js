const DIRECTIONS = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN'
}
const D_PAD_AXES = 9
const toDegrees = (value) => (value + 1) * 315 / 2

const getButton = (pad, direction) => {
    const rawValue = pad.axes[D_PAD_AXES].getValue()
    const degreesValue = toDegrees(rawValue)
    switch (direction) {
        case DIRECTIONS.UP:
            return (degreesValue <= 45 || degreesValue >= 315) && degreesValue < 360
        case DIRECTIONS.DOWN:
            return degreesValue >= 135 && degreesValue <= 225
        case DIRECTIONS.LEFT:
            return degreesValue >= 225 && degreesValue <= 315
        case DIRECTIONS.RIGHT:
            return degreesValue >= 45 && degreesValue <= 135
        default:
            return 0
    }
}

// 2563-0575-PS3/PC Gamepad
export const GENGameS3Controller = {
    UP: (pad) => getButton(pad, DIRECTIONS.UP),
    DOWN: (pad) => getButton(pad, DIRECTIONS.DOWN),
    LEFT: (pad) => getButton(pad, DIRECTIONS.LEFT),
    RIGHT: (pad) => getButton(pad, DIRECTIONS.RIGHT),

    SELECT: 8,
    START: 9,

    A: 2,
    B: 1,
    X: 3,
    Y: 0,

    LB: 4,
    RB: 5,

    LT: 6,
    RT: 7,

    LEFT_STICK_H: 0,
    LEFT_STICK_V: 1,
    RIGHT_STICK_H: 2,
    RIGHT_STICK_V: 5
}
