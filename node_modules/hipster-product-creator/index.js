const request = require('request')
const uuidv4 = require('uuid/v4')
const fs = require('fs')

const FILENAME = 'products.json'

// *******************************************
// PRODUCT OPTIONS
// Edit these to customize your own products.
let styles = ["modern", "transitional", "traditional", "retro", "classical"]
let types  = ["jeans", "T-shirt", "chair", "table", "wall art", "coffee", "beer", "accessory"]
let sizes  = [ "xs", "small", "medium", "large", "xl"]
// let ages = ["Under 2", "2-4", "4-6", "6-8", "8 and Up"]
// let productOptions = ["option1", "option2", "option3"] // et cetera
// *******************************************

// createProducts(10)

function createProducts(n, outputFileName = FILENAME) {
  const writeStream = fs.createWriteStream(outputFileName)
  writeStream.on('open', function (fd) {
    writeStream.write('{ \n "products": \t[\n')
    createRandomProducts(n, writeStream)
  })
}

function createRandomProducts(n, writeStream) {
  request('http://hipsterjesus.com/api', (err, body, res) => {
    if(err) {
      console.log('error:', err)
      return
    }
    else {
      let jsonRes = {}
      jsonRes = JSON.parse(body.body)
      const text = jsonRes.text
      const textArray = text.split(' ')

      for(let i=0; i < n; i++) {
        writeProduct(textArray, writeStream)
        writeStream.write(',\n')
        // all but last product need a comma & a newline in the JSON file
      }

      writeProduct(textArray, writeStream)
      writeStream.write('\n\t]\n}')
      // after last product, no comma but close array and object in JSON
    }
  })
}

function randomString(data, length) {
  let answer = ""

  for(let i=0; i < length-1; i++) {
    let index = Math.floor(Math.random() * data.length)
    answer += data[index] + " "
  }
  let index = Math.floor(Math.random() * data.length)
  answer += data[index]

  return answer
}

// empirically determined by 404 errors from unsplash.it; nowhere near comprehensive!
const badIds = ['636', '792', '205', '578', '462', '895', '226',
                '644', '763', '601', '285', '470', '226', '148',
                '597', '303', '333', '332', '150', '748', '754',
                '734', '647', '712', '1034']


function writeProduct(textArray, writeStream) {
  writeStream.write('\t\t')
  const product = {}

  let nameLength = Math.floor(Math.random() * 5)
  let descriptionLength = Math.floor(Math.random() * 15) + 8
  let numberTags = Math.floor(Math.random() * 3) + 4

  product.id = uuidv4()
  product.name = randomString(textArray, nameLength)
  product.description = randomString(textArray, descriptionLength)
  product.tags = []
  for(let i=0; i<numberTags; i++) {
    let index = Math.floor(Math.random() * textArray.length)
    product.tags.push(textArray[index])
  }

  // ***************
  // PRODUCT OPTIONS
  // Ensure these match those selected at the top!!
  // Comment out any options you are not using;
  // add new calls for any custom options you add.
  // ***************
  product.style = styles[Math.floor(Math.random() * styles.length)]
  product.type  = types[Math.floor(Math.random() * types.length)]
  product.size  = sizes[Math.floor(Math.random() * sizes.length)]
  // product.age = ages[Math.floor(Math.random() * ages.length)]
  // product.productOptions = productOptions[Math.floor(Math.random() * productOptions.length)]

  // Price: randomly generated between $0 and $200. Edit this to change your product price range.
  product.price = ((Math.random() * 20000)/100).toFixed(2)

  // Image is randomly pulled from unsplash.it.
  let imageId
  do {
    imageId = Math.floor(Math.random() * 1084)
  } while(badIds.includes(imageId.toString()))

  product.image = `https://unsplash.it/400/200?image=${imageId}`

  writeStream.write(JSON.stringify(product))
}

module.exports = createProducts
