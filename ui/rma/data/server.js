const express = require('express')
const app = express()
const port = 3000

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.get('/', (req, res) => {
    res.send('Bismillah React Material UI Application Framework (RMA)')
})

app.all('/api/v1/authentication/login', (req, res, next) => {
    res.json(
        {
            "status": "success",
            "data": {
                "login": {
                    "accessToken": "accessToken",
                    "refreshToken": "refreshToken"
                },
                "user": {
                    "firstName" : "Touhid",
                    "lastName" : "Mia",
                    "id" : 1,
                }
            }
        }
    )
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})