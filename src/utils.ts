import type { Rect } from "./types";

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
