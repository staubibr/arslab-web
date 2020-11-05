export const sirSelect = (SIR) => {
  if (SIR == "Susceptible") {
    document.getElementById("SIR-select").selectedIndex = 0;
  } else if (SIR == "Infected") {
    document.getElementById("SIR-select").selectedIndex = 1;
  } else {
    document.getElementById("SIR-select").selectedIndex = 2;
  }
};
