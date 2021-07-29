<h1 align="center">Welcome to svelte-window-system 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version- (0.1.0)-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/DonutLaser/svelte-window-system#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/DonutLaser/svelte-modal-system/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> Simple customizable window system for Svelte

### 🏠 [Homepage](https://github.com/DonutLaser/svelte-window-system)

## Install

```sh
npm install svelte-window-system
```

## Window features
* Multiple open windows at the same time
* Draggable
* Resizable
* Customizable

## Usage
### Opening a window
```svelte
<!-- App.svelte -->
<script>
    import { openWindow } from 'svelte-window-system';
    import MyWindowComponent from 'MyWindowComponent.svelte';

    function openNewWindow() {
        openModal(MyWindowComponent, { width: 200, height: 400 }, { someProp: 'my window property' });
    }
</script>

<button on:click="{openNewModal}">Open modal</button>
```
```svelte
<!-- MyWindowComponent.svelte -->
<script>
    export let someProp = '';
</script>

<div>{someProp}</div>
```
To open a window, use `openWindow(component: any, windowOptions?: WindowOptions, componentProps?: any)` function, provide it a component to render inside the window, some options (if you want to change anything beyond the defaults) and an object of component properties that will be passed to the component, rendered inside the window.

Notes:
- A window will always be rendered as a child of the `body` 

### Window options
All of these are optional.
| Option                          | Type                     | Default value  | Description                                                                                                                                                                            |
|---------------------------------|--------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **width**                       | number                   | 600            | Initial window width in pixels.                                                                                                                                                        |
| **minWidth**                    | number                   | 300            | Minimum width of the window.                                                                                                                                                           |
| **maxWidth**                    | number                   | -1             | Maximum width of the window. Set to -1 to allow the window to be of any width.                                                                                                         |
| **height**                      | number                   | 500            | Initial window height in pixels.                                                                                                                                                       |
| **minHeight**                   | number                   | 200            | Minimum height of the window.                                                                                                                                                          |
| **maxHeight**                   | number                   | -1             | Maximum height of the window. Set to -1 to allow the window to be of any height.                                                                                                       |
| **resizable**                   | boolean                  | true           | Whether the window should be resizable.                                                                                                                                                |
| **title**                       | string                   | 'New window'   | The title of the window show at the top of the window.                                                                                                                                 |
| **position**                    | { x: number; y: number } | { x: 0; y: 0 } | The absolute position of the viewport at which the window will be opened. The **top-left** corner of the window will be placed at this position. Ignored, if `openInCenter` is `true`. |
| **openInCenter**                | boolean                  | true           | Whether to open the window in the center of the screen.                                                                                                                                |
| **alwaysOnTop**                 | boolean                  | false          | Whether to always show the window on top. When there are multiple windows open, this window will always be on top, no matter if it the active window or not.                           |
| **preventBodyOverflow**         | boolean                  | false          | Whether the whole body of the page should overflow when the window is dragged outside the screen.                                                                                      |
| **animate**                     | boolean                  | true           | Whether the opening and closing of the window should be animated.                                                                                      |
| **customTitlebarButtons**       | TitlebarButton[]         | []             | By default, there's only a button to close the window in the titlebar, but this property allows you to add custom buttons to the titlebar.                                             |
| **customTitlebarClass**         | string                   | <empty>        | A class that will style the title bar. **Must be defined in global.css**. Overrides the default styles completely.                                                                     |
| **customInactiveTitlebarClass** | string                   | <empty>        | A class that will style the title bar when the window is not active. **Must be defined in global.css**. Overrides the default styles completely.                                       |
| **customTitlebarButtonClass**   | string                   | <empty>        | A class that will style the title bar buttons. **Must be defined in global.css**. Overrides the default styles completely.                                                             |
| **customWindowClass**           | string                   | <empty>        | A class that will style the main modal window. **Must be defined in global.css**. Overrides the default styles completely.                                                             |

### Component props
You can easily provide the properties for your window component by passing in an object to `openWindow` function.
```typescript
const componentProps = {
    propName1: 'propValue1',
    propName2: 'propValue2',
    propName3: { ... },
    propName4: 20,
};

openWindow(component, windowOptions, componentProps);
```

### Adding custom button to the title bar
The system allows you to add custom button to the title bar next to the close button. This can be achieved by providing one or more TitlebarButton objects with windowOptions in a property `customTitlebarButtons` when opening a window. The style of the button will be the same as the style of close button and if a `customTitlebarButtonsClass` is specified, the buttons will instead be styled according to the probided class.

#### TitlebarButton
| Option   | Type                         | Description                         |
|----------|------------------------------|-------------------------------------|
| value    | string                       | Text inside a button                |
| callback | a function with no arguments | A callback function for the button  |

## Author

👤 **Vidmantas Luneckas**

* Github: [@DonutLaser](https://github.com/DonutLaser)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/DonutLaser/svelte-modal-system/issues). You can also take a look at the [contributing guide](https://github.com/DonutLaser/svelte-modal-system/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Vidmantas Luneckas](https://github.com/DonutLaser).<br />
This project is [MIT](https://github.com/DonutLaser/svelte-modal-system/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_