export const config = {
  app: {
    rootClassName: 'root',
    dojoTheme: 'claro',
    requests: {
      ofdaRecalls: (recallTerm, limit, skip) => `http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${skip}&search=reason_for_recall:${recallTerm}`,
      ofdaTimeseries: (recallTerm) => `https://api.fda.gov/food/enforcement.json?&count=report_date&search=reason_for_recall:${recallTerm}`
    },
    detailLabels: [
      {key: 'report_date', text: 'Report Date'},
      {key: 'recalling_firm', text: 'Recalling Firm'},
      {key: 'recall_number', text: 'Recall Number'},
      {key: 'city', text: 'City'},
      {key: 'state', text: 'State'},
      {key: 'status', text: 'Status'},
      {key: 'distribution_pattern', text: 'Distribution Pattern'},
      {key: 'product_description', text: 'Product Description'},
      {key: 'reason_for_recall', text: 'Reason for Recall'}
    ]
  },
  panel: {
    foods: {
      individual: {
        iceCream: 'Ice Cream',
        wheat: 'Wheat',
        salads: 'Salads',
        peanuts: 'Peanuts'
      },
      nested: {
        bacteria: [
          'Chloramphenicol',
          'Salmonella',
          'Listeria'
        ]
      }
    },
    ids: {
      bacteriaSelect: 'bacteria',
      firmSelect: 'firm',
      eventSelect: 'event',
      recallSelect: 'recall'
    }
  },
  map: {
    id: 'map',
    options: {
      basemap: 'dark-gray',
      zoom: 5,
      minZoom: 3,
      maxZoom: 8,
      center: [-100, 34.5]
    },
    controls: {
      ids: {
        home: 'home-button',
        locate: 'locate-button',
        search: 'search'
      }
    },
    symbology: {
      states: { "color": [ 232, 104, 80, 64 ], "outline": { "color": [ 232, 104, 80, 255 ], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid" }, "type": "esriSFS", "style": "esriSFSSolid" }
    },
    expressions: {
      states: /HI|Hawaii|WA|Washington|MT|Montana|ME|Maine|ND|North Dakota|SD|South Dakota|WY|Wyoming|WI|Wisconsin|ID|Idaho|VT|Vermont|MN|Minnesota|OR|Oregon|NH|New Hampshire|IA|Iowa|MA|Massachusetts|NE|Nebraska|NY|New York|PA|Pennsylvania|CT|Connecticut|RI|Rhode Island|NJ|New Jersey|IN|Indiana|NV|Nevada|UT|Utah|CA|California|OH|Ohio|IL|Illinois|DC|District of Columbia|DE|Delaware|WV|West Virginia|MD|Maryland|CO|Colorado|KY|Kentucky|KS|Kansas|VA|Virginia|MO|Missouri|AZ|Arizona|OK|Oklahoma|NC|North Carolina|TN|Tennessee|TX|Texas|NM|New Mexico|AL|Alabama|MS|Mississippi|GA|Georgia|SC|South Carolina|AR|Arkansas|LA|Louisiana|FL|Florida|MI|Michigan|AK|Alaska/g,
      stateCodes: /HI|WA|MT|ME|ND|SD|WY|WI|ID|VT|MN|OR|NH|IA|MA|NE|NY|PA|CT|RI|NJ|IN|NV|UT|CA|OH|IL|DC|DE|WV|MD|CO|KY|KS|VA|MO|AZ|OK|NC|TN|TX|NM|AL|MS|GA|SC|AR|LA|FL|MI|AK/g,
      stateNames: /Hawaii|Washington|Montana|Maine|North Dakota|South Dakota|Wyoming|Wisconsin|Idaho|Vermont|Minnesota|Oregon|New Hampshire|Iowa|Massachusetts|Nebraska|New York|Pennsylvania|Connecticut|Rhode Island|New Jersey|Indiana|Nevada|Utah|California|Ohio|Illinois|District of Columbia|Delaware|West Virginia|Maryland|Colorado|Kentucky|Kansas|Virginia|Missouri|Arizona|Oklahoma|North Carolina|Tennessee|Texas|New Mexico|Alabama|Mississippi|Georgia|South Carolina|Arkansas|Louisiana|Florida|Michigan|Alaska/g
    },
    requests: {
      geoData: () => 'http://localhost:3000/getGeoData',
    }
  }
}
export const app = config.app
export const map = config.map
export const panel = config.panel
// NOTE: states regex generation below
// http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0/query?where=1+%3D+1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=STATE_ABBR%2CSTATE_NAME&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=json&token=
// copy(json.features.map(function(f){return f.attributes.STATE_ABBR}).join('|'))
// copy(json.features.map(function(f){return f.attributes.STATE_NAME}).join('|'))
