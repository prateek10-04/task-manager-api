const express=require('express')
const Task=require('../models/tasks')
const router=new express.Router()
const auth=require('../middleware/auth')

router.post('/tasks',auth,async (req,res)=>{
    
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        
        res.status(201).send(task)
        
    }catch(error){
        res.status(500)
        res.send(error)
    }
    
})



router.get('/tasks',auth,async (req,res)=>{
    const match={}
    const sort={}

    if (req.query.completed){
        match.completed =req.query.completed === 'true'
    }

    if (req.query.sort){
        const parts=req.query.sort.split(':')
        sort[parts[0]] = parts[1]==='desc'? -1 : 1
    }
    try{

        let tasks;
        const queryOptions={
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
        
        if (Object.keys(match).length === 0) {
            tasks = await Task.find({ owner: req.user._id },null,queryOptions);
        } else {
            tasks = await Task.find({ owner: req.user._id, completed: match.completed},null,queryOptions);
        }
         res.send(tasks)
     }catch(error){
         res.status(500).send()
     }
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const id=req.params.id
    
    
    try{
        const task=await Task.findOne({_id:id,owner:req.user})
        if(!task){
            return res.status(404).send(`No task found with ID ${id}`)
        }
        res.status(200).send(task)
    }
    catch(error){
        res.status(500).send(error.message)
    }
})



router.patch('/tasks/:taskID',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowed=['description','completed']
    const isValid=updates.every((update)=> allowed.includes(update))
    if (!isValid){
        return res.status(400).send('Invalid Update')
    }
    const ID=req.params.taskID
    try{
        const Task=await findOne({_id:ID,owner:req.user._id})
        const task=await Task.findByIdAndUpdate({_id:ID,owner:req.user._id},req.body,{new:true, runValidators:true})
        if(!task){
           return res.status(404).send('No task found with that ID')
        }
        updates.forEach((update)=> task[update]=req.body[update])
        await task.save()
        
        res.status(200).send('Task details updated!')
    }catch(error){
        res.status(500).send(error)
    }
    
    
})



router.delete('/tasks/:taskID',auth,async (req,res)=>{
    const ID=req.params.taskID
    try{
        const task=await Task.findByIdAndDelete({_id:ID,owner:req.user._id})
        if (!task){
            return res.status(404).send('Task not found with that ID')
        }
        res.status(400).send('Task deleted'+' '+task)
    }
    catch(error){
        res.status(500).send(error)
    }
})

module.exports=router