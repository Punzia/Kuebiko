const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token, prefix } = require('./config.json');
const { parse } = require('rss-to-json');
var Parser = require('rss-parser');
var cron = require("cron");
const fs = require("fs");
const articleJSON = require('./articles.json');

//const logger = require("discordjs-logger");

// Adding flag permission to check permissions of users.
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
    //https://javascript.tutorialink.com/discordjs-add-space-between-prefix-and-command/
  })
  client.user.setPresence({
    activities: [{
      name: "my code",
      type: "WATCHING"
    }],
    status: "idle"
  })
  var AljazeeraCron = new cron.CronJob('0 * * * *', function () {
    getAljazeera();
    console.log('AljazeeraCron ran at :', new Date());

  });
  AljazeeraCron.start();

  var GuardianCron = new cron.CronJob('0 * * * *', function () {
    getGuardian();
    console.log('Guardian Cron Job Ran');
  })

  GuardianCron.start();

  var japanreutersCron = new cron.CronJob('*/20 * * * * *', function () {

    getReuters();
    console.log("hit reutures for articles")
    //console.log(jpreutersLast24HoursArticles)

  }, null, true, 'Asia/Tokyo');

  //japanreutersCron.start();

})

/*
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'server') {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  } else if (commandName === 'user') {
    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
  }
});
*/










client.on('messageCreate', message => {
  if (message.author.bot) return;
  // Certain maps
  const serverQueue = queue.get(message.guild.id);


  if (message.content.startsWith(`${prefix}help`)) {
    const newsEmbed = new MessageEmbed()
    newsEmbed.setColor('#0099ff')
    newsEmbed.setTitle("help")
    newsEmbed.setDescription("This will help")

    message.channel.send({ embeds: [newsEmbed] });
  }

  /*
  if (message.content.startsWith(`${prefix}news`)) {
    //var serverList = [];

    client.guilds.cache.forEach(guild => {

      //console.log(guild.id)
      //serverList.push(guild.id);
      try {
        const channel = guild.channels.cache.find(channel => channel.name === 'general') || guild.channels.cache.first();
        if (channel) {
          console.log("Sent a message to the server");
          //channel.send('Hello Cuties');
        } else {
          console.log('The server ' + guild.name + ' has no channels.');
        }
      } catch (err) {
        console.log('Could not send message to ' + guild.name + '.');
      }
    })
    console.log(serverList)

  }
  */
  if (message.content.startsWith(`${prefix}EnableWorldNewsStream`)) {
    //console.log(permissions.has(Permissions.FLAGS.MANAGE_ROLES));
    if (message.member.permissions.has('ADMINISTRATOR')) {
      //message.channel.send("EnableWorldNews")
      let tmp = message.content.substring(prefix.length, message.length).split(' ')
      console.log(tmp);
      //let args = []


    }
    else {
      //message.channel.send("I'm sorry you have to have higher permission to enable the News Stream.")
    }
  }
  if (message.content.startsWith(`${prefix}EnableJPNewsStream`)) {
    //console.log(permissions.has(Permissions.FLAGS.MANAGE_ROLES));
    if (message.member.permissions.has('ADMINISTRATOR')) {
      message.channel.send("EnableWorldNews")
    }
    else {
      //message.channel.send("I'm sorry you have to have higher permission to enable the News Stream.")
    }
  }

});
/*======================


========================*/
function AljazeeraArticle(title, link, description, image, published) {
  this.title = title;
  this.link = link;
  this.description = description;
  this.image = image;
  this.published = published;
}
var _aljazeeraArticle = []

async function getAljazeera() {
  const feed = await parser.parseURL("https://rss.app/feeds/kPr2jQabyfmE87f8.xml");

  for (let i = 0; i < feed.items.length; i++) {
    var item = feed.items[i];
    var title = item.title;
    var link = item.link;
    var description = item.contentSnippet;
    var image = item.enclosure.url;
    var published = item.pubDate;
    var article = new AljazeeraArticle(title, link, description, image, published);
    _aljazeeraArticle.push(article);


    if (new Date(article.published) > new Date(new Date().getTime() - (60 * 60 * 1000))) {
      var _article = _aljazeeraArticle[i];
      var channel = client.channels.cache.get("929467124714471464")
      const newsEmbed = new MessageEmbed()
      newsEmbed.setColor('#0099ff')
      newsEmbed.setTitle(_article.title)
      newsEmbed.setURL(_article.link)
      newsEmbed.setThumbnail()
      newsEmbed.setDescription(_article.description)
      channel.send({ embeds: [newsEmbed] });


    }
  }
}














/*===================================================================
Guardian Articles Function Starts Here.
=====================================================================*/

function GuardianArticle(title, link, description, published) {
  this.title = title;
  this.link = link;
  this.description = description;
  this.published = published;
}


var guardianArticles = [];


async function getGuardian() {
  const feed = await parser.parseURL('https://www.theguardian.com/world/rss');

  console.log(feed.items.length)
  for (let i = 0; i < feed.items.length; i++) {

    const item = feed.items[i];
    const article = new GuardianArticle(item.title, item.link, item.contentSnippet, parseDate(item.isoDate));
    
    //console.log(article);

    if (new Date(article.published) > new Date(new Date().getTime() - (60 * 60 * 1000))) {
      guardianArticles.push(article);
      console.log("Article" + article)

      //console.log(guardianArticles);
      var channel = client.channels.cache.get("929467124714471464")
      //channel.send(guardianArticles[i].title);
      var _article = guardianArticles[i];

      const newsEmbed = new MessageEmbed()
      newsEmbed.setColor('#0099ff')
      newsEmbed.setTitle(_article.title)
      newsEmbed.setURL(_article.link)
      newsEmbed.setDescription(_article.description)

      channel.send({ embeds: [newsEmbed] });


    }

  }

}

//=======================================================

function JpReutersArticle(date, title, link) {
  this.date = date;
  this.title = title;
  this.link = link;
}

//=======================================================

var parser = new Parser();

//=======================================================

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

//=======================================================

// keep for testing delete once in production
var jpreutersLast24HoursArticles = [];
//=======================================================

async function getReuters() {

  const feed = await parser.parseURL('https://assets.wor.jp/rss/rdf/reuters/top.rdf');
  console.log(feed.items.length)

  for (let i = 0; i < feed.items.length; i++) {

    const item = feed.items[i];
    const article = new JpReutersArticle(parseDate(item.isoDate), item.title, item.link);
    jpreutersLast24HoursArticles.push(article);
    if (item.isoDate > new Date(Date.now() - 3600000)) {
      
      console.log(jpreutersLast24HoursArticles);
      // ADD CODE TO SEND TO JP CHANNEL HERE
      //let jpchannel = client.channels.cache.get('929467035518398524');
      console.log("Sent article")


      //jpchannel.send(article);

    }
  }
}

//==========================================================================================
// <----

/*
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'react') {
    const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
    message.react('😄');
  }
});
*/
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
