import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";
import fs from 'fs'
import path from 'path';
const router = Router();

const deleteImageFile = (fileNameWithoutExtension, dir) => {
  const directoryPath = `/${dir}/`;
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    const filesToDelete = files.filter((filename) =>
      filename.startsWith(fileNameWithoutExtension)
    );
    filesToDelete.forEach((filename) => {
      const filePath = path.join(directoryPath, filename);
      fs.unlinkSync(filePath);
      console.log("Deleted file:", filePath);
    });
  });
};

router.delete("/class/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const _class = await prisma.class.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(_class);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

router.delete("/student/:id", async (req, res) => {
  const id = req.params.id
  try {
    const student = await prisma.student.delete({
      where: {
        id_no: id,
      },
    });
    deleteImageFile(student.id_no, 'students')
    res.status(200).json(student);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
   
  }
});

router.delete("/teacher/:id", async (req, res) => {
  const id = req.params.id
  try {
    const teacher = await prisma.teacher.delete({
      where: {
        id_no: id,
      },
    });
    deleteImageFile(teacher.id_no, 'teachers')
    res.status(200).json(teacher);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
   
  }
});

router.delete("/staff/:id", async (req, res) => {
  const id = req.params.id
  try {
    const staff = await prisma.staff.delete({
      where: {
        id_no: id,
      },
    });
    deleteImageFile(staff.id_no, 'staff')
    res.status(200).json(staff);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
   
  }
});

router.delete("/accounts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const account = await prisma.account.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(account);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
   
  }
});

// delete salary
router.delete("/salary/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const account = await prisma.salary.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(account);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
   
  }
});

//visitor
router.delete("/visitor/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const visitor = await prisma.visitor.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(visitor);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
   
  }
});


export default router;
