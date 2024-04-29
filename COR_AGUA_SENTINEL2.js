//LINK PARA RODAR: https://code.earthengine.google.com/dcce8770d8f786cd3d86f617abebfcef
//AREAS DE ESTUDO:
var pscinas_naturais = 
    /* color: #05d6b4 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-38.81963403333207, -13.549701438931761],
          [-38.81963403333207, -13.550786179432556],
          [-38.81834657300492, -13.550786179432556],
          [-38.81834657300492, -13.549701438931761]]], null, false),
    rio_madeira = 
    /* color: #7a0000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-64.03448821177543, -8.845943522799908],
          [-64.03448821177543, -8.847978951553939],
          [-64.03251410594046, -8.847978951553939],
          [-64.03251410594046, -8.845943522799908]]], null, false),
    lago_verde = 
    /* color: #068b01 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-54.949377795320316, -2.4917877596204394],
          [-54.949377795320316, -2.4926881294028806],
          [-54.948433657747074, -2.4926881294028806],
          [-54.948433657747074, -2.4917877596204394]]], null, false),
    baia_guanabara = 
    /* color: #171e5b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-43.18090936678268, -22.857572767091504],
          [-43.18090936678268, -22.861685420617018],
          [-43.1764461709819, -22.861685420617018],
          [-43.1764461709819, -22.857572767091504]]], null, false);


//Áreas:
var agua = pscinas_naturais
var alga = lago_verde
var susp = rio_madeira
var dom = baia_guanabara

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
                  .filterDate('2018-01-01', '2022-9-01')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds);

var visualization = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};


Map.setCenter(83.277, 17.7009, 12);

Map.addLayer(dataset.mean(), visualization, 'RGB');


