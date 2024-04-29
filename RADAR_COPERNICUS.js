//LINK PARA RODAR: https://code.earthengine.google.com/7aef83a0cd79ee4b4837be8f37393981

//LOCAIS DE ESTUDO:
var floresta = /* color: #98ff00 */ee.Geometry.Point([-64.466765872486, -9.990909180435228]),
    graminea = /* color: #0b4a8b */ee.Geometry.Point([-63.86936329070591, -8.562330368636749]),
    solo = /* color: #ffc82d */ee.Geometry.Point([-48.345884050497055, -3.395011065674088]),
    urbana = /* color: #00ffff */ee.Geometry.Point([-63.87905686802497, -8.759707618389065]),
    lago = /* color: #bf04c2 */ee.Geometry.Point([-63.95916290752831, -5.619286398890405]),
    Lake = /* color: #d63000 */ee.Geometry.Point([-59.58676202599068, 53.70368298289854]),
    urban = /* color: #ffffff */ee.Geometry.Point([-60.37956625641137, 53.311934636751964]);



//PARA OS DIFERENTES TIPOS DE POLARIZAÇÃO (VV, VH, HH, HV):
// Filter the collection for the VV product from the descending track
var collectionVV = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    //.filterBounds(roi)
    .select(['VV']);
print(collectionVV);

// Filter the collection for the VH product from the descending track
var collectionVH = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    //.filterBounds(roi)
    .select(['VH']);
print(collectionVH);

// Filter the collection for the HV product from the descending track
var collectionHV = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'HV'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    //.filterBounds(roi)
    .select(['HV']);
print(collectionHV);

// Filter the collection for the HH product from the descending track
var collectionHH = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'HH'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    //.filterBounds(roi)
    .select(['HH']);
print(collectionHH);

//Let's centre the map view over our ROI
//Map.centerObject(roi, 13);

var VV = collectionVV.median();

// Adding the VV layer to the map
Map.addLayer(VV, {min: -14, max: -7}, 'VV');

//Calculate the VH layer and add it
var VH = collectionVH.median();
Map.addLayer(VH, {min: -20, max: -7}, 'VH');

var HV = collectionHV.median();
Map.addLayer(HV, {min: -20, max: -7}, 'HV');

var HH = collectionHH.median();
Map.addLayer(HH, {min: -20, max: -7}, 'HH');

// Create a 3 band stack by selecting from different periods (months)
var VV1 = ee.Image(collectionVV.filterDate('2018-01-01', '2018-01-08').median());
var VV2 = ee.Image(collectionVV.filterDate('2018-05-01', '2018-05-08').median());
var VV3 = ee.Image(collectionVV.filterDate('2018-09-01', '2018-09-08').median());

//Add to map
Map.addLayer(VV1.addBands(VV2).addBands(VV3), {min: -12, max: -7}, 'Season composite VV');

// Create a 3 band stack by selecting from different periods (months)
var VH1 = ee.Image(collectionVH.filterDate('2018-01-01', '2018-01-08').median());
var VH2 = ee.Image(collectionVH.filterDate('2018-05-01', '2018-05-08').median());
var VH3 = ee.Image(collectionVH.filterDate('2018-09-01', '2018-09-08').median());

//Add to map
Map.addLayer(VH1.addBands(VH2).addBands(VH3), {min: -18, max: -7}, 'Season composite VH');

// Create a 3 band stack by selecting from different periods (months)
var HH1 = ee.Image(collectionHH.filterDate('2018-01-01', '2018-01-08').median());
var HH2 = ee.Image(collectionHH.filterDate('2018-05-01', '2018-05-08').median());
var HH3 = ee.Image(collectionHH.filterDate('2018-09-01', '2018-09-08').median());

//Add to map
Map.addLayer(HH1.addBands(HH2).addBands(HH3), {min: -18, max: -7}, 'Season composite HH');

// Create a 3 band stack by selecting from different periods (months)
var HV1 = ee.Image(collectionHV.filterDate('2018-01-01', '2018-01-08').median());
var HV2 = ee.Image(collectionHV.filterDate('2018-05-01', '2018-05-08').median());
var HV3 = ee.Image(collectionHV.filterDate('2018-09-01', '2018-09-08').median());

//Add to map
Map.addLayer(HV1.addBands(HV2).addBands(HV3), {min: -18, max: -7}, 'Season composite HV');
