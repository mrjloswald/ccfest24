let table

function preload() {
  table = loadTable("population_total.csv","csv","header")
}

function setup() {
  createCanvas(windowWidth-20, windowHeight-20)
  noLoop()
}

function draw() {
  background(220)
  const rowsToDraw = table.findRows( "Kenya", "country" )
  rowsToDraw.sort( (a,b) => a.getNum("year") - b.getNum("year") )
  const dx = width / (rowsToDraw.length + 1) 
  const populationValues = rowsToDraw.map( r => r.getNum("population"))
  const minPop = min(populationValues)
  const maxPop = max(populationValues)
  let pp
  fill('orange')
  for( let i = 0; i < rowsToDraw.length; i++ ) {
    const p = {
      x: (i+1) * dx, 
      y: map( rowsToDraw[i].getNum("population"), minPop, maxPop, height-20, 20 ) 
    }

    circle( p.x, p.y, 10 )
    
    if( pp ) {
      line(pp.x, pp.y, p.x, p.y )
    }
    pp = p    
    
  }
  
}