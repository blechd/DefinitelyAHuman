const fs = require('fs');
const rankFile = './data/rankings.json';

module.exports = {
    name: 'matchmake',
    description: 'Generate fair teams given relative skill levels',
    execute(message, args) {
        switch (args[0]) {
            case 'set':
                if (args.length != 4) message.channel.send('Example usage: \`?set user iron 1\`');
                writeRank(message, args[1], args[2], args[3]);
                break;
            case 'make':
                matchmake(message, args.slice(1));
                break;
            default: message.channel.send('Command not recognized.');
                break;
        }
    }
}

writeRank = function(message, user, division, rank) {
    const ranking = parseInt(divisionToNum(division)) * 3 + parseInt(rank);
    fs.readFile(rankFile, 'utf8', (err, data) => {
        if (err) {
            message.channel.send('Error setting rank.');
            console.error(err);
            return;
        }

        let rankList = JSON.parse(data);

        //if that user already has a rank, update it
        let alreadyExists = false;
        for (let rankEntry of rankList) {
            if (rankEntry.user === user) {
                rankEntry.rank = ranking;
                alreadyExists = true;
                break;
            }
        }

        if (!alreadyExists) {
            rankList.push({user: user, rank: ranking});
        }

        fs.writeFile(rankFile, JSON.stringify(rankList), 'utf8', (err) => {
            if (err) {
                console.error(err);
                message.channel.send('Error setting rank.');
            }
        });
    });
    message.channel.send(`Successfully set ${user}'s rank to ${division} ${rank}!`);
}

divisionToNum = function(rank) {
    rankStr = rank.toLowerCase();
    switch (rankStr) {
        case 'iron': return 0;
        case 'bronze': return 1;
        case 'silver': return 2;
        case 'gold': return 3;
        case 'platinum': return 4;
        case 'diamond': return 5;
        case 'immortal': return 6;
        case 'valorant': return 7;
        default: return 0;
    }
}

matchmake = function(message, usernames) {
    if (!usernames.length) {
        message.channel.send("No users given to make a match with.");
    }
    
    fs.readFile(rankFile, 'utf8', (err, data) => {
        if (err) {
            message.channel.send('Error getting ranks.');
            console.error(err);
            return;
        }

        let rankList = JSON.parse(data);
        let match = [];

        for (let rankEntry of rankList) {
            if (usernames.includes(rankEntry.user)) {
                match.push(rankEntry);
            }
        }

        //sort in increasing order
        match = match.sort((a, b) => {return parseInt(a.rank) - parseInt(b.rank)});

        let team1 = [], team2 = [];

        while (match.length > 0) {
            team1.push(match.pop());
            team2.push(match.pop());
        }

        //map {user, rank} pairs to just the usernames
        team1 = team1.map((entry) => {return entry.user});
        team2 = team2.map((entry) => {return entry.user});

        message.channel.send(`Team 1: ${team1}.`);
        message.channel.send(`Team 2: ${team2}.`);
    });
}