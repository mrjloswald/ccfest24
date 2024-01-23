// https://sashamaps.net/docs/resources/20-colors/
const colorList = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

let top20

function setup() {
  table = loadTable("population_total.csv","csv","header", processTable)
  createCanvas(windowWidth-20, windowHeight-20)
  noLoop()
  noStroke()
}

function draw() {
  background(220)
  if( top20 ) {
    text( `Population Change from 1955–2020 for the 20 most populous countries`, 10, 15)
    push()
    translate(0,height)
    scale(1,-1)
    let i = 0
    for( const row of top20.data ) {
      showCurrentCountry(row.getString("country"), top20.maxPop, colorList[i])
      i++
    }
    pop()
  }
}

function showCurrentCountry(country,maxPop,fillColor) {
  const rowsToDraw = table.findRows( country, "country" )
  rowsToDraw.sort( (a,b) => a.getNum("year") - b.getNum("year") )
  const dx = width / (rowsToDraw.length - 1)
  fill(fillColor)
  beginShape()
  vertex(0,20)
  for( let i = 0; i < rowsToDraw.length; i++ ) {
    vertex( i * dx, map( rowsToDraw[i].getNum("population"), 0, maxPop, 20, height-20 ) )    
  }
  vertex(width,20)
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
  
  redraw()
}