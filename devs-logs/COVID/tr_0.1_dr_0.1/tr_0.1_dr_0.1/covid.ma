#include(VN.inc)
[top]
components : population

[population]
type : cell
dim : (200,200)
delay : inertial
defaultDelayTime : 1
border : nowrapped
neighbors : population(0,-1) population(0,0) population(0,1) 
neighbors :                  population(-1,0) 
neighbors :                  population(1,0) 

initialvalue : 0
InitialCellsValue : covid.val

localtransition : infections

[infections]
rule : {if( #macro(gotInfected), #macro(infected), (0,0))} 1 
     { (0,0)=0 and #macro(anyNeighborIsInfected)}

rule : { #macro(sick) }  7   { #macro(imAsymp) }

rule : {if( #macro(died), #macro(dead), (0,0)+1)} 1 
            {#macro(imInfected)}

rule : {(0,0)} 1000 { t }  

% neighbors : population(-1,-1) population(-1,0) population(-1,1) 
% neighbors : population(1,-1) population(1,0) population(1,1)
