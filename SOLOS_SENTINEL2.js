//LINK PARA RODAR: https://code.earthengine.google.com/e922f0a6ab4c977c94060c096d04dc1b

//PONTOS DE LOCALIZAÇÃO DAS AREAS DE ESTUDO:
var Areia = /* color: #d63000 */ee.Geometry.Point([-48.14388575110287, -15.368234307673209]),
    materiaorgn = /* color: #4f75d6 */ee.Geometry.Point([-63.077007051347245, -7.515716848844955]),
    argila = /* color: #98ff00 */ee.Geometry.Point([-45.22740893993776, -5.503738170810047]),
    silte = /* color: #d65555 */ee.Geometry.Point([-45.227341728849545, -5.506019090299876]),
    ferro = /* color: #98ff00 */ee.Geometry.Point([-44.38366591904078, -20.13452341435884]),
    areia_caraibas = /* color: #d63000 */ee.Geometry.Point([-38.493541071620946, -9.01952039704468]);


//Areas de Estudo:
var areia = Areia
var sil = silte
var humos = materiaorgn
var arg = argila
var fer = ferro


//Sensor Sentinel 2:
/**
 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

var dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterDate('2020-01-01', '2020-03-28')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds)
                  .map(NDVI);

var visualization = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};


function NDVI (image) {
  var ndvi = image.expression(
  '((NIR-RED) / (NIR + RED))', {
    NIR:image.select('B8'),
    RED:image.select('B4')}).rename('NDVI')
return image.addBands(ndvi)
}

Map.setCenter(-45.23, -5.51, 12);

Map.addLayer(dataset.mean(), visualization, 'RGB-Sentinel');
Map.addLayer(dataset.select('NDVI'), {min: 0.0, max: 1.0}, 'NDVI');



