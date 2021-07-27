<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    import type { WindowOptions } from "./types";
    import { clamp, getElementRect } from "./utils";

    // ================== VARIABLES ==================
    export let component: any = null;
    export let options: WindowOptions = {};
    export let componentProps: any = {};
    export let id: number = 0;
    export let isActive = true;

    let windowDiv: HTMLDivElement = null;
    let dragOffset = { x: 0, y: 0 };
    let resizeObserver: ResizeObserver;

    const HORIZONTAL_CLAMP = 100;
    const HORIZONTAL_CLAMP_EXTRA = 50;

    // ================== SETUP ==================
    onMount(() => {
        resizeObserver = new ResizeObserver(() => {
            resize();
        });
        resizeObserver.observe(windowDiv);

        if (options.openInCenter) {
            options.position = {
                x: window.innerWidth / 2 - options.width / 2,
                y: window.innerHeight / 2 - options.height / 2,
            };
        }
    });

    onDestroy(() => {
        resizeObserver.disconnect();
    });

    // ================== FUNCTIONS ==================
    function close() {
        dispatch("close", id);
    }

    function activateWindow() {
        dispatch("activate", id);
    }

    function startDrag(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.classList.contains("title-bar")) {
            return;
        }

        document.body.style.cursor = "grabbing";

        const rect = getElementRect(windowDiv);
        dragOffset.x = event.x - rect.x;
        dragOffset.y = event.y - rect.y;

        options.width = rect.width;
        options.height = rect.height;
    }

    function drag(event: MouseEvent) {
        if (dragOffset.x === 0) {
            return;
        }

        const left = event.x - dragOffset.x;
        const top = event.y - dragOffset.y;

        windowDiv.style.left = `${left}px`;
        windowDiv.style.top = `${top}px`;

        options.position.x = left;
        options.position.y = top;
    }

    function stopDrag() {
        dragOffset.x = 0;
        dragOffset.y = 0;

        // When window is too much outside the right edge, push it back to the right to make sure it can be recovered
        const right = options.position.x + options.width;
        if (right < HORIZONTAL_CLAMP) {
            const diff = HORIZONTAL_CLAMP - right;
            options.position.x += diff + HORIZONTAL_CLAMP_EXTRA;
        }

        // When window is too much outside the left edge, push it back to the left to make sure it can be recovered
        if (options.position.x > window.innerWidth - HORIZONTAL_CLAMP) {
            options.position.x = window.innerWidth - HORIZONTAL_CLAMP - HORIZONTAL_CLAMP_EXTRA;
        }

        // When window is too much outside the top edge, clamp it to the top edge, otherwise the window won't be recoverable
        // due to the fact that it can only be dragged by its title bar
        if (options.position.y < 0) {
            options.position.y = 0;
        }

        // When window is too much outside the bottom edge, push it back up to make sure that at least the title bar is visible
        // to be able to recover the window when needed.
        if (options.position.y >= window.innerHeight) {
            options.position.y = window.innerHeight - 32;
        }

        document.body.style.cursor = "default";
    }

    function resize() {
        options.width = windowDiv.offsetWidth;
        options.height = windowDiv.offsetHeight;
        options.maxHeight = window.innerHeight - options.position.y;
        options.maxWidth = window.innerWidth - options.position.x;
    }
</script>

<svelte:window on:mousemove={drag} on:mouseup={stopDrag} />

<!-- @TODO ability to pin window to make it always on top on demand -->
<div
    bind:this={windowDiv}
    class="window"
    class:resize={options.resizable}
    style="width: {options.width}px; height: {options.height}px; left: {options.position.x}px; top: {options.position.y}px;
        min-width: {options.minWidth}px; min-height: {options.minHeight}px; max-width: {options.maxWidth}px; max-height: {options.maxHeight}px"
    class:active={isActive}
    class:always-on-top={options.alwaysOnTop}
    on:mousedown={activateWindow}
>
    <div class="title-bar" on:mousedown={startDrag} class:active={isActive}>
        <span class="window-title">{options.title}</span>
        <div class="right-align">
            <button class="close-window-button" on:click={close}>X</button>
        </div>
    </div>
    <svelte:component this={component} {...componentProps} />
</div>

<style>
    .window {
        position: absolute;

        background-color: white;

        box-shadow: 0px 4px 8px 1px rgba(0, 0, 0, 0.53);

        border-radius: 0.2rem;

        z-index: 1000;
    }

    .window.resize {
        resize: both;
        overflow: auto;
    }

    .window.active {
        z-index: 2000;
    }

    .window.always-on-top {
        z-index: 10000;
    }

    .title-bar {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        height: 32px;

        background-color: #727681;

        border-top-left-radius: 0.2rem;
        border-top-right-radius: 0.2rem;

        user-select: none;
    }

    .title-bar.active {
        background-color: #354981;
    }

    .window-title {
        margin-left: 0.5rem;

        color: white;

        font-family: Consolas;

        pointer-events: none;
    }

    .title-bar .right-align {
        height: 100%;
        margin-left: auto;
    }

    .close-window-button {
        height: 100%;

        background: transparent;
        outline: none;
        border: none;

        font-family: Consolas;
        font-weight: 500;
        font-size: 1.2rem;

        padding-left: 0.5rem;
        padding-right: 0.5rem;

        color: white;
    }

    .close-window-button:hover {
        background-color: rgba(255, 255, 255, 0.12);
        cursor: pointer;
    }

    .close-window-button:active {
        background-color: rgba(255, 255, 255, 0.24);
    }
</style>
