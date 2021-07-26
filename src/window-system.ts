import type { WindowOptions } from "./types";

import Window from './Window.svelte';

let nextId = 0;
let openWindows: { [id: number]: Window } = {};
let activeWindow = -1;

export function openWindow(component: any, options?: WindowOptions, componentProps?: any) {
    let windowOptions: WindowOptions = {
        width: 600,
        minWidth: 300,
        height: 500,
        minHeight: 200,
        resizable: true,
        title: 'New Window',
        openInCenter: true,
        position: { x: 0, y: 0 },
    };
    windowOptions = { ...windowOptions, ...options };

    const id = nextId++;

    const props: any = { component };
    props.options = windowOptions;
    props.id = id;
    props.isActive = true;
    if (componentProps) { props.componentProps = componentProps; }

    const window = new Window({
        target: document.body,
        props,
        intro: true,
    });
    window.$on('close', (event: CustomEvent) => { closeWindow(event.detail); });
    window.$on('activate', (event: CustomEvent) => { setActiveWindow(event.detail); });

    openWindows[id] = window;

    if (activeWindow !== -1) {
        openWindows[activeWindow].$set({ isActive: false });
    }

    activeWindow = id;
}

export function closeWindow(windowId: number) {
    const window = openWindows[windowId];
    if (!window) {
        console.error(`Window with id '${windowId}' does not exist!`);
        return;
    }

    window.$destroy();
    delete openWindows[windowId];

    const wnds = Object.keys(openWindows);
    if (wnds.length > 0) {
        activeWindow = parseInt(wnds[0], 10);
        setActiveWindow(activeWindow);
    } else {
        activeWindow = -1;
    }
}

export function setActiveWindow(windowId: number) {
    if (activeWindow !== -1) {
        openWindows[activeWindow].$set({ isActive: false });
    }

    activeWindow = windowId;
    openWindows[activeWindow].$set({ isActive: true });
}