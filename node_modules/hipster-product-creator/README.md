# Hipster Product Creator #
by [katreinhart](mailto:kat@reinhart.digital)

Easily generate a JSON object of random Hipster Ipsum product items for use in your e-commerce projects.
Uses the [Hipster Ipsum API](http://hipsterjesus.com/api) and [Unsplash.it API](http://unsplash.it).

Developed as a side project alongside [Dynamic Product Filters](https://github.com/katreinhart/dynamic-product-filters) as a means of quickly generating test data.

### Installation ###
```
npm install hipster-product-creator
```
Or fork and clone this repository.

### Generating products ###
```
const hipsterProductCreator = require('hipster-product-creator')
hipsterProductCreator(n [, filename])
```
Outputs a JSON object of random products to a new file, in your local directory.
Takes two arguments (one optional):
n: number of products to create.
filename: (optional) what it says on the tin. Defaults to products.json.

### Product Options ###

ADVANCED STUFF: You can add your own options for products by editing the arrays in the PRODUCT OPTIONS section.
Add categories, comment categories in or out. If you're editing a lot of this stuff, you should probably just fork & clone the repo instead of npm installing it.
