const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID=mongodb.ObjectId

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager1'


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }
    console.log('Connected')

    const db = client.db(databaseName)
    
    db.collection('users').deleteMany({
        age:19
    })
    .then(result=>{
        console.log(result)
    })
    .catch(error=>{
        console.log(error)
    })
})