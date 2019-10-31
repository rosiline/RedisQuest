const inquirer = require('inquirer');
const redis = require('redis');
const { welcome, getExistingQuests, quest } = require('./questions');

const client = redis.createClient({
  host: process.env.REDIS_HOST
  }); //connect to redis server from docker environment variable

function runApp() {
  inquirer
    .prompt(welcome)
    .then(({ welcome }) => {
      if (welcome === 'old') {
        return Promise.all([
          welcome,
          inquirer.prompt(getExistingQuests(client)),
        ]);
      }
      if (welcome === 'new') {
        return Promise.all([welcome, inquirer.prompt(quest)]);
      }
      if (welcome === 'flush') {
        return Promise.all([
          welcome,
          new Promise((res, rej) => {
            client.flushdb(res);
          }),
        ]);
      }
      if (welcome === 'leave') {
        console.log('all done!');
        process.exit();
      }
    })
    .then(([welcome, next]) => {
      return new Promise((res, rej) => {
        if (welcome === 'new') {
          const { name, quest, colour } = next;
          console.log('Thanks for your submission!');
          client.set(
            name,
            `${name}'s quest is to ${quest} (and their favourite colour is ${colour})`,
            res,
          );
        } else if (welcome === 'old') {
          const { user } = next;
          if (user === 'back') {
            res();
          } else {
            client.get(user, (err, data) => {
              if (err) rej();
              else {
                console.log(data);
                res();
              }
            });
          }
        } else res();
      });
    })
    .then(runApp)
    .catch(() => {
      process.exit();
    });
}

client.on('connect', function() {
  runApp();
});

client.on('error', function(err) {
  console.log('Something went wrong ' + err);
});
