let data = [{title: "Item 1", count: 0}, {title: "Item 2", count: 2}, {title: "Item 3", count: 5}, {title: "Item 4", count: 7}]


function renderPanel() {
  console.info("HEEEEEEEEEE>>>>>>>>>>>>>>>>>>>>>>>>>>")
  let canvas = document.getElementById("countLayer")
  let height = Math.ceil(data.length / 2) * 300

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
  }


}

//window.onload = renderPanel
renderPanel()
