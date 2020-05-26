import * as nodemailer from 'nodemailer'
import * as dbMngr from '../Database/DatabaseManager'
import { mailCredentials } from '../CREDENTIALS'
import { Logger } from '../Debug/LoggerService';
import { ErrorTemplate } from '../Errors/Errors';

const logger = new Logger("mail");

function sendMail(subject: string, content: string) {

    const smtpTransport = nodemailer.createTransport(mailCredentials)

    const mail = {
        from: '"Support" <csgo.highlights.viewer@gmail.com>',
        to: "csgo.highlights.viewer@gmail.com",
        subject,
        html: content
    }

    smtpTransport.sendMail(mail, (error) => {
        if(error){
            logger.debug("Error when sending the email")
            logger.debug(error);
        }else{
            logger.debug("A report mail was sent")
        }
        smtpTransport.close();
    });
}

export async function mailError(matchId: number, error: ErrorTemplate) {
    const subject = "Match " + matchId + " issue."

    const date = new Date(await dbMngr.findMatchDate(matchId)).toDateString();
    const content = "<b>Match " + matchId + " issue :</b> <br> Issue: " + error.message + "<br><br>" + "Date: " + date;

    sendMail(subject, content);
}
