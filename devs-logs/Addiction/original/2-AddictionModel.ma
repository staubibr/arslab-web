[top]
components : addiction

[addiction]
type : cell
dim : (20,20,2)
delay : transport
defaultDelayTime : 150
border : wrapped 

neighbors : addiction(0,0,-1)  addiction(-1,0,-1)  addiction(1,0,-1)  addiction(0,-1,-1) addiction(0,1,-1)
neighbors : addiction(-2,0,0)  addiction(-1,0,0)  addiction(1,0,0)  addiction(2,0,0) addiction(0,0,0)
neighbors : addiction(0,-2,0)  addiction(0,-1,0)  addiction(0,1,0)  addiction(0,2,0)

zone : NonDrugPerson-transition { (0,0,0)..(19,19,0) }
zone : Druggist-transition { (0,0,1)..(19,19,1) }

localtransition : default-rule

initialvalue : 0

[NonDrugPerson-transition]
rule : 1 150 { (0,0,0)=0 AND (0,-1,0)=1 AND (-1,0,0)=1 AND (0,1,0)=1 AND (1,0,0)=1 }
rule : 1 150 { (0,0,0)=0 AND normal(0.4,0.3) > 0.6 }
rule : 1 150 { (0,0,0)=1 } 
rule : 0 150 { t }

[Druggist-transition]
rule : 2 150 { (0,0,0)=0 AND (0,0,-1)=1 AND (0,-1,-1)=1 AND (-1,0,-1)=1 AND (0,1,-1)=1 AND (1,0,-1)=1 }
rule : 2 150 { (0,0,0)=2 }
rule : 0 150 { t }

[default-rule]
rule : {(0,0)} 150 {t}  
