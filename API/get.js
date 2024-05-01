import { Router } from "express";
import jwt from 'jsonwebtoken';
import prisma from "../DB/db.config.js";
const router = Router();

//all teachers
router.get("/teachers", async(req, res) => {
    try {
        const teacher = await prisma.teacher.findMany({
          include: {
            attendance: true
          },
        });
        res.status(200).json(teacher);
      } catch (err) {
        res.status(400).json({ err: err });
        console.log(err);
      }
})


router.get("/students", async(req, res) => {
  try {
      const students = await prisma.student.findMany({
        include:{
          section: true,
          class: true,
          attendance: true
        }
      });
      res.status(200).json(students);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})


router.get("/sections", async(req, res) => {
  try {
      const section = await prisma.section.findMany({
        include: {
          class: true
        },
      });
      res.status(200).json(section);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})

router.get("/classes", async(req, res) => {
  try {
      const _class = await prisma.class.findMany({
        include: {
          sections: true
        },
      });
      res.status(200).json(_class);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})

//get one class
router.get("/class/:id", async(req, res) => {
  const id = parseInt(req.params.id)
  try {
      const _class = await prisma.class.findUnique({
        where: {
          id: id
        },
        include: {
          sections: {
            include: {
              student: true
            },
          },
          student: true,
          teachers: {
            include: {
              teacher: true
            }
          }
        },
      });
      res.status(200).json(_class);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})


export default router;


