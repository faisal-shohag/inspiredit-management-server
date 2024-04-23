import jwt from 'jsonwebtoken';
import "dotenv/config"

const admin_mid =(req, res, next) => {
    const token = req.cookies.jwt_admin 
    console.log(token)
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if(err) {
                res.status(400).json({"err": {"message": "authentication required"}})
            } else {
                next()
            }
        })
    } else {
        res.status(400).json({"err": {"message": "authentication required"}})
    }
}


//
const staff_mid =(req, res, next) => {
    const token = req.cookies.jwt_staff 
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if(err) {
                res.status(400).json({"err": {"message": "authentication required"}})
            } else {
                next()
            }
        })
    } else {
        res.status(400).json({"err": {"message": "authentication required"}})
    }
}


const isAuthorized = (req, res, next) => {
    const token = req.cookies.jwt_admin 
    const token2 = req.cookies.jwt_staff
    // if(!token || !token2) {
    //     res.status(400).json({"err": {"message": "authentication required"}})
    // }
    let isAdmin = false
    let isStaff = false
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if(err) {
                isAdmin = false
            } else {
                isAdmin = true
            }
        })
    }

    if(token2) {
        jwt.verify(token2, process.env.JWT_SECRET, (err) => {
            if(err) {
                isStaff = false
            } else {
                isStaff = true
            }
        })
    }

    if(isAdmin || isStaff) {
        next()
    } else {
        res.status(400).json({"err": {"message": "authentication required"}})
    }
}



export{admin_mid, staff_mid, isAuthorized}