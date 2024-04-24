import prisma from "../DB/db.config.js";
import { Router } from "express";
const router = Router();

const sendError = (res, error)=> {
    res.status(404).json({ err: err });
    console.log(error);
}

//teacher
router.post('/teacher', async(req, res) => {
    const data = req.body
    try {
        const teacher = await prisma.teacher.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: teacher})
    } catch (error) {
        sendError(res, error)
    }
})


export default router