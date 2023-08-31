const express=require('express')
const User=require('../models/users')
const router=new express.Router()
const auth=require('../middleware/auth')
const multer= require('multer')
const sharp=require('sharp')
// const {sendWelcomeEmail,
//     sendCancelationEmail}=require('../emails/account')

router.post('/users/signup',async (req,res)=>{
    const user=new User(
        req.body
    )
    try{
        await user.save()
       const token= await user.generateAuthToken()
       //sendWelcomeEmail(user.email,user.name)
        res.status(201).send({user,token})
    }catch(error){
        res.status(400)
        res.send(error)
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(await req.user.getPublicData())
    
})



router.patch('/users/me',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowed=['name','email','password','age']
    const isValid=updates.every((update)=> allowed.includes(update))
    if (!isValid){
        return res.status(400).send('Invalid Update')
    }
    const ID=req.user._id
    try{

        const user=await req.user
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()
        //const user=await User.findByIdAndUpdate(ID,req.body,{new:true, runValidators:true})
        
        res.status(200).send('User details updated!')
    }catch(error){
        res.status(500).send(error)
    }
    
    
})


router.delete('/users/me',auth,async (req,res)=>{
    console.log(req.user)    
    try {
        const user = req.user; // Assuming req.user is properly populated

        // Delete the user using the deleteOne() method
        const result = await User.deleteOne({ _id: user._id });

        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User Deleted successfully')
    }
    catch(error){
        res.status(500).send(error.message)
    }
    
})

router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user:await user.getPublicData(),token})
        return token
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })

        await req.user.save()

        res.send('Logged out successfully')
    }catch(error){
        res.status(500).send(error)
    }
})
const avatar=multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must me of jpg/jpeg/png format only'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,avatar.single('avatar'),async (req,res)=>{
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
  
      if (!req.user) {
        return res.status(401).send("User not authenticated.");
      }
      const buffer=await sharp(req.file.buffer).resize({
        width:250,
        height:250
      }).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)

        if (!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)

    }catch(error){
        res.status(404).send()
    }
})

module.exports=router