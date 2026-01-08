import express, { urlencoded } from 'express'

const app = express();
const port = 4000;

app.use((req,res,next)=>{
    console.log(req.originalUrl)
    next()
})


app.get('/',(req,res)=>{
    res.send('strona główna')
})
.get('/test',(req,res)=>{
    res.send('test')
})

app.listen(port,()=>{
    console.log('uruchomiono')
})