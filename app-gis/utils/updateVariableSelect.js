import Dom from '../../api-web-devs/tools/dom.js';

export const updateVariableSelect = (variables) => {

    var d = document.getElementById("variable-select");

    // Clear any existing options
    for (let index = d.length - 1; index >= 0; index--) {
        const element = d[index];
        d.remove(element)
    }
    
    // Add new options
    for (let index = 0; index < variables.length; index++) {
        const element = variables[index];
        var option = Dom.Create("option", { "text":element, "value":element });
        d.add(option);
    }
    
    // Reset to first variable
    d.selectedIndex = 0;
};
  