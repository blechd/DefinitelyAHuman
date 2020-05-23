module.exports = {
    name: 'owoify',
    description: 'Owoify text',
    execute(message, args) {
        let text = args.join(' ');
        //replace all 'r' or 'l' with 'w'
        text = text.replace(/[rl]/g, 'w');
        message.channel.send(text);
    }
}