let top20

function setup() {
  table = loadTable("population_total.csv","csv","header", processTable)
  createCanvas(windowWidth-20, windowHeight-20)
  noLoop()
  noStroke()
}

function draw() {
  background('white')
  if( top20 ) {
    fill('black')
    text( `Population Change from 1955–2020 for the 20 most populous countries`, 10, 15)
    fill('red')
    text( top20.selectedCountry, 10, 30)
    push()
    translate(0,height)
    scale(1,-1)
    let i = 0
    for( const row of top20.data ) {
      showCountry(row.getString("country"), top20.maxPop, color(map(i, 0, 20, 240, 48)))
      i++
    }
    
    showCountry(top20.selectedCountry, top20.maxPop, color(256,0,0,96))
    pop()
  }
}

function showCountry(country,maxPop,fillColor) {
  const rowsToDraw = table.findRows( country, "country" )
  rowsToDraw.sort( (a,b) => a.getNum("year") - b.getNum("year") )
  const dx = width / (rowsToDraw.length - 1)
  fill(fillColor)
  beginShape()
  vertex(0,0)
  for( let i = 0; i < rowsToDraw.length; i++ ) {
    vertex( i * dx, map( rowsToDraw[i].getNum("population"), 0, maxPop, 0, height-20 ) )    
  }
  vertex(width,0)
  endShape()
}

function processTable(data) {
  top20 = {
    data: [...data
    .findRows("2020","year")
    .sort( (a,b) => b.getNum("population") - a.getNum("population") )]
    .filter( (r,i) => i < 20 ),
  }
  
  top20.maxPop = max(top20.data.map( row => row.getNum("population")))
  top20.selectedCountry = random(top20.data).getString("country")
  
  redraw()
}

function keyPressed() {
  top20.selectedCountry = random(top20.data).getString("country")
  redraw()
}