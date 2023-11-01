import nodemailer from "nodemailer"
import mailsConfig from "../config/mails";

class Mail {
    constructor(){
        const { host, port, secure, auth } = mailsConfig
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null
        });
    }

    send(mensage){
        return this.transporter.sendMail({
            ...mailsConfig.dafult,
            ...mensage,
        })
    }
}

export default new Mail();


// Serviços para envio de email
//Amazon SES
//Sandgrid


// mailtrap() == envio para desenvolvimento