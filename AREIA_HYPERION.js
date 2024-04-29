//LINK PARA RODAR: https://code.earthengine.google.com/147a8dd4f7aa8e1d8e42242132fbfc31

//PONTO DE ESTUDO:
var areia = /* color: #d63000 */ee.Geometry.Point([-38.493859516700866, -9.018812264829544]);

var dataset = ee.ImageCollection('EO1/HYPERION')
                  .filter(ee.Filter.date('2016-01-01', '2022-03-01'));
//var rgb = dataset.select(['B050', 'B023', 'B015']);
var rgbVis = {
  min: 1000.0,
  max: 14000.0,
  gamma: 2.5,
};
Map.setCenter(-38.51, -8.99, 9);
Map.addLayer(dataset.median(), rgbVis, 'RGB');
//Map.addLayer(rgb.median(), rgbVis, 'RGB');
