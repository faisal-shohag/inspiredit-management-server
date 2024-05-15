import { Router } from "express";
import jwt from 'jsonwebtoken';
import prisma from "../DB/db.config.js";
const router = Router();
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); 

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

router.get("/last_teacher", async(req, res) => {
  try {
      const teacher = await prisma.teacher.findMany({
        orderBy: {
          created_at: 'desc'
        },
        take: 1
      });
      res.status(200).json(teacher);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})

// get staff

router.get("/last_staff", async(req, res) => {
  try {
      const staff = await prisma.staff.findMany({
        orderBy: {
          created_at: 'desc'
        },
        take: 1
      });
      res.status(200).json(staff);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})

//all staffs
router.get("/staffs", async(req, res) => {
  try {
      const staff = await prisma.staff.findMany({
        include: {
          attendance: true
        },
      });
      res.status(200).json(staff);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})


//all students
router.get("/students", async(req, res) => {
  try {
      const students = await prisma.student.findMany({
        include:{
          section: true,
          class: true,
          attendance: true
        },
        orderBy: {
          id_no: 'asc'
        },
      });
      res.status(200).json(students);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})

//students by class
router.get("/students/:classId", async(req, res) => {
 const classId = parseInt(req.params.classId)
  try {
      const students = await prisma.student.findMany({
        where: {
          classId: classId,
        },
        orderBy: {
          id_no: 'asc'
        },
        include: {
          attendance: true,
          section: true
        },
        
      });
      res.status(200).json(students);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})

//last student
router.get("/last_student", async(req, res) => {
  try {
      const students = await prisma.student.findMany({
        orderBy: {
          created_at: 'desc'
        },
        take: 1
      });
      res.status(200).json(students);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})


//get student by id_no
router.get("/student/:id", async(req, res) => {
  const id = parseInt(req.params.id)
  console.log("ID", req.params.id)
  try {
      let student = await prisma.student.findUnique({
        where: {
          id_no: id
        },
        include: {
          class: true,
          section: true,
          admissionFee: true,
          regularFee: true,
          attendance: true,
        }
      });
      res.status(200).json(students);
      
      let regularfees = []
      for(let i=0; i<student.regularFee.length; i++) {
        regularfees.push({
          ...student.regularFee[i],
          total: (student.regularFee[i].regular_fee + student.regularFee[i].fine + student.regularFee[i].transport_fee + student.regularFee[i].others_fee + student.regularFee[i].books_fee + student.regularFee[i].uniform_fee  + student.regularFee[i].id_card_fee) - student.regularFee[i].discount_fee
        })
      }
      student["regularFee"] = regularfees
      res.status(200).json(student);
    } catch (err) {
      console.log(err);
      res.status(400).json({ err: err });
      
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
          sections: true,
          subject: true,
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
          subject: true,
          sections: {
            include: {
              student: true
            },
          },
          student: {
            orderBy: {
              id: 'asc'
            },
            include: {
              section: true
            }
          },
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

router.get("/class/attendance/:classId/:date", async(req, res) => {
  const classId = parseInt(req.params.classId)
  const date = new Date(req.params.date)
  console.log(date)
  try {
      const attendance = await prisma.studentAttendance.findMany({
        orderBy: {
          studentId: 'asc'
        },
        where: {
          classId: classId,
          date: {
            gte: date,
            lte: date
          },
        },
        include: {
          student: {
            include: {
              attendance: true
            }
          },
          class: true,
          section: true,
          
        }
      });
      res.status(200).json(attendance);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})



router.get("/settings", async(req, res) => {
  try {
      const settings = await prisma.settings.findMany({
      });
      res.status(200).json(settings);
    } catch (err) {
      res.status(400).json({ err: err });
      console.log(err);
    }
})


router.get('/image2/:folder/:file', (req, res) => {
  const folder = req.params.folder
  const file = req.params.file

  let dirname = __dirname.split('\\')
  dirname.pop()
  const filepath = path.join(dirname.join('\\'), `resources/${folder}`, file)
   fs.access(filepath, fs.constants.F_OK, (err) => {
    if(err) {
      console.log(err)
      return res.status(404).send({err: 'File not found.'});
    }
    res.sendFile(filepath);
   })
})

router.get('/image/:folder/:file', (req, res) => {
  const folder = req.params.folder;
  const fileName = req.params.file;
  let dirname = __dirname.split('\\')
  dirname.pop()

  const resourcesDir = path.join(dirname.join('\\'), 'resources', folder);

  const searchFile = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const found = searchFile(filePath);
        if (found) {
          return found;
        }
      } else if (file.split('.')[0] === fileName) {
        return filePath;
      }
    }
    return null;
  };

  // Search for the file
  const filePath = searchFile(resourcesDir);

  // Respond with the file if found
  if (filePath) {
    res.sendFile(filePath);
  } else {
    res.status(404).send({ error: 'Image not found.' });
  }
});




export default router;

