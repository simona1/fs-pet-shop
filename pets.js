#!/usr/bin/env node

'use strict';

const fs = require('fs');

const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];
const option = process.argv[3];
let args = process.argv;

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    const pets = JSON.parse(data);
    const index = parseInt(option);
    if (isNaN(index)) {
      console.log(pets);
    } else if (index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} read INDEX`);
      process.exit(1);
    } else {
      console.log(pets[index]);
    }
  });
} else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    } else if (args.length <= 5) {
      console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
      process.exit(1);
    }
    const pets = JSON.parse(data);
    const pet = {};
    const age = parseInt(args[3]);
    pet.age = age;
    pet.kind = args[4];
    pet.name = args[5];

    pets.push(pet);
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pet);
    });
  });
} else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    } else if (args.length <= 6) {
      console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
      process.exit(1);
    }
    const pets = JSON.parse(data);
    const index = parseInt(args[3]);
    const age = parseInt(args[4]);
    const kind = args[5];
    const name = args[6];
    const newPet = pets[index];
    newPet.age = age;
    newPet.kind = kind;
    newPet.name = name;
    pets[index] = newPet;
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(newPet);
    });
  });
} else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    if (args.length === 3) {
      console.error(`Usage: ${node} ${file} destroy INDEX`);
      process.exit(1);
    }
    const pets = JSON.parse(data);
    const index = parseInt(args[3]);
    const res = pets.splice(index, 1)[0];

    const petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(res);
    });
  });
} else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
