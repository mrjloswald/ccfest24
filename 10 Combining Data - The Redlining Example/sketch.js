let hpiData
let holcData
let data
let mapData
const S = 20
let colors = {}
let colorization = {
  holc: holcColor,
  hpi: hpiColor,
}
let hpiDescriptives = {}

currentColorMode = "hpi"

function preload() {
  holcData = loadJSON("https://raw.githubusercontent.com/mrjloswald/ccfest24/main/housing/HOLC_2020_census_tracts.json")
  hpiData = loadTable("https://raw.githubusercontent.com/mrjloswald/ccfest24/main/housing/HPI_AT_BDL_tract_2020.csv","csv","header")
  mapData = loadJSON("./map2.json")
}

function setup() {
  createCanvas(30 * S, 17 * S)
  processData()
  noLoop()
  textAlign(CENTER,CENTER)
  colors.A = color("#76a865")
  colors.B = color('#7bb1b9')
  colors.C = color('#fcfc04')
  colors.D = color('#d7848b')  
}

function stateShape(state) {
  let s = [2*S,2*S]
  if( state.t === 9 ) {
    s = [3*S,3*S]
  } else if( state.t === 6 ) {
    s = [3*S, 2*S]
  } else if( state.t === 7 ) {
    s = [2*S,3*S]
  } else if( state.t === 3 ) {
    s = [S, 2*S]
  } else if( state.t === 2 ) {
    s = [2*S, S]
  }  
  return s
}

function draw() {
  background(220);
  // k is the state abbreviation
  // v is the drawing information
  for( const [k,v] of Object.entries(mapData) ) {
    s = stateShape(v)
    // const fillColor = hpiColor(k) 
    const fillColor = colorization[currentColorMode](k)
    fill(fillColor)    
    rect(v.c * S, v.r * S, ...s)
    fill('black')
    text(k, v.c * S + s[0]/2, v.r * S + s[1]/2 )
  }
}

function keyPressed() {
  currentColorMode = currentColorMode === "hpi" ? "holc" : "hpi"
  redraw()
}


// returns a color that is mapped from high hpi values (green) to low (red)
// in the original example, this was a straight mapping from green to red,
// in the current version, we actually map directly to one of the colors
function hpiColor(state) {
  const i = round(map( data[state].hpi.avg, hpiDescriptives.min, hpiDescriptives.max, 3, 0))
  return [colors.A,colors.B,colors.C,colors.D,colors.D][i]
  // return lerpColor(colors.D, colors.A, c)                   
}

// returns the holc color for the most commonly occuring rating in that state. 
// white means that there are no ratings
function holcColor(state) {    
  let largest 

  if( state in data ) {
    const counts = data[state]
    if( counts.A ) {
      largest = {v: counts.A, k: "A"}
      for( const [k,v] of Object.entries (counts) ) {
        if( v > largest.v ) {
          largest.v = v
          largest.k = k
        }
      }            
    }
  }    

  if( largest ) {
    return colors[largest.k]
  } else {
    return 'white'
  }  
}

function processData() {
  data = {}
  for( const [k,v] of Object.entries(holcData) ) {
    const r = hpiData.findRow(v.geoid20,"tract")
    if( r ) {
      const state = r.get("state_abbr")
      if( data[state] ) {
        data[state][v.class1]++
      } else {
        data[state] = {A:0,B:0,C:0,D:0}
      }      
    }     
  }
  
  for( const row of hpiData.getRows() ) {
    const hpi_empty_test = row.get("hpi")
    if( hpi_empty_test !== "" ) {
      const hpi = row.getNum("hpi")
      const state = row.get("state_abbr")
      if( !data[state] ) {
        data[state] = {}
      }
      if( data[state].hpi ) {
        data[state].hpi.sum += hpi
        data[state].hpi.count++
      } else {
        data[state].hpi = {sum: 0, count: 0, avg: 0}
      }
    }
  }
  
  const descriptives = {min: Infinity, max: -Infinity}
  for( const state of Object.values(data) ) {
    state.hpi.avg = state.hpi.sum/state.hpi.count
    descriptives.min = min(state.hpi.avg, descriptives.min)
    descriptives.max = max(state.hpi.avg, descriptives.max)
  }
  hpiDescriptives = descriptives
}
