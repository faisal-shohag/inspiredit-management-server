import prisma from "../DB/db.config.js";
import { Router } from "express";
import {studentUploader} from '../Controllers/UploadController.js'
const router = Router();


router.put('/student_update/:id', async(req, res) => {
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
        res.status(200).json({success: true, created: student})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Student with this email already been created!"})
         else res.status(400).json({err: "Something went wrong! Did you filled all the fields!"})
    }
})

export default router