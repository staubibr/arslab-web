[top]
components : UAV

[UAV]
type : cell
dim : (10,10)
delay : transport
defaultDelayTime : 100
border : nonwrapped 

neighbors : UAV(-2,-2) UAV(-2,-1) UAV(-2,0) UAV(-2,1) UAV(-2,2) 
neighbors : UAV(-1,-2) UAV(-1,-1) UAV(-1,0) UAV(-1,1) UAV(-1,2) 
neighbors : UAV(0,-2) UAV(0,-1) UAV(0,0) UAV(0,1) UAV(0,2) 
neighbors : UAV(1,-2) UAV(1,-1) UAV(1,0) UAV(1,1) UAV(1,2) 
neighbors : UAV(2,-2) UAV(2,-1) UAV(2,0) UAV(2,1) UAV(2,2) 

initialvalue : 6
initialCellsValue : UAVSearchInput.val
localtransition : SpiralSearch

[SpiralSearch]
% If target found, switch to loiter mode
rule : 3 10 {(0,0) = 12}

% Move UAV to next square
rule : 5 10 {(0,0) = 11}

% Mark square as searched
rule : 0 10 {((0,0) = 5) and (((1,-1) > 5 and (1,-1) < 10) or ((0,-1) > 5 and (0,-1) < 10) or ((-1,-1) > 5 and (-1,-1) < 10) or ((-1,0) > 5 and (-1,0) < 10) or ((-1,1) > 5 and (-1,1) < 10) or ((0,1) > 5 and (0,1) < 10) or ((1,1) > 5 and (1,1) < 10) or ((1,0) > 5 and (1,0) < 10))} 

% If obstacle (i.e. searched, obstacle, found, etc ...) do not change
rule : {(0,0)} 10 {(0,0) < 5}

% Rule 1 per documentation
rule : {(0,0)+5} 10 {((-1,-1) = 5) and ((0,-1) < 6 or (0,-1) = ?) and ((0,-2) < 6 or (0,-2) = ?)}

% Rule 2 per documentation
rule : {(0,0)+5} 10 {((0,-1) = 5) and ((1,0) < 6 or (1,0) = ?) and ((1,-1) < 6 or (1,-1) = ?) and ((1,-2) < 6 or (1,-2) = ?) }

% Rule 3 per documentation
rule : {(0,0)+5} 10 {((1,-1) = 5) and ((1,0) < 6 or (1,0) = ?) and ((2,-1) < 6 or (2,-1) = ?) and ((2,0) < 6 or (2,0) = ?)}

% Rule 4 per documentation
rule : {(0,0)+5} 10 {((1,0) = 5) and ((0,1) < 6 or (0,1) = ?) and ((1,1) < 6 or (1,1) = ?) and ((2,1) < 6 or (2,1) = ?)}

% Rule 5 per documentation
rule : {(0,0)+5} 10 {((1,1) = 5) and ((0,1) < 6 or (0,1) = ?) and ((0,2) < 6 or (0,2) = ?) }

% Rule 6 per documentation
rule : {(0,0)+5} 10 {((0,1) = 5) and ((-1,0) < 6 or (-1,0) = ?) and ((-1,1) < 6 or (-1,1) = ?) and ((-1,2) < 6 or (-1,2) = ?)}

% Rule 7 per documentation
rule : {(0,0)+5} 10 {((-1,1) = 5) and ((-1,0) < 6 or (-1,0) = ?) and ((-2,0) < 6 or (-2,0) = ?)}

% Rule 8 per documentation
rule : {(0,0)+5} 10 {((-1,0) = 5) and ((0,-1) < 6 or (0,-1) = ?) and ((-1,-1) < 6 or (-1,-1) = ?) and ((-2,-1) < 6 or (-2,-1) = ?)}

% Rule 11 per documentation
rule : {(0,0)+5} 10 {((0,-1) = 5) and ((-1,0) > 5 and (-1,0) < 10) and ((-1,-1) > 5 and (-1,-1) < 10) and ((-1,-2) > 5 and (-1,-2) < 10) and ((1,0) > 5 and (1,0) < 10) and ((1,-1) > 5 and (1,-1) < 10) and ((1,-2) > 5 and (1,-2) < 10)}

% Rule 12 per documentation
rule : {(0,0)+5} 10 {((1,-1) = 5) and ((1,0) < 6 or (1,0) = ?)}

% Rule 13 per documentation
rule : {(0,0)+5} 10 {((1,0) = 5) and ((0,1) < 6 or (0,1) = ?) and ((1,1) < 6 or (1,1) = ?)}

% Rule 14 per documentation
rule : {(0,0)+5} 10 {((1,1) = 5) and ((0,1) < 6 or (0,1) = ?) and ((0,2) < 6 or (0,2) = ?) and ((1,2) < 6 or (1,2) = ?)}

% Rule 15 per documentation
rule : {(0,0)+5} 10 {((0,1) = 5) and ((0,2) < 6 or (0,2) = ?) and ((-1,2) < 6 or (-1,2) = ?) and ((-1,1) < 6 or (-1,1) = ?) and ((-1,0) < 6 or (-1,0) = ?)}

% Rule 16 per documentation
rule : {(0,0)+5} 10 {((-1,1) = 5) and ((-1,0) < 6 or (-1,0) = ?) and ((-2,0) < 6 or (-2,0) = ?) and ((-2,1) < 6 or (-2,1) = ?) and ((-2,2) < 6 or (-2,2) = ?) and ((-1,2) < 6 or (-1,2) = ?)}

% Rule 17 per documentation
rule : {(0,0)+5} 10 {((-1,0) = 5) and ((0,-1) < 6 or (0,-1) = ?) and ((-1,-1) < 6 or (-1,-1) = ?) and ((-2,-1) < 6 or (-2,-1) = ?) and ((-2,0) < 6 or (-2,0) = ?) and ((-2,1) < 6 or (-2,1) = ?) and ((-1,1) < 6 or (-1,1) = ?)}

% Rule 18 per documentation
rule : {(0,0)+5} 10 {((-1,-1) = 5) and ((0,-1) < 6 or (0,-1) = ?) and ((0,-2) < 6 or (0,-2) = ?) and ((-1,-2) < 6 or (-1,-2) = ?) and ((-2,-2) < 6 or (-2,-2) = ?) and ((-2,-1) < 6 or (-2,-1) = ?) and ((-2,0) < 6 or (-2,0) = ?) and ((-1,0) < 6 or (-1,0) = ?)}

% Catch all rule
rule : {(0,0)} 100 {t}