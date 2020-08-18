export const mapOnClick = (data, map, filterTitle, title, currentCcyle) => {

  const overlayContainerElement = document.querySelector(".overlay-container");
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement
  });
  // Allows us to display elements over the map
  // Such elements are attached to specific map locations
  // Tied to geographic coordiantes
  map.addOverlay(overlayLayer);
  const overlayFeatureDescription = document.getElementById("feature-title");
  const overlayFeatureSimulation = document.getElementById("feature-simulation");
  const overlayFeatureName = document.getElementById("feature-name");
  const overlayFeatureCycle = document.getElementById("feature-cycle");
  const overlayFeatureInfected = document.getElementById("feature-infected");
  const overlayFeatureSusceptible = document.getElementById("feature-susceptible");
  const overlayFeatureRecovered = document.getElementById("feature-recovered");
  const overlayFeatureInitialPopulation = document.getElementById("feature-init-pop");
  const overlayFeatureCurrentPopulation = document.getElementById("feature-current-pop");
  const overlayFeatureFatalities = document.getElementById("feature-fatal");

  // So we can highlight the currently selected feature
  var featureOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({features:  new ol.Collection}),
    style: new ol.style.Style({
      fill: new ol.style.Fill({color: 'rgba(255,255,255,0.7)'}),
      stroke: new ol.style.Stroke({color: '#3399CC', width: 3}),
    })
  });

  map.on("click", function (e) {
    ClearOverlay()

    // Finds where the user clicks on the map and matches it to the correct feature
    map.forEachFeatureAtPixel(
      e.pixel,
      function (feature, layer) {
        
        let clickedCoordinate = e.coordinate;
        let clickedDauid = parseFloat(feature.N.dauid);
        let clickedValue;
        
        overlayLayer.setPosition(clickedCoordinate);

        // Check if the census subdivision has an infected population
        if (data[parseFloat(feature.N.dauid)] != undefined) {
          clickedValue = data[parseFloat(feature.N.dauid)];
          AddToOverLay(title, clickedDauid, clickedValue, feature.N.DApop_2016)
        } else {
          clickedValue = "N/A";
          AddToOverLayNoData(title, clickedDauid, feature.N.DApop_2016)
        }

        // Highlight feature
        featureOverlay.getSource().addFeature(feature)
      },
      {
        /*         
          Layer filter function, this ensures that if we have other vector layers, 
          this on("click") will only work for the current title
        */
        layerFilter: function (layerCandidate) {
          return layerCandidate.get("title") === filterTitle;
        },
      }
    );
  });

  function ClearOverlay(){
    // Clear existing features in overlay
    featureOverlay.getSource().clear();

    // Clear contents from overlay 
    overlayFeatureDescription.innerHTML = null;
    overlayFeatureSimulation.innerHTML = null;
    overlayFeatureCycle.innerHTML = null;
    overlayFeatureName.innerHTML = null;


    overlayFeatureInitialPopulation.innerHTML = null;
    overlayFeatureCurrentPopulation.innerHTML = null;
    overlayFeatureFatalities.innerHTML = null;
    
    overlayFeatureSusceptible.innerHTML = null;
    overlayFeatureInfected.innerHTML = null;
    overlayFeatureRecovered.innerHTML = null;
    
    
    // Clicking outside vector layer
    overlayLayer.setPosition(undefined);
  }

  function AddToOverLay(title, clickedDauid, clickedValue, population){
    overlayFeatureDescription.innerHTML = "Selected Feature: ";
    overlayFeatureSimulation.innerHTML = "Current Simulation: " + title
    overlayFeatureCycle.innerHTML = "Current Cycle: " + currentCcyle;
    overlayFeatureName.innerHTML = "Census Subdivision: " + clickedDauid;

    overlayFeatureInitialPopulation.innerHTML = "Initial Population: " + population;
    overlayFeatureCurrentPopulation.innerHTML = "Current Population: TODO";
    overlayFeatureFatalities.innerHTML = "Fatalities: TODO";
    

    overlayFeatureSusceptible.innerHTML = "Proportion Susceptible: TODO";
    if(clickedValue == "N/A"){
      overlayFeatureInfected.innerHTML = "Proportion Infected: " + clickedValue;
    } else {
      overlayFeatureInfected.innerHTML = "Proportion Infected: " + clickedValue.toFixed(3);
    }
    overlayFeatureRecovered.innerHTML = "Proportion Recovered: TODO";
    

  }

  function AddToOverLayNoData(title, clickedDauid, population){
    overlayFeatureDescription.innerHTML = "Selected Feature: ";
    overlayFeatureSimulation.innerHTML = "Current Simulation: " + title;
    overlayFeatureCycle.innerHTML = "Census Subdivision not found in Simulation Results.";
    overlayFeatureName.innerHTML = "Census Subdivision: " + clickedDauid;
    overlayFeatureInitialPopulation.innerHTML = "Initial Population: " + population;
    overlayFeatureCurrentPopulation.innerHTML = "No more data to show.";
    
  }

};
