#BeginMacro(susceptible) 
0 
#EndMacro

#BeginMacro(infected)   
  1	 
#EndMacro % asymptomatic

#BeginMacro(sick)   	    
  8	 
#EndMacro % separate asymptomatic 

#BeginMacro(recovered)  
16 
#EndMacro

#BeginMacro(dead)	   
-1 
#EndMacro

#BeginMacro(imAsymp)   
  ( ((0,0)>=1) and ((0,0) < 8))  
#EndMacro

#BeginMacro(imInfected)   
((0,0)>=1 and (0,0)<16)   
#EndMacro

#BeginMacro(imRecovered)
  ((0,0)=16 ) %(((0,0) > 8) and not ((0,0)>0 and (0,0)<16))
#EndMacro

#BeginMacro(anyNeighborIsInfected)
( ( (-1,0)>0 and (-1,0)<16 ) or ( (0,-1)>0 and (0,-1)<16) or  
  ( (0,0)>0  and (0,0)<16  ) or ( (0,1)> 0 and (0,1)<16 ) or
  ( (1,0)>0 and (1,0)<16   )  
)
#EndMacro

#BeginMacro(gotInfected)   
   (uniform(0,1) <= 0.4)
#EndMacro

%#BeginMacro(asymp)         
%   (uniform(0,1) <= 0.5)   
%#EndMacro

#BeginMacro(died)          
   (uniform(0,1) <= 0.1) 
#EndMacro