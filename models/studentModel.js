const mongoose = require('mongoose')
require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const studentModel = new mongoose.Schema({
    role:{
        type:String,
        default:"Student"
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    avatar:{
        type:Object,
        default:{
            fileId:'',
            url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png'
        }
    },
    contact:{
        type: Number,
        required:[true,"Contact is required"],
        minLength:[10,"Contact Should be atleast 4 char long"],
        maxLength:[10,"Contact must not exceed 10 char"],

    },
    city:{
        type: String,
        required:[true,"Ciy is required"],
    },

    gender:{
        type:String,
        enum:["Male","Female","Others"]
    },

    resume:{
        education:["sda"],
        jobs:[],
        interships:[],
        responsibilities:[],
        courses:[],
        projects:[],
        skills:[],
        accomplishments:[]
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        select: false,
        maxLength: [15, "password should not exceed more than 15 char"],
        minLength: [6, "password should  more than 6 char"],
        // match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/]

    },
    resetPasswordToken: {
        type: Number,
        default: 0
    },

    appliedinterships:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Internship"
    }],
    appliedjobs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job"
    }]
}, { timestamps: true })


studentModel.pre("save", function () {

    if (!this.isModified("password")) {
        return
    }


    this.password = bcrypt.hashSync(this.password, 10)
})

studentModel.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

studentModel.methods.getjwttoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRECT, { expiresIn: process.env.JWT_EXPIRE })
}


module.exports = mongoose.model("student", studentModel)