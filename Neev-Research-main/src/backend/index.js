const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'candidate.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.post('/api/store-candidate/', async (request, response) => {
  const candidateDetails = request.body
  const {name, dateOfBirth, gender, contactDetails, address} = candidateDetails
  const addCandidateQuery = `
    INSERT INTO
      details (name,date_of_birth,gender,contact_details,dress)
    VALUES
      (
        '${name}',
         ${dateOfBirth},
         ${gender},
         ${contactDetails},
         ${address},
      );`

  const dbResponse = await db.run(addCandidateQuery)
  const candidateId = dbResponse.lastID
  response.send({candidateId: candidateId})
})

app.get('/api/candidates', async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      details
    ORDER BY
      candidate_id;`
  const booksArray = await db.all(getBooksQuery)
  response.send(booksArray)
})
