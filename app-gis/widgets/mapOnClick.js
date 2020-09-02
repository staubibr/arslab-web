// Allows us to display elements over the map
// Such elements are attached to specific map locations
// Tied to geographic coordiantes
export const mapOnClick = (data, map, title, currentCcyle) => {

  const overlayContainerElement = document.getElementById("overlay-container");
  const overlayLayer = new ol.Overlay({ element: overlayContainerElement});
  map.addOverlay(overlayLayer);
  
  const overlayFeatureSimulation = document.getElementById("feature-simulation");
  const overlayFeatureName = document.getElementById("feature-name");
  const overlayFeatureCycle = document.getElementById("feature-cycle");
  const overlayFeatureInfected = document.getElementById("feature-infected");
  const overlayFeatureSusceptible = document.getElementById("feature-susceptible");
  const overlayFeatureRecovered = document.getElementById("feature-recovered");
  const overlayFeatureInitialPopulation = document.getElementById("feature-init-pop");
  const overlayFeatureCurrentPopulation = document.getElementById("feature-current-pop");
  const overlayFeatureFatalities = document.getElementById("feature-fatal");

  map.on("click", function (e) {
    // Clicking outside vector layer
    overlayLayer.setPosition(undefined);
    // Finds where the user clicks on the map and matches it to the correct feature
    map.forEachFeatureAtPixel(
      e.pixel,
      function (feature, layer) {
        let clickedCoordinate = e.coordinate;
        let clickedDauid = parseFloat(feature.N.dauid);
        overlayLayer.setPosition(clickedCoordinate);

        // Check if the census subdivision has an infected population
        if (data[parseFloat(feature.N.dauid)] != undefined) {
          AddToOverLay(
            title, 
            clickedDauid, 
            data[parseFloat(feature.N.dauid)].Fatalities, 
            data[parseFloat(feature.N.dauid)].Susceptible, 
            data[parseFloat(feature.N.dauid)].Infected,
            data[parseFloat(feature.N.dauid)].Recovered, 
            feature.N.DApop_2016
            )
        } else { AddToOverLayNoData(title, clickedDauid, feature.N.DApop_2016) }
      },
      {
        /*         
          Layer filter function, this ensures that if we have other vector layers, 
          this on("click") will only work for the current title
        */
        layerFilter: function (layerCandidate) {
          return layerCandidate.get("title") === title;
        },
      }
    );
  });


  function AddToOverLay(title, clickedDauid, clickedFatalities, clickedSusceptible, clickedInfected, clickedRecovered,  population){

    overlayContainerElement.style.display = 'block'

    overlayFeatureSimulation.innerHTML = "Current Simulation: " + title
    overlayFeatureCycle.innerHTML = "Current Cycle: " + currentCcyle;
    overlayFeatureName.innerHTML = "Census Subdivision: " + clickedDauid;

    overlayFeatureInitialPopulation.innerHTML = "Initial Population: " + population;
    overlayFeatureCurrentPopulation.innerHTML = "Current Population: " + (population - (population * clickedFatalities));
    overlayFeatureFatalities.innerHTML = "Fatalities this cycle: " + clickedFatalities;
    

    overlayFeatureSusceptible.innerHTML = "Proportion Susceptible: " + clickedSusceptible;
    overlayFeatureInfected.innerHTML = "Proportion Infected: " + clickedInfected //.toFixed(3);
    overlayFeatureRecovered.innerHTML = "Proportion Recovered: " + clickedRecovered;
    
  }

  function AddToOverLayNoData(title, clickedDauid, population){

    overlayContainerElement.style.display = 'block'

    overlayFeatureSimulation.innerHTML = "Current Simulation: " + title;
    overlayFeatureCycle.innerHTML = "Census Subdivision not found in Simulation Results.";
    overlayFeatureName.innerHTML = "Census Subdivision: " + clickedDauid;

    overlayFeatureInitialPopulation.innerHTML = "Initial Population: " + population;
    overlayFeatureCurrentPopulation.innerHTML = "No more data to show.";
    overlayFeatureFatalities.innerHTML = null;

    overlayFeatureSusceptible.innerHTML = null;
    overlayFeatureInfected.innerHTML = null; 
    overlayFeatureRecovered.innerHTML = null;

  }

};