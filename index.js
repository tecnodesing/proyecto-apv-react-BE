import express from "express";

const app = express();

app.use("/", (req, res) =>{
    res.send("Welcome")
})

app.listen(4000, () =>{
    console.log('servidor ok')
});