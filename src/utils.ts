import type { Rect } from "./types";

export function clamp(value: number, min: number, max: number) {
    if (value < min) { return min; }
    if (value > max) { return max; }

    return value;
}

export function getElementRect(element: HTMLElement): Rect {
    return {
        x: parseInt(trimFromEnd(element.style.left, 2), 10),
        y: parseInt(trimFromEnd(element.style.top, 2), 10),
        width: parseInt(trimFromEnd(element.style.width, 2), 10),
        height: parseInt(trimFromEnd(element.style.height, 2), 10),
    };
}


function trimFromEnd(str: string, count: number) {
    return str.substr(0, str.length - count);
}
