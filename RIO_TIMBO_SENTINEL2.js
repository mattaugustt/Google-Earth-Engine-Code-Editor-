//LINK PARA RODAR: https://code.earthengine.google.com/a249c9a1c2358206b593cf580cf45907

//PONTOS DO RIO (ENTRE SUA NASCENTE E FOZ):
var nascente = /* color: #d63000 */ee.Geometry.MultiPoint(
        [[-43.300769679900206, -22.869504575825026],
         [-43.316390827226876, -22.877081030527943]]),
    foz = /* color: #98ff00 */ee.Geometry.Point([-43.26598181748152, -22.871607650417232]),
    geometry = 
    /* color: #0b4a8b */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-43.32105886474517, -22.844098652431978],
          [-43.32105886474517, -22.89502855834164],
          [-43.23866140380767, -22.89502855834164],
          [-43.23866140380767, -22.844098652431978]]], null, false),
    ponto2 = /* color: #ffc82d */ee.Geometry.Point([-43.29261429052866, -22.867817284297438]),
    ponto4 = /* color: #00ffff */ee.Geometry.Point([-43.274645919952526, -22.871168753715448]),
    ponto3 = /* color: #bf04c2 */ee.Geometry.Point([-43.28266747617966, -22.868507115834444]);


var addNDVI = function NDVI (image) {
  var ndvi = image.expression(
  '(NIR - RED)/(NIR + RED)', {
    NIR:image.select('B5'),
    RED:image.select('B4')
  }).rename('ndvi')
return image.addBands([ndvi])
}

//Estudo sobre o Rio Timbó para a disciplina de top. especiais em geomorfo.
var srtm = ee.Image("CGIAR/SRTM90_V4"); //altimetria
var antiga = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterBounds(geometry)
.filterDate('2018-12-13', '2019-01-01')
.map(addNDVI);

var atual = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
.filterBounds(geometry)
.filterDate('2023-07-01', '2023-07-25')
.map(addNDVI);

print(antiga.first().date());

print(atual.size());
print(antiga.size());
var srtm_clip = srtm.clip(geometry);



Map.addLayer(srtm, {'bands': ['elevation'], max:235, min:-4}, 'srtm');
Map.addLayer(antiga, {'bands': ['B4','B3','B2'], max:6712, min: 130}, 'antiga');
Map.addLayer(atual, {'bands': ["B4","B3","B2"], max: 4821, min: 47}, 'atual');
Map.addLayer(antiga.select('ndvi'), {}, 'NDVI Antiga');
Map.addLayer(atual.select('ndvi'), {}, 'NDVI Atual');
Map.addLayer(srtm_clip, {palette:['green','yellow','red'],
                    min:0 , max:285
},'recorte')



Map.centerObject(geometry, 14);
