import Dom from '../../api-web-devs/tools/dom.js';

export const updateVariableSelect = (variables) => {
    for (let index = 0; index < variables.length; index++) {
        const element = variables[index];
        var option = Dom.Create("option", { "text":element, "value":element });
        
        document.getElementById("variable-select").add(option);
    }
    
    document.getElementById("variable-select").selectedIndex = 0;
};
  