export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TitlebarButton {
    value: string;
    callback: () => void;
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
    preventBodyOverflow?: boolean;
    animate?: boolean;
    customTitlebarButtons?: TitlebarButton[];
    customTitlebarClass?: string;
    customInactiveTitlebarClass?: string;
    customTitlebarButtonClass?: string;
    customWindowClass?: string;
}