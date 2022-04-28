const express = require('express')
const path = require('path')

const app = express()

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '7b6d4c87610f485ebf4897b15cc8fd2b',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
    rollbar.info('html file served successfully.')
})


let students = []

app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()
    
    students.push(name)
    
    res.status(200).send(students)
})

// Now let's add some rollbar functionality to log info and track errors. In your post function add a rollbar log:
app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()
    
    students.push(name)
    
    rollbar.log('Student added successfully', {author: 'Scott', type: 'manual entry'})
    
    res.status(200).send(students)
})

// Let's also add some top-level middleware that will track any errors that occur in our server:
app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))