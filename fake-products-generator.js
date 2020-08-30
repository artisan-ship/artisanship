const fs = require('fs')
const FPG = require('fake-product-generator')
const rs = FPG(100) // creates a million products!
const ws = fs.createWriteStream('./data.json')
rs.pipe(ws)