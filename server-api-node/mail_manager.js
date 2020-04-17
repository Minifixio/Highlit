var nodemailer = require('nodemailer');
var credentials = require('./credentials.js');
var debugManager = require("./debug_manager.js");
var dbManager = require("./database_manager.js");
const logger = new debugManager.loggerService("mail");

function sendMail(subject, content) {

    var smtpTransport = nodemailer.createTransport(credentials.mail_credentials)
    
    var mail = {
        from: '"Support" <csgo.highlights.viewer@gmail.com>',
        to: "csgo.highlights.viewer@gmail.com",
        subject: subject,
        html: content
    }

    smtpTransport.sendMail(mail, function(error){
        if(error){
            logger.debug("Error when sending the email")
            logger.debug(error);
        }else{
            logger.debug("A report mail was sent")
        }
        smtpTransport.close();
    });
}

exports.mailError = async function mailError(matchId, error) {
    let subject = "Match " + matchId + " issue."

    let date = new Date(await dbManager.findMatchDate(matchId)).toDateString();
    let content = "<b>Match " + matchId + " issue :</b> <br> Issue: " + error + "<br><br>" + "Date: " + date;

    sendMail(subject, content);
}
