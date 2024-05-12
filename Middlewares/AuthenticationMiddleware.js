import jwt from 'jsonwebtoken';
import "dotenv/config"

const isAdminAuth =(req, res, next) => {
    const token = req.cookies.jwt_admin 
    // console.log(token)
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            err ? res.status(201).json({"err": {"message": "authentication required"}}) : next()
        })
    } else {
        res.status(201).json({"err": {"message": "authentication required"}})
    }
}


//
// const staff_mid =(req, res, next) => {
//     const token = req.cookies.jwt_staff 
//     if(token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err) => {
//             err ? res.status(400).json({"err": {"message": "authentication required"}}): next()
//         })
//     } else {
//         res.status(400).json({"err": {"message": "authentication required"}})
//     }
// }


// const isAuthorized = (req, res, next) => {
//     const token = req.cookies.jwt_admin 
//     const token2 = req.cookies.jwt_staff
//     let isAdmin = false
//     // let isStaff = false
//     if(token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err) => {
//             err ? isAdmin = false : isAdmin = true
//         })
//     }

    // if(token2) {
    //     jwt.verify(token2, process.env.JWT_SECRET, (err) => {
    //         err ? isStaff = false : isStaff = true
    //     })
    // }

    // if(isAdmin || isStaff) {
    //     next()
    // } else {
    //     res.status(400).json({"err": {"message": "authentication required"}})
    // }
// }



export{isAdminAuth}