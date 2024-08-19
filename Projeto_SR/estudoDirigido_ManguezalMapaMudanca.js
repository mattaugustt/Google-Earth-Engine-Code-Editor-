var mangue = ee.FeatureCollection('users/mataugusto1999/mangue_fundo_baia');



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

// define collection parameters
var startYear = 1987;
var endYear = 2023;
var startDay = '06-20';
var endDay = '09-01';
var aoi = ee.Geometry.Point(-43.02903317771691, -22.715175280498926);
var index = 'NDVI';
var maskThese = ['cloud', 'shadow', 'snow', 'water'];

// define landtrendr parameters
var runParams = { 
  maxSegments:            12,
  spikeThreshold:         0.2,
  vertexCountOvershoot:   3,
  preventOneYearRecovery: true,
  recoveryThreshold:      1,
  pvalThreshold:          0.05,
  bestModelProportion:    1,
  minObservationsNeeded:  6
};

// define change parameters
var changeParams = {
  delta:  'loss',
  sort:   'greatest',
  year:   {checked:true, start:1987, end:2023},
  mag:    {checked:true, value:200,  operator:'>'},
  dur:    {checked:true, value:5,    operator:'<'},
  preval: {checked:false, value:300,  operator:'>'},
  mmu:    {checked:false, value:11},
  
};

//##########################################################################################
// END INPUTS
//##########################################################################################

// load the LandTrendr.js module
var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js'); 

// add index to changeParams object
changeParams.index = index;

// run landtrendr
var lt = ltgee.runLT(startYear, endYear, startDay, endDay, aoi, index, [], runParams, maskThese);

// get the change map layers
var changeImg = ltgee.getChangeMap(lt, changeParams);

// set visualization dictionaries
var palette = ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'];
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
Map.addLayer(mangue, {}, 'Mangue');
Map.centerObject(mangue, 12);
Map.addLayer(changeImg.select(['mag']), magVizParms, 'Magnitude of Change');
Map.addLayer(changeImg.select(['yod']), yodVizParms, 'Year of Detection');



// export change data to google drive

var exportImg = changeImg.unmask(0).short();
Export.image.toDrive({
  image: exportImg, 
  description: 'lt-gee_disturbance_map', 
  folder: 'lt-gee', 
  fileNamePrefix: 'MapaMudanca', 
  region: mangue, 
  scale: 30, 
  crs: 'EPSG:4326', 
  maxPixels: 1e13
});

print(changeImg);
Map.addLayer(changeImg.clip(mangue), paleta, 'Change Image');
