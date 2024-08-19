
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


//coleção:
var dataset = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterBounds(areas_protec)
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',0.5))
.filterDate('2019-01-01', '2023-09-12');

//filterBounds -> só entrega as imagens que interceptam a geometria.
//ee.Filter.lt -> só entrega as imagens que cumpram o requisito 
//(nesse caso, imagens com menos de 10% de nuvens).
//CLOUDY_PIXEL_PERCENTAGE	-> responsavel pela quantidade de nuvens.
//filterDate -> só entrega as imagens entre os períodos especificados.

print('Quantas imagens temos: ', dataset.size())
//size vai dar a quantidade total de imagens (desde o lançamento -2017- até o momento).

print(dataset) //mostra cada uma das imagens obtidas -> 'features'


var img = dataset.sort('CLOUDY_PIXEL_PERCENTAGE').first();  
//ordena as imagens pelo percentual de nuvens e recebe a com o menor percentual

Map.addLayer(img, 
{bands: ["B4","B3","B2"],
max: 1200,
min: 146}, 'RGB'); //mostra a imagem com o menor percentual

//bandas RGB - B4,B3,B2.


//criar um timelapse -> para observar a evolução das imagens.
var dataset_vis = dataset.map(function(image) {
  return image.visualize({'bands':['B11', 'B8', 'B4'], 'gain': [0.08,0.06, 0.2], 'gamma':0.65});
});


var limite = img.geometry().bounds()
print(limite)
//limite da área.


//definir parametros do videos:
var params = {
  'bands': ['B12', 'B3', 'B2'], //Swir(B11), nir(B5), red (B4)
  'gain': [0.08, 0.06, 0.2],
  'gamma': 0.65,
  region: limite,
  dimensions: '800',
  framesPerSercond: 3
};

// animação no mapa:
var animation = ui.Thumbnail({
  image: dataset,
  params: params,
  style: {position: 'top-center'}
});

print(animation);


//para exportar uma imagem para o drive:
Export.video.toDrive({
  collection: dataset_vis,
  folder: 'GEE_Pratica',
  description: 'Desmatamento',
  dimensions: 800,
  framesPerSecond: 4,
  region: limite
});


//para exportar a imagem para o drive 
//(no tipo GeoTIFF):
Export.image.toDrive({
  image: img,
  description: 'img_sentinel_menosNuvens',
  folder: 'GEE_PRATICA',
  region: limite,
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});
