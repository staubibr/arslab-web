/* 
  Allows us to display elements over the map
  Such elements are attached to specific map locations
  Tied to geographic coordiantes
*/
export const mapOnClick = (data, map, title, currentCycle, scale, SIR) => {
  // Exit if the box is unchecked
  // document.getElementsByClassName("panel")
  // document.querySelector('[title="simulation0_ottawaDA"]');
  // map.getControls().a[6]

  // Go through each until you find the title
  // map.getControls().a[6]._layers [index].li.innerText == title
  // [index].listeners[2].target.N.visible
  // debugger;

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

  // Clear any existing popups
  for (let index = 0; index < map.getOverlays().a.length; index++) {
    // Where the popups are held
    map.getOverlays().a.pop();
    // HTML collection
    map.v.children[index].remove();
  }

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

    // Don't bother if layer switcher unchecked for the layer
    // This sometimes doesn't work...
    // let uncheckedBox;
    // [6] is where the layer switcher currently is
    // for (let index = 0; index < map.getControls().a[6]._layers.length; index++) {
    //   var titleOfLayer = map.getControls().a[6]._layers[index].li.innerText;
    //   var checkBox = map.getControls().a[6]._layers[index].listeners[2].target.N.visible
    //   debugger;
    //   if( titleOfLayer == (title + "100") && checkBox == false){
    //     uncheckedBox = true;
    //   }
    // }
    // if(uncheckedBox != true){

    var coord = evt.mapBrowserEvent.coordinate;

    var features = select_interaction.getFeatures();

    let f;
    features.forEach(function (feature) {
      f = feature;
    });

    if (f != undefined) {
      preserveFeature = f;

      f.setStyle(highlightStyle);

      highlightedFeature.push(f);

      popup.setPosition(coord);

      let clickedDauid = parseFloat(f.N.dauid);

      if (data[clickedDauid] != undefined) {
        AddToOverLay(coord, clickedDauid, f.N.DApop_2016);
      } else {
        AddToOverLayNoData(coord);
      }
    }
  });

  function removeHighlightStyle() {
    var d = preserveFeature.getProperties();
    let x;
    if (data[d.dauid] != undefined) {
      if (SIR == "Susceptible" || SIR == undefined) {
        x = data[d.dauid].Susceptible;
      } else if (SIR == "Infected") {
        x = data[d.dauid].Infected;
      } else {
        x = data[d.dauid].Recovered;
      }
    } else {
      x = 0;
    }
    if (data[d.dauid] != undefined) {
      preserveFeature.setStyle(
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: "black",
            width: 1.2,
          }),
          fill: new ol.style.Fill({
            color: scale.GetColor(d, x),
          }),
        })
      );
    }
    return preserveFeature.getStyle();
  }

  function AddToOverLay(coord, clickedDauid, population) {
    var content = "<div>";

    content += `<h2>Polygon ID: ${clickedDauid}</h2>`
    content += `<p>Current Simulation: ${title}</p>`
    content += `<p>Current Cycle: ${currentCycle}</p>`
    content += `<p>Initial Population: ${population}</p>`

    Object.keys(data[clickedDauid]).forEach(function (f){
      // In case the population is between 0 and 1
      if(f == "Population" && data[clickedDauid][f] <= 1){
        content += `<p>${f}: ${parseInt(population) * data[clickedDauid][f]}</p>`
      }else{
        content += `<p>${f}: ${data[clickedDauid][f]}</p>`
      }
    })

    content += "</div>";
	
    popup.show(coord, content);
  }

  function AddToOverLayNoData(coord) {
    popup.show(
      coord,
      `<div><h2>Census Subdivision not found in Simulation Results</h2>` +
        `<p>No more data to show.</p>` +
        "</div>"
    );
  }
};
