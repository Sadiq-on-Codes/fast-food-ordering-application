const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

// Create canvas
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

// Draw background
ctx.fillStyle = '#ff6b6b'
ctx.fillRect(0, 0, 200, 200)

// Draw pork chop shape
ctx.beginPath()
ctx.fillStyle = '#fff'
ctx.moveTo(50, 100)
ctx.bezierCurveTo(50, 50, 150, 50, 150, 100)
ctx.bezierCurveTo(150, 150, 50, 150, 50, 100)
ctx.fill()

// Add text
ctx.fillStyle = '#2d3436'
ctx.font = 'bold 24px Arial'
ctx.textAlign = 'center'
ctx.fillText('PC', 100, 110)

// Save the logo
const buffer = canvas.toBuffer('image/png')
fs.writeFileSync(
  path.join(__dirname, '../src/assets/logo.png'),
  buffer
)