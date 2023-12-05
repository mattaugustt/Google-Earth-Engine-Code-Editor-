//LINK PARA RODAR: https://code.earthengine.google.com/b2a1a35a2a27add5b60a62641bc79f4e

//QUANTIFICAR PRECIPITAÇÃO NA SUB-BACIA DO RIO RAMOS (ZONA NORTE DO RIO DE JANEIRO) USANDO "GPM: Global Precipitation Measurement (GPM) v6"
//IMPRIME O GRÁFICO DA PRECIPITAÇÃO NO PERIODO DADO PARA OS 3 ULTIMOS ANOS (2023, 2022, 2021).

//bacia hidrográfica:
var bacia = ee.FeatureCollection('users/mataugusto1999/Sub_Bacias_Hidrograficas')
.filter(ee.Filter.eq('shi_nm','Sub bacia do Rio Ramos')); //para selecionar apenas a sub-bacia do rio ramos

//Realizar o contorno 
var empty = ee.Image().byte();

//Definindo o contorno 
var outline = empty.paint({
  featureCollection: bacia,
  color: 1,
  width: 2
});

//Visualização:
Map.addLayer(outline, {}, 'Bacias no Rio');
Map.centerObject(bacia, 13);

//Coleção de imagens:
var dataset = ee.ImageCollection("NASA/GPM_L3/IMERG_V06")
.select('precipitationCal')//banda
.filterBounds(bacia)//seleciona os dados na área apenas
.filterDate('2021-09-03', '2023-09-10')//periodo
.filter(ee.Filter.calendarRange(9,9,'month')); 
//seleciona apenas os dados dos meses de setembro,
//entre os dias 3 e 10


print('Quantidade de dados monitorados: ', dataset.size()); //obtenção de dados a cada 3 horas
print('Quantidade de dados monitorados: ', dataset.limit(24)); //dados nas primeiras 24h

var pre_acum22 = dataset.filterDate('2022-09-05', '2022-09-10').sum().clip(bacia);
var pre_acum23 = dataset.filterDate('2023-09-05', '2023-09-10').sum().clip(bacia);

Map.addLayer(pre_acum22, {palette:['gray', 'lightblue', 'cyan', 'blue', 'darkblue'], min:0, max:100}, 'Precipitação Acumulada 2022')
Map.addLayer(pre_acum23, {palette:['gray', 'lightblue', 'cyan', 'blue', 'darkblue'], min:0, max:100}, 'Precipitação Acumulada 2023')


//Gráficos:
var chart = ui.Chart.image.doySeriesByYear({
  imageCollection: dataset, bandName: 'precipitationCal',
  region: bacia,
  regionReducer: ee.Reducer.mean(),
  sameDayReducer: ee.Reducer.sum(),
  scale: 11132,
}).setChartType('LineChart')
.setOptions({
  title: 'Precipitação Acumulada',
  hAxis: {title: 'Dia do Ano'},
  vAxis: {title: 'Precipitação (mm)'},
  lineWidth: 1,
})
//parametros: imageCollection, bandName, region, regionReducer, scale, sameDayReducer, startDay, endDay.


print(chart);

