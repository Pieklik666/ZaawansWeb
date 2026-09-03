const express = require("express");
const app = express()
const PORT = 3000

let requestCount = 0;

app.use((req,res,next)=>{
    req.timestamp = Date()
	next()
})
.use((req, res, next)=>{
    requestCount++
    console.log(req.originalUrl)
    next()
})
.use((req, res, next)=>{
    res.setHeader("X-Powered-By", "MyApp")
    next()
})
.get('/',(req,res)=>{
    res.send('app')
    console.log(req.timestamp)
    console.log(requestCount)
})
.listen(PORT);

