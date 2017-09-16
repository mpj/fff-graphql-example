const util = require('util')
const fetch = require('node-fetch')
const parseXML = util.promisify(require('xml2js').parseString)

const getAuthorXML = id =>
  fetch(
    `http://www.goodreads.com/author/show.xml` +
    `?id=${id}&key=${process.env.GOODREADS_API_KEY}`
  )
  .then(response => response.text())
  .then(parseXML)

const authorElement = xml =>
  xml.GoodreadsResponse.author[0]

const nameFromXML = xml => authorElement(xml).name[0]
const booksFromXML = xml =>
  authorElement(xml).books[0].book
    .map(book => ({
      title: book.title[0],
      isbn: book.isbn[0]
    }))

const getAuthor = id => getAuthorXML(id).then(xml => ({
  name: nameFromXML(xml),
  books: booksFromXML(xml)
}))

module.exports = {
  getAuthor
}




