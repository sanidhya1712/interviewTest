const http = require('http');
const express = require('express');
const mySql = require('mysql');

let app = express();
let server = http.createServer(app);

app.post('/scheduledMeeting', function (req, res) {
    let dateTime = req.body.input.split('');
    let date = dateTime[0];
    let time = dateTime[1].split(' - ');
    let startTime = time[0];
    let endTime = time[1];
    const connection = mySql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'interviewTest'
    })
    connection.execute(`INSERT INTO meeting ("date","startTime","endTime") VALUES ('${date}','${startTime}','${endTime}')`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(200).json({ "message": "Successfully inserted" });
        }
    })
})

app.get('/getAllSlotsByDay', function (req, res) {
    // let dateTime = req.body.input.split('');
    // let date = dateTime[0];
    // let time = dateTime[1].split(' - ');
    let slot = [];
    let startTime = new Date('9:00');
    let endTime = new Date('18:00');
    const connection = mySql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'interviewTest'
    })
    connection.execute(`SELECT * from meeting where date = ${req.query.date} ORDER BY startTime`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            for (i = 0; i < result.length(); i++) {
                if (i === 0) {
                    if (result[i].startTime !== '9:00') {
                        slot.push({ 'startTime': '9:00', 'endTime': result[i].startTime })
                    }
                } else if (i === result.length() - 1) {
                    if (result[i].endTime !== '18:00') {
                        slot.push({ 'startTime': result[i].endTime, 'endTime': '18:00' })
                        res.status(201).json({ "message": slots });
                    } else {
                        res.status(201).json({ "message": slots });
                    }
                } else {
                    if (result[i - 1].endTime !== result[i].startTime) {
                        slot.push({ 'startTime': result[i - 1].endTime, 'endTime': result[i].startTime })
                    }
                }
            }
        }
    })
})

app.put('/resScheduledMeeting', function (req, res) {
    let dateTime = req.body.input.split('to');
    let originalDateTime = dateTime[0];
    let originalDate = originalDateTime.split(' ');
    let originalTime = originalDateTime.split(' ');
    let newDate = dateTime[1];
    let time = dateTime[1].split(' - ');
    let startTime = time[0];
    let endTime = time[1];
    const connection = mySql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'interviewTest'
    })
    connection.execute(`SELECT * from meeting where date = ${originalDate} ORDER BY startTime`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(200).json({ "message": "Successfully inserted" });
        }
    })
})

server.listen(8090, function () {
    console.log("listening on 8090");
})