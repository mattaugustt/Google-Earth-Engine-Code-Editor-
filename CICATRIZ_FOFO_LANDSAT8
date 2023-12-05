//LINK PARA RODAR: https://code.earthengine.google.com/a2fe2811f873b31b01ce71856c22b315

//AREAS DE ESTUDO:
var cicatriz = 
    /* color: #000000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-57.49376767272949, -18.580854448550173],
          [-57.49376767272949, -18.595172636453018],
          [-57.47728818054199, -18.595172636453018],
          [-57.47728818054199, -18.580854448550173]]], null, false),
    lago = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-55.71669933738956, -14.957074831027736],
          [-55.71669933738956, -14.974985385674367],
          [-55.69644329490909, -14.974985385674367],
          [-55.69644329490909, -14.957074831027736]]], null, false),
    floresta_densa = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-61.56839372938342, -9.559031550639357],
          [-61.56839372938342, -9.592885437078207],
          [-61.52719499891467, -9.592885437078207],
          [-61.52719499891467, -9.559031550639357]]], null, false),
    fogo_ativo = /* color: #d60000 */ee.Geometry.Polygon(
        [[[-57.51007550354004, -18.633646801393983],
          [-57.505097323608396, -18.639827884806994],
          [-57.500634127807615, -18.649099088187924],
          [-57.495655947875974, -18.64861114273524],
          [-57.485871249389646, -18.640315855498077],
          [-57.47986310119629, -18.64194241434356],
          [-57.47522824401855, -18.633646801393983],
          [-57.47780316467285, -18.623236047423962],
          [-57.50183575744629, -18.62339872035822],
          [-57.509903842163084, -18.627302824085245]]]),
    sombra_nuvem = 
    /* color: #ffffff */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-56.80005567071648, -17.95266916480755],
          [-56.80005567071648, -17.959037884105246],
          [-56.79387586114617, -17.959037884105246],
          [-56.79387586114617, -17.95266916480755]]], null, false);



//Áreas de estudo:
var cica = cicatriz
//alvos que são confundidos com cicatriz de fogo
var floresta = floresta_densa
var agua = lago
var sombra = sombra_nuvem

var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2020-06-01', '2020-08-30')
    //.filterDate('2020-06-01', '2020-06-15')
    .filterMetadata('CLOUD_COVER', 'less_than', 30);

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

Map.setCenter(-57.3912, -19.0033, 8);

Map.addLayer(dataset, visualization, 'True Color (432)');


//media dos poligonos:
var chart_cicatriz = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: cica,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_floresta = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: floresta,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_agua = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: agua,
  reducer: ee.Reducer.mean(),
  scale: 30
});

var chart_sombra = ui.Chart.image.series({
  imageCollection: dataset.select('SR_B2','SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'), 
  region: sombra,
  reducer: ee.Reducer.mean(),
  scale: 30
});

//plotar os gráficos:
chart_cicatriz.style().set({
  position: 'bottom-right',
  width: '250px',
  height: '250px'
});
chart_cicatriz.setOptions({
  title: 'Cicatriz de Queimada',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_cicatriz);

chart_floresta.style().set({
  position: 'bottom-left',
  width: '250px',
  height: '250px'
});
chart_floresta.setOptions({
  title: 'Floresta Densa',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_floresta);

chart_agua.style().set({
  position: 'top-right',
  width: '250px',
  height: '250px'
});
chart_agua.setOptions({
  title: 'Água',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_agua);

chart_sombra.style().set({
  position: 'top-left',
  width: '250px',
  height: '250px'
});
chart_sombra.setOptions({
  title: 'Sombra de Nuvem:',
  vAxis: {title: 'valores da reflectância'},
  hAxis: {title: 'período', format: 'MM-YY', gridlines: {count: 7}},
});
Map.add(chart_sombra);
