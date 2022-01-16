const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token, prefix } = require('./config.json');
var Parser = require('rss-parser');
//const { parse } = require('rss-to-json');
var cron = require("cron");
const fs = require("fs");

var parser = new Parser();

const flags = new Permissions([
  Permissions.FLAGS.VIEW_CHANNEL,
  Permissions.FLAGS.EMBED_LINKS,
  Permissions.FLAGS.ATTACH_FILES,
  Permissions.FLAGS.READ_MESSAGE_HISTORY,
  Permissions.FLAGS.MANAGE_ROLES,
]);

// NEWS STRUCTURE
// =================================================================

function GuardianArticle(title, link, description, published) {
  this.title = title;
  this.link = link;
  this.description = description;
  this.published = published;
}

function JpArticle(date, title, link) {
  this.date = date;
  this.title = title;
  this.link = link;
}

function AljazeeraArticle(title, link, description, image, published) {
  this.title = title;
  this.link = link;
  this.description = description;
  this.image = image;
  this.published = published;
}

// =================================================================

//This is according to flags.
//const permissions = new Permissions(flags);
const queue = new Map();



function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// =================================================================

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
  getNews()
// news cron runs every 30 mintues
  var RunNewsCron = new cron.CronJob('0 */30 * * * *', function () {
    getNews()
    console.log('News Cron ran at:', new Date());

  });
  RunNewsCron.start();
})

// =================================================================
// create a function that grabs the channel 

// =================================================================
client.on('messageCreate', message => {
  if (message.author.bot) return;
  // Certain maps
  const serverQueue = queue.get(message.guild.id);


  if (message.content.startsWith(`${prefix}help`)) {
    const newsEmbed = new MessageEmbed()
    newsEmbed.setColor('#0099ff')
    newsEmbed.setTitle("Some Dinosaur eating a car")
    newsEmbed.setDescription("This is the description of the news that is being posted")
    newsEmbed.setThumbnail("https://www.aljazeera.com/favicon_aje.ico")
    newsEmbed.setImage("https://altdriver.com/wp-content/uploads/sites/2/2020/07/megasaurus-e1632249071292.jpg")

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

      message.channel.awaitMessages(m => m.author.id == message.author.id,
        { max: 1, time: 30000 }).then(collected => {
          // only accept messages by the user who sent the command
          // accept only 1 message, and return the promise after 30000ms = 30s

          // first (and, in this case, only) message of the collection
          if (collected.first().content.toLowerCase() == 'yes') {
            message.reply('Shutting down...');
            client.destroy();
          }

          else
            message.reply('Operation canceled.');
        }).catch(() => {
          //message.reply();
          console.log('No answer after 30 seconds, operation canceled.')
        });
    }
    else {
      //message.channel.send("I'm sorry you have to have higher permission to enable the News Stream.")
    }
  }
  if (message.content.startsWith(`${prefix}EnableJPNewsStream`)) {
    //console.log(permissions.has(Permissions.FLAGS.MANAGE_ROLES));
    if (message.member.permissions.has('ADMINISTRATOR')) {
      var channel = client.channels.cache.get("929467124714471464")
      const newsEmbed = new MessageEmbed()
      newsEmbed.setColor('#0099ff')
      newsEmbed.setTitle(_article.title)
      newsEmbed.setURL(_article.link)
      newsEmbed.setThumbnail(_article.image)
      newsEmbed.setDescription(_article.description)
      channel.send({ embeds: [newsEmbed] });
    }
    else {
      //message.channel.send("I'm sorry you have to have higher permission to enable the News Stream.")
    }
  }

});

// =================================================================


// ============================================================

