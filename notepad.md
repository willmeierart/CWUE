## active
[] general
  [x] find out about which menu items have dropdowns - ALL
    [x] and set that up
  [x] FINISH UDEMY GRAPHQL
  [] implement proptypes
  [] clean up && comment code
  [] start using google tools to be checking:
    [] pagespeed
    [] seo indexing

[] locations 
  [x] work out routing completely
    [] **make sure query strings parseable - DOESN'T NEED TO SSR**
    [] make sure everything actually being SSR'd
  [] maps
    [x] restrict api key
    [] deal with automatic bounds / markers / etc
    [] get working with indirect search (markers)
    [x] check out potential for styling (esp america border)
  [x] figure out multi-endpoint apollo thing (schema-stitching?)
    [x] deploy server
  [] **figure out how to bind 'region' (or derive it from data) to each location** -- think about finding >/< bounds
  [x] start working on binding functions to real data, graphcms
  [x] set map to load at different zooms based on screen size
  [] **reallllly clean up / wrap your hand around code for search portion**



## tests
[] locations
  [x] if you search for an address it shows up in list view 
    [] and map shows markers
  [x] if you search for a carwash by name it shows up in list view
    [] and map shows markers
  [x] if you search for an address within 5 miles the nearby locations show up in list view
    [] and map shows markers
  [x] if you search for a city that contains a location it shows up in list view
  + parsed by bounds and region
  [x] if you search for a state that contains location it shows up in list view
  + parsed by bounds and region
  [] if you navigate directly to a 'search' link (SSR), its query string is parsed into a valid search
    +
  [] when a group of locations show up on a map, the map centers on marker cluster **(or search item?)** and zooms to bounds

## problems with above
1. [x] no search results rendering at all
2. [x] results not rendering on first search
2. [] no map markers rendering at all
3. [] map not centering correctly
4. [] activeResult not being picked
5. [] handle all incomplete paths (no 404 on locations/detail etc)