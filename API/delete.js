import { Router } from "express";
import jwt from 'jsonwebtoken';
import prisma from "../DB/db.config.js";
const router = Router();

router.delete("/class/:id", async(req, res) => {
    const id = parseInt(req.params.id)
    try {
        const _class = await prisma.class.delete({
          where: {
            id: id
          },
    });
        res.status(200).json(_class);
      } catch (err) {
        res.status(400).json({ err: err });
        console.log(err);
      }
  })

  export default router