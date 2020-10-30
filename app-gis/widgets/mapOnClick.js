// Allows us to display elements over the map
// Such elements are attached to specific map locations
// Tied to geographic coordiantes
export const mapOnClick = (data, map, title, currentCycle, scale, SIR) => {
  
  var highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.7)',
    }),
    stroke: new ol.style.Stroke({
      color: '#3399CC',
      width: 3,
    }),
  });

  
  let preserveFeature;
  let highlightedFeature = [];

  const popup = new ol.Overlay.Popup();
  map.addOverlay(popup);

  var select_interaction = new ol.interaction.Select();
  map.addInteraction(select_interaction);

  // https://stackoverflow.com/questions/38012268/multiple-event-on-a-map-marker

  // add a listener to know when features are selected
  select_interaction.on('select', function(evt) {
    popup.setPosition(undefined)

    highlightedFeature.forEach(f => f.setStyle(removeHighlightStyle()));

    highlightedFeature = [];

    var coord = evt.mapBrowserEvent.coordinate

    var features = select_interaction.getFeatures();

    let f;
    features.forEach(function(feature){
      f = feature
    });
    preserveFeature = f;

    f.setStyle(highlightStyle);

    highlightedFeature.push(f);

    popup.setPosition(coord)

    let clickedDauid = parseFloat(f.N.dauid);

    if (data[clickedDauid] != undefined) {
        AddToOverLay(
          coord,
          clickedDauid,
          f.N.DApop_2016
        );
      } 


  });

  // map.on('click', function(e) {
  //   // Clicking outside vector layer
  //   debugger;
  //   popup.setPosition(undefined)

  //   highlightedFeature.forEach(f => f.setStyle(removeHighlightStyle()));

  //   highlightedFeature = [];
  //   //debugger;

  //   // Finds where the user clicks on the map and matches it to the correct feature
  //   map.forEachFeatureAtPixel(e.pixel, function (feature, layer){
  //     //debugger;

  //     preserveFeature = feature;

  //     feature.setStyle(highlightStyle);

  //     highlightedFeature.push(feature);

  //     popup.setPosition(e.coordinate)

  //     let clickedDauid = parseFloat(feature.N.dauid);
      // Check if the census subdivision has an infected population
      // if (data[clickedDauid] != undefined) {
      //   AddToOverLay(
      //     e.coordinate,
      //     clickedDauid,
      //     f.N.DApop_2016
      //   );
      // } 
      // else {
      //   AddToOverLayNoData(e.coordinate, clickedDauid, f.N.DApop_2016);
      // }

  //   }),
  //   {
  //     /*         
  //       Layer filter function, this ensures that if we have other vector layers, 
  //       this on("click") will only work for the current title
  //       // Except it sometimes doesn't work if the layers are on top of each other?
  //     */
  //     layerFilter: function (layerCandidate) {
  //       return layerCandidate.get("title") === title;
  //     },
  //   }

  // });
  


  function removeHighlightStyle(){
    var d = preserveFeature.getProperties();
    let x;
    if (data[d.dauid] != undefined) {
      if(SIR == "Susceptible" || SIR == undefined){
        x = data[d.dauid].Susceptible;
      } else if (SIR == "Infected") {
        x = data[d.dauid].Infected;
      } else {
        x = data[d.dauid].Recovered;
      }
    } else {
      x = 0;
    }
    if(data[d.dauid] != undefined){
      preserveFeature.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "black",
          width: 1.2,
        }),
        fill: new ol.style.Fill({
          color: scale.GetColor(d, x),
        }),
      }))
    }
    return preserveFeature.getStyle()
  }

  function AddToOverLay(coord, clickedDauid, population){

    //console.log(currentCycle)

    popup.show(coord,
      `<div><h2>Current Simulation: ${title}</h2>` +
        `<p>Current Cycle: ${currentCycle}</p>` +
        `<p>Census Subdivision: ${clickedDauid}</p>` + 
        `<p>Initial Population: ${data[clickedDauid].Population}</p>` + 
        `<p>Current Population: ${population}</p>` + 
        `<p>Fatalities this cycle:  ${data[clickedDauid].Fatalities}</p>` + 
        `<p>Proportion Susceptible:  ${data[clickedDauid].Susceptible}</p>` + 
        `<p>Proportion Infected:  ${data[clickedDauid].Infected}</p>` + 
        `<p>Proportion Recovered:  ${data[clickedDauid].Recovered}</p>` + 
      '</div>'
    )

    // popup.content.innerText =
    //   `Current Simulation: ${title}\n` +
    //   `Current Cycle: ${currentCycle}\n` +
    //   `Census Subdivision: ${clickedDauid}\n` + 
    //   `Initial Population: ${data[clickedDauid].Population}\n` + 
    //   `Current Population: ${population}\n` + 
    //   `Fatalities this cycle:  ${data[clickedDauid].Fatalities}\n` + 
    //   `Proportion Susceptible:  ${data[clickedDauid].Susceptible}\n` + 
    //   `Proportion Infected:  ${data[clickedDauid].Infected}\n` + 
    //   `Proportion Recovered:  ${data[clickedDauid].Recovered}` 




      //debugger;
    
  }

  function AddToOverLayNoData(clickedDauid, population){

    overlayFeatureSimulation.innerHTML = "Current Simulation: " + title;
    overlayFeatureCycle.innerHTML = "Census Subdivision not found in Simulation Results.";
    overlayFeatureName.innerHTML = "Census Subdivision: " + clickedDauid;

    overlayFeatureInitialPopulation.innerHTML = "Population: " + population;
    overlayFeatureCurrentPopulation.innerHTML = "No more data to show.";


  }

};