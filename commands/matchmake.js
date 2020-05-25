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
        for (let userRank of rankList) {
            console.log(`comparing ${userRank.user} and ${user}`);
            if (userRank.user === user) {
                userRank.rank = ranking;
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

matchmake = function(message, users) {
    
}