// https://sashamaps.net/docs/resources/20-colors/
const colorList = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

const data = [36,25,14,13,10,8,7,5,2]

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop()
}

function draw() {
  background('white')
  noStroke()
  fill('#bcf60c')
  rect(0,height-70,width,70)
  flower(width/2,height-20,300,70,colorList[2],data[0])
  flower(width/4,height-60,250,50,colorList[3],data[1])
  flower(3*width/4,height-40,280,50,colorList[4],data[2])
  flower(width/8,height-50,150,30,colorList[5],data[3])
  flower(5*width/8,height-20,130,30,colorList[6],data[4])
  flower(3*width/8,height-30,140,30,colorList[7],data[5])
  flower(7*width/8,height-20,100,30,colorList[8],data[6])
  flower(5*width/16,height-20,60,15,colorList[9],data[7])
  flower(9*width/16,height-30,70,15,colorList[10],data[8])
  
  
  
}

function flower( x, y, h, r, c, n) {
  stroke('#3cb44b')
  strokeWeight(map(n,2,36,2,3))
  line(x,y,x,y-h)
  strokeWeight(1)
  noStroke()
  fill(c)
  push()
  translate(x,y-h)
  const dr = (3 * PI/2)/(n-1)
  rotate(3*PI/4)
  for( let i = 1; i <= n; i++) {             
    hdline(0,0,r,0)       
    rotate(dr)
  }
  pop()
}

function hdline(x1,y1,x2,y2) {
  let t = random(10000)
  for( let x = x1; x <= x2; x++ ) {
    const y = map( noise(t), 0, 1, -1, 1)
    t += 0.1
    circle(x, y, 2)
  }
}