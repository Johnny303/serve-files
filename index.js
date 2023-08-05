import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import fs from "fs";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();

app.use(`/pub`, express.static(path.join(_dirname, `client`, `public`)));

app.get(`/public/script.js`,(req, res) => {
    res.sendFile(path.join(_dirname, `client`, `public`, `client`));
});

app.get(`/`, (req,res) => {
    res.sendFile(path.join(_dirname, `client`, `index.html`));
});

app.get(`/users`, (req, res) => {
    fs.readFile(`./users.json`, `utf-8`, (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data).users;
        res.send(users)
    });
});

app.get(`/users/:userId`, (req, res) => {
    fs.readFile(`./users.json`, `utf-8`, (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data).users;
        const userId = parseInt(req.params.userId);
        const user = users.find(user => user.id === userId);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({state: `User not found`});
        }
    });
});





app.listen(3000, () => {
    console.log( "open this link in your browser: http://127.0.0.1:3000")
});

//app.listen(3000);