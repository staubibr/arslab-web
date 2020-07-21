export const hideLayer = (layer) => {
    
    var checkbox = document.querySelector("#checkbox");
    checkbox.addEventListener("change", function () {
    var checked = this.checked;
    if (checked !== layer.getVisible()) {
        layer.setVisible(checked);
    }
    });
}