import { Router } from "express";
import prisma from "../DB/db.config.js";
const router = Router();


router.get("/teacher_count", async(req, res) => {
    try {
        const count = await prisma.teacher.count()
        res.status(200).json({name: 'teacher', count});
      } catch (err) {
        res.status(400).json({ err: err });
        console.log(err);
      }
})

router.get("/student_count", async(req, res) => {
    try {
        const count = await prisma.student.count()
        res.status(200).json({name: 'student', count});
      } catch (err) {
        res.status(400).json({ err: err });
        console.log(err);
      }
})


router.get("/staff_count", async(req, res) => {
    try {
        const count = await prisma.staff.count()
        res.status(200).json({name: 'staff', count});
      } catch (err) {
        res.status(400).json({ err: err });
        console.log(err);
      }
})


router.get("/count", async(req, res) => {
  try {
      const teacher = await prisma.teacher.count()
      const student = await prisma.student.count()
      const staff = await prisma.staff.count()

      res.status(200).json({teacher, student, staff});
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})




router.get("/class_student_count/:id", async(req, res) => {
    try {const id = parseInt(req.params.id)
        const count = await prisma.student.count({
            where: {
                classId: id
            }
        })
        res.status(200).json({name: `class_student_count of id ${id}`, count});
      } catch (err) {
        res.status(400).json({ err: err });
        console.log(err);
      }
})

router.get("/section_student_count/:id", async(req, res) => {
    try {const id = parseInt(req.params.id)
        const count = await prisma.student.count({
            where: {
                sectionId: id
            }
        })
        res.status(200).json({name: `section_student_count of id ${id}`, count});
      } catch (err) {
        res.status(400).json({ err: err });
        console.log(err);
      }
})




export default router;