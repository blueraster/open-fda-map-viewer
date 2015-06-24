export const config = {
  app: {
    rootClassName: 'root',
    dojoTheme: 'claro'
  },
  map: {
    id: 'map',
    options: {
      basemap: 'dar-gray',
      zoom: 5,
      center: [-100, 34.5]
    },
    queryTerms: {
      iceCream: 'Ice Cream',
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
