import nodemailer from 'nodemailer'
import smtp from 'nodemailer-smtp-transport'
import mailView from '../mailtemplate.js'

const contactAdmin = async(req,res)=> {

    try{
        const {email, subject,name,message} = req.params
    const auth = {
        host: 'in.mailjet.com', 
        port: 2525,
        auth: {
          user: process.env.MAILJET_API_KEY,
          pass: process.env.MAILJET_API_SECRET
        },
      };

      const transporter = await nodemailer.createTransport(smtp(auth))
   
      const options ={
        to:'angelmalachi5@gmail.com',
        from:'angelmalachi5@gmail.com',
        subject:subject,
        text:`message from: ${name} \n email: ${email} \n subject:${subject} \n message:${message}`,
        // html:mailView(email,name,message,subject)
      }

      //send mail
      const sendMail = await transporter.sendMail(options)

      if(!sendMail){
        throw new Error('Something went wrong')
      }

     res.status(200).json({
        status:'success',
        contact:'Thank you for mailing us. Your mail will be treated approprietly'
     })
    }catch(err){
      console.log(err.message)
      res.status(400).json({
        status:'error',
        message:err.message
      })
    }
}


export {
    contactAdmin
}