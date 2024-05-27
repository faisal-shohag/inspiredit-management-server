import jwt from 'jsonwebtoken';
import "dotenv/config"
import { find_admin, find_admin_only_with_id } from "./Check.js"
// import prisma from "../DB/db.config.js";

//create jwt token with maxAge
// const maxAge = 1095 * 24 * 60 * 60
// const createToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '3y'})


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

const maxAge = 3 * 365 * 24 * 60 * 60 * 1000; // 3 years in seconds

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3y' });

// Admin login controller
const admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await find_admin(email, password);
        const token = createToken(admin.id);
        res.cookie('jwt_admin', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: "none", secure: true });
        res.status(200).json({ ...admin });
    } catch (error) {
        console.log(error);
        const errors = handleError(error);
        res.status(400).json({ errors });
    }
};

// Admin logout
const admin_logout = async (req, res) => {
    try {
        res.cookie('jwt_admin', '', { httpOnly: true, maxAge: 1 });
        res.status(200).json({ message: "logged out!" });
    } catch (error) {
        const errors = handleError(error);
        res.status(400).json({ errors });
    }
};

// Check admin login status
const check_admin_login = async (req, res) => {
    const token = req.cookies.jwt_admin;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.cookie('jwt_admin', '', { httpOnly: true, maxAge: 1 });
                res.status(401).json({ loggedIn: false });
            } else {
                try {
                    const admin = await find_admin_only_with_id(decoded.id);
                    res.status(200).json({ ...admin, loggedIn: true });
                } catch (error) {
                    res.cookie('jwt_admin', '', { httpOnly: true, maxAge: 1 });
                    res.status(401).json({ loggedIn: false });
                }
            }
        });
    } else {
        res.cookie('jwt_admin', '', { httpOnly: true, maxAge: 1 });
        res.status(401).json({ loggedIn: false });
    }
};

const handleError = (err) => {
    let errors = { err: err.message };
    console.log(errors);
    return errors;
};

export { admin_login, admin_logout, check_admin_login };