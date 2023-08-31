require('../src/db/mongoose')

const User=require('../src/models/users')
const Task=require('../src/models/tasks')

// User.findByIdAndUpdate('64db6e9f31f428247c818693',{age:16})
// .then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:16})
//     .then((users)=>{
//         console.log(users)
//     })
// })
// .catch((error)=>{
//     console.log(error)
// })

// const findByIdAndUpdate= async(id,age)=>{
//     const user=await User.findByIdAndUpdate(id,{age})
//     const count=await User.countDocuments({age})

//     return count
// }

// findByIdAndUpdate('64db6e9f31f428247c818693',9)
// .then((count)=>{
//     console.log(count)
// })
// .catch((error)=>{
//     console.log(error)
// })

const deleteTaskAndCount=async (id)=>{
    await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:true})
    return count
}

deleteTaskAndCount('64dcd577780024cbee6ba57f')
.then((count)=>{console.log(count)})
.catch((error)=>{console.log(error)})