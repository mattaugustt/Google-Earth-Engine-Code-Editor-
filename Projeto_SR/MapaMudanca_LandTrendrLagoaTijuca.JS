//######################################################################################################## 
//#                                                                                                    #\\
//#                           LANDTRENDR GREATEST DISTURBANCE MAPPING                                  #\\
//#                                                                                                    #\\
//########################################################################################################


// date: 2018-10-07
// author: Justin Braaten | jstnbraaten@gmail.com
//         Zhiqiang Yang  | zhiqiang.yang@oregonstate.edu
//         Robert Kennedy | rkennedy@coas.oregonstate.edu
// parameter definitions: https://emapr.github.io/LT-GEE/api.html#getchangemap
// website: https://github.com/eMapR/LT-GEE
// notes: 
//   - you must add the LT-GEE API to your GEE account to run this script. 
//     Visit this URL to add it:
//     https://code.earthengine.google.com/?accept_repo=users/emaprlab/public
//   - use this app to help parameterize: 
//     https://emaprlab.users.earthengine.app/view/lt-gee-change-mapper


//##########################################################################################
// START INPUTS
//##########################################################################################

//var ZO = ee.FeatureCollection("users/mataugusto1999/LimiteRegioesAdministrativasRA")
//.filter(ee.Filter.eq('nomera', 'Barra da Tijuca'));
//.filter(ee.Filter.eq('nomera', 'Guaratiba'));



var muzema = ee.Geometry.Point([-43.31804483396461,-22.989384326734744])

//todas as areas de proteção:
//var areasProtec = ee.FeatureCollection('users/mataugusto1999/areas_protegidas');


//Areas de proteção integral:
var areaProtec1 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Parque Nacional da Tijuca'));

var areaProtec2 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Parque Natural Municipal Bosque da Barra'));

var areaProtec3 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Refúgio de Vida Silvestre dos Campos de Sernambetiba'));

var areaProtec4 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Parque Estadual da Pedra Branca'));


var areas_protec = areaProtec1.merge(areaProtec2).merge(areaProtec3).merge(areaProtec4);




//Zonas de Amortecimento: 
var zonaAmort1 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Zona de Amortecimento do Parque Nacional da Tijuca'));

var zonaAmort2 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Zona de Amortecimento Mosaico Marapendi'));

var zonaAmort3 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Zona de Amortecimento Parque Natural Municipal Bosque da Barra'));

var zonaAmort4 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Zona de Amortecimento do Parque Estadual da Pedra Branca'));

var zonasAmortecimento = zonaAmort1.merge(zonaAmort2).merge(zonaAmort3).merge(zonaAmort4);



// define collection parameters
var startYear = 1986;
var endYear = 2024;
var startDay = '06-20';
var endDay = '05-20';
//var aoi = ee.Geometry.Point(-122.8848, 43.7929);
var index = 'NDVI';
var maskThese = ['cloud', 'shadow', 'snow', 'water'];



// define landtrendr parameters
var runParams = { 
  maxSegments:            3,
  spikeThreshold:         1.5,
  vertexCountOvershoot:   3,
  preventOneYearRecovery: true,
  recoveryThreshold:      0.25,
  pvalThreshold:          0.05,
  bestModelProportion:    0.75,
  minObservationsNeeded:  6
};

// define change parameters
var changeParams = {
  delta:  'loss',
  sort:   'greatest',
  year:   {checked:true, start:1986, end:2024},
  mag:    {checked:true, value:100,  operator:'>'},
  dur:    {checked:false, value:4,    operator:'<'},
  preval: {checked:false, value:300,  operator:'>'},
  mmu:    {checked:false, value:11},
  
};

//##########################################################################################
// END INPUTS
//##########################################################################################

// load the LandTrendr.js module
var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js'); 



//tentar adicionar o indice ndbi aqui! e colocar como índice;


// add index to changeParams object
changeParams.index = index;

// run landtrendr
var lt = ltgee.runLT(startYear, endYear, startDay, endDay, muzema, index, [], runParams, maskThese);

// get the change map layers
var changeImg = ltgee.getChangeMap(lt, changeParams);

//recortando para a ZO:
//var clipZO = changeImg.clip(ZO);

// Recortar a imagem para as áreas de preservação:
var clip_ap = changeImg.clip(areas_protec);

// Recortando para as zonas de amortecimento:
var clip_amortecimento = changeImg.clip(zonasAmortecimento);


// set visualization dictionaries
var palette = ["25ff00","fffa0e","ff2c14"];
var yodVizParms = {
  min: startYear,
  max: endYear,
  palette: palette
};

var magVizParms = {
  min: 200,
  max: 800,
  palette: palette
};

// display the change attribute map - note that there are other layers - print changeImg to console to see all
//Map.addLayer(ZO,{}, "ZO");
Map.centerObject(areas_protec, 13);
//Map.addLayer(clipZO.select(['mag']), magVizParms, 'Magnitude ZO');
//Map.addLayer(clipZO.select(['yod']), yodVizParms, "Ano de detecção");
Map.addLayer(changeImg.select(['mag']), magVizParms, 'Magnitude of Change');
Map.addLayer(changeImg.select(['yod']), yodVizParms, 'Year of Detection');
Map.addLayer(areas_protec, {},"Áreas de Proteção");
Map.addLayer(clip_ap.select(['mag']), magVizParms, "Magnitude AP");
Map.addLayer(zonasAmortecimento, {}, "Zonas de Amortecimento");
Map.addLayer(clip_amortecimento.select(['mag']), magVizParms, "Magnitude Z. Amortecimento");

// export change data to google drive

var exportImg = changeImg.clip(areas_protec).unmask(0).short();
Export.image.toDrive({
  image: exportImg, 
  description: 'lt-gee_AP_NDVI', 
  folder: 'lt-gee', 
  fileNamePrefix: 'lt_AP_NDVI', 
  region: areas_protec, 
  scale: 30, 
  crs: 'EPSG:4674', 
  maxPixels: 1e13
});


var exportImg = changeImg.clip(zonasAmortecimento).unmask(0).short();
Export.image.toDrive({
  image: exportImg, 
  description: 'lt-gee_ZA_NDVI', 
  folder: 'lt-gee', 
  fileNamePrefix: 'lt_ZA_NDVI', 
  region: zonasAmortecimento, 
  scale: 30, 
  crs: 'EPSG:4674', 
  maxPixels: 1e13
});

print(changeImg);



var polygonZA = zonasAmortecimento.map(function(feature) {
  return ee.Feature(feature.geometry().buffer(100)); // Exemplo de buffer para converter LineString em Polygon
});

// Exportar como Shapefile
Export.table.toDrive({
  collection: polygonZA,
  description: 'ZonasAmortecimento',
  fileFormat: 'SHP'
});


var polygonAP = areas_protec.map(function(feature) {
  return ee.Feature(feature.geometry().buffer(100)); // Exemplo de buffer para converter LineString em Polygon
});

// Exportar como Shapefile
Export.table.toDrive({
  collection: polygonAP,
  description: 'AreasProtec',
  fileFormat: 'SHP'
});
