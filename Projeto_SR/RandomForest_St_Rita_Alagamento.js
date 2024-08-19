// random forest para o municipio de Nova Santa Rita (Rio Grande do Sul) 
//- antes e após as cheias


var nv_st_rita_6_mai = ee.Image('users/mataugusto1999/Nv_St_Rita_6_mai_24');
var nv_st_rita_30marc = ee.Image('users/mataugusto1999/Nv_St_Rita_30mar_24');



//ndvi
var ndvi = nv_st_rita_6_mai.normalizedDifference(['b4', 'b3']).rename('ndvi');
nv_st_rita_6_mai = nv_st_rita_6_mai.addBands(ndvi,['ndvi']);

var ndvi = nv_st_rita_30marc.normalizedDifference(['b4', 'b3']).rename('ndvi');
nv_st_rita_30marc = nv_st_rita_30marc.addBands(ndvi,['ndvi']);

//ndwi
var ndwi = nv_st_rita_6_mai.normalizedDifference(['b4', 'b2']).rename('ndwi');
nv_st_rita_6_mai = nv_st_rita_6_mai.addBands(ndwi,['ndwi']);

var ndwi = nv_st_rita_30marc.normalizedDifference(['b4', 'b2']).rename('ndwi');
nv_st_rita_30marc = nv_st_rita_30marc.addBands(ndwi,['ndwi']);





// ------ Classificação a primeira imagem:
var amostras = lama.merge(graminea).merge(arvore).merge(solo_exposto).merge(area_urbana); //juntando as amostras


//extraindo as regiões da amostra
var input_features = nv_st_rita_6_mai.sampleRegions ({
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
  inputProperties: ['b1','b2','b3','b4','ndvi']
});  //indexdatabase.de -> indices de s.r.


//classificando
var classificado_atual = nv_st_rita_6_mai.classify(classificador);









// ------ classificando a segunda imagem:

var amostras = agua.merge(graminea).merge(arvore).merge(solo_exposto2).merge(area_urbana); //juntando as amostras


//extraindo as regiões da amostra
var input_features = nv_st_rita_30marc.sampleRegions ({
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
  inputProperties: ['b1','b2','b3','b4','ndvi']
});


var classificado_anterior = nv_st_rita_30marc.classify(classificador);

//validação
var validacao = teste.classify(classificador);
var testeAcuracia = validacao.errorMatrix('class', 'classification');
print('Validação Matrix de Erro: ', testeAcuracia);
print('Validação Acuracia Geral: ', testeAcuracia.accuracy());
print('kappa: ', testeAcuracia.kappa());



//exportando a imagem
Export.image.toDrive({
  image: classificado_atual,
  folder: 'GEE',
  scale: 3,
  maxPixels: 1e13
});

Export.image.toDrive({
  image: classificado_anterior,
  folder: 'GEE2',
  scale: 3,
  maxPixels: 1e13
});



Map.addLayer(nv_st_rita_30marc, cor_marc, '30 de março');
Map.addLayer(nv_st_rita_6_mai, cor_mai, '06 de maio');
Map.centerObject(nv_st_rita_30marc);
Map.addLayer(classificado_atual, cor_classes, 'Classificação Mais Atual');
Map.addLayer(classificado_anterior, cor_classes2, 'Classificação Mais Antiga');


