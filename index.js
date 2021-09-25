const express = require('express')
const fs = require("fs");
const parse = require('csv-parse/lib/sync')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/posts', (req, res) => {
  res.contentType = "text/html"
  const formText = `
    <div>
      <form action="/posts" method="post">
        <div>
          <label>Name: </label>
          <input type="text" name="name">
        </div>
        <div>
          <label>内容: </label>
          <input type="text" name="post">
        </div>
        
        
        <input type="submit" value="投稿">
      </form>
    </div>
  \n
  `

  const posts = parse(fs.readFileSync("./posts.csv"),{ columns: true})
  const texts = posts.map((elem,index)=> (`<p>${elem.Name} : ${elem.Content}</p>`))
  res.send(formText + texts.join("\n"))
})


app.get("/posts/user/:userName",(req,res)=>{
  const posts = parse(fs.readFileSync("./posts.csv"),{ columns: true})
  const texts = posts
    .filter(elem=> elem.name === req.params.userName)
    .map((elem,index)=> (`<p>${elem.Name} : ${elem.Content}</p>`))
    res.send(texts.join("\n"))
})

app.post("/posts",(req,res)=>{
  fs.appendFileSync("posts.csv",req.body.name+",")
  fs.appendFileSync("posts.csv",req.body.post+"\n")
  res.redirect("/posts")
})


app.get('/search', (req, res) => {
  res.send('Hello World search!')
})



app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000}`)
})