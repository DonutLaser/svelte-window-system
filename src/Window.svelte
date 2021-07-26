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

        // @TODO (!important) make sure that the user cannot lose the window outside the viewport when window is not clamped
        let left = 0;
        let top = 0;
        if (options.clampWindowToViewport) {
            left = clamp(event.x - dragOffset.x, 0, window.innerWidth - options.width);
            top = clamp(event.y - dragOffset.y, 0, window.innerHeight - options.height);
        } else {
            left = event.x - dragOffset.x;
            top = event.y - dragOffset.y;
        }

        windowDiv.style.left = `${left}px`;
        windowDiv.style.top = `${top}px`;

        options.position.x = left;
        options.position.y = top;
    }

    function stopDrag() {
        dragOffset.x = 0;
        dragOffset.y = 0;
    }

    function resize() {
        options.width = windowDiv.offsetWidth;
        options.height = windowDiv.offsetHeight;
        options.maxHeight = window.innerHeight - options.position.y;
        options.maxWidth = window.innerWidth - options.position.x;
    }
</script>

<svelte:window on:mousemove={drag} on:mouseup={stopDrag} />

<!-- @TODO (!important) ability to pin window to make it always on top on demand -->
<div
    bind:this={windowDiv}
    class="window"
    class:resize={options.resizable}
    style="width: {options.width}px; height: {options.height}px; left: {options.position.x}px; top: {options.position.y}px;
        min-width: {options.minWidth}px; min-height: {options.minHeight}px; max-width: {options.maxWidth}px; max-height: {options.maxHeight}px"
    class:active={isActive}
    on:mousedown={activateWindow}
>
    <div class="title-bar" on:mousedown={startDrag}>
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

        border-radius: 0.18rem;
        border: 1px solid black;

        z-index: 1000;
    }

    .window.resize {
        resize: both;
        overflow: auto;
    }

    .window.active {
        z-index: 2000;
        border: 1px solid rgb(0, 0, 200);
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 200, 0.67);
    }

    .title-bar {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        height: 32px;

        background-color: burlywood;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;

        user-select: none;
    }

    .window-title {
        margin-left: 0.3rem;
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

        padding-left: 0.3rem;
        padding-right: 0.3rem;

        cursor: pointer;
    }

    .close-window-button:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .close-window-button:active {
        background-color: rgba(0, 0, 0, 0.12);
    }
</style>
