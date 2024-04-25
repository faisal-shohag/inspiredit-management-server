// import prisma from "../db/db.config.js";
import bcrypt from 'bcrypt';
import prisma from "../DB/db.config.js";
//check admin on database
const find_admin = async(email, password) => {
    const admin = await prisma.admin.findUnique({
        where: {email}
    })

    if (admin) {
       // const match = await bcrypt.compare(password, admin.password);
        if(password == admin.password) return admin
        throw Error('Password is incorrect!')
    }
   throw Error('Email does not exist!')
}

const find_admin_only_with_id = async (id) => {
    const admin = await prisma.admin.findUnique({
        where: {id: id}
    })
    if(admin) return admin
    return Error('Admin does not exist!')
}

export { find_admin, find_admin_only_with_id }