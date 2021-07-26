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
    alwaysOnTop?: boolean;
}