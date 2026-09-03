import express from "express"

const app =express()

app.use((req,res,next)=>{
    console.log(req.method)
    console.log(req.originalUrl)
	// MW: brak next()    
}

).listen(3000,console.log("Działa"))