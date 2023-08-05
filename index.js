import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import fs from "fs";
const dataRoute = './users.json'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`/pub`, express.static(path.join(__dirname, `client`, `public`)));

app.get(`/public/script.js`,(req, res) => {
    res.sendFile(path.join(__dirname, `client`, `public`, `client`));
});

app.get(`/`, (req,res) => {
    res.sendFile(path.join(__dirname, `client`, `index.html`));
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
app.patch('/users/:userId', (req, res) => {
    //TELL NOAH: `.users.json` instead of dataRoute
    fs.readFile(`./users.json`, 'utf8', (err, data) => {
      if (err) throw err;
  
      const {users} = JSON.parse(data);
      const userId = parseInt(req.params.userId);
      const user = users.find(user => user.id === userId);
  
      if (user) {
        user.name = req.body.name;
  
        fs.writeFile(`./users.json`, JSON.stringify({users}), (err) => {
          if (err) throw err;
        });
        
        res.send({state: "DONE"});
      } else {
        res.status(404).send({state: 'User not found'});
      }
    });
  });

  app.put('/users/:userId', (req, res) => {
    fs.readFile(`./users.json`, 'utf8', (err, data) => {
      if (err) throw err;
  
      const { users } = JSON.parse(data);
      const userId = parseInt(req.params.userId);
      const user = users.find((user) => user.id === userId);
  
      if (user) {
        user.name = req.body.name;
        user.id = req.body.id;
  
        fs.writeFile(`./users.json`, JSON.stringify({ users }), (err) => {
          if (err) throw err;
        });
  
        res.send({ state: "DONE" });
      } else {
        res.status(404).send({ state: 'User not found' });
      }
    });
  });
  
  app.delete('/users/:userId', (req, res) => {
    fs.readFile(dataRoute, 'utf8', (err, data) => {
      if (err) throw err;
  
      const { users } = JSON.parse(data);
      const userId = parseInt(req.params.userId);
      const user = users.find(user => user.id === userId);
  
      if (user) {
  
        fs.writeFile(dataRoute, JSON.stringify({ users: users.filter((x) => x !== user) }), (err) => {
          if (err) throw err;
        });
  
        res.send({ state: "DONE" });
      } else {
        res.status(404).send({ state: 'User not found' });
      }
    });
  });

  app.post('/users/:userId', (req, res) => {
    fs.readFile(dataRoute, 'utf8', (err, data) => {
      if (err) throw err;
  
      const {users} = JSON.parse(data);
      const lastUser = users[users.length - 1];
      const newUser = {
        name: req.body.name,
        id: lastUser.id + 1
      }
      users.push(newUser);
  
      fs.writeFile(dataRoute, JSON.stringify({users}), (err) => {
        if (err) throw err;
      });
  
      res.send({state: "DONE"});
    });
  });

app.get('/edit', (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'))
})





app.listen(3000, () => {
    console.log( "open this link in your browser: http://127.0.0.1:3000")
});

//app.listen(3000);