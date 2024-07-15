import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";
const router = Router();
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

const getMonthName = (dateString) => {
  const date = new Date(dateString).toString();
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();
  return {
    month: year + "-" + month,
    name: date.split(" ")[1],
  };
};


router.get('/admin', async(req, res) => {
  try{
    const admin = await prisma.admin.findUnique({
      where: {
        email: 'admin@gmail.com'
      }
    });
    res.status(200).json(admin);
  }catch{
    console.log(err);
    res.status(400).json({ err: err });
  }
  
})

//all teachers
router.get("/teachers", async (req, res) => {
  try {
    const teacher = await prisma.teacher.findMany({
      include: {
        attendance: true,
      },
      orderBy: {
        id_no: "asc",
      },
    });
    res.status(200).json(teacher);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

router.get("/last_teacher", async (req, res) => {
  try {
    const teacher = await prisma.teacher.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 1,
    });
    res.status(200).json(teacher);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});


router.get("/latest_visitors", async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: {
        date: "desc",
      },
      take: 10,
    });
    res.status(200).json(visitors);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

//visitor by date
router.get('/visitors_by_date', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Please provide startDate and endDate' });
  }

  try {
    const visitors = await prisma.visitor.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    const totalVisitors = visitors.length;

    res.json({ totalVisitors, visitors });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching visitors' });
  }
});



// get staff

router.get("/last_staff", async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 1,
    });
    res.status(200).json(staff);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

//all staffs
router.get("/staffs", async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        attendance: true,
      },
      orderBy: {
        id_no: "asc",
      },
    });
    res.status(200).json(staff);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

// Student Pagination
router.get("/students_per_page", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const searchConditions = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { id_no: { contains: search, mode: "insensitive" } },
            { section: { name: { contains: search, mode: "insensitive" } } },
            { class: { name: { contains: search, mode: "insensitive" } } },
            // Add other fields as needed
          ],
        }
      : {};

    const students = await prisma.student.findMany({
      where: searchConditions,
      include: {
        section: true,
        class: true,
        attendance: true,
      },
      orderBy: {
        id_no: "asc",
      },
      skip: search ? 0 : (page - 1) * limit,
      take: parseInt(limit),
    });

    const totalStudents = await prisma.student.count({
      where: searchConditions,
    });

    res.status(200).json({
      students,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
    console.log(err);
  }
});

//all students
router.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        section: true,
        class: true,
        attendance: true,
      },
      orderBy: {
        id_no: "asc",
      },
    });
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

//students by class
router.get("/students/:classId", async (req, res) => {
  const classId = parseInt(req.params.classId);
  try {
    const students = await prisma.student.findMany({
      where: {
        classId: classId,
      },
      orderBy: {
        id_no: "asc",
      },
      include: {
        attendance: true,
        section: true,
      },
    });
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

//last student
router.get("/last_student", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 1,
    });
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

//get student by id_no
router.get("/student/:id", async (req, res) => {
  const id = req.params.id;
  // console.log("ID", req.params.id)
  try {
    let student = await prisma.student.findUnique({
      where: {
        id_no: id,
      },
      include: {
        class: true,
        section: true,
        admissionFee: true,
        regularFee: true,
        attendance: true,
      },
    });
    //console.log(student)
    let regularfees = [];
    let total_regular_fee = 0;
    let subtotal_regular_fee = 0;
    let only_regular_fee = 0;
    for (let i = 0; i < student.regularFee.length; i++) {
      total_regular_fee =
        student.regularFee[i].regular_fee +
        student.regularFee[i].fine +
        student.regularFee[i].transport_fee +
        student.regularFee[i].others_fee +
        student.regularFee[i].books_fee +
        student.regularFee[i].uniform_fee +
        student.regularFee[i].id_card_fee -
        student.regularFee[i].discount_fee;
      only_regular_fee += student.regularFee[i].regular_fee;
      regularfees.push({
        ...student.regularFee[i],
        total: total_regular_fee,
      });
      subtotal_regular_fee += total_regular_fee;
    }

    // admission fee
    let admissionfees = [];
    let total_admission_fee = 0;
    let subtotal_admission_fee = 0;
    for (let i = 0; i < student.admissionFee.length; i++) {
      total_admission_fee =
        student.admissionFee[i].fee +
        student.admissionFee[i].other -
        student.admissionFee[i].discount;
      admissionfees.push({
        ...student.admissionFee[i],
        total: total_admission_fee,
      });
      subtotal_admission_fee += total_admission_fee;
    }

    student["regularFee"] = regularfees;
    student["admissionFee"] = admissionfees;
    student["due"] =
      student.class.fee - (subtotal_admission_fee + only_regular_fee);

    res.status(200).json(student);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

//get teacher by id_no
router.get("/teacher/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let teacher = await prisma.teacher.findUnique({
      where: {
        id_no: id,
      },
      include: {
        salary: true,
        classes: {
          include: {
            class: true,
          },
        },
        attendance: true,
      },
    });
    res.status(200).json(teacher);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

//get staff by id_no
router.get("/staff/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let staff = await prisma.staff.findUnique({
      where: {
        id_no: id,
      },
      include: {
        salary: true,
      },
    });
    res.status(200).json(staff);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

router.get("/sections", async (req, res) => {
  try {
    const section = await prisma.section.findMany({
      include: {
        class: true,
      },
    });
    res.status(200).json(section);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

router.get("/classes", async (req, res) => {
  try {
    const _class = await prisma.class.findMany({
      include: {
        sections: true,
        subject: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json(_class);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

//get one class
router.get("/class/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const _class = await prisma.class.findUnique({
      where: {
        id: id,
      },
      include: {
        subject: true,
        sections: {
          include: {
            student: true,
          },
        },
        student: {
          orderBy: {
            id: "asc",
          },
          include: {
            section: true,
          },
        },
        teachers: {
          include: {
            teacher: true,
          },
        },
      },
    });
    res.status(200).json(_class);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

router.get("/class/attendance/:classId/:date", async (req, res) => {
  const classId = parseInt(req.params.classId);
  const date = new Date(req.params.date);
  console.log(date);
  try {
    const attendance = await prisma.studentAttendance.findMany({
      orderBy: {
        studentId: "asc",
      },
      where: {
        classId: classId,
        date: {
          gte: date,
          lte: date,
        },
      },
      include: {
        student: {
          include: {
            attendance: true,
          },
        },
        class: true,
        section: true,
      },
    });
    res.status(200).json(attendance);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const settings = await prisma.settings.findMany({});
    res.status(200).json(settings);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

router.get("/accounts", async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: {
        date: "desc",
      },
    });
    res.status(200).json(accounts);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

router.get("/accountsByDate", async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);
  try {
    const accounts = await prisma.account.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(accounts);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

router.get("/salaries", async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);

  try {
    const salary = await prisma.salary.findMany({
      where: {
        paid_date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        staff: true,
        teacher: true,
      },
      orderBy: {
        paid_date: "desc",
      },
    });

    res.status(200).json(salary);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

router.get("/fees", async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const regular_fee = await prisma.regularFee.findMany({
      where: {
        collectionDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        collectionDate: "desc",
      },
    });

    const admission_fee = await prisma.admissionFee.findMany({
      where: {
        collectionDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        collectionDate: "desc",
      },
    });

    let reg_fee = [];
    for (let i = 0; i < regular_fee.length; i++) {
      const total =
        regular_fee[i].regular_fee +
        regular_fee[i].others_fee +
        regular_fee[i].id_card_fee -
        regular_fee[i].discount_fee;
      reg_fee.push({ ...regular_fee[i], total });
    }

    let adm_fee = [];
    for (let i = 0; i < admission_fee.length; i++) {
      const total =
        admission_fee[i].fee +
        admission_fee[i].other -
        admission_fee[i].discount;
      adm_fee.push({ ...admission_fee[i], total });
    }

    res.status(200).json({ regular_fee: reg_fee, admission_fee: adm_fee });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

router.get("/transactions", async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    let totalIncome = 0
    let totalExpense = 0
    for(let i=0; i<transactions.length; i++) {
        if(transactions[i].type == 'income') {
          totalIncome += transactions[i].amount
        } else {
          totalExpense += transactions[i].amount
        }
    }

    res.status(200).json({transactions, totalIncome, totalExpense, total: totalIncome - totalExpense});
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

router.get("/transactions_per_page", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        date: "desc",
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalTransactions = await prisma.transactions.count();

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

router.get("/transactions/total", async (req, res) => {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  try {
    const [totalIncome, totalExpense, monthlyIncome, monthlyExpense] =
      await Promise.all([
        prisma.transactions.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            type: "income",
          },
        }),
        prisma.transactions.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            type: "expense",
          },
        }),
        prisma.transactions.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            type: "income",
            date: {
              gte: startOfCurrentMonth,
              lte: endOfCurrentMonth,
            },
          },
        }),
        prisma.transactions.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            type: "expense",
            date: {
              gte: startOfCurrentMonth,
              lte: endOfCurrentMonth,
            },
          },
        }),
      ]);

    const totalIncomeAmount = totalIncome._sum.amount || 0;
    const totalExpenseAmount = totalExpense._sum.amount || 0;
    const netProfit = totalIncomeAmount - totalExpenseAmount;

    const monthlyIncomeAmount = monthlyIncome._sum.amount || 0;
    const monthlyExpenseAmount = monthlyExpense._sum.amount || 0;
    const netProfitThisMonth = monthlyIncomeAmount - monthlyExpenseAmount;

    res.json({
      totalIncome: totalIncomeAmount,
      totalExpense: totalExpenseAmount,
      netProfit,
      monthlyIncome: monthlyIncomeAmount,
      monthlyExpense: monthlyExpenseAmount,
      netProfitThisMonth,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error calculating totals", message: error });
  }
});

router.get("/transactions/with-month", async (req, res) => {
  try {
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        date: "desc",
      },
    });

    const monthlyNetProfits = transactions.reduce((acc, transaction) => {
      const { month, name } = getMonthName(transaction.date);

      if (!acc[month]) {
        acc[month] = {
          name,
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        acc[month].income += transaction.amount;
      } else if (transaction.type === "expense") {
        acc[month].expense += transaction.amount;
      }

      return acc;
    }, {});

    const result = Object.values(monthlyNetProfits).map((monthData) => ({
      month: monthData.name,
      netProfit: monthData.income - monthData.expense,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});


//issues
router.get("/issues", async (req, res) => {
  try {
    const issues = await prisma.issues.findMany({
      orderBy: {
        date: "desc",
      },
    });
    res.status(200).json(issues);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
});

router.get("/image2/:folder/:file", (req, res) => {
  const folder = req.params.folder;
  const file = req.params.file;

  let dirname = __dirname.split("\\");
  dirname.pop();
  const filepath = path.join(dirname.join("\\"), `resources/${folder}`, file);
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err);
      return res.status(404).send({ err: "File not found." });
    }
    res.sendFile(filepath);
  });
});

router.get("/image/:folder/:file", (req, res) => {
  const folder = req.params.folder;
  const fileName = req.params.file;
  let dirname = __dirname.split("\\");
  dirname.pop();

  const resourcesDir = path.join(dirname.join("\\"), "resources", folder);

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
      } else if (file.split(".")[0] === fileName) {
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
    res.status(404).send({ error: "Image not found." });
  }
});

export default router;
