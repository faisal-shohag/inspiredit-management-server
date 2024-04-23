import jwt from 'jsonwebtoken';
import "dotenv/config"
import { find_admin } from "./Check.js"


//create jwt token with maxAge
const maxAge = 2 * 24 * 60 * 60
const createToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '2d'})


// const admin_signup = async (req, res) => {
//     try {
//         const res = await prisma.admin.create({
//             data: {
//                 email: 'admin@gmail.com',
//                 name: 'admin',
//                 password: 'admin'
//             }
//         })
        
//         console.log(res)
//         res.status(200).send({status: "OK", result: res})

//     } catch(err) {
//         res.status(400).send({status: 'error', err: err})
//     }

// }


// admin login controller
const admin_login = async (req, res) => {
    const { email, password } = req.body 
    try {
        const admin = await find_admin(email, password)
        const token = createToken(admin.id)
        res.cookie('jwt_admin', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({...admin, token})
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({errors})
    }
}

//admin logout
const admin_logout = async(req, res) => {
    try{
        res.cookie('jwt_admin', '', {httpOnly: true, maxAge: 1})
        res.status(200).json({"message": "logged out!"})
    } catch(error) {
        const errors = handleError(error)
        res.status(400).json({errors})
    }
}


const check_admin_login =(req, res) => {
    const token = req.cookies.jwt_admin 
    console.log(token)
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            err ? res.status(400).json({loggedIn: false}) : res.status(200).json({loggedIn: true})
        })
    } else {
        res.status(400).json({loggedIn: false})
    }
}



const handleError = (err) =>{
    let errors = {err: err.message}
    return errors;
}

export { admin_login, admin_logout, check_admin_login }
