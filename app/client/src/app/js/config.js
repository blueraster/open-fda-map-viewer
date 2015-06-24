export const config = {
  app: {
    rootClassName: 'root',
    dojoTheme: 'claro'
  },
  map: {
    id: 'map',
    options: {
      basemap: 'dark-gray',
      zoom: 5,
      center: [-100, 34.5]
    },
    foods: {
      individual: {
        iceCream: 'Ice Cream',
        wheat: 'Wheat',
        peanuts: 'Peanuts',
        salads: 'Salads'
      },
      bacteria: [
        'Chloramphenicol',
        'Salmonella',
        'Listeria'
      ]
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
