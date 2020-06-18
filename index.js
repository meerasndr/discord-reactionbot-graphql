const discord = require("discord.js");
const config = require("./config.json");
const axios = require('axios');
const bot = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

bot.on("ready", async() => {
    console.log(`${bot.user.username} is online and ready!`);
    bot.user.setStatus("online");    
    //bot.user.setActivity("chilling")
});

bot.on("message", async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}hi`){
        console.log(message.author.username);
        return message.channel.send(`Hello ${message.author.username}!`);
    }
});

bot.on('guildMemberAdd', member =>{
    //let role = member.guild.roles.find("name", "newuserjoin");
    member.roles.add("677152627363938324");
   //member.guild.defaultRole.setPermissions(['VIEW_CHANNEL']);
})

bot.on('messageReactionAdd', async (reaction, user) => {
    // When we receive a reaction we check if the message is partial or not
    //console.log(reaction._emoji.name)
	if (reaction.message.partial) {
	    // If the message was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.message.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
		}
	}
    // Message is cached and fully available
    if(reaction._emoji.name == '❓') {
        console.log(`Author is: ${reaction.message.author.username}`)
        console.log(reaction.message.content)
        console.log(reaction.message.channel);
        console.log(reaction.message.id);
        axios({
            url:`https://mydisbot.herokuapp.com/v1/graphql`,
            method: 'post',
            data: {query:
                `mutation{
                insert_questions(objects:[{
                  question: "${reaction.message.content}",
                  user: "${reaction.message.author.username}",
                  message_id:"${reaction.message.id}"
                  message_url:"${reaction.message.url}"
                }])
                {
              affected_rows
                }
              }`
            }
        }).then((result) => {
            //console.log(result.data);
        })
    }
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the reaction: ', error);``
		}
	}
	// Now the reaction is fully available and the properties will be reflected accurately:
   // console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

bot.on('messageReactionAdd', async (reaction, user) => {
    // When we receive a reaction we check if the message is partial or not
    //console.log(reaction._emoji.name)
	if (reaction.message.partial) {
	    // If the message was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.message.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
		}
	}
    // Message is cached and fully available
    if(reaction._emoji.name == '✅') {
        console.log(`Author is: ${reaction.message.author.username}`)
        console.log(reaction.message.content)
        const questionChannel = bot.channels.cache.get('678295356437692427')
        questionChannel.send('Question: \n' + reaction.message.content +' \n asked by user ' + reaction.message.author.username)
    }
    
	// We can also check if the reaction is partial or not
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the reaction: ', error);``
		}
	}
	// Now the reaction is fully available and the properties will be reflected accurately:
    console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});



bot.login(config.token); //setup on config.json