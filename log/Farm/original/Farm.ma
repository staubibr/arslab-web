[top]
components : f1@field f2@field f3@field market@market sm wm hm 
out : out_bushels out_type out_sales 
in : in_stop_f1 in_stop_f2 in_stop_f3 
Link : in_stop_f1 in_stop@f1
Link : in_stop_f2 in_stop@f2
Link : in_stop_f3 in_stop@f3
Link : out_water_field@f1 in_field@wm
Link : out_water_surface@f1 in_surface@wm
Link : out_water_type@f1 in_type@wm
Link : out_water_field@f2 in_field@wm
Link : out_water_surface@f2 in_surface@wm
Link : out_water_type@f2 in_type@wm
Link : out_water_field@f3 in_field@wm
Link : out_water_surface@f3 in_surface@wm
Link : out_water_type@f3 in_type@wm
Link : out_sower_field@f1 in_field@sm
Link : out_sower_surface@f1 in_surface@sm
Link : out_sower_type@f1 in_type@sm
Link : out_sower_field@f2 in_field@sm
Link : out_sower_surface@f2 in_surface@sm
Link : out_sower_type@f2 in_type@sm
Link : out_sower_field@f3 in_field@sm
Link : out_sower_surface@f3 in_surface@sm
Link : out_sower_type@f3 in_type@sm
Link : out_harvest_field@f1 in_field@hm
Link : out_harvest_surface@f1 in_surface@hm
Link : out_harvest_type@f1 in_type@hm
Link : out_harvest_field@f2 in_field@hm
Link : out_harvest_surface@f2 in_surface@hm
Link : out_harvest_type@f2 in_type@hm
Link : out_harvest_field@f3 in_field@hm
Link : out_harvest_surface@f3 in_surface@hm
Link : out_harvest_type@f3 in_type@hm
Link : out_field_1@wm in_done@f1
Link : out_field_2@wm in_done@f2
Link : out_field_3@wm in_done@f3
Link : out_field_1@sm in_done@f1
Link : out_field_2@sm in_done@f2
Link : out_field_3@sm in_done@f3
Link : out_field_1@hm in_done@f1
Link : out_field_2@hm in_done@f2
Link : out_field_3@hm in_done@f3
Link : out_bushels@hm in_bushels@market
Link : out_type@hm in_type@market
Link : out_type@market out_type
Link : out_bushels@market out_bushels
Link : out_sales@market out_sales

[f1]
surface : 100
type : 1
id : 1
growth_rate_1 : 50
growth_rate_2 : 40
growth_rate_3 : 60
evaporation_rate_1 : 2
evaporation_rate_2 : 1
evaporation_rate_3 : 3

[f2]
surface : 200
type : 2
id : 2
growth_rate_1 : 50
growth_rate_2 : 40
growth_rate_3 : 60
evaporation_rate_1 : 2
evaporation_rate_2 : 1
evaporation_rate_3 : 3

[f3]
surface : 300
type : 3
id : 3
growth_rate_1 : 50
growth_rate_2 : 40
growth_rate_3 : 60
evaporation_rate_1 : 2
evaporation_rate_2 : 1
evaporation_rate_3 : 3

[market]
value_type_1 : 2.5
value_type_2 : 3.2
value_type_3 : 4.1

[sm]
components : que_sm@queue sower@sower 
out : out_field_1 out_field_2 out_field_3 
in : in_surface in_field in_type 
Link : in_surface in_surface@que_sm
Link : in_field in_field@que_sm
Link : in_type in_type@que_sm
Link : out_id@que_sm in_id@sower
Link : out_surface@que_sm in_surface@sower
Link : out_type@que_sm in_type@sower
Link : out_id@sower in_done@que_sm
Link : out_field_1@que_sm out_field_1
Link : out_field_2@que_sm out_field_2
Link : out_field_3@que_sm out_field_3

[que_sm]

[sower]
speed : 5


[wm]
components : que_wm@queue irrigator@irrigation 
out : out_field_1 out_field_2 out_field_3 
in : in_surface in_field in_type 
Link : in_surface in_surface@que_wm
Link : in_field in_field@que_wm
Link : in_type in_type@que_wm
Link : out_id@que_wm in_id@irrigator
Link : out_surface@que_wm in_surface@irrigator
Link : out_type@que_wm in_type@irrigator
Link : out_id@irrigator in_done@que_wm
Link : out_field_1@que_wm out_field_1
Link : out_field_2@que_wm out_field_2
Link : out_field_3@que_wm out_field_3

[que_wm]

[irrigator]
speed : 20


[hm]
components : que_hm@queue harvester@harvester 
out : out_field_1 out_field_2 out_field_3 out_bushels out_type 
in : in_surface in_field in_type 
Link : in_surface in_surface@que_hm
Link : in_field in_field@que_hm
Link : in_type in_type@que_hm
Link : out_id@que_hm in_id@harvester
Link : out_surface@que_hm in_surface@harvester
Link : out_type@que_hm in_type@harvester
Link : out_id@harvester in_done@que_hm
Link : out_field_1@que_hm out_field_1
Link : out_field_2@que_hm out_field_2
Link : out_field_3@que_hm out_field_3
Link : out_bushels@harvester out_bushels
Link : out_type@harvester out_type

[que_hm]

[harvester]
speed : 5
yield_type_1 : 150
yield_type_2 : 120
yield_type_3 : 170



