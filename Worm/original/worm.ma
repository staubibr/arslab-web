[top]
components : worm 

[worm]
type : cell
dim : (10,10,3)
delay : transport
defaultDelayTime : 100   
border : wrapped

%neighbours for level 0 (Movement)
neighbors :              worm(-1,0,0) 
neighbors : worm(0,-1,0) worm(0,0,0)  worm(0,1,0)                  
neighbors :              worm(1,0,0)  
 
neighbors :              worm(0,0,1)
 
neighbors :              worm(-1,0,2) 
neighbors : worm(0,-1,2) worm(0,0,2)  worm(0,1,2)                  
neighbors :              worm(1,0,2)  


%neighbours for level 1 (Food)
neighbors :              worm(-1,0,-1) 
neighbors : worm(0,-1,-1)              worm(0,1,-1)                  
neighbors :              worm(1,0,-1)  

neighbors :              worm(-1,0,1) 
neighbors : worm(0,-1,1)              worm(0,1,1)                  
neighbors :              worm(1,0,1)  

%neighbours for level 2 (Direction)
neighbors :              worm(-1,0,-2) 
neighbors : worm(0,-1,-2) worm(0,0,-2)  worm(0,1,-2)                  
neighbors :              worm(1,0,-2) 

initialvalue : 0 
initialCellsValue : worm.val
localtransition : Movement

zone : Movement  { (0,0,0)..(9,9,0) }
zone : Food      { (0,0,1)..(9,9,1) }
zone : Direction { (0,0,2)..(9,9,2) }


[Movement]
%There is a worm in the cell and it wants to stay in this cell
rule : {(0,0,0)} 100 { (0,0,0) > 0 and (0,0,2) = 500 }
%There is a worm in the cell, and it wants to move. Becuase, we just have one worm, when it moves from a cell, that cell will be empty.
rule : 0 100 { (0,0,0) > 0 and (0,0,2) != 500 }

%A cell is empty, and there is worm in the north neighbour that wants to come to the south (come to this cell).
rule : {(-1,0,0)}     100 { (0,0,0) = 0 and (0,0,1) = 0   and (-1,0,0) > 0 and (-1,0,2) = 502} %This cell has no food.
rule : {(-1,0,0) + 1} 100 { (0,0,0) = 0 and (0,0,1) = 600 and (-1,0,0) > 0 and (-1,0,2) = 502} %This cell has food.

%A cell is empty, and there is worm in the south neighbour that wants to come to the north (come to this cell).
rule : {(1,0,0)}     100 { (0,0,0) = 0 and (0,0,1) = 0   and (1,0,0) > 0 and (1,0,2) = 501} %This cell has no food.
rule : {(1,0,0) + 1} 100 { (0,0,0) = 0 and (0,0,1) = 600 and (1,0,0) > 0 and (1,0,2) = 501} %This cell has food.

%A cell is empty, and there is worm in the east neighbour that wants to come to the west (come to this cell).
rule : {(0,1,0)}     100 { (0,0,0) = 0 and (0,0,1) = 0   and (0,1,0) > 0 and (0,1,2) = 504} %This cell has no food.
rule : {(0,1,0) + 1} 100 { (0,0,0) = 0 and (0,0,1) = 600 and (0,1,0) > 0 and (0,1,2) = 504} %This cell has food.

%A cell is empty, and there is worm in the west neighbour that wants to come to the east (come to this cell).
rule : {(0,-1,0)}     100 { (0,0,0) = 0 and (0,0,1) = 0   and (0,-1,0) > 0 and (0,-1,2) = 503} %This cell has no food.
rule : {(0,-1,0) + 1} 100 { (0,0,0) = 0 and (0,0,1) = 600 and (0,-1,0) > 0 and (0,-1,2) = 503} %This cell has food.

%If we reach to this rule it means:
%A cell is empty, and there is NOT a worm in the neighbours
%or 
%A cell is empty, and there is a worm in the one of the neighbours, but this worm does not want to come to this cell.
%So, we set this cell value to 0.
rule : 0 100 { (0,0,0) = 0}

[Food]
%There is no food in this cell, so its value remians 0.
rule : 0 100 { (0,0,0) = 0 } 

%The following rules of the Food section are about the cells that have food.
%A worm wants to go to the correpondent cell in the movement plane. This food is eaten by the worm, and there will be no food in this cell.
rule : 0 100 {(0,0,0) = 600 and (-1,0,-1) > 0 and (-1,0,1) = 502} %There is worm in the north neighbour that wants to come to the south. 
rule : 0 100 {(0,0,0) = 600 and (1,0,-1)  > 0 and (1,0,1)  = 501} %There is worm in the south neighbour that wants to come to the north.
rule : 0 100 {(0,0,0) = 600 and (0,1,-1)  > 0 and (0,1,1)  = 504} %There is worm in the east neighbour that wants to come to the west.
rule : 0 100 {(0,0,0) = 600 and (0,-1,-1) > 0 and (0,-1,1) = 503} %There is worm in the west neighbour that wants to come to the east.  

%There is food in the cell, but it is not going to be consumed by the worm.
rule : 600 100 {(0,0,0) = 600}

[Direction]
%For this plane cells, set the next movement direction if there is going to be a worm in the correpondent cell of them in the movemnet plane.
% randInt(n) returns a random integer from [0,n]
rule : {randInt(4) + 500} 100 {(0,0,-2)  > 0 and (0,0,0)  = 500} %There is worm in the cell that wants to stay.
rule : {randInt(4) + 500} 100 {(-1,0,-2) > 0 and (-1,0,0) = 502} %There is worm in the north neighbour that wants to come to the south. 
rule : {randInt(4) + 500} 100 {(1,0,-2)  > 0 and (1,0,0)  = 501} %There is worm in the south neighbour that wants to come to the north.
rule : {randInt(4) + 500} 100 {(0,1,-2)  > 0 and (0,1,0)  = 504} %There is worm in the east neighbour that wants to come to the west.
rule : {randInt(4) + 500} 100 {(0,-1,-2) > 0 and (0,-1,0) = 503} %There is worm in the west neighbour that wants to come to the east. 

%There is no worm that wants to come to this cell.
rule : 0 100 { (0,0,0) >= 0 } 
