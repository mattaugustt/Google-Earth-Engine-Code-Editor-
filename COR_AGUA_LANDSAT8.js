//LINK PARA RODAR: 

//POLIGONOS DAS ÁREAS DE ESTUDO:
var lago_verde = 
    /* color: #0e8b2c */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-54.94947818832832, -2.4882366533887343],
          [-54.94947818832832, -2.4893085249970595],
          [-54.9479439647718, -2.4893085249970595],
          [-54.9479439647718, -2.4882366533887343]]], null, false),
    rio_madeira = 
    /* color: #ffcb4c */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-64.04277288521133, -8.84468780069349],
          [-64.04277288521133, -8.85003079539328],
          [-64.03792345131241, -8.85003079539328],
          [-64.03792345131241, -8.84468780069349]]], null, false),
    baia_guanabara = 
    /* color: #bf04c2 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-43.161725185485466, -22.860500982099254],
          [-43.161725185485466, -22.866037098170345],
          [-43.156232021422966, -22.866037098170345],
          [-43.156232021422966, -22.860500982099254]]], null, false),
    piscinas_naturais = 
    /* color: #0ad6c8 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-38.683818239398356, -13.509445251976041],
          [-38.683818239398356, -13.511197818921753],
          [-38.68175830287492, -13.511197818921753],
          [-38.68175830287492, -13.509445251976041]]], null, false);


//Áreas:
var agua = piscinas_naturais
var alga = lago_verde
var madeira = rio_madeira
var dom = baia_guanabara


var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2018-01-01', '2022-9-01')
    .filterMetadata('CLOUD_COVER', 'less_than', 20);

// Applies scaling factors.
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBands, null, true);
}

dataset = dataset.map(applyScaleFactors);

var visualization = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3,
};

Map.setCenter(-114.2579, 38.9275, 8);

Map.addLayer(dataset, visualization, 'True Color (432)');

            //media dos poligonos:
var chart_pscinas = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: agua,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_lagoverd = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: alga,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_madeira = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: madeira,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_baia = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: dom,
  reducer: ee.Reducer.mean(),
  scale: 30
});


//adicionar gráfico:
chart_pscinas.style().set({
  position: 'bottom-right',
  width: '250px',
  height: '250px'
});
chart_pscinas.setOptions({
  title: 'Piscinas Naturais',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_pscinas);

chart_lagoverd.style().set({
  position: 'top-right',
  width: '250px',
  height: '250px'
});
chart_lagoverd.setOptions({
  title: 'Lago Verde',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_lagoverd);

chart_madeira.style().set({
  position: 'bottom-left',
  width: '250px',
  height: '250px'
});
chart_madeira.setOptions({
  title: 'Rio Madeira',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_madeira);

chart_baia.style().set({
  position: 'top-left',
  width: '250px',
  height: '250px'
});
chart_baia.setOptions({
  title: 'Baía de Guanabara',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_baia);

