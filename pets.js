#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const CMDS = {
  read: readPromise,
  create: createPromise,
  update: updatePromise,
  destroy: destroyPromise,
};

const petsPath = path.join(__dirname, 'pets.json');

const ARGS = process.argv.slice(0);
const NODE = path.basename(ARGS.shift());
const FILE = path.basename(ARGS.shift());

function main() {
  const cmd = ARGS.shift();
  if (!CMDS.hasOwnProperty(cmd)) {
    console.error(`Usage: ${NODE} ${FILE} [${Object.keys(CMDS).join(' | ')}]`);
    process.exit(1);
  }

  CMDS[cmd].apply(null, ARGS).catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

function writeFilePromise(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), function(writeErr) {
      writeErr ? reject(writeErr) : resolve();
    });
  });
}

function readPromise(index) {
  return readFilePromise(petsPath).then(pets => {
    if (index == null) {
      console.log(pets);
      return pets;
    }
    const pet = pets[parseInt(index)];
    if (pet) {
      console.log(pet);
      return pet;
    }
    throw new Error(`Usage: ${NODE} ${FILE} read INDEX`);
  });
}

function createPromise(age, kind, name) {
  if (age == null || kind == null || name == null) {
    return Promise.reject(
      new Error(`Usage: ${NODE} ${FILE} create AGE KIND NAME`)
    );
  }
  return readFilePromise(petsPath).then(pets => {
    const pet = {
      age: parseInt(age),
      kind: kind,
      name: name,
    };
    pets.push(pet);

    return writeFilePromise(petsPath, pets).then(() => {
      console.log(pet);
    });
  });
}

function updatePromise(index, age, kind, name) {
  const usage = `Usage: ${NODE} ${FILE} update INDEX AGE KIND NAME`;

  if (index == null || age == null || kind == null || name == null) {
    return Promise.reject(new Error(usage));
  }

  return readFilePromise(petsPath).then(
    pets => {
      const pet = pets[parseInt(index)];
      if (!pet) {
        throw new Error(usage);
      }

      pet.age = parseInt(age);
      pet.kind = kind;
      pet.name = name;

      return writeFilePromise(petsPath, pets).then(() => {
        console.log(pet);
      });
    }
  );
}

function destroyPromise(index) {
  const usage = `Usage: ${NODE} ${FILE} destroy INDEX`;

  if (index == null) {
    return Promise.reject(new Error(usage));
  }

  return readFilePromise(petsPath).then(
    pets => {
      index = parseInt(index);
      const pet = pets[index];
      if (!pet) {
        throw new Error(usage);
      }
      pets = pets.filter((pet, i) => i !== index);

      return writeFilePromise(petsPath, pets).then(() => {
        console.log(pet);
      });
    }
  );
}

main();
