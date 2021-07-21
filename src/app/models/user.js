
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    nome:{
        type: String,
        require : true,
    },
    email:{
       type:String,
       unique: true,
       required: true,
       lowercase: true,
    },
    password :{
       type:String,
       required: true,
       select: false,
    },
    passwordResetToken :{
      type:String,
      select: false,
   },
   passwordResetExpires :{
      type:Date,
      select: false,
   },
    CreateDat :{
       type:Date,
       default:Date.now,
    },
    status:{
       type: Boolean,
       required: true,
       default: true
    }
});

userSchema.pre('save',async function(next){
   const hash = await bcrypt.hash( this.password, 10);
   this.password = hash;

   next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;