let table
let currentCountryIndex
let countryList 

function setup() {
  table = loadTable("population_total.csv","csv","header", processTable)
  createCanvas(windowWidth-20, windowHeight-20)
  noLoop()
}

function draw() {
  background(220)
  if( currentCountryIndex ) {
    showCurrentCountry()  
  }
}

function showCurrentCountry() {
  const rowsToDraw = table.findRows( countryList[currentCountryIndex], "country" )
  rowsToDraw.sort( (a,b) => a.getNum("year") - b.getNum("year") )
  const dx = width / (rowsToDraw.length -1)
  const populationValues = rowsToDraw.map( r => r.getNum("population"))
  const minPop = min(populationValues)
  const maxPop = max(populationValues)
  let pp
  fill('orange')
  beginShape()
  vertex(0,height-20)
  for( let i = 0; i < rowsToDraw.length; i++ ) {
    vertex( i * dx, map( rowsToDraw[i].getNum("population"), 0, maxPop, height-20, 20 ) )    
  }
  vertex(width,height-20)
  endShape()
}

function processTable(data) {
  table = data
  const countries = new Set( table.getColumn("country" ) )
  countryList = [...[...countries.values()].sort()]
  currentCountryIndex = int(random(countryList.length))
  redraw()
}

function keyPressed() {
  if( keyCode === LEFT_ARROW ) {
    currentCountryIndex--
    if( currentCountryIndex < 0 ) {
      currentCountryIndex = countryList.length - 1
    }
    
  }
  if( keyCode === RIGHT_ARROW ) {
    currentCountryIndex++ 
    currentCountryIndex %= countryList.length 
  }
  redraw()  
}