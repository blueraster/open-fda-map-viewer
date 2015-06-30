 const pathname = window.location.pathname.replace(/\/[^/]+$/, '')
 const basePath = pathname + (pathname.substr(-1) !== '/' ? '/' : '') + 'app'

 export const resources = {
  openFdaImage: `${basePath}/images/l_openFDA.png`,
  blueRasterImage: `${basePath}/images/br_logo.png`,
  closeIcon: `${basePath}/images/close.png`

}
