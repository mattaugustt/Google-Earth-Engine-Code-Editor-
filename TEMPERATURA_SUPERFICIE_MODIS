//LINK PARA RODAR: https://code.earthengine.google.com/12759a77cc399258ea12536e969aa3a3

//PONTO DE ESTUDO - CENTRO DO RIO:
var Centro = /* color: #d63000 */ee.Geometry.Point([-43.19245607580732, -22.91071004083011]);


//local
var centro = Centro

var dataset = ee.ImageCollection('MODIS/061/MOD11A1')
                  .filter(ee.Filter.date('2014-01-01', '2016-12-31'));
var landSurfaceTemperature = dataset.select('LST_Day_1km');
var landSurfaceTemperatureVis = {
  min: 13000.0,
  max: 16500.0,
  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ],
};
Map.setCenter(6.746, 46.529, 2);
Map.addLayer(landSurfaceTemperature, landSurfaceTemperatureVis,'Land Surface Temperature');
Map.centerObject(centro, 7)

var TST_d = dataset.select('LST_Day_1km');
var TST_n = dataset.select('LST_Night_1km');

// Correção de escala de K par C.
var escala_d = TST_d.map(function(image) {
  return image
    .multiply(0.02)
    .subtract(273.15)
    .copyProperties(image, ['system:time_start']);
});

//Cria um grafico temperatura x tempo
var temp = ui.Chart.image.series({
  imageCollection: escala_d,
  region: centro,
  reducer: ee.Reducer.median(),
  scale: 1000,
  xProperty: 'system:time_start'})
  .setOptions({
    lineWidth: 0,
    pointSize: 3,
    trendlines: {1: {
        color: 'CC0000'
      }},
     title: 'LST Dia Serie Temporal',
     vAxis: {title: 'TST Celsius'}});
print(temp);

// Correção de escala de K par C.
var escala_n = TST_n.map(function(image) {
  return image
    .multiply(0.02)
    .subtract(273.15)
    .copyProperties(image, ['system:time_start']);
});

//Cria um grafico temperatura x tempo
var temp = ui.Chart.image.series({
  imageCollection: escala_n,
  region: centro,
  reducer: ee.Reducer.median(),
  scale: 1000,
  xProperty: 'system:time_start'})
  .setOptions({
    lineWidth: 0,
    pointSize: 3,
    trendlines: {1: {
        color: 'CC0000'
      }},
     title: 'LST Noite Serie Temporal',
     vAxis: {title: 'TST Celsius'}});
print(temp);


