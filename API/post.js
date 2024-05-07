import prisma from "../DB/db.config.js";
import { Router } from "express";
import {studentUploader, logoUploader, teacherUploader} from '../Controllers/UploadController.js'
import { mailToStudent, mailToTeacher } from "../Controllers/MailController.js";
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
        // mailToTeacher(teacher)
        res.status(200).json({success: true, created: teacher})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Teacher with this email already been created!"})
         else res.status(400).json({err: "error"})
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
        // mailToStudent(student)
        res.status(200).json({success: true, created: student})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Student with this email already been created!"})
         else res.status(400).json({err: "Something went wrong! Did you filled all the fields!"})
    }
})

//admission fee
router.post('/admission_fee', async(req, res) => {
    const data = req.body
    try {
        const subject = await prisma.admissionFee.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: subject})
    } catch (error) {
        // sendError(res, error)
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: "This teacher is already been added for this class and subject!"})
        else res.status(400).json({err: "error"})
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
        // sendError(res, error)
        if(error.code == "P2002") 
           res.status(403).send({err: "Class with this name already been created! Choose another name."})
        else res.status(400).json({err: "error"})
    }
})

//section 
router.post('/section_add', async(req, res) => {
    const data = req.body
    try {
        const section = await prisma.section.create({
            data: {...data, classId: parseInt(data.classId)}
        })
        res.status(200).json({success: true, created: section})
    } catch (error) {
        sendError(res, error)
    }
})

//subject
router.post('/subject_add', async(req, res) => {
    const data = req.body
    try {
        const subject = await prisma.subject.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: subject})
    } catch (error) {
        // sendError(res, error)
        if(error.code == "P2002") 
           res.status(403).send({err: "This teacher is already been added for this class and subject!"})
        else res.status(400).json({err: "error"})
    }
})

//Settings
router.post('/settings_add', async(req, res) => {
    const data = req.body
    try {
        const subject = await prisma.settings.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: subject})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: "This teacher is already been added for this class and subject!"})
        else res.status(400).json({err: "error"})
    }
})

//image 
router.post('/student_upload', studentUploader.single('image'), (req, res)=> {
    if(!req.file) {
        return res.status(400).send("No file to upload!")
    }
    console.log(req.file)

    res.send({ok: "ok", file: req.file})
})

router.post('/teacher_upload', teacherUploader.single('image'), (req, res)=> {
    if(!req.file) {
        return res.status(400).send("No file to upload!")
    }
    console.log(req.file)

    res.send({ok: "ok", file: req.file})
})

router.post('/logo_upload', logoUploader.single('image'), (req, res)=> {
    if(!req.file) {
        return res.status(400).send("No file to upload!")
    }
    console.log(req.file)
    

    res.send({ok: "ok", file: req.file})
})


export default router