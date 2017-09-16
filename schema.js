const util = require('util')
const fetch = require('node-fetch')
const parseXML = util.promisify(require('xml2js').parseString)

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = require('graphql')

const {
  getAuthor,
} = require('./goodreads')

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: '...',

  fields: {
    title: { type: GraphQLString },
    isbn: { type: GraphQLString },
  }
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',

  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml =>
        xml.GoodreadsResponse.author[0].name[0]
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: xml =>
        xml.GoodreadsResponse.author[0].books[0].book
          .map(book => ({
            title: book.title[0],
            isbn: book.isbn[0]
          }))
    }
  })
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, { id }) => fetch(
          `http://www.goodreads.com/author/show.xml` +
          `?id=${id}&key=${process.env.GOODREADS_API_KEY}`
        )
        .then(response => response.text())
        .then(parseXML)
      }
    })
  })
})
