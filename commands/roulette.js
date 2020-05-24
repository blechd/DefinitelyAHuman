module.exports = {
    name: 'roulette',
    description: 'Play russian roulette',
    execute(message, args) {
        const user = message.member;
        if (Math.floor(Math.random() * 6) == 0) {
            if (user.roles.cache.some(role => role.name === 'Owner')) {
                message.channel.send('I don\'t have the power to kick owners, sorry.');
                return;
            }
            message.channel.send(`Bang! ${user} lost!`);
            user.kick();
        } else {
            message.channel.send(`Bang! ${user} survived!`);
        }
    }
}