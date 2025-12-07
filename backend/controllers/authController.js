const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
const bcrypt =  require("bcryptjs");


const signupUser = async (req, res) => {
  try{
    const {name, email, password, adminkey} = req.body;
    if( !name || !email || !password){
        return res.status(400).json({message : "All fields are requird"});
    }

    const userExists = await prisma.user.findUnique({where : {email}});
    if(userExists){
        return res.status(400).json({message :"User already preset with this email"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role ="customer";

    if(adminkey){
        if(adminkey === process.env.ADMIN_KEY){
            role ="admin";
        }
        else{
            return res.status(403).json({message : "Invalid admin key"});
        }
    }

    await prisma.user.create({
        data : {
            name,
            email,
            passwordHash : hashedPassword,
            role
        }
    });

    return res.status(201).json({message : `User registered successfully with role ${role}`});

  }
  catch(e){
    console.log("signup user error : ",e);
    return res.status(500).json({message : "Internal Server Error"});
  }
};


const loginUser = async (req, res) => {
  try{
    const {email, password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({message : "Email & Password are requird"});
    }

    const user = await prisma.user.findUnique({where : {email}});

    if(!user){
        return res.status(400).json({message : "Invalid email or password"});
    }

    const isPasswordMatch = await bcrypt.compare(password,user.passwordHash);
    if(!isPasswordMatch){
        return res.status(400).json({message : "Invalid email or password"});
    }

    const token = jwt.sign(
        {
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role
        },
        process.env.JWT_SECRET,
        {expiresIn : "7d"}
    );

    return res.status(200).json({
        message : "Login successful",
        token,
        user : {
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role
        }

    });
  }
  catch(e){
    console.log("login user error : ",e);
    return res.status(500).json({message : "Internal Server Error"});
  }
};

const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout successful"
    });
  } catch (e) {
    console.log("logout user error : ", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signupUser, loginUser, logoutUser };