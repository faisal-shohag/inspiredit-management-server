import nodemailer from 'nodemailer'
import "dotenv/config"
import {htmlToText} from 'nodemailer-html-to-text';

const tp = nodemailer.createTransport({
    host: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}).use('compile', htmlToText());




const mailToStudent = (student) => {

    const mailOptions = {
        from: 'cse1805027brur@gmail.com',
        to: student.email,
        subject: 'Admission successfull.',
        html: `<b>Congratulations ${student.name}</b>, You have successfully admitted as student at InspiredIT. Your #ID: ${student.id_no}.`
    } 

    tp.sendMail(mailOptions, (err, info) => {
        if(err) console.log(err)
        else console.log('Email sent:', info)
    })


}

const mailToTeacher = (teacher) => {

    const mailOptions = {
        from: 'cse1805027brur@gmail.com',
        to: teacher.email,
        subject: `Congratulations to Joine inspiredIT as an ${teacher.designation} `,
        html: `<b>Congratulations ${teacher.name}</b>, You have successfully joined as ${teacher.designation} at InspiredIT. Your #ID: ${teacher.id_no}.`
    } 

    tp.sendMail(mailOptions, (err, info) => {
        if(err) console.log(err)
        else console.log('Email sent:', info)
    })


}

export {mailToStudent, mailToTeacher}
