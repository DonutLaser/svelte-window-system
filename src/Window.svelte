<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    import type { WindowOptions } from "./types";
    import { getElementRect } from "./utils";

    // ================== VARIABLES ==================
    export let component: any = null;
    export let options: WindowOptions = {};
    export let componentProps: any = {};
    export let id: number = 0;
    export let isActive = true;

    let windowDiv: HTMLDivElement = null;
    let dragOffset = { x: 0, y: 0 };
    let resizeObserver: ResizeObserver;
    let titlebarHeight = 0;
    let originalMaxHeight = 0;
    let originalMaxWidth = 0;

    let titlebarClass = "";
    let inactiveTitlebarClass = "";
    let titlebarButtonClass = "";
    let windowClass = "";

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

        if (options.preventBodyOverflow) {
            document.body.style.overflow = "hidden";
        }

        originalMaxHeight = options.maxHeight;
        originalMaxWidth = options.maxWidth;

        titlebarClass = options.customTitlebarClass || "title-bar";
        inactiveTitlebarClass = options.customInactiveTitlebarClass || "inactive";
        titlebarButtonClass = options.customTitlebarButtonClass || "titlebar-button";
        windowClass = options.customWindowClass || "window";

        // Using a timeout here because apparently offsetHeight is not correct onMount, so move the code to
        // to the end fo the queue and then the offset height is correct.
        setTimeout(() => {
            const titlebar = windowDiv.getElementsByClassName("title-bar-default")[0] as HTMLElement;
            titlebarHeight = titlebar.offsetHeight;
        }, 0);
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
        if (!target.classList.contains("title-bar-default")) {
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
            options.position.y = window.innerHeight - titlebarHeight;
        }

        document.body.style.cursor = "default";
    }

    function resize() {
        options.width = windowDiv.offsetWidth;
        options.height = windowDiv.offsetHeight;

        if (originalMaxHeight >= 0) {
            options.maxHeight = Math.min(window.innerHeight - options.position.y, originalMaxHeight);
        } else {
            options.maxHeight = window.innerHeight - options.position.y;
        }

        if (originalMaxWidth >= 0) {
            options.maxWidth = Math.min(window.innerWidth - options.position.x, originalMaxWidth);
        } else {
            options.maxWidth = window.innerWidth - options.position.x;
        }
    }
</script>

<svelte:window on:mousemove={drag} on:mouseup={stopDrag} />

<!-- @TODO ability to pin window to make it always on top on demand -->
<div
    bind:this={windowDiv}
    class="window-default {windowClass}"
    class:resize={options.resizable}
    style="width: {options.width}px; height: {options.height}px; left: {options.position.x}px; top: {options.position.y}px;
        min-width: {options.minWidth}px; min-height: {options.minHeight}px; max-width: {options.maxWidth}px; max-height: {options.maxHeight}px"
    class:inactive={!isActive}
    class:always-on-top={options.alwaysOnTop}
    on:mousedown={activateWindow}
>
    <div
        class="title-bar-default {titlebarClass} {!isActive ? inactiveTitlebarClass : ''}"
        on:mousedown={startDrag}
        class:inactive={!isActive}
    >
        <span class="window-title">{options.title}</span>
        <div class="title-bar-right-align">
            {#if options.customTitlebarButtons}
                {#each options.customTitlebarButtons as btn}
                    <button class="titlebar-button-default {titlebarButtonClass}" on:click={btn.callback}>{btn.value}</button>
                {/each}
            {/if}
            <button class="titlebar-button-default {titlebarButtonClass}" on:click={close}>X</button>
        </div>
    </div>
    <svelte:component this={component} {...componentProps} />
</div>

<style>
    .window-default {
        position: absolute;
        z-index: 2000;
        box-shadow: 0px 4px 8px 1px rgba(0, 0, 0, 0.53);
    }

    .window-default.inactive {
        z-index: 1000;
    }

    .window-default.always-on-top {
        z-index: 10000;
    }

    .window-default.resize {
        resize: both;
        overflow: auto;
    }

    .window {
        background-color: white;
        border-radius: 0.2rem;
    }

    .title-bar-default {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .title-bar {
        height: 32px;

        background-color: #354981;

        border-top-left-radius: 0.2rem;
        border-top-right-radius: 0.2rem;

        user-select: none;
    }

    .title-bar.inactive {
        background-color: #727681;
    }

    .window-title {
        margin-left: 0.5rem;

        color: white;

        font-family: Consolas;

        pointer-events: none;
        user-select: none;
    }

    .title-bar-right-align {
        height: 100%;
        margin-left: auto;
    }

    .titlebar-button-default {
        height: 100%;
        user-select: none;
    }

    .titlebar-button {
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

    .titlebar-button:hover {
        background-color: rgba(255, 255, 255, 0.12);
        cursor: pointer;
    }

    .titlebar-button:active {
        background-color: rgba(255, 255, 255, 0.24);
    }
</style>
