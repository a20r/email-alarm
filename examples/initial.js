
eal = require("../");

alarm = new eal.Alarm({
    email: "example@example.com",
    password: "password",
    service: "ExampleService",
    pin: 7
});

alarm.start();

