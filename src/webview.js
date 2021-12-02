//let data = [{title: "Item 1", count: 0}, {title: "Item 2", count: 2}, {title: "Item 3", count: 5}, {title: "Item 4", count: 7}]
let data = undefined
const STROKE_HEIGHT = 50
const STROKE_SPACING = 10
const STROKE_SET_WIDTH = 50
let canvas = undefined

function drawFiveStroke(ctx, strokeCount, x, y) {
  ctx.beginPath()
  ctx.lineWidth = 3
  let x_offset = x
  for(let i = 0; i < strokeCount && i < 4; ++i) {
    ctx.moveTo(x_offset, y)
    ctx.lineTo(x_offset + 5, y - STROKE_HEIGHT)
    x_offset += STROKE_SPACING
  }

  if (strokeCount === 5) {
    ctx.moveTo(x - 5, y - 10)
    ctx.lineTo(x_offset + 5, y - STROKE_HEIGHT + 10)
  }
  ctx.stroke()
}

function renderStrokeInArea(ctx, strokeCount, x, y, width, height) {
  let x_offset = x + 5, y_offset = y + STROKE_HEIGHT + 5
  let used_width = STROKE_SET_WIDTH;
  for (let i = 0; i < Math.floor(strokeCount / 5); ++i) {
    drawFiveStroke(ctx, 5, x_offset, y_offset)
    used_width += STROKE_SET_WIDTH + 10

    x_offset += STROKE_SET_WIDTH + 10

    if (used_width > width) {
      x_offset = x + 5
      y_offset += STROKE_HEIGHT + 5
      used_width = STROKE_SET_WIDTH
    }
  }

  drawFiveStroke(ctx, strokeCount % 5, x_offset, y_offset)
}

function getData() {
  let dataField = document.getElementById("dataContent")

  if(dataField) {
    data = JSON.parse(dataField.textContent)
    renderPanel()
  } else {
    setTimeout(getData, 1000)
  }
}

function increment(event) {
  let x = event.clientX
  let y = event.clientY

  let selectedItem = getItemFromCoordinates(x, y)
  selectedItem.count++
  webviewApi.postMessage({
    name: 'clickedTable',
    data: selectedItem
  });

  canvas.removeEventListener('click', increment)
  canvas.removeEventListener('contextmenu', decrement)
  setTimeout(getData, 500)
}

function decrement(event) {
  let x = event.clientX
  let y = event.clientY

  if(selectedItem.count > 0) {
    selectedItem.count--
  }
  let selectedItem = getItemFromCoordinates(x, y)
  webviewApi.postMessage({
    name: 'clickedTableSub',
    data: selectedItem
  });

  canvas.removeEventListener('click', increment)
  canvas.removeEventListener('contextmenu', decrement)
  setTimeout(getData, 500)
}

function renderPanel() {
  console.info("HEEEEEEEEEE>>>>>>>>>>>>>>>>>>>>>>>>>>")
  if(!data) {
    getData()
    return
  }

  canvas = document.getElementById("countLayer")
  let height = Math.ceil(data.length / 2) * 300

  canvas.addEventListener('click', increment)
  canvas.addEventListener('contextmenu', decrement)

  canvas.width = document.width > 600 ? document.width : 600
  canvas.height = height
  canvas.style.position = "absolute"
  canvas.style.border = "1 px solid"

  let cell_width = canvas.width / 2

  let ctx = canvas.getContext("2d")

  ctx.beginPath()
  ctx.moveTo(cell_width - 2, 0)
  ctx.lineTo(cell_width - 2, height)
  ctx.stroke()

  if (data.length % 2 !== 0) {
    data.push({title: "" , count: 0})
  }

  ctx.font = '48px serif'
  for (let i = 0; i < data.length; i += 2) {
    let y_offset_text =  50 + Math.floor(i / 2) * 300
    ctx.fillText(data[i].title, 0, y_offset_text)
    ctx.fillText(data[i + 1].title, cell_width, y_offset_text)

    ctx.beginPath()
    ctx.moveTo(0, y_offset_text + 2)
    ctx.lineTo(canvas.width, y_offset_text + 2)
    ctx.stroke()

    renderStrokeInArea(ctx, data[i].count, 0, y_offset_text, cell_width, 250)
    renderStrokeInArea(ctx, data[i + 1].count, cell_width, y_offset_text, cell_width, 250)
  }
}

function getItemFromCoordinates(x, y) {
  let line = Math.floor(y / 300)
  let column = Math.floor(x / (canvas.width / 2))

  return data[line * 2 + column]
}



renderPanel()
