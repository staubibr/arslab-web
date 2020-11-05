export const filterFiles = (files) => {
  files = files.filter(function (item) {
    var temp = item.name;
    var ext = temp.split(".").pop();
    // Accepted file formats
    if (ext === "txt" || ext === "geojson") {
      return true;
    } else {
      var Dom = document.querySelector(".files-container").children;
      for (let index = 0; index < Dom.length; index++) {
        if (Dom[index].outerText == temp) {
          Dom[index].remove();
        }
      }
      return false;
    }
  });
  return files;
};
