let tractData
let hpiData
let holcData
let data
let mapData
const S = 20
let colors = {}
let hpiDescriptives

// hand determined, but maybe could be calculated
let boundaries = {
  lng: {min:-75.426,max:-74.902},
  lat: {min:39.828,max:40.188}
}

function preload() {
  holcData = loadJSON("https://raw.githubusercontent.com/mrjloswald/ccfest24/main/housing/HOLC_2020_census_tracts.json")
  hpiData = loadTable("https://raw.githubusercontent.com/mrjloswald/ccfest24/main/housing/HPI_AT_BDL_tract_2020.csv","csv","header")
}

function loadTractData() {
  const descriptives = {min: Infinity, max: -Infinity}
  let hpiSum = 0
  let hpiCount = 0
  let hpis = []
  loadJSON("PATracts.json", (json) => {
    tractData = json.features.reduce( (data, feature) => {
      e = Object.values(holcData).find( e => e.geoid20 === feature.properties.GEOID )
      if( e ) {
        f = hpiData.findRow(feature.properties.GEOID, "tract")
        if( f ) {
          const not_empty_test = f.get("hpi")
          if( not_empty_test ) {
            const hpi = f.getNum("hpi")
            hpis.push( hpi )
            data[feature.properties.GEOID] = {
              rating: e.class1, 
              hpi, 
              coordinates: feature.geometry.coordinates[0].map( c => {
                return {lng:c[0],lat:c[1]}              
              })
            }            
          }
        }
      }
      return data
    }, {})
    hpis.sort()
    descriptives.hpis = hpis
    descriptives.min = hpis[0]
    descriptives.max = hpis[hpis.length-1]
    descriptives.average = hpis.reduce( (sum,h) => sum += h, 0 )/hpis.length
    hpiDescriptives = descriptives
    redraw()
  })
}

function setup() {
  createCanvas(524,720)
  background(128)
  loadTractData()
  noLoop()
  colors.A = color("#76a865")
  colors.B = color('#7bb1b9')
  colors.C = color('#fcfc04')
  colors.D = color('#d7848b')  
}

function draw() {
  if( tractData ) {
    for( let tract of Object.values(tractData) ) { 
      drawTract(tract)
      fill('black')
      text( "Original HOLC mapping for Philadelphia neighborhoods", 10, 15 )
      drawTract(tract,"hpi","bottom")
      fill('black')
      text( "Current HPI values by quadrants", 10, height/2 + 15 )
    }
  }
}

function drawTract(tract,mode="holc",position="top") {
  const hpiColor = (hpi) => {
    const hpis = hpiDescriptives.hpis
    const q1 = hpis[int(hpis.length/4)]
    const q2 = hpis[int(hpis.length/2)]
    const q3 = hpis[int(3*hpis.length/4)] 
    if( hpi < q1 ) {
      return "D"
    } else if( hpi < q2 ) {
      return "C"
    } else if( hpi < q3 ) {
      return "B"
    } else {
      return "A"
    }
  }

  
  fillColor = mode === "holc" ? colors[tract.rating] : colors[hpiColor(tract.hpi)]
  fill(fillColor)
  beginShape()
  for( let p of tract.coordinates ) {
    vertex( 
      map(p.lng,boundaries.lng.min, boundaries.lng.max,0,width),
      map(p.lat,boundaries.lat.min, boundaries.lat.max,...(position === "top" ? [height/2,0] : [height,height/2]))
    )
  }
  endShape()  
}