async function getNews() {
  const Aljazeefeed = await parser.parseURL("https://rss.app/feeds/kPr2jQabyfmE87f8.xml");
  const Guardianfeed = await parser.parseURL('https://www.theguardian.com/world/rss');
  const Reutersfeed = await parser.parseURL('https://assets.wor.jp/rss/rdf/reuters/top.rdf');
  const Nikkeifeed = await parser.parseURL('https://assets.wor.jp/rss/rdf/nikkei/society.rdf');
  const NHKfeed = await parser.parseURL('https://www.nhk.or.jp/rss/news/cat0.xml');

  //==================================================================
  for (let i = 0; i < NHKfeed.items.length; i++) {
    var NHKitem = NHKfeed.items[i];
    var title = NHKitem.title;
    var link = NHKitem.link;
    var description = NHKitem.contentSnippet;
    var published = NHKitem.isoDate;

    var NHKarticle = new GuardianArticle(title, link, description,parseDate(published));
    console.log("NHK")
    console.log(new Date(NHKarticle.published),new Date(new Date().getTime() - (60 * 60 * 1000)))
    if (new Date(NHKarticle.published) > new Date(new Date().getTime() - (60 * 60 * 1000))) {
      console.log("NHK Article Published"+ NHKarticle.title)
      let Nhkchannel = client.channels.cache.get("929467035518398524")
      const NHKnewsEmbed = new MessageEmbed()
      .setColor('#FF69B4')
      .setTitle(NHKarticle.title)
      .setURL(NHKarticle.link)
      .setTimestamp(NHKarticle.published)
      .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/NHK_World.svg/1280px-NHK_World.svg.png')
      Nhkchannel.send({ embeds: [NHKnewsEmbed] });
    }
  }

  //=============================================================
  for (let i = 0; i < Aljazeefeed.items.length; i++) {
    var Aljazeeitem = Aljazeefeed.items[i];
    
    var title = Aljazeeitem.title;
    var link = Aljazeeitem.link;
    var description = Aljazeeitem.contentSnippet;
    var image = Aljazeeitem.content ? Aljazeeitem.content.match(/<img.+?src=["'](.+?)["'].+?>/)[1] : null;
    var published = Aljazeeitem.pubDate;

    var Aljazeearticle = new AljazeeraArticle(title, link, description, image, published);
    console.log("Aljazeera")
    console.log(new Date(Aljazeearticle.published),new Date(new Date().getTime() - (60 * 60 * 1000)))
    if (new Date(Aljazeearticle.published) > new Date(new Date().getTime() - (60 * 60 * 1000))) {
      console.log("Aljazeera Article Published"+ Aljazeearticle.title)
      let Alchannel = client.channels.cache.get("929467124714471464")
      const AljazeenewsEmbed = new MessageEmbed()
      .setColor('#6aa84f')
      .setTitle(Aljazeearticle.title)
      .setURL(Aljazeearticle.link)
      .setImage(Aljazeearticle.image)
      .setThumbnail('https://i.imgur.com/GDZRJtM.png')
      .setDescription(Aljazeearticle.description)
      Alchannel.send({ embeds: [AljazeenewsEmbed] });
    }
  }
  //=============================================================

  for (let i = 0; i < Guardianfeed.items.length; i++) {
    var Guardianitem = Guardianfeed.items[i];
    
    var title = Guardianitem.title;
    var link = Guardianitem.link;
    var description = Guardianitem.contentSnippet;
    var published = Guardianitem.isoDate;
    var Guardianarticle = new GuardianArticle(title, link, description, parseDate(published));
    console.log("guardian")
    console.log(new Date(Guardianarticle.published), new Date(new Date().getTime() - (60 * 60 * 1000)))
    if (new Date(Guardianarticle.published) > new Date(new Date().getTime() - (60 * 60 * 10000))) {
      console.log("Guardian Article Published"+ Guardianarticle.title)
      let Guchannel = client.channels.cache.get("929467124714471464")
      const GuardiannewsEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(Guardianarticle.title)
      .setURL(Guardianarticle.link)
      .setImage(Guardianarticle.image)
      .setThumbnail('https://i.imgur.com/mhfnhJi.jpg')
      .setDescription(Guardianarticle.description)
      Guchannel.send({ embeds: [GuardiannewsEmbed] });
    }
  }
  // //=============================================================

  for (let i = 0; i < Reutersfeed.items.length; i++) {
    var Reutersitem = Reutersfeed.items[i];
    var title = Reutersitem.title;
    var link = Reutersitem.link;
    var published = Reutersitem.isoDate;
    var Reutersarticle = new JpArticle(title, link, parseDate(published));
    console.log("reuters")
    console.log(new Date(Reutersitem.isoDate) ,new Date(new Date().getTime() - (60 * 60 * 1000)))
    if (new Date(Reutersitem.published) > new Date(new Date().getTime() - (60 * 60 * 1000))) {
      console.log("Reuters Article Published"+ Reutersarticle.title)
      let Reuchannel = client.channels.cache.get("929467035518398524")
      const ReutersnewsEmbed = new MessageEmbed()
      .setColor('#e50000')
      .setTitle(Reutersarticle.title)
      .setURL(Reutersarticle.link)
      .setTimestamp(Reutersarticle.published)
      .setThumbnail('https://i.imgur.com/klTaUZH.jpg')
      Reuchannel.send({ embeds: [ReutersnewsEmbed] });
    }
  }

  // //=============================================================

  for (let i = 0; i < Nikkeifeed.items.length; i++) {
    var Nikkeiitem = Nikkeifeed.items[i];
    var title = Nikkeiitem.title;
    var link = Nikkeiitem.link;
    var published = Nikkeiitem.isoDate;

    var Nikkeiarticle = new JpArticle(parseDate(published), title, link);
    console.log("Nikkei")
    console.log(new Date(Nikkeiarticle.published),new Date(new Date().getTime() - (60 * 60 * 1000)))
    if (new Date(Nikkeiitem.isoDate) > new Date(new Date().getTime() - (60 * 60 * 1000))) {
      console.log("Nikkei Article Published"+ Nikkeiarticle.title)
      let Nijchannel = client.channels.cache.get("929467035518398524")
      const NikkeinewsEmbed = new MessageEmbed()
      .setColor('#e50000')
      .setTitle(Nikkeiarticle.title)
      .setURL(Nikkeiarticle.link)
      .setTimestamp(Nikkeiarticle.published)
      .setThumbnail('https://i.imgur.com/poDaGMo.jpg')
      
      Nijchannel.send({ embeds: [NikkeinewsEmbed] });
    }
  }
}

//=====================================================================
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
