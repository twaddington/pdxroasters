import * as map from './sections/map'
import * as list from './sections/list'
import router from './sections/router'

map.addRoasters(list.roasters)
map.locationFound(list.sortDistanceList)
