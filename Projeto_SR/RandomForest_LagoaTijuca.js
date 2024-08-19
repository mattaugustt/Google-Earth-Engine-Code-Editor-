//criar as feature collections para cada classe


//Areas de proteção integral:
var areaProtec1 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Parque Nacional da Tijuca'));

var areaProtec2 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Parque Natural Municipal Bosque da Barra'));

var areaProtec3 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Refúgio de Vida Silvestre dos Campos de Sernambetiba'));

var areaProtec4 = ee.FeatureCollection('users/mataugusto1999/areas_protegidas')
.filter(ee.Filter.eq('nome','Parque Estadual da Pedra Branca'));




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



var areas_protec = areaProtec1.merge(areaProtec2).merge(areaProtec3).merge(areaProtec4);



//coleção imagens:
var landsat8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
.filterDate('2024-01-01', '2024-05-15')
.filterBounds(areas_protec)
.filterMetadata('CLOUD_COVER', 'less_than', 15);




var imagens = landsat8.sort('CLOUD_COVER');
var melhor_imagem = imagens.first();

//ndvi
var ndvi = melhor_imagem.normalizedDifference(['SR_B5', 'SR_B4']).rename('ndvi');
melhor_imagem = melhor_imagem.addBands(ndvi,['ndvi']);

//ndwi
var ndwi = melhor_imagem.normalizedDifference(['SR_B3', 'SR_B5']).rename('ndwi');
melhor_imagem = melhor_imagem.addBands(ndwi,['ndwi']);

//ndbi
var ndbi = melhor_imagem.normalizedDifference(['SR_B6', 'SR_B5']).rename('ndbi');
melhor_imagem = melhor_imagem.addBands(ndbi,['ndbi']);


// ------ Classificação a primeira imagem:
var amostras = graminea.merge(floresta).merge(solo_exposto).merge(area_urbana).merge(agua); //juntando as amostras


//extraindo as regiões da amostra
var input_features = melhor_imagem.sampleRegions ({
  collection: amostras,
  properties: ['id'],
  scale: 3
});


//fazendo a validação cruzada
input_features = input_features.randomColumn()
var split = 0.7
var treino = input_features.filter(ee.Filter.lt('random', split))
var teste = input_features.filter(ee.Filter.gte('random', split))

//treinando
var classificador = ee.Classifier.smileRandomForest(300).train({
  features: treino, 
  classProperty: 'id',
  inputProperties: ['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7','ndvi', 'ndwi', 'ndbi']
});  //indexdatabase.de -> indices de s.r.


//classificando
var classificacao = melhor_imagem.classify(classificador);




//validação
var validacao = teste.classify(classificador);
var testeAcuracia = validacao.errorMatrix('class', 'classification');
print('Validação Matrix de Erro: ', testeAcuracia);
print('Validação Acuracia Geral: ', testeAcuracia.accuracy());
print('kappa: ', testeAcuracia.kappa());



//exportando a imagem
Export.image.toDrive({
  image: classificacao,
  folder: 'Proj. SR',
  fileNamePrefix: 'RF_LagoaTijuca',
  scale: 3,
  maxPixels: 1e13
});

var imagem_cortadaAP = classificacao.clip(areas_protec);
var imagem_cortadaZA = classificacao.clip(zonasAmortecimento);

Export.image.toDrive({
  image: classificacao,
  folder: 'Proj. SR',
  fileNamePrefix: 'RF_AP', 
  region: areas_protec, 
  scale: 3,
  maxPixels: 1e13
});



Export.image.toDrive({
  image: classificacao,
  folder: 'Proj. SR',
  fileNamePrefix: 'RF_ZA', 
  region: zonasAmortecimento, 
  scale: 3,
  maxPixels: 1e13
});


Map.addLayer(melhor_imagem, RGB, 'RGB');
Map.centerObject(areas_protec);
Map.addLayer(imagem_cortadaAP, cor_classes, 'Classificação AP');
Map.addLayer(imagem_cortadaZA, cor_classes, 'Classificação ZA');
Map.addLayer(classificacao, cor_classes, 'Classificação Lagoa da Tijuca');



// Exporta a coleção de pontos para um arquivo CSV no Google Drive
Export.table.toDrive({
  collection: amostras,
  folder: 'Proj. SR',
  description: 'Pontos',
  fileFormat: 'CSV'
});
