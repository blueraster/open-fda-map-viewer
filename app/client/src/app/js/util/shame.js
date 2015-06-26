let foodDatas = {},
    runGeocodes

runGeocodes = function () {
  // TODO:
  //   debugger;
  //   // TODO: get all unique locations
  //   // sequential geocode
}

export function geocode (foodData, food) {
  // let citiesToQuery = Array.from(new Set([for (d of foodData) d.city])).map((c) => `'${c.replace("'","''")}'`)
  let citiesToQuery = Array.from(new Set([for (d of foodData) `${d.city}|||${d.state}`]))
  foodDatas[food] = citiesToQuery
  console.log(foodDatas)
  // TODO: do geocdes once foodDatas keys match config.foods
  // if (foodDatas keys match config.foods) {
     //  runGeocodes()
  // }
}
