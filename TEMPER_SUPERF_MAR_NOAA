//LINK PARA RODAR: https://code.earthengine.google.com/a97d20a97e97a74ae929d2fa5a5a43df

//PONTO NO OCEANO NA LINHA DO EQUADOR:
var equador = /* color: #000000 */ee.Geometry.Point([-94.304453125, -2.812471953965256]);

//TEMPERATURA DA SUPERFÍCIE DO MAR (SST) - NOAA
var eq = equador




var dataset = ee.ImageCollection('NOAA/CDR/SST_PATHFINDER/V53')
                  //.filter(ee.Filter.date('2014-01-01', '2016-12-31'));
                  .filter(ee.Filter.date('2019-01-01', '2020-12-31'));
                  //.filter(ee.Filter.date('2015-01-01', '2016-12-31'));
                  //.filter(ee.Filter.date('2002-01-01', '2003-12-31'));
                  //.filter(ee.Filter.date('2009-01-01', '2010-12-31'));
                  
var seaSurfaceTemperature = dataset.select('sea_surface_temperature');
var visParams = {
  min: 0.0,
  max: 2500.0,
  palette: [
    '030d81', '0519ff', '05e8ff', '11ff01', 'fbff01', 'ff9901', 'ff0000',
    'ad0000'
  ],
};

// Correção de escala de K par C.
var escala = seaSurfaceTemperature.map(function(image) {
  return image
    .multiply(0.01)
    .subtract(273.15)
    .copyProperties(image, ['system:time_start']);
});

//Cria um grafico temperatura x tempo
var temp = ui.Chart.image.series({
  imageCollection: escala,
  region: eq,
  scale: 100,
  xProperty: 'system:time_start'})
  .setOptions({
    lineWidth: 0,
    pointSize: 3,
    trendlines: {1: {
        color: 'CC0000'
      }},
     title: 'SST Oceano Pacífico',
     vAxis: {title: 'SST Celsius'}});
print(temp);

Map.setCenter(-121.99, -2.11, 2);
Map.addLayer(seaSurfaceTemperature, visParams, 'Sea Surface Temperature');
Map.centerObject(eq, 3);
