function getWarehouses (warehouses) {
  var submenus = []
  for(let i in warehouses) {
    let wh = warehouses[i]
    var submenu = {
      "name": wh.warehouse_name,
      "router": {
        "name": "StockControl",
        "query": {
          "wh_id": wh.warehouse_id
        }
      },
      "activeClass": ''
    }
    submenus.push(submenu)
  }
  return submenus
}

export default {
  getWarehouses
}
