import prisma from "../DB/db.config.js";
import { Router } from "express";
import axios from 'axios'
import {studentUploader, logoUploader, teacherUploader, staffUploader} from '../Controllers/UploadController.js'
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

//staff add
router.post('/staff_add', async(req, res) => {
    const data = req.body
    // console.log(data)
    try {
        const staff = await prisma.staff.create({
            data: {...data}
        })
        // mailToTeacher(teacher)
        res.status(200).json({success: true, created: staff})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
            res.status(403).send({err: "Staff with this email already been created!"})
         else res.status(400).json({err: "error"})
    }
})

//admission fee
router.post('/admission_fee', async(req, res) => {
    const data = req.body
  
    // console.log(transactions)
    try {
        const fee = await prisma.admissionFee.create({
            data: {...data}
        })
        const transactions = await prisma.transactions.create({
            data: {admissionFeeId: fee.id, amount: (data.fee + data.other) - data.discount, name: 'Addmission Fee', type: 'income'}
        })
        res.status(200).json({success: true, created: fee})
    } catch (error) {
        // sendError(res, error)
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: "This teacher is already been added for this class and subject!"})
        else res.status(400).json({err: "error"})
    }
})




//class 
router.post('/class_add', async(req, res) => {
    const data = req.body
    try {
        const _class = await prisma.class.create({
            data: {...data}
        })

        const section = await prisma.section.create({
            data: {name: "1", classId: _class.id}
        })

        res.status(200).json({success: true, created: _class})
    } catch (error) {
        console.log(error)
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
            data: {...data, classId: parseInt(data.classId), name: (data.name).toString()}
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
        const settings = await prisma.settings.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: settings})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: "This teacher is already been added for this class and subject!"})
        else res.status(400).json({err: "error"})
    }
})



router.post('/regular_fee', async(req, res) => {
    const data = req.body
    try {
        const fee = await prisma.regularFee.create({
            data: {...data}
        })
        const transactions = await prisma.transactions.create({
            data: {regularFeeId: fee.id, amount: (data.regular_fee + data.others_fee + data.id_card_fee) - data.discount_fee, name: 'Regular Fee', type: 'income'}
        })
        res.status(200).json({success: true, created: fee})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: true})
        else res.status(400).json({err: "error"})
    }
})


router.post('/salary_add/:employee', async (req, res) => {
    const data = req.body;
    const employee = req.params.employee;
    const paidDate = new Date(data.paid_date);
    const year = paidDate.getFullYear();
    const month = paidDate.getMonth() + 1; // JavaScript months are 0-indexed
    console.log(data)
    
    try {
        // Check if salary already exists for this employee and month
        const employeeField = data.teacherId ? 'teacherId' : 'staffId';
        const existingSalary = await prisma.salary.findFirst({
            where: {
                [employeeField]: data[employeeField],
                paid_date: {
                    gte: new Date(year, month - 1, 1),
                    lt: new Date(year, month, 1)
                }
            }
        });

        if (existingSalary) {
            return res.status(409).json({ err: "Salary already exists for this employee and month" });
        }

        // Create new salary record
        const salary = await prisma.salary.create({
            data: { ...data, paid_date: paidDate }
        });

        // Create new transaction record
        const transactions = await prisma.transactions.create({
            data: {
                salaryId: salary.id,
                amount: data.monthly_salary + data.bonus,
                name: `${employee} Salary`,
                type: 'expense',
                date: paidDate
            }
        });

        res.status(200).json({ success: true, created: salary });
    } catch (error) {
        console.log(error);
        if (error.code === "P2002") {
            res.status(403).send({ err: "Unique constraint failed" });
        } else {
            res.status(400).json({ err: "An error occurred" });
        }
    }
});

router.post('/visitor_add', async(req, res) => {
    const data = req.body
    try {
        const visitors = await prisma.visitor.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: visitors})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: ""})
        else res.status(400).json({err: "error"})
    }
})




//add staff salary
// router.post('/staff_salary_add', async(req, res) => {
//     const data = req.body
//     const transactions = await prisma.transactions.create({
//         data: {amount: data.monthly_salary + data.bonus, name: 'Staff Salary', type: 'expense'}
//     })
//     try {
//         const salary = await prisma.staffSalary.create({
//             data: {...data}
//         })
//         res.status(200).json({success: true, created: salary})
//     } catch (error) {
//         console.log(error)
//         if(error.code == "P2002") 
//            res.status(403).send({err: ""})
//         else res.status(400).json({err: "error"})
//     }
// })

//add teacher salary
// router.post('/teacher_salary_add', async(req, res) => {
//     const data = req.body
//     const transactions = await prisma.transactions.create({
//         data: {amount: data.monthly_salary + data.bonus, name: 'Teacher Salary', type: 'expense'}
//     })
//     try {
//         const salary = await prisma.teacherSalary.create({
//             data: {...data}
//         })
//         res.status(200).json({success: true, created: salary})
//     } catch (error) {
//         console.log(error)
//         if(error.code == "P2002") 
//            res.status(403).send({err: ""})
//         else res.status(400).json({err: "error"})
//     }
// })


router.post('/account_add', async(req, res) => {
    const data = req.body
    // console.log(data)
    
    try {
        const account = await prisma.account.create({
            data: {...data}
        })
        const transactions = await prisma.transactions.create({
            data: {accountId: account.id,
                date: data.date, amount: data.amount, name: data.purpose, type: data.type}
        })
        res.status(200).json({success: true, created: account})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: ""})
        else res.status(400).json({err: "error"})
    }
})


router.post('/class/attendances', async(req, res) => {
    const data = req.body
    try {
        const student_attendances = await prisma.studentAttendance.createMany({
            data: data
        })
        res.status(200).json({success: true, created: student_attendances})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: ""})
        else res.status(400).json({err: "error"})
    }
})

router.post('/transaction_add', async(req, res) => {
    const data = req.body
    console.log(data)
    try {
        const transactions = await prisma.transactions.create({
            data: {...data}
        })
        res.status(200).json({success: true, created: transactions})
    } catch (error) {
        console.log(error)
        if(error.code == "P2002") 
           res.status(403).send({err: ""})
        else res.status(400).json({err: "error"})
    }
})




//image 
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload/:type/:id', upload.single('image'), async(req, res)=> {
    const id = req.params.id;
    const type = req.params.type;

    try {
        const file = req.file;
    
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
    
        // Convert file buffer to base64
        const base64Image = file.buffer.toString('base64');
    
        // Prepare form data for ImgBB
        const formData = new URLSearchParams();
        formData.append('image', base64Image);
    
        // Upload to ImgBB
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=8fc8712951eb00488098a3e9d6307fee`,
          formData,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
    
        let updateData= await prisma[type].update({
            where: {id_no: id},
            data: {
                image: response.data
            }
        })
        console.log(updateData)
        res.status(200).send({data:response.data, updateData});
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error uploading image' });
      }

})

router.post('/teacher_upload', teacherUploader.single('image'), (req, res)=> {
    if(!req.file) {
        return res.status(400).send("No file to upload!")
    }
    console.log(req.file)

    res.send({ok: "ok", file: req.file})
})

router.post('/staff_upload', staffUploader.single('image'), (req, res)=> {
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