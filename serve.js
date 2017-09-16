const express = require('express')
const graphqlHTTP = require('express-graphql')
const { maskErrors } = require('graphql-errors')
const schema = require('./schema')

const app = express()
maskErrors(schema)
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(process.env.PORT || 4000)
