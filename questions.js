exports.welcome = [
  {
    type: 'list',
    name: 'welcome',
    message:
      "Hello, would you like to add your own quest or see other people's?",
    choices: [
      { name: 'See the quests!', value: 'old' },
      { name: 'Start my own!', value: 'new' },
      { name: 'Clear the quests!', value: 'flush' },
      { name: 'Leave!', value: 'leave' },
    ],
  },
];

exports.quest = [
  { name: 'name', message: 'What is your name?' },
  { name: 'quest', message: 'What is your quest?' },
  { name: 'colour', message: 'What is your favourite colour?' },
];

exports.getExistingQuests = client => {
  return {
    type: 'list',
    name: 'user',
    message: "Here's all the people who have added their quest:",
    choices() {
      return new Promise((res, rej) => {
        client.keys('*', (err, keys) => {
          if (err) console.log(err);
          res(['back', ...keys]);
        });
      });
    },
  };
};
