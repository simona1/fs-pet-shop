const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
const petsPath = path.join(__dirname, 'pets.json');

app.get('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      res.sendStatus(404);
      return;
    }
    res.set('Content-Type', 'application/json');
    res.send(data);
  });
});

app.get('/pets/:id', function(req, res){
  const index = parseInt(req.params.id);
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      res.sendStatus(404);
      return;
    }
    res.set('Content-Type', 'application/json');
    const pets = JSON.parse(data);
    if (index < 0 || index >= pets.length) {
      res.sendStatus(404);
      return;
    }
    res.send(pets[index]);
  });
});

app.post('/pets', function(req, res) {
  const petInfo = req.body;
  fs.readFile(petsPath, 'utf8', function(err, data){
    if (err) {
      res.sendStatus(404);
      return;
    }
    res.set('Content-Type', 'application/json');
    const pets = JSON.parse(data);
    if (!petInfo.age || !petInfo.kind || !petInfo.name) {
      res.sendStatus(400);
      return;
    }
    const pet = {
      age: petInfo.age,
      kind: petInfo.kind,
      name: petInfo.name,
    }
    pets.push(pet);
    const petsJSON = JSON.stringify(pets);
    fs.writeFile('pets.json', petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
    });
    res.set('Content-Type', 'application/json');
    res.send(pets[pets.length - 1]);
  });
});

app.patch('/pets/:id', function(req, res) {
  const index = parseInt(req.params.id);
  const petInfo = req.body;

  fs.readFile(petsPath, 'utf8', function(err, data){
    if (err) {
      res.sendStatus(404);
      return;
    }
    res.set('Content-Type', 'application/json');
    const pets = JSON.parse(data);

    let pet = Object.assign({}, pets[index], petInfo);
    pets[index] = pet;

    const petsJSON = JSON.stringify(pets);
    fs.writeFile('pets.json', petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
    });
    res.set('Content-Type', 'application/json');
    res.send(pets[index]);
  });
});

app.delete('/pets/:id', function(req, res) {
  const index = parseInt(req.params.id);

  fs.readFile(petsPath, 'utf8', function(err, data){
    if (err) {
      res.sendStatus(404);
      return;
    }
    res.set('Content-Type', 'application/json');
    const pets = JSON.parse(data);
    const deleted = pets.splice(index, 1);

    const petsJSON = JSON.stringify(pets);
    fs.writeFile('pets.json', petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
    });
    res.set('Content-Type', 'application/json');
    res.send(deleted[0]);
  });
});

app.get('*', function(req, res) {
  res.sendStatus(404);
});

app.listen(8000, () => {
  console.log('Now listening on port 8000');
});

module.exports = app;
