import prisma from "../DB/db.config.js";
import { Router } from "express";
import {studentUploader} from '../Controllers/UploadController.js'
import { mailToAdmin } from "../Controllers/MailController.js";
const router = Router();


router.put('/admin_update/:id', async(req, res) => {
    const data = req.body
    const id = req.params.id
    try {
        const admin = await prisma.admin.update({
            where: {
                id: id
            },
            data: {...data}
        })

        // mailToAdmin(admin)
        res.status(200).json({success: true, updated: admin})
        
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Admin error."})
         else res.status(400).json({err: "Something went wrong!"})
    }
})


router.put('/readmission/:id', async(req, res) => {
    const data = req.body
    const id = parseInt(req.params.id)
    // console.log(data)
    try {
        const student = await prisma.student.update({
            where: {
                id: id
            },
            data: {...data}
        })
        // mailToStudent(student)
        res.status(200).json({success: true, updated: student})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Student with this email already been created!"})
         else res.status(400).json({err: "Something went wrong! Did you filled all the fields!"})
    }
})

router.put('/student_update/:id', async(req, res) => {
    const data = req.body
    const id = req.params.id
    // console.log(data)
    try {
        const student = await prisma.student.update({
            where: {
                id_no: id
            },
            data: {...data}
        })
        res.status(200).json({success: true, updated: student})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Student with this email already been created!"})
         else res.status(400).json({err: "Something went wrong! Did you filled all the fields!"})
    }
})


//teacher update
router.put('/teacher_update/:id', async(req, res) => {
    const data = req.body
    const id = parseInt(req.params.id)
    // console.log(data)
    try {
        const teacher = await prisma.teacher.update({
            where: {
                id: id
            },
            data: {...data}
        })
        res.status(200).json({success: true, updated: teacher})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Student with this email already been created!"})
         else res.status(400).json({err: "Something went wrong! Did you filled all the fields!"})
    }
})


//staff update
router.put('/staff_update/:id', async(req, res) => {
    const data = req.body
    const id = parseInt(req.params.id)
    // console.log(data)
    try {
        const staff = await prisma.staff.update({
            where: {
                id: id
            },
            data: {...data}
        })
        res.status(200).json({success: true, updated: staff})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Student with this email already been created!"})
         else res.status(400).json({err: "Something went wrong! Did you filled all the fields!"})
    }
})


router.put('/class_update/:id', async(req, res) => {
    const data = req.body
    
    const id = parseInt(req.params.id)
    // console.log(data)
    try {
        const _class = await prisma.class.update({
            where: {
                id: id
            },
            data: {...data, fee: parseInt(data.fee)}
        })
        res.status(200).json({success: true, updated: _class})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Student with this email already been created!"})
         else res.status(400).json({err: "Something went wrong! Did you filled all the fields!"})
    }
})



//setting update
router.put('/settings_update/:id', async(req, res) => {
    const data = req.body
    const id = parseInt(req.params.id)
    try {
        const subject = await prisma.settings.update({
            
            data: {...data},
            where: {
                id: id
            }
        })
        res.status(200).json({success: true, updated: subject})
    } catch (error) {
        // sendError(res, error)
        if(error.code == "P2002") 
           res.status(403).send({err: ""})
        else res.status(400).json({err: "error"})
    }
})


router.put('/class/attendance/:attendanceId/:studentId/:date', async(req, res) => {
    const data = req.body
    const id = parseInt(req.params.studentId)
    const date = new Date(req.params.date)
    const attendanceId = parseInt(req.params.attendanceId)
    console.log(data)
    try {
        const attendance = await prisma.studentAttendance.update({
            data: {...data},
            where: {
                id: attendanceId,
                studentId: id,
                date: date
            }
        })
        res.status(200).json({success: true, updated: attendance})
    } catch (error) {
       console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: ""})
        else res.status(400).json({err: "error"})
    }
})

router.put('/account/:id', async(req, res) => {
    
    const data = req.body
    const id = parseInt(req.params.id)
    // console.log(data)
    try {
        const account = await prisma.account.update({
            where: {
                id: parseInt(id)
            },
            data: {...data}
        })
        // await prisma.transactions.deleteMany({
        //     where: {
        //         accountId: parseInt(id)
        //     }
        // })
        await prisma.transactions.updateMany({
            where: {
                accountId: parseInt(id)
            },
            data: {date: data.date, amount: data.amount, name: data.purpose, type: data.type}
        })
        res.status(200).json({success: true, updated: account})
    } catch (error) {
        console.log(error)
        res.status(400).json({err: "error"})
    }
})

export default router