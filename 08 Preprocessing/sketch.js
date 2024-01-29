// https://sashamaps.net/docs/resources/20-colors/
const colorList = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

let allAirports
let flights
let airports // top airports
let maxFlightCount = 1200 // -Infinity, find dynamically while preprocessing
 
function preload() {
  allAirports = loadJSON("airportsAndFlightMappings.580x250.1.json")
}
  
function setup() {
  createCanvas(580,250)
  airports = Object.fromEntries(Object.entries(allAirports).slice( 0,15 ))
}

function draw() {
  background(220);
  fill(255,128)
  for( const airport of Object.values(airports) ) {
    s = airport.square
    d = s.s/2
    stroke('black')
    circle( airport.square.x, airport.square.y, airport.square.s )
    if( mouseX > s.x - d && mouseX < s.x + d && mouseY > s.y - d && mouseY < s.y + d ) {
      for( const dest of Object.keys(airport.outboundFlightCounts) ) {
        if( dest !== "all" && allAirports[dest] && allAirports[dest].square ) {
          stroke(0,map(airport.outboundFlightCounts[dest], 0, maxFlightCount, 16, 256))
          strokeWeight(map(airport.outboundFlightCounts[dest], 0, maxFlightCount, 0.5, 5))
          line(s.x, s.y, allAirports[dest].square.x, allAirports[dest].square.y)  
        }        
      }
    }
  }
}

let boundaryMapping = {
  west: -125,
  east: -67,
  south: 24.39,
  north: 49.38
}

// function preload() {
//   airports = loadTable("https://raw.githubusercontent.com/mrjloswald/ccfest24/main/flights/airports.csv","csv","header")
//   flights = loadTable("https://raw.githubusercontent.com/mrjloswald/ccfest24/main/flights/flights.monthly.1.csv", "csv", "header")
// }

function processData() {
  // Excluding for drawing purposes. 
  // If you want to include these places, 
  //   you have to expand your canvas size and boundary mapping
  const excludedStateCodes = ["HI","AK","PR","VI"]
  allAirports = airports.getRows()
    .filter( row => excludedStateCodes.includes( row.getString("STATE") ) )
    .map( row => {
      outboundFlightCounts = flights
      .findRows(row.getString("IATA_CODE"), "ORIGIN_AIRPORT")
      .reduce((counts, row) => {
        // counting flights, and flights to each destination
        const destination = row.getString("DESTINATION_AIRPORT")
        if( destination in counts ) {
          counts[destination] += 1
          if( counts[destination] > maxFlightCount ) {
            maxFlightCount = counts[destination]
          }
        } else {
          counts[destination] = 0
        }
        counts.all++
        return counts
      },{all:0})

      return {
        iata: row.getString("IATA_CODE"),
        airportString: row.getString("AIRPORT"),
        lat: float(row.get("LATITUDE")),
        lng: float(row.get("LONGITUDE")),
        outboundFlightCounts,
      }})
    .sort( (a,b) => b.outboundFlightCounts.all - a.outboundFlightCounts.all )
    .reduce( (obj, current, i, arr) => {
      current.square = {
        x: mapLng(current.lng),
        y: mapLat(current.lat),
        s: map( current.outboundFlightCounts.all,0,arr[0].outboundFlightCounts.all,10,50 )
      }
      obj[current.iata] = current
      return obj
    }, {})
  airports = Object.fromEntries(Object.entries(allAirports).slice( 0,20 ))
}

function mapLat(lat) {
  return map(lat,boundaryMapping.north,boundaryMapping.south,0,height)
}

function mapLng(lng) {
  return map(lng,boundaryMapping.west,boundaryMapping.east,0,width)
}

// function keyPressed() {
//   if( key === "s" ) {
//     saveJSON(allAirports,"airportsAndFlightMappings.1.json")        
//   }
// }
