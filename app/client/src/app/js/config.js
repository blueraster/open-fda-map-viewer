export const config = {
  app: {
    rootClassName: 'root',
    dojoTheme: 'claro'
  },
  map: {
    id: 'map',
    options: {
      basemap: 'topo',
      zoom: 5,
      center: [-100, 34.5]
    },
    controls: {
      ids: {
        home: 'home-button',
        locate: 'locate-button',
        search: 'search'
      }
    }
  }
}
export const app = config.app
export const map = config.map
