import multer from "multer";
import path from 'path';


const Storage = (dir) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,  `uploads/${dir}/`)
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname))
        }
    })
    return storage
}



const studentUploader = multer({storage: Storage('students')})
const teacherUploader = multer({storage: Storage('teachers')})
const staffUploader = multer({storage: Storage('staffs')})



export {studentUploader, teacherUploader, staffUploader}