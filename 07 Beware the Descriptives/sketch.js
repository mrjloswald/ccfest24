// https://sashamaps.net/docs/resources/20-colors/
const colorList = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

let data
let fc
let bg

function setup() {
  createCanvas(400, 400);
  loadTable("data.csv","csv","header",processFile)
  noLoop()
  noStroke()
  setColors()
}

function setColors() {
  fc = random(colorList)
  bg = color(255-red(fc), 255-green(fc), 255-blue(fc))  
}

function draw() {
  if( data ) {
    fill(fc)
    background(bg)
    push()
    translate(0,height)
    scale(4,-4)    
    showCategory(data.currentCategory)
    pop()
    displayStats(data.currentCategory)
  }
}

function showCategory(category) {
  const points = data[category]
  for( const p of points ) {
    circle(p.x, p.y, 3)
  }
}

function displayStats(category) {
  const points = data[category]
  const xs = points.map( x => x.x )
  const ys = points.map( x => x.y )
  const x_bar = mean( xs )
  const y_bar = mean( ys )
  const x_stddev = stddev(xs, x_bar)
  const y_stddev = stddev(ys, y_bar)
  const r = pcc(xs, ys, x_bar, y_bar )
  text( `x̄: ${round(x_bar,2)}`, 10, 15 )
  text( `ȳ: ${round(y_bar,2)}`, 10, 30 )
  text( `x σ: ${round(x_stddev,2)}`, 10, 45 )
  text( `y σ: ${round(y_stddev,2)}`, 10, 60 )
  text( `r: ${round(r,2)}`, 10, 75 )
  
}

function mean(values) {
  return values.reduce( (sum, x) => sum + x, 0 ) / values.length
}

function stddev(values, mean) {
  return Math.sqrt(sumOfDistanceFromMeanSquared(values,mean)/(values.length-1))
}

function sumOfDistanceFromMeanSquared(values,mean) {
  return values.reduce( (sum,x) => sum + (x-mean)*(x-mean), 0 )
}

function pcc(xs, ys, x_bar, y_bar ) {
  return xs.reduce( (sum, x,i) => sum + (x - x_bar) * (ys[i]-y_bar) ) / Math.sqrt(sumOfDistanceFromMeanSquared(xs,x_bar)*sumOfDistanceFromMeanSquared(ys,y_bar))
}

function processFile(table) {
  data = {}
  data.categories = ["all", ...new Set( table.getColumn("s") )]
  data.currentCategory = "all"
  for( const category of data.categories ) {
    data[category] = table.findRows(category,"s").map( row => {
      return {x: row.getNum("x"), y: row.getNum("y")}
    })
    data.all = [...data.all, ...data[category]]
  }
  redraw()
}

function keyPressed() {
  const i = data.categories.indexOf(data.currentCategory)
  if( keyCode === RIGHT_ARROW ) {
    if( i < data.categories.length - 1 ) {
      data.currentCategory = data.categories[i+1]
    } else {
      data.currentCategory = data.categories[0]
    }
    redraw()
  }
  
  if( keyCode == LEFT_ARROW ) {
    if( i > 0 ) {
      data.currentCategory = data.categories[i-1]
    } else {
      data.currentCategory = data.categories[data.categories.length-1]
    }
    redraw()
  }
  
  if( key === 'c' ) {
    setColors()
    redraw()
  }
}