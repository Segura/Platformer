import { State, StateTransition } from '../state-machine'
import { BUTTONS_EVENTS, CHARACTER_EVENTS } from '../events'

import { STATES } from './states'

export const stateMachineConfig = (character) =>
    [
        new State(
            STATES.STAND,
            [
                new StateTransition(CHARACTER_EVENTS.FAILING, STATES.JUMP_DOWN),
                new StateTransition(BUTTONS_EVENTS.DOWN.PRESSED, STATES.CROUCH),
                new StateTransition(BUTTONS_EVENTS.UP.PRESSED, STATES.JUMP_UP),
                new StateTransition(BUTTONS_EVENTS.LEFT.PRESSED, STATES.RUN_LEFT, [character.canMoveLeft]),
                new StateTransition(BUTTONS_EVENTS.RIGHT.PRESSED, STATES.RUN_RIGHT, [character.canMoveRight]),
            ],
            {
                onEnter: character.onStand,
                onLeave: character.onLeaveStand,
                isDefault: true
            }
        ),
        new State(
            STATES.CROUCH,
            [
                new StateTransition(BUTTONS_EVENTS.DOWN.RELEASED, STATES.STAND),
            ]
        ),
        new State(
            STATES.JUMP_UP,
            [
                new StateTransition(CHARACTER_EVENTS.STOP_ELEVATION, STATES.JUMP_TOP),
                new StateTransition(CHARACTER_EVENTS.CAN_GRUB, STATES.GRAB),
            ],
            {
                onEnter: character.onJump,
                onUpdate: character.ifInAir
            }
        ),
        new State(
            STATES.JUMP_TOP,
            [
                new StateTransition(CHARACTER_EVENTS.FAILING, STATES.JUMP_DOWN),
                new StateTransition(CHARACTER_EVENTS.CAN_GRUB, STATES.GRAB),
            ],
            {
                onUpdate: character.ifInAir
            }
        ),
        new State(
            STATES.JUMP_DOWN,
            [
                new StateTransition(BUTTONS_EVENTS.LEFT.PRESSED, STATES.RUN_LEFT, [character.isOnGround]),
                new StateTransition(BUTTONS_EVENTS.RIGHT.PRESSED, STATES.RUN_RIGHT, [character.isOnGround]),
                new StateTransition(CHARACTER_EVENTS.ON_GROUND, STATES.STAND),
                new StateTransition(CHARACTER_EVENTS.CAN_GRUB, STATES.GRAB),
            ],
            {
                onEnter: character.onDrop, // TODO: a little weird place
                onUpdate: character.ifInAir
            }
        ),
        new State(
            STATES.RUN_LEFT,
            [
                new StateTransition(BUTTONS_EVENTS.UP.PRESSED, STATES.JUMP_UP),
                new StateTransition(CHARACTER_EVENTS.FAILING, STATES.JUMP_DOWN),
                new StateTransition(BUTTONS_EVENTS.DOWN.PRESSED, STATES.GLIDE),
                new StateTransition(BUTTONS_EVENTS.RIGHT.PRESSED, STATES.RUN_RIGHT),
                new StateTransition(BUTTONS_EVENTS.LEFT.RELEASED, STATES.STAND),
                new StateTransition(CHARACTER_EVENTS.STOP, STATES.STAND),
            ],
            {
                onEnter: character.onRunLeft,
                onUpdate: character.ifRun
            }
        ),
        new State(
            STATES.RUN_RIGHT,
            [
                new StateTransition(BUTTONS_EVENTS.UP.PRESSED, STATES.JUMP_UP),
                new StateTransition(CHARACTER_EVENTS.FAILING, STATES.JUMP_DOWN),
                new StateTransition(BUTTONS_EVENTS.DOWN.PRESSED, STATES.GLIDE),
                new StateTransition(BUTTONS_EVENTS.LEFT.PRESSED, STATES.RUN_LEFT),
                new StateTransition(BUTTONS_EVENTS.RIGHT.RELEASED, STATES.STAND),
                new StateTransition(CHARACTER_EVENTS.STOP, STATES.STAND),
            ],
            {
                onEnter: character.onRunRight,
                onUpdate: character.ifRun
            }
        ),
        new State(
            STATES.GLIDE,
            [
                new StateTransition(BUTTONS_EVENTS.UP.PRESSED, STATES.JUMP_UP),
                new StateTransition(CHARACTER_EVENTS.FAILING, STATES.JUMP_DOWN),
                new StateTransition(CHARACTER_EVENTS.STOP, STATES.STAND),
                // TODO: new StateTransition(???, STATES.CROUCH),
            ],
            {
                onEnter: character.onGlide,
                onUpdate: character.ifGlide
            }
        ),
        new State(
            STATES.GRAB,
            [
                new StateTransition(BUTTONS_EVENTS.DOWN.PRESSED, STATES.JUMP_DOWN),
            ],
            {
                onEnter: character.onGrub
            }
        )
    ]
