export interface Controls {
    MENU_SELECT: string,
    MOVE_UP: string,
    MOVE_DOWN: string,
    MOVE_LEFT: string,
    MOVE_RIGHT: string,
    SHOOT: string,
    BOMB: string,
    FOCUS: string,
    BACK: string
}

export const Controls : Controls = {
    MENU_SELECT:  'Enter',
    MOVE_UP:      'ArrowUp',
    MOVE_DOWN:    'ArrowDown',
    MOVE_LEFT:    'ArrowLeft',
    MOVE_RIGHT:   'ArrowRight',
    SHOOT:        'KeyZ',
    BOMB:         'KeyX',
    FOCUS:        'ShiftLeft',
    BACK:         'Escape'
};


export function setControls(newControls: typeof Controls) {
    Object.assign(Controls, newControls);
}