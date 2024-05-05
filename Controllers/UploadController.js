import multer from "multer";
import path from 'path';
import fs from 'fs';


// const Storage = (dir) => {
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null,  `resources/${dir}/`)
//         },
//         filename: (req, file, cb) => {
//             cb(null, file.originalname)
//         }
//     })
//     return storage
// }

const Storage = (dir) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `resources/${dir}/`);
        },
        filename: (req, file, cb) => {
            const fileNameWithoutExtension = file.originalname.replace(/\.[^/.]+$/, "");
            const directoryPath = `resources/${dir}/`;
            
            // Get a list of files in the destination directory
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    // Handle error
                    console.error("Error reading directory:", err);
                    cb(err);
                    return;
                }

                // Filter files that match the same name (without extension) and delete them
                const filesToDelete = files.filter(filename => filename.startsWith(fileNameWithoutExtension));
                filesToDelete.forEach(filename => {
                    const filePath = path.join(directoryPath, filename);
                    fs.unlinkSync(filePath);
                    console.log("Deleted file:", filePath);
                });

                console.log("Saving file:", file.originalname);
                cb(null, file.originalname);
            });
        }
    });
    return storage;
};




const studentUploader = multer({storage: Storage('students')})
const teacherUploader = multer({storage: Storage('teachers')})
const staffUploader = multer({storage: Storage('staffs')})
const logoUploader = multer({storage: Storage('inst')})



export {studentUploader, teacherUploader, staffUploader, logoUploader}