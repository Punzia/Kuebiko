const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token, prefix } = require('./config.json');
const { parse } = require('rss-to-json');
const fs = require("fs");
const articleJSON = require('./articles.json');
var cron = require("cron");
const logger = require("discordjs-logger");

const flags = new Permissions([
  Permissions.FLAGS.VIEW_CHANNEL,
  Permissions.FLAGS.EMBED_LINKS,
  Permissions.FLAGS.ATTACH_FILES,
  Permissions.FLAGS.READ_MESSAGE_HISTORY,
  Permissions.FLAGS.MANAGE_ROLES,
]);
//This is according to flags.
//const permissions = new Permissions(flags);
const queue = new Map();



//Ready commands
client.on("ready", () => {

  console.log(`Logged in as ${client.user.tag}!`);
  //logger.info("Logged in! Serving in " + kuebiko.guilds.cache.array().length + " servers");
  //logger.info(prefix+ "help to view a list of commands");
  client.guilds.cache.forEach(guild => {
    //console.log(`${guild.name} | ${guild.id}`);

  })
  /*
  client.user.setActivity("me getting developed", {
    type: "STREAMING",
    url: "https://twitch.tv/sleepyrapunzel"
  });
  */
  client.user.setPresence({
    activities: [{
      name: "my code",
      type: "WATCHING"
    }],
    status: "idle"
  })

  var scheduleNews = new cron.CronJob('*/10 * * * *', () => {
    console.log("test")
    //let channel = client.channels.cache.get('925412639029465088');
    let channel = client.channels.cache.get('739059784891891785');
    console.log("Just so you know this function is currently ruinnugn");
    //channel.send("I'm watching you Goose");

    //  create a  loop that goes through guardian articles
    //  and sends them to the channel
    /*
    const newsEmbed = new MessageEmbed()
      .setColor('#4EE90B')
      .setTitle(articleJSON.title)
      .setURL(articleJSON.link)
      .setDescription(articleJSON.description)
      .setTimestamp(articleJSON.published)
      .setFooter('Published:', 'https://cdn-icons-png.flaticon.com/512/141/141723.png');
    channel.send({ embeds: [newsEmbed] });
    */
    const article = articleJSON;
    const newsEmbed = new MessageEmbed()
    newsEmbed.setColor('#4EE90B')
    for (let i = 0; i < articleJSON.length; i++) {
      const title = articleJSON[i].title;
      const link = articleJSON[i].link;
      newsEmbed.setTitle(article[i].title)
      newsEmbed.setURL(article[i].link)
      newsEmbed.setDescription(article[i].description)
      newsEmbed.setTimestamp(article[i].published)

    }
    newsEmbed.setFooter('Published:', 'https://cdn-icons-png.flaticon.com/512/141/141723.png%27');
    channel.send({ embeds: [newsEmbed] });


  });
  //scheduleNews.start();

})


client.on('messageCreate', async message => {
  if (message.author.bot) return;
  // Certain maps
  const serverQueue = queue.get(message.guild.id);


  if (message.content.startsWith(`${prefix}hello`)) {
    message.channel.send("hello")
  }

  if (message.content.startsWith(`${prefix}news`)) {
    //var serverList = [];

    client.guilds.cache.forEach(guild => {

      //console.log(guild.id)
      //serverList.push(guild.id);
      try {
        const channel = guild.channels.cache.find(channel => channel.name === 'general') || guild.channels.cache.first();
        if (channel) {
          channel.send('Hello Cuties');
        } else {
          console.log('The server ' + guild.name + ' has no channels.');
        }
      } catch (err) {
        console.log('Could not send message to ' + guild.name + '.');
      }
    })
    console.log(serverList)


    /*
    var title = articleJSON.title;
    //message.channel.send(articleJSON.link);
    console.log(title)
    const newsEmbed = new MessageEmbed()
      .setColor('#4EE90B')
      .setTitle(title)
      .setURL(articleJSON.link)
      .setDescription(articleJSON.description)
      .setTimestamp(articleJSON.published)
      .setFooter('Published:', 'https://cdn-icons-png.flaticon.com/512/141/141723.png');
    message.channel.send({ embeds: [newsEmbed] });
    */

  }
  if (message.content.startsWith(`${prefix}wattson`)) {
    message.channel.send("https://tenor.com/view/wattson-apex-wattson-cute-apex-wattson-wattson-paqette-natalie-paqette-gif-21365855");
  }
  if (message.content.startsWith(`${prefix}addnews`)) {
    //console.log(permissions.has(Permissions.FLAGS.MANAGE_ROLES));
    if (message.member.permissions.has('ADMINISTRATOR')) {
      message.reply("User has admin!")
    }
    else {
      message.reply("sorry dumbass")
    }
  }
  if (message.content.startsWith(`${prefix}srvfile`)) {
    let server = message.guild.id
    console.log(`./servers/${server}.json`)
    console.log("serverid is:", server)
    //message.channel.send("server id is: " + server);
    const path = `./servers/${server}.json`

    fs.access(path, fs.F_OK, (err) => {
      if (err) {
        //console.error(err)
        message.channel.send("I'm sorry a file for this server doesn't exist, want me to create it for you?")
          //const createFile =  ;
          //await createFile.react('✅');
          //await createFile.react('❎');
          //message.channel.send(":apple:***SONDAGE :apple:\n "+choix1+" ou "+""+choix2+"***")
          //message.channel.send('Do you want me create it for you?')
          .then(function (message) {
            message.react("✅")
            message.react("❎")
            //message.pin()
            //message.delete()
          }).catch(function () {
            //Something
          });
        //return
      }
      else {
        message.channel.send("Looks like there is a file for this server!");
      }

      //file exists
    })

  }
});


/*
function Article(title, link, description, published) {
  this.title = title;
  this.link = link;
  this.description = description;

  this.published = published;
}

(async () => {

  var rss = await parse('https://www.theguardian.com/world/rss');
  rss = resprss
  //console.log(rss);

})();
var resprss;
var guardianArticles = [];
parse('https://www.theguardian.com/world/rss').then(rss => {
  // for each rss.description if  the string contains <p> or </p> <a> or </a> then remove them
  // rss has many items in it
  //for (var i = 0; i < rss.items.length; i++) {
  for (var i = 0; i < 1; i++) {
    var item = rss.items[i];
    
    var description = item.description;
    
    if (description.includes("&lt;p&gt;") || description.includes("&lt;/p&gt;") || description.includes("&lt;a&gt;") || description.includes("&lt;/a&gt;") || description.includes("&lt;a href=")) {
      console.log("true");
      description = description.replace("&lt;p&gt;", "");
      description = description.replace("&lt;/p&gt;", "");
      description = description.replace("&lt;a&gt;", "");
      description = description.replace("&lt;/a&gt;", "");
      description = description.replace("&lt;a href=", "");
      //description = description.replace("&lt;p&gt;", "");
    }


    var article = new Article(item.title, item.link, description, new Date(item.published));
    guardianArticles.push(article);
    console.log(article);

    // Write article object to file..
    fs.writeFileSync("./articles.json", JSON.stringify(article, null, 4));

    // Read back from the file...
    const articleFromFile = JSON.parse(fs.readFileSync("./articles.json", "utf8"));
    //console.log("Articles from file:", articleFromFile);
  }
});
*/
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'react') {
    const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
    message.react('😄');
  }
});
function addChannelID(id) {
  channelIDs.push(id) // Push the new ID to the array

  let newConfigObj = { // Create the new object...
    //...require('./config.json'), // ...by taking all the current values...
    channelIDs // ...and updating channelIDs
  }

  // Create the new string for the file so that it's not too difficult to read
  let newFileString = JSON.stringify(newConfigObj, null, 2)

  fs.writeFileSync('./server.json', newFileString) // Update the file
}


client.login(token);
