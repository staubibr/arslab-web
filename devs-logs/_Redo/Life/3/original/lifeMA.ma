[top]
components : life

[life]
type : cell
width : 20
height : 20
delay : transport
defaultDelayTime : 100
border : wrapped 
neighbors : life(-1,-1) life(-1,0) life(-1,1) 
neighbors : life(0,-1)  life(0,0)  life(0,1)
neighbors : life(1,-1)  life(1,0)  life(1,1)
initialvalue : 0
initialrowvalue :  5     00000001110000000000
initialrowvalue :  7     00000100100100000000
initialrowvalue :  8     00000101110100000000
initialrowvalue :  9     00000100100100000000
initialrowvalue : 11     00000001110000000000
localtransition : life-rule


[life-rule]
rule : 1 100 { (0,0) = 1 and trueCount = 5 } 
rule : 1 100 { (0,0) = 0 and trueCount = 3 } 
rule : 0 100 { t } 