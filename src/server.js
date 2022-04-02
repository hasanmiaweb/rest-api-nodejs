const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const shortid = require('shortid')
const app = express()
const fs = require('fs/promises')
const path = require('path');
const dbLocation = path.resolve('src', 'data.json');
app.use(cors())
app.use(morgan('dev'));
app.use(express.json());

app.post('/', async (req, res) => {
    const player = {
        ...req.body,
        id: shortid.generate()
    };
    const data = await fs.readFile(dbLocation)
    const players = JSON.parse(data)
    players.push(player)
    await fs.writeFile(dbLocation, JSON.stringify(players));
    res.status(201).json(`Message:created Success`)
});

app.get('/', async (req, res) => {
    const data = await fs.readFile(dbLocation);
    const players = JSON.parse(data);
    res.status(201).json(players)
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const data = await fs.readFile(dbLocation);
    const players = JSON.parse(data);
    const player = players.find((item) => item.id === id)
    if (!player) {
        return res.status(404).json({message: "player Not found"})
    }
    res.status(200).json(player)
});

app.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const data = await fs.readFile(dbLocation);
    const players = JSON.parse(data);
    const player = players.find((item) => item.id === id)
    if (!player) {
        return res.status(404).json({message: "player Not found"})
    }
   player.name =req.body.name || player.name
   player.age =req.body.age || player.age
   player.work =req.body.work || player.work
    await fs.writeFile(dbLocation, JSON.stringify(players));
    res.status(201).json(`Update Success`)
});

app.delete('/:id',async (req, res) => {
    const id = req.params.id;
    const data = await fs.readFile(dbLocation);
    const players = JSON.parse(data);
    const player = players.find((item) => item.id === id)
    if (!player) {
        return res.status(404).json({message: "player Not found"})
    }
    const newPlayer = players.filter((item) => item.id !== id)
    await fs.writeFile(dbLocation, JSON.stringify(newPlayer));
    res.status(201).json(`Delete Success`)
});



app.get('/health', (_req, res) => {
    res.status(200).json( {status: 'OK'})
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server start ${port} `)
})