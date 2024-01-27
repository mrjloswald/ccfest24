let top20
let selectedCountryIndex
let maxPop

function setup() {
  table = loadTable("population_total.csv","csv","header", processTable)
  createCanvas(windowWidth-20, windowHeight-20)
  noLoop()
  noStroke()
  rectMode(CENTER)
  textAlign(CENTER, CENTER)  
}

function draw() {
  background('white')
  if( top20 ) {
    fill('black')
    text( `Population Change from 1955–2020 for the 20 most populous countries`, width/2, 15)
    push()
    translate(0,height)
    scale(1,-1)
    for( let i = 0; i < 20; i++ ) {
      showCountry(i, maxPop, color(map(i, 0, 20, 240, 48)))
    }
    showCountry(selectedCountryIndex, maxPop, color("#e6194B"), true)
    pop()
  }
}

function showCountry(countryIndex,maxPop,fillColor,withText=false) {  
  const country = top20.countries[countryIndex]
  const α = 96
  
  const dx = width / (country.rows.length - 1)
  
  fill(red(fillColor), blue(fillColor), green(fillColor), α)
  beginShape()
  vertex(0,0)
  for( let i = 0; i < country.rows.length; i++ ) {
    vertex( i * dx, map( country.rows[i].getNum("population"), 0, maxPop, 0, height-20 ) )    
  }
  vertex(width,0)
  endShape()
  if( withText ) {
    push()
    translate(country.rows.length/2 * dx, map( country.rows[country.rows.length/2].getNum("population"), 0, maxPop, 0, height-20 ))
    scale(1,-1)
    fill('#a9a9a9')
    rect( 0, 0, textWidth(country.name)+5, 20)
    fill(fillColor)
    text( country.name, 0, 0 )  
    pop()
  }
}

function processTable(data) {
  const rows2020 = [...data
    .findRows("2020","year")
    .sort( (a,b) => b.getNum("population") - a.getNum("population") )]
    .slice(0,20)
    .map( row => { return {country:row.getString("country"), population:row.getNum("population")}})
  
  top20 = {countries: []}  
  maxPop = rows2020[0].population 

  for( const country of rows2020.map(r=>r.country) ) {
    rows = data.findRows( country, "country" )
    rows.sort( (a,b) => a.getNum("year") - b.getNum("year") )
    top20.countries.push( {name:country, rows} )
  }
  
  selectedCountryIndex = int(random(20))
  redraw()
}

function keyPressed() {
  if( keyCode === UP_ARROW ) {
    selectedCountryIndex = ((selectedCountryIndex - 1) + 20) % 20     
  }
  if( keyCode === DOWN_ARROW ) {
    selectedCountryIndex = ((selectedCountryIndex + 1) + 20) % 20     
  }
  redraw()
}