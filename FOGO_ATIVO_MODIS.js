//LINK PARA RODAR: https://code.earthengine.google.com/f1ba1d931137a4e000b2f7320387345a

//PARA OS POLIGONOS DE ESTUDO:
var areaqueimada = /* color: #0318d6 */ee.Geometry.Polygon(
        [[[-57.319630968452216, -18.75844801219974],
          [-57.3064988731153, -18.75836674058402],
          [-57.305211412788154, -18.754221836271334],
          [-57.300404894233466, -18.754221836271334],
          [-57.299460756660224, -18.750158105753997],
          [-57.30787216413093, -18.749670451516618],
          [-57.30529724347663, -18.741867792131323],
          [-57.31396614301276, -18.741623953215274]]]),
    area = 
    /* color: #000000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-57.85713189239502, -18.45934560787251],
          [-57.85713189239502, -18.53488168689838],
          [-57.77198784942627, -18.53488168689838],
          [-57.77198784942627, -18.45934560787251]]], null, false),
    floresta = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-61.52302976684943, -9.602273671029222],
          [-61.52302976684943, -9.61022862373392],
          [-61.51410337524787, -9.61022862373392],
          [-61.51410337524787, -9.602273671029222]]], null, false),
    agua = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-55.75048681335822, -14.939498605599722],
          [-55.75048681335822, -14.950113317896008],
          [-55.73984380798713, -14.950113317896008],
          [-55.73984380798713, -14.939498605599722]]], null, false);


var area_queimada = areaqueimada
var area_flo = floresta
var area_s_fogo = area

//Imagem do Modis True Color:
var dataset = ee.ImageCollection('MODIS/006/MCD43A4')
                  .filter(ee.Filter.date('2020-06-01', '2020-06-04')); 
                  // '2020-04-27', '2020-04-30' para o fogo ativo na região da cicatriz 
                  
var trueColor = dataset.select([
  'Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band4',
  'Nadir_Reflectance_Band3'
]);
var trueColorVis = {
  min: 0.0,
  max: 4000.0,
  gamma: 1.4,
};
Map.setCenter(-7.03125, 31.0529339857, 2);
Map.addLayer(trueColor, trueColorVis, 'True Color');

//Imagem FIRMS - BIBLIOTECA DE QUEIMADA:
var firms = ee.ImageCollection('FIRMS').filter(
    ee.Filter.date('2020-05-20', '2020-06-04')); // data do fogo na area queimada
    //ee.Filter.date('2020-06-11', '2020-06-13')); // periodo onde o fogo ativo foi iniciado 
var fires = firms.select('T21');
var firesVis = {
  min: 325.0,
  max: 400.0,
  palette: ['red', 'orange', 'yellow'],
};
Map.setCenter(-57.3912, -19.0033, 8);
Map.addLayer(fires, firesVis, 'Fires');


//Imagem Burned Area:
var burn_a = ee.ImageCollection('MODIS/061/MCD64A1')
                  .filter(ee.Filter.date('2020-06-01', '2020-06-04'));
var burnedArea = burn_a.select('BurnDate');
var burnedAreaVis = {
  min: 30.0,
  max: 341.0,
  palette: ['4e0400', '951003', 'c61503', 'ff1901'],
};
Map.addLayer(burnedArea, burnedAreaVis, 'Burned Area');


//Calculo da area queimada total:
  var image = ee.ImageCollection('MODIS/061/MCD64A1').filterBounds(areaqueimada).mosaic()
  image = ee.Image(1).mask(image.select('BurnDate').gte(0.3))
  Map.addLayer(image)

  var area_pxa = image.multiply(ee.Image.pixelArea()) 
                    .reduceRegion(ee.Reducer.sum(),areaqueimada,30,null,null,false,1e13)
                    .get('constant')
                    print ('Área queimada total:', ee.Number(area_pxa).divide(1e6))



//Imagem TST (TEMPERATURA SUPERFICIE TERRESTRE):
var surface_t = ee.ImageCollection('MODIS/061/MOD11A1')
                  .filter(ee.Filter.date('2020-06-01', '2020-06-15'));
var landSurfaceTemperature = surface_t.select('LST_Day_1km');
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

Map.addLayer(landSurfaceTemperature, landSurfaceTemperatureVis, 'TST');



//media das areas:
var chart_flo = ui.Chart.image.series({
  imageCollection: dataset.select('Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band4','Nadir_Reflectance_Band3','Nadir_Reflectance_Band2','Nadir_Reflectance_Band5','Nadir_Reflectance_Band6','Nadir_Reflectance_Band7'), 
  region: area_flo,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_area_q = ui.Chart.image.series({
  imageCollection: dataset.select('Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band4','Nadir_Reflectance_Band3','Nadir_Reflectance_Band2','Nadir_Reflectance_Band5','Nadir_Reflectance_Band6','Nadir_Reflectance_Band7'), 
  region: area_queimada,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_area_s_fogo = ui.Chart.image.series({
  imageCollection: dataset.select('Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band4','Nadir_Reflectance_Band3','Nadir_Reflectance_Band2','Nadir_Reflectance_Band5','Nadir_Reflectance_Band6','Nadir_Reflectance_Band7'), 
  region: area_s_fogo,
  reducer: ee.Reducer.mean(),
  scale: 30
});


//adicionar gráficoS:
chart_flo.style().set({
  position: 'bottom-right',
  width: '250px',
  height: '250px'
});
chart_flo.setOptions({
  title: 'Floresta Densa:',
  vAxis: {title: 'Reflectância'},
  hAxis: {title: 'Período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_flo);


chart_area_q.style().set({
  position: 'bottom-left',
  width: '250px',
  height: '250px'
});
chart_area_q.setOptions({
  title: 'Área Queimada:',
  vAxis: {title: 'Reflectância'},
  hAxis: {title: 'Período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_area_q);


chart_area_s_fogo.style().set({
  position: 'top-right',
  width: '250px',
  height: '250px'
});
chart_area_s_fogo.setOptions({
  title: 'Área Sem Fogo:',
  vAxis: {title: 'Reflectância'},
  hAxis: {title: 'Período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_area_s_fogo);
