  var Lat = -57.3521391763849; 
  var Lon = -17.793748568873948;

  var GeomCoordinates = [Lat, Lon];
  print('Map focus point', GeomCoordinates);

  var deltaLat = 0.2;
  var deltaLon = 0.2;

  var polygon = ee.Geometry.Polygon({
    coords: [[ [Lat-deltaLat, Lon-deltaLon], [Lat-deltaLat, Lon+deltaLon], [Lat+deltaLat, Lon+deltaLon], [Lat+deltaLat, Lon-deltaLon], [Lat-deltaLat, Lon-deltaLon] ]],
    geodesic: false
  });

  var dataset = ee.ImageCollection('ESA/CCI/FireCCI/5_1')
                    .filterDate('2015-01-01', '2020-12-31');

  var burnedArea = dataset.select('LandCover');
  // var burnedArea = dataset.select('ConfidenceLevel');
  // var burnedArea = dataset.select('BurnDate');

  var baVis = {
    min: 1,
    max: 366,
    palette: [
      'ff0000', 'fd4100', 'fb8200', 'f9c400', 'f2ff00', 'b6ff05',
      '7aff0a', '3eff0f', '02ff15', '00ff55', '00ff99', '00ffdd',
      '00ddff', '0098ff', '0052ff', '0210ff', '3a0dfb', '7209f6',
      'a905f1', 'e102ed', 'ff00cc', 'ff0089', 'ff0047', 'ff0004'
    ]
  };
  var maxBA = burnedArea.max();

  Map.setCenter(0, 18, 2.1);
  Map.addLayer(maxBA, baVis, 'Burned Area');

  Map.setCenter(22.2, 21.2, 0);
  print('Number of images: ',burnedArea.size());

  var datasetClip = burnedArea.filterBounds(polygon)
                    .map(function(img){
                      return img.clip(polygon);
                    })
                    
  print('Number of images after the clip: ',datasetClip.size());

  var finalDataset = datasetClip.toBands();
  print(finalDataset);
  Map.addLayer(finalDataset);
  print(finalDataset.getDownloadURL({region: polygon, name:"ImagesGoogleEE"}));