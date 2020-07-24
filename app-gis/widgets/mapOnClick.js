export const mapOnClick = (data, map, title) => {
  const overlayContainerElement = document.querySelector(".overlay-container");
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement,
  });
  // See: https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html
  // Allows us to display elements over the map
  // Such elements are attached to specific map locations
  // Tied to geographic coordiantes
  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById("feature-name");
  const overlayFeatureAssets = document.getElementById("feature-assets");
  map.on("click", function (e) {
    // Clicking outside vector layer
    overlayLayer.setPosition(undefined);
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
        overlayFeatureName.innerHTML = "DAUID: " + clickedDauid;
        overlayFeatureAssets.innerHTML = "Proportion Infected: " + clickedValue.toFixed(3);
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
};
