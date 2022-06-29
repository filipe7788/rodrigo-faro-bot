// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { TOKEN, CLIENT_ID, CLIENT_SECRET } = require('./config/config.json')
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice")

const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
] 

const prefixo = '-faro'

// Create a new client instance
const client = new Client({ intents });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log("App funcional");
});

client.on('messageCreate', async (msg) => {
    const message = msg
    if(message.content.startsWith(prefixo)) {
        const connection = await makeBotJoinvoiceChannel(message)
        // checkIf2MinutesPassed(message)
        playMp3(connection, message)
    }
});
// Login to Discord with your client's token
client.login(TOKEN);

// Bot states
makeBotJoinvoiceChannel = async (message) => {
    return joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })
}

// // method to check if 2 minutes has passedfrom last message
// // if so, leave the voice channel
// // if not, reset the timer
// // if the bot is not in a voice channel, join the voice channel
// function checkIf2MinutesPassed(message) {
//     if(message.member.voice.channel) {
//         console.log(message.guild.voiceStates.connection);
//         if(message.member.voice.channel.id === message.guild.voice.connection.channel.id) {
//             if(message.createdTimestamp - message.guild.voiceStates.connection.channel.lastMessageTimestamp > 120000) {
//                 message.guild.voice.connection.disconnect();
//             }
//         }
//     }
// }

// method to relate mp3 name with the message
// if the message is a command, play the mp3 file
function playMp3(connection, message) {
    const mp3Name = message.content.split(' ')[1]
    if(mp3Name) {
        playMp3File(connection, message)
    }
}

const player = createAudioPlayer()

// method to run mp3 file if the bot is in a voice channel
// if the bot is not in a voice channel, join the voice channel
function playMp3File(connection, message) {
    const mp3Name = message.content.split(' ')[1]
    const mp3File = `./mp3/${mp3Name}.mp3`
    const audioResource = createAudioResource(mp3File)
    connection.subscribe(player)
    player.play(audioResource)
    player.on('end', () => {
        connection.disconnect()
    })    
}

//method to check if two minutes have passed since the last message
// if so, leave the voice channel
// if not, reset the timer
function checkIf2MinutesPassed(message) {
    if(message.member.voice.channel) {
        if(message.member.voice.channel.id === message.guild.voice.connection.channel.id) {
            if(message.createdTimestamp - message.guild.voiceStates.connection.channel.lastMessageTimestamp > 120000) {
                message.guild.voice.connection.disconnect();
            }
        }
    }
}