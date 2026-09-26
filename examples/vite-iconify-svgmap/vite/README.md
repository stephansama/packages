# vite-iconify-svgmap vite example

Plain [vite](https://vite.dev) app using [`@stephansama/vite-iconify-svgmap`](../../../core/vite-iconify-svgmap)

- `src/main.js` imports icons statically on the client
  (`import href from "virtual:iconify-svgmap/<pack>/<icon>"`)
- `src/render.js` uses `getIcon` for icons that are only known while
  rendering. `vite.config.js` renders it into `index.html` during development
  and `build.js` prerenders it and calls `writeSprites` for production builds
