const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('../models/tasks')



const userSchema=new mongoose.Schema({name:{
    type:String,
    required:true,
    trim:true
},
age:{
    type:Number,
    default:0,
    validate(value){
        if (value<0){
            throw new Error('Age must be a positive number')
        }
    }
},
email:{
    type:String,
    unique:true,
    required:true,
    trim:true,
    lowercase:true,
    
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Not in Email format')
        }
    }
},
password:{
    type:String,
    required:true,
    trim:true,
    validate(value){
        if (!(value.length >6)){
            throw new Error('Password cannot be of length less than 7')
        }

        if ( (value.toLowerCase().includes('password'))){
            throw new Error('Password cannot contain the word "password"')
        }
    }
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}],
avatar:{
    type:Buffer
}
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField: '_id',   // The field in the current schema to match
    foreignField: 'owner'
})

userSchema.methods.getPublicData=async function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken=async function (){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},'secretToken')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    if (!user){
        throw new Error('Unable to login')
    }
    if(!(await bcrypt.compare(password,user.password))){
        throw new Error('Unable to login')
    }
    return user
}

userSchema.pre('save',async function(next){
    const user=this
    if (user.isModified('password')){
        console.log('Hello')
        user.password=await bcrypt.hash(user.password,8)

    }

    next()
})

userSchema.pre('remove',async function (next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User=mongoose.model('Users',userSchema)



module.exports=User