const express=require('express')
require('./db/mongoose')
const User=require('./models/users')
const Task=require('./models/tasks')

const userRouter=require('./routers/users')
const taskRouter=require('./routers/tasks')

const app=express()
app.listen(3000,()=>{
    console.log('Server running on port '+3000)
})

const multer=require('multer')
const upload=multer({
    dest:'images'
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})

app.use(express.json())

app.use(userRouter)
app.use(taskRouter)







