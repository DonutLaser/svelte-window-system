export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface WindowOptions {
    width?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    height?: number;
    resizable?: boolean;
    title?: string;
    position?: { x: number; y: number };
    openInCenter?: boolean;
    // @TODO (!important) always on top property
    // @TODO (!important) clamp window to browser viewport property
}