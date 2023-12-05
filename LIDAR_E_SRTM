//LINK PARA RODAR: https://code.earthengine.google.com/5ccef25712b32a5b9a7cec70463edcdc

//PONTOS DE ESTUDO:
var geometry = /* color: #d63000 */ee.Geometry.Point([5.937874025460612, 52.04777214946692]),
    geometry2 = /* color: #98ff00 */ee.Geometry.Point([4.878320198410209, 52.37012004123062]);

//SRTM:

var dataset = ee.Image('CGIAR/SRTM90_V4');
var elevation = dataset.select('elevation');
var slope = ee.Terrain.slope(elevation);
//Map.setCenter(-112.8598, 36.2841, 10);
Map.addLayer(slope, {min: 0, max: 30}, 'SRTM');

//LIDAR:

var dataset2 = ee.Image('AHN/AHN2_05M_NON');
var elevation = dataset2.select('elevation');
var elevationVis = {
  min: -5.0,
  max: 30.0,
};
Map.setCenter(5.80258, 51.78547, 14);
Map.addLayer(elevation, elevationVis, 'LIDAR');
