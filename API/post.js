import prisma from "../DB/db.config.js";
import { Router } from "express";
const router = Router();

const sendError = (res, error)=> {
    res.status(404).json({ err: error });
    console.log(error);
}

//teacher
router.post('/teacher_add', async(req, res) => {
    const data = req.body
    // console.log(data)
    try {
        const teacher = await prisma.teacher.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: teacher})
    } catch (error) {
        sendError(res, error)
    }
})

//student
router.post('/student_add', async(req, res) => {
    const data = req.body
    // console.log(data)
    try {
        const student = await prisma.student.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: student})
    } catch (error) {
        sendError(res, error)
    }
})

//sataff
router.post('/staff_add', async(req, res) => {
    const data = req.body
    // console.log(data)
    try {
        const staff = await prisma.staff.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: staff})
    } catch (error) {
        sendError(res, error)
    }
})

//class 
router.post('/class_add', async(req, res) => {
    const data = req.body
    try {
        const _class = await prisma.class.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: _class})
    } catch (error) {
        sendError(res, error)
    }
})

//section 
router.post('/section_add', async(req, res) => {
    const data = req.body
    try {
        const section = await prisma.section.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: section})
    } catch (error) {
        sendError(res, error)
    }
})


export default router