import {map as config} from 'js/config'

export function recallsByTerm (recallTerm) {
  let limit = 100
  return new Promise((resolve, reject) => {
    fetch(config.requests.openFda(recallTerm))
      .then((response) => {
        resolve(response)
      })
  })
}
