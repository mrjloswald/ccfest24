// https://sashamaps.net/docs/resources/20-colors/
const colorList = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

let airports
let flights
let currentFlightIndex
let showAirports = true

let boundaryMapping = {
  west: -125,
  east: -65,
  south: 24,
  north: 50
}

const aspectRatio = {
  width: 60,
  height: 26  
}

function preload() {
  // airports = loadTable("airports.csv","csv","header")
  airports = loadJSON("airports.json")
  flights = loadTable("https://raw.githubusercontent.com/mrjloswald/ccfest24/main/flights/flights.csv", "csv", "header")
}

function filterFlights() {
  let rowsToRemove = []
  for( let i = 0; i < flights.getRowCount(); i++ ) {
    const row = flights.getRow(i)
    if( !row.get("ORIGIN_AIRPORT") in airports || !row.get("DESTINATION_AIRPORT") in airports ) {
      rowsToRemove.push(i)
    }
  }
  rowsToRemove.forEach(i => flights.removeRow(i) )
  // saveTable(flights, "filteredFlights.csv")
}

function calculateWindow() {
  const r = aspectRatio.width/aspectRatio.height
  // console.log( r )
  // if( windowWidth > windowHeight ) {
    return [windowWidth, windowWidth/r]  
  // } else {
  //   return [windowWidth, windowWidth/r]
  // }
}

function setup() {
  filterFlights()
  // buildBoundaryMapping()
  createCanvas(1200,520)
  // createCanvas(...calculateWindow());
  
  // airports = airports.getRows()
  //   .map( row => [
  //     row.getString("IATA_CODE"),
  //     float(row.get("LATITUDE")), 
  //     float(row.get("LONGITUDE"))
  //   ])
  //   .reduce( (all, cur) => {
  //     all[cur[0]] = {
  //       lat: cur[1],
  //       lng: cur[2],
  //       x:mapLng(cur[2]),
  //       y:mapLat(cur[1])
  //     }
  //     return all
  //   }, {})
  
//   airports = Object
//   .fromEntries( 
//     Object
//     .entries(airports)
//     .filter(([k,v]) => v.x > 0 && v.y > 0 && v.x < width && v.y < height )
//   )
    airports = Object
      .fromEntries(
        Object
        .entries(airports)
        .map( ([k,v]) => {
          v.x = mapLng(v.lng)
          v.y = mapLat(v.lat)
          return [k,v]
        })
      )  
//   saveJSON(airports, 'airports.json')
  currentFlightIndex = int(random(flights.getRowCount()))
  // noLoop()
}

function draw() {
  background(0,8);
  if( showAirports ) {
    noStroke()
    fill("#fabebe")

    for( const airport of Object.values(airports) ) {
      circle(
        airport.x,
        airport.y,
        3
      )
    }    
  }

  const offset = int(random(flights.getRowCount()-1001))
  // for( const flight of flights.getRows() ) {
  for( let i = 0; i < 1000; i++ ) {  
    const flight = flights.getRow(i + offset)
  
    // const flight = flights.getRow(currentFlightIndex)
    // const arrivalDelay = flight.getNum("ARRIVAL_DELAY")
    let strokeColor = "#ffffff08"
    // if( arrivalDelay > 0 ) {
    //   strokeColor = '#e6194b08'
    // } else if( arrivalDelay < 0 ) {
    //   strokeColor = '#46f0f008' 
    // }
    drawFlight( flight, strokeColor )  
  }  
}

function drawFlight(flight,c) {
  const org = airports[flight.getString("ORIGIN_AIRPORT")]
  const des = airports[flight.getString("DESTINATION_AIRPORT")]
  if( org && des ) {
    const v = p5.Vector.sub(createVector( org.x, org.y), createVector(des.x, des.y))
    const d = dist( org.x, org.y, des.x, des.y )
    const dh = d/2
    const mp = {x:(org.x+des.x)/2, y:(org.y+des.y)/2 }
    // console.log( d, dh, mp )
    push()  
    translate(mp.x, mp.y)
    // fill(c)
    // circle(0,0,3)
    rotate(v.heading())
    stroke(c)
    noFill()
    const t = flight.getNum("ELAPSED_TIME")
    curve(-dh-t, t, -dh, 0, dh, 0, dh+t, t )
    pop()    
  }

}

function buildBoundaryMapping() {
  const lngs = data.getColumn("LONGITUDE").map( float )
  const lats = data.getColumn("LATITUDE").map( float )
  boundaryMapping = {
    north: max(lats),
    south: min(lats),
    east: min(lngs),
    west: max(lngs)
  }
}

function mapLat(lat) {
  return map(lat,boundaryMapping.north,boundaryMapping.south,0,height)
}

function mapLng(lng) {
  return map(lng,boundaryMapping.west,boundaryMapping.east,0,width)
}

function keyPressed() {
  if( key === "a" ) { showAirports = !showAirports }
  if( keyCode === UP_ARROW ) { currentFlightIndex++ }
  if( keyCode === DOWN_ARROW ) { currentFlightIndex-- }
  currentFlightIndex %= flights.getRowCount()
  // redraw()
}