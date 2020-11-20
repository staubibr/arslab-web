/* 
  Allows us to display elements over the map
  Such elements are attached to specific map locations
  Tied to geographic coordinates
*/
export const mapOnClick = (data, map) => {

    var highlightStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255,255,255,0.7)",
      }),
      stroke: new ol.style.Stroke({
        color: "#3399CC",
        width: 3,
      }),
    });
  
    let preserveFeature;
    let highlightedFeature = [];
  
    // // Clear any existing popups
    // for (let index = 0; index < map.getOverlays().getLength(); index++) {
    //   // Where the popups are held
    //   map.getOverlays().pop();
    //   // HTML collection
    //   map.v.children[index].remove();
    // }
  
    // Create popup
    const popup = new ol.Overlay.Popup();
    // Add popup to overlay (won't show up yet)
    map.addOverlay(popup);
  
    // Add listener for feature selection
    var select_interaction = new ol.interaction.Select();
    map.addInteraction(select_interaction);
  
    select_interaction.on("select", function (evt) {
      // When we click outside a feature the popup will disappear
      popup.setPosition(undefined);
  
      // Reset feature to unhighlighted
      highlightedFeature.forEach((f) => f.setStyle(removeHighlightStyle()));
  
      highlightedFeature = [];
  
      var coord = evt.mapBrowserEvent.coordinate;
  
      var features = select_interaction.getFeatures();
  
      let f;
      features.forEach(function (feature) {
        f = feature;
      });

      //debugger;
  
      if (f != undefined) {
        preserveFeature = f;
  
        f.setStyle(highlightStyle);
  
        highlightedFeature.push(f);
  
        popup.setPosition(coord);
  
        //let clickedDauid = parseFloat(f.values_.dauid);

        //debugger;
  
        // if (f != undefined) {
          AddToOverLay(coord, f);
        // } else {
        //   AddToOverLayNoData(coord);
        // }
      }
    });
  
    function removeHighlightStyle() {
      return preserveFeature.getStyle();
    }
  
    function AddToOverLay(coord, d) {
      popup.show(
        coord,
        `<div><h2>Polygon ID: ${d.values_.id}</h2>` +
          `<p>Another Place Holder: ${d.values_.id}</p>` +
          "</div>"
      );
    }
  
    function AddToOverLayNoData(coord) {
      popup.show(
        coord,
        `<div><h2>Coordinate Select: ${coord}</h2>` +
          `<p>No more data to show.</p>` +
          "</div>"
      );
    }
  };
  