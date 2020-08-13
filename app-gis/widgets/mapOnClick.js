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
    source: new ol.source.Vector({
      features:  new ol.Collection,
    }),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.7)',
      }),
      stroke: new ol.style.Stroke({
        color: '#3399CC',
        width: 3,
      }),
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
        } else {
          clickedValue = "N/A";
        }

        AddToOverLay(title, clickedDauid, clickedValue)
        
        // Highlight feature
        featureOverlay.getSource().addFeature(feature)
      },
      // Commented out the line below for now
      
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
    overlayFeatureName.innerHTML = null;
    overlayFeatureInitialPopulation.innerHTML = null;
    overlayFeatureCurrentPopulation.innerHTML = null;
    overlayFeatureCycle.innerHTML = null;
    overlayFeatureInfected.innerHTML = null;
    overlayFeatureSusceptible.innerHTML = null;
    overlayFeatureRecovered.innerHTML = null;
    overlayFeatureFatalities.innerHTML = null;
    
    
    
    // Clicking outside vector layer
    overlayLayer.setPosition(undefined);
  }

  function AddToOverLay(title, clickedDauid, clickedValue){
    overlayFeatureDescription.innerHTML = "Selected Feature: ";
    overlayFeatureSimulation.innerHTML = "Current Simulation: " + title
    overlayFeatureName.innerHTML = "Census Subdivision: " + clickedDauid;
    overlayFeatureInitialPopulation.innerHTML = "Initial Population: TODO";
    overlayFeatureCurrentPopulation.innerHTML = "Current Population: TODO";
    overlayFeatureCycle.innerHTML = "Current Cycle: " + currentCcyle;
    // TODO resolve:
    // Uncaught TypeError: clickedValue.toFixed is not a function
    overlayFeatureInfected.innerHTML = "Proportion Infected: " + clickedValue.toFixed(3);
    overlayFeatureSusceptible.innerHTML = "Proportion Susceptible: TODO";
    overlayFeatureRecovered.innerHTML = "Proportion Recovered: TODO";
    overlayFeatureFatalities.innerHTML = "Fatalities: TODO";

  }

};
