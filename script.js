let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")
let projSpd = 5
let allproj=[]
let enemies=[]
let enemySpd = 3
var score = 0
var highscore = getStorage("HighScore")
document.getElementById("highScore").innerHTML=highscore
function getStorage(name) {
	 const value = localStorage.getItem(name);
	 if (value === null) {
	   return 0
	 } else {
	   return Number(value)
	 }
   }
canvas.width = window.innerWidth
canvas.height = window.innerHeight


class Player {
	 constructor(x, y, rad, col) {
		  this.x=x
		  this.y=y
		  this.rad=rad
		  this.col=col
	 }
	 draw() {
		  ctx.beginPath()
		  ctx.arc(this.x, this.y, this.rad, 0, Math.PI*2)
		  ctx.fillStyle = this.col
		  ctx.fill()
	 }
}
let player = new Player(canvas.width/2, canvas.height/2, 30, "white")
class Projectile {
	 constructor(x, y, rad, velocity, col) {
		  this.x = x
		  this.y = y
		  this.rad = rad
		  this.velocity = velocity
		  this.col = col
	 }
	 draw() {
		  ctx.beginPath()
		  ctx.arc(this.x, this.y, this.rad, 0, Math.PI*2)
		  ctx.fillStyle = this.col
		  ctx.fill()
	 }
	 move() {
		  this.draw()
		  this.x+=this.velocity.x
		  this.y+=this.velocity.y
	 }
}
class Enemy {
	 constructor(x, y, rad, col, velocity, stage) {
		  this.x=x
		  this.y=y
		  this.rad=rad
		  this.col=col
		  this.velocity=velocity
            this.stage=stage
	 }
	 draw() {
		  ctx.beginPath()
		  ctx.arc(this.x, this.y, this.rad, 0, Math.PI*2)
		  ctx.fillStyle = this.col
		  ctx.fill()
	 }
	 move() {
		  this.draw()
		  this.x+=this.velocity.x
		  this.y+=this.velocity.y
	 }
}
function animate() {
	 let frameID=window.requestAnimationFrame(animate)
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
	 player.draw()
	 for (m = 0; m < allproj.length; m++) {
		  allproj[m].move()
		  let proj=allproj[m]
		  for (i = 0; i < enemies.length; i++) {
			   if (Math.hypot((enemies[i].x-proj.x),(enemies[i].y-proj.y))-enemies[i].rad-proj.rad<=0) {
                         let enemy=enemies[i]
                         if (enemy.stage==1) {
                              enemies.splice(i,1)
                              console.log(enemy.stage,"die")
                         }
                         else {
                              enemy.stage-=1
                              console.log(stage)
                              enemy.rad-=10
                         }
					allproj.splice(m,1)
					score+=1
					document.getElementById("score").innerHTML=score
					if (score>highscore) {
						 highscore=score
						 localStorage.setItem("HighScore",highscore)
						 document.getElementById("highScore").innerHTML=highscore
					}
			   }
		  }
		  if (proj.x>canvas.width || proj.x<0 || proj.y>canvas.height || proj.y<0) {
			   allproj.splice(m,1)
		  }
	 }
	 for (i = 0; i < enemies.length; i++) {
		  enemies[i].move()
		  if (Math.hypot((enemies[i].x-canvas.width/2),(enemies[i].y-canvas.height/2))-enemies[i].rad-player.rad<=0) {
			   window.cancelAnimationFrame(frameID)
			   score = 0
		  }
	 }
}
function shoot(event) {
	 let angle = Math.atan2(
		  event.y-canvas.height/2,
		  event.x-canvas.width/2
	 )
	 let velocity = {
		  x : projSpd*Math.cos(angle),
		  y : projSpd*Math.sin(angle)
	 }
	 let proj = new Projectile(canvas.width/2, canvas.height/2, 5, velocity, "white")
	 allproj.push(proj)
}
function create() {
	 if (Math.random() <= 0.5) {
		  if (Math.random() <= 0.5) {
			   var x = 0
		  }
		  else {
			   var x = canvas.width
		  }
		  var y = Math.random()*canvas.height
	 }
	 else {
		  if (Math.random() <= 0.5) {
			   var y = 0
		  }
		  else {
			   var y = canvas.height
		  }
		  var x = Math.random()*canvas.width
	 }
	 let rad = Math.ceil(Math.random()*30)
	 rad=40-rad
	 let angle = Math.atan2(
		  canvas.height/2-y,
		  canvas.width/2-x
	 )
	 let velocity = {
		  x : enemySpd*Math.cos(angle),
		  y : enemySpd*Math.sin(angle)
	 }
	 let r = Math.floor(Math.random()*250)
	 let g = Math.floor(Math.random()*250)
	 let b = Math.floor(Math.random()*250)
	 col=`rgb(${r}, ${g}, ${b})`
      if (rad>25) {
          stage = 3
      }
      else if (25>=rad && rad>20) {
          stage = 2
      }
      else {
          stage = 1
      }
	 let enemy = new Enemy(x, y, rad, col, velocity, stage)
	 enemies.push(enemy)
}
window.addEventListener("click" ,shoot)
setInterval(create, 1000)
animate()