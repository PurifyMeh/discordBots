const fs = require('fs');

var triggers = [
	{trigger: "ayy", response: "lmao"},
	{trigger: "ping", response: "<user> pong"}
];
triggers.push({trigger: "test", response: "testt"});
triggers.push({trigger: "another", response: "one"});
triggers.push({trigger: "and", response: "another one"});

const write = JSON.stringify(triggers, null, 4);
fs.writeFileSync('test.json', write, function(err) {
    if (err) throw err;
});

fs.readFile('test.json', (err, data) => {
    if (err) throw err;
    const d = JSON.parse(data);
    const obj = Object.values(d);
    console.log(obj);
});