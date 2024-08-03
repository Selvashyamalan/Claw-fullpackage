const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())


//let todos = [];

mongoose.connect('mongodb://localhost:27017/claw-app')
.then(() => {
    console.log('Database Connected')
})
.catch((err) => {
    console.log(err)
})

const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String,
    status: String
})

const todoModel = mongoose.model('Todo', todoSchema);


app.post('/todos',async (req, res) => {
    const {title, description, status}= req.body
    try{  
        const newTodo = new todoModel({title, description, status})
        await newTodo.save();
        res.status(201).json(newTodo); 
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

app.get('/todos', async (req, res) => {
    try{
        const todos = await todoModel.find();
        res.json(todos);
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.put('/todos/:id',async (req, res) => {
    try{
        const {title, description, status} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description, status},
            {new: true}
        )

        if (!updatedTodo){
                return res.status(404).json({message: "Todo not found"})
            }
            res.json(updatedTodo)
        }catch(error){
            console.log(error)
            res.status(500).json({message: error.message})
        }
})

app.delete('/todos/:id', async (req, res) => {
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

const port = 8000;

app.listen(port, () => {
    console.log("Server listening to port" + port);
})