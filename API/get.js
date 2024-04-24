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


export default router;


