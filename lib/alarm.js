
var nodemailer = require("nodemailer");
var arduino = require("duino");

var Alarm = function (option) {
    this.pin = option.pin;

    // create reusable transport method (opens pool of SMTP connections)
    this.smtpTransport = nodemailer.createTransport("SMTP",{
        service: option.service,
        auth: {
            user: option.email,
            pass: option.password
        }
    });

    // setup e-mail data with unicode symbols
    this.mailOptions = {
        from: "email-alarm <" + option.email + ">", // sender address
        to: option.email, // list of receivers
        subject: "Intruder!"
    }
}

Alarm.prototype = {
    start: function () {
        var board = new arduino.Board({
            debug: false
        });

        var pir = new arduino.PIR({
            board: board,
            pin: this.pin
        });

        var self = this;

        pir.on('calibrated', function(err, date) {

            this.on('motionstart', function(err, date) {

                self.mailOptions.text = "Intruder detected at " + date.toString();
                self.smtpTransport.sendMail(self.mailOptions, function(error, response) {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
                });
            });

            this.on('motionend', function(err, date) {
            });
        });
    }
}

module.exports = Alarm;
