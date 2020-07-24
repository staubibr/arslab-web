export const mapOnClick = (data, map, title) => {
  const overlayContainerElement = document.querySelector(".overlay-container");
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement,
  });
  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById("feature-name");
  const overlayFeatureAssets = document.getElementById("feature-assets");
  map.on("click", function (e) {
    // Clicking outside vector layer
    overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(
      e.pixel,
      function (feature, layer) {
        let clickedCoordinate = e.coordinate;
        let clickedDauid = parseFloat(feature.N.dauid);
        let clickedValue;
        overlayLayer.setPosition(clickedCoordinate);
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
