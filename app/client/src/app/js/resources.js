 const pathname = window.location.pathname.replace(/\/[^/]+$/, '')
 const basePath = pathname + (pathname.substr(-1) !== '/' ? '/' : '') + 'app'

 export const resources = {
  openFdaImage: `${basePath}/images/l_openFDA.png`,
  blueRasterImage: `${basePath}/images/br_logo.jpeg`,
  closeIcon: `${basePath}/images/close.png`,
  fullscreenIcon: `${basePath}/images/fullscreen.svg`,
  legendSymbols: {
    allRecalls: `${basePath}/images/all_recalls.png`,
    firmRecalls: `${basePath}/images/firm_recalls.png`,
    distributionPatterns: `${basePath}/images/distribution_patterns.png`,
  }
}
