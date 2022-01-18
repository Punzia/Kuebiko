const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token, prefix } = require('./config.json');
var Parser = require('rss-parser');
var cron = require("cron");


var parser = new Parser();

const flags = new Permissions([
  Permissions.FLAGS.VIEW_CHANNEL,
  Permissions.FLAGS.EMBED_LINKS,
  Permissions.FLAGS.ATTACH_FILES,
  Permissions.FLAGS.READ_MESSAGE_HISTORY,
  Permissions.FLAGS.MANAGE_ROLES,
]);

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
      name: "the news",
      type: "WATCHING"
    }],
    status: "online"
  })
  //getNews()
  // news cron runs every 10 minutes 


  var RunNewsCron = new cron.CronJob('*/30 * * * *', function () {
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
    newsEmbed.setAuthor({ name: 'Kuebiko', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://punzia.com' })
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


// ============================================================

async function getNews() {
  const Aljazeefeed = await parser.parseURL("https://rss.app/feeds/kPr2jQabyfmE87f8.xml");
  const NYTechfeed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml");
  const NYTSciencefeed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/Science.xml");
  const NYTHealthfeed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/Health.xml");
  const ReutersENG = await parser.parseURL("https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best")
  const ReutersJP = await parser.parseURL('https://assets.wor.jp/rss/rdf/reuters/top.rdf');
  const Nikkeifeed = await parser.parseURL('https://assets.wor.jp/rss/rdf/nikkei/society.rdf');
  const NHKfeed = await parser.parseURL('https://www.nhk.or.jp/rss/news/cat0.xml');
  const NYTimesfeed = await parser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/World.xml');
  //-----
  
  const YahooInternational = await parser.parseURL('https://news.yahoo.co.jp/rss/topics/world.xml');
  const YahooIT = await parser.parseURL('https://news.yahoo.co.jp/rss/topics/it.xml');
  const YahooScience = await parser.parseURL('https://news.yahoo.co.jp/rss/topics/science.xml');
  const YahooEntertainment = await parser.parseURL('https://news.yahoo.co.jp/rss/topics/entertainment.xml');
  //------------------------------------------------
  const BBCFeed = await parser.parseURL('https://feeds.bbci.co.uk/news/rss.xml?edition=us');

  for (let i = 0; i < BBCFeed.items.length; i++) {
    let BBCitem = BBCFeed.items[i];

    if (new Date(BBCitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("BBC Article Published" + BBCitem.title)
      let BBCchannel = client.channels.cache.get("929467124714471464")
      const BBCEmbed = new MessageEmbed()
        .setAuthor({ name: 'BBC News', iconURL: 'https://i.imgur.com/hZoHXUz.png', url: 'https://bbc.co.uk' })
        .setColor('#0099ff')
        .setTitle(BBCitem.title)
        .setURL(BBCitem.link)
        .setDescription(BBCitem.contentSnippet)
        .setThumbnail('https://i.imgur.com/hZoHXUz.png')
        .setTimestamp(new Date(BBCitem.isoDate))
      BBCchannel.send({ embeds: [BBCEmbed] });
    }
  }

  /*------------*/

  for (let i = 0; i < YahooInternational.items.length; i++) {
    var YahooInternationalitem = YahooInternational.items[i];

    if (new Date(YahooInternationalitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("YahooInternational Article Published" + YahooInternationalitem.title)
      let YahooInternationalchannel = client.channels.cache.get("929467035518398524")
      const YahooInternationalEmbed = new MessageEmbed()
        .setAuthor({ name: 'Yahoo International', iconURL: 'https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg', url: 'https://news.yahoo.co.jp' })
        .setColor('#0099ff')
        .setTitle(YahooInternationalitem.title)
        .setDescription(YahooInternationalitem.contentSnippet)
        .setURL(YahooInternationalitem.link)
        .setTimestamp(new Date(YahooInternationalitem.isoDate))
        .setThumbnail('https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg')


      YahooInternationalchannel.send({ embeds: [YahooInternationalEmbed] });
    }
  }


  for (let i = 0; i < YahooIT.items.length; i++) {
    var YahooITitem = YahooIT.items[i];

    if (new Date(YahooITitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("YahooIT Article Published" + YahooITitem.title)
      let YahooITchannel = client.channels.cache.get("929467035518398524")
      const YahooITEmbed = new MessageEmbed()
        .setAuthor({ name: 'Yahoo IT', iconURL: 'https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg', url: 'https://news.yahoo.co.jp' })
        .setColor('#0099ff')
        .setTitle(YahooITitem.title)
        .setDescription(YahooITitem.contentSnippet)
        .setURL(YahooITitem.link)
        .setTimestamp(new Date(YahooITitem.isoDate))
        .setThumbnail('https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg')
      //.setFooter({ text: 'Yahoo IT', iconURL: 'https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg' })

      YahooITchannel.send({ embeds: [YahooITEmbed] });
    }
  }

  for (let i = 0; i < YahooScience.items.length; i++) {
    var YahooScienceitem = YahooScience.items[i];

    if (new Date(YahooScienceitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("YahooScience Article Published" + YahooScienceitem.title)
      let YahooSciencechannel = client.channels.cache.get("929467035518398524")
      const YahooScienceEmbed = new MessageEmbed()
        .setAuthor({ name: 'Yahoo Science', iconURL: 'https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg', url: 'https://news.yahoo.co.jp' })
        .setColor('#0099ff')
        .setTitle(YahooScienceitem.title)
        .setDescription(YahooScienceitem.contentSnippet)
        .setURL(YahooScienceitem.link)
        .setTimestamp(new Date(YahooScienceitem.isoDate))
        .setThumbnail('https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg')
      //.setFooter({ text: 'Yahoo Science', iconURL: 'https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg' })

      YahooSciencechannel.send({ embeds: [YahooScienceEmbed] });
    }
  }

  for (let i = 0; i < YahooEntertainment.items.length; i++) {
    var YahooEntertainmentitem = YahooEntertainment.items[i];

    if (new Date(YahooEntertainmentitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("YahooEntertainment Article Published" + YahooEntertainmentitem.title)
      let YahooEntertainmentchannel = client.channels.cache.get("929467035518398524")
      const YahooEntertainmentEmbed = new MessageEmbed()
        .setAuthor({ name: 'Yahoo International', iconURL: 'https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg', url: 'https://news.yahoo.co.jp' })
        .setColor('#0099ff')
        .setTitle(YahooEntertainmentitem.title)
        .setDescription(YahooEntertainmentitem.contentSnippet)
        .setURL(YahooEntertainmentitem.link)
        .setTimestamp(new Date(YahooEntertainmentitem.isoDate))
        .setThumbnail('https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg')
      //.setFooter({ text: 'Yahoo Entertainment', iconURL: 'https://toraumanight.com/wp-content/uploads/2018/08/168058.jpg' })

      YahooEntertainmentchannel.send({ embeds: [YahooEntertainmentEmbed] });
    }
  }

  // ============================================================================================================

  for (let i = 0; i < NHKfeed.items.length; i++) {
    var NHKitem = NHKfeed.items[i];

    if (new Date(NHKitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("NHK Article Published" + NHKitem.title)
      let Nhkchannel = client.channels.cache.get("929467035518398524")
      const NHKnewsEmbed = new MessageEmbed()
        .setAuthor({ name: 'NHK World Japan', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/NHK_World.svg/1280px-NHK_World.svg.png', url: 'https://www.nhk.or.jp/' })
        .setColor('FF3B33')
        .setTitle(NHKitem.title)
        .setURL(NHKitem.link)
        .setDescription(NHKitem.contentSnippet)
        .setTimestamp(NHKitem.published)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/NHK_World.svg/1280px-NHK_World.svg.png')

      Nhkchannel.send({ embeds: [NHKnewsEmbed] });
    }
  }
  // ============================================================================================================
  for (let i = 0; i < ReutersJP.items.length; i++) {
    var ReutersJPitem = ReutersJP.items[i];

    if (new Date(ReutersJPitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("ReutersJP Article Published" + ReutersJPitem.title)
      let ReutersJPchannel = client.channels.cache.get("929467035518398524")
      const ReutersJPEmbed = new MessageEmbed()
        .setAuthor({ name: 'Reuters JP', iconURL: 'https://i.imgur.com/klTaUZH.jpg', url: 'https://assets.wor.jp' })
        .setColor('#0099ff')
        .setTitle(ReutersJPitem.title)
        .setURL(ReutersJPitem.link)
        .setDescription(ReutersJPitem.contentSnippet)
        .setTimestamp(ReutersJParticle.published)
        .setThumbnail('https://i.imgur.com/klTaUZH.jpg')
      ReutersJPchannel.send({ embeds: [ReutersJPEmbed] });
    }
  }
  // ============================================================================================================
  for (let i = 0; i < Nikkeifeed.items.length; i++) {
    var Nikkeiitem = Nikkeifeed.items[i];

    if (new Date(Nikkeiitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("Nikkei Article Published" + Nikkeiitem.title)
      let Nijchannel = client.channels.cache.get("929467035518398524")
      const NikkeinewsEmbed = new MessageEmbed()
        .setAuthor({ name: 'Nikkei JP', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Nikkei_logo_ja.svg/2560px-Nikkei_logo_ja.svg.png', url: 'https://www.nikkei.com/' })
        .setColor('#0099ff')
        .setTitle(Nikkeiitem.title)
        .setURL(Nikkeiitem.link)
        .setTimestamp(new Date(Nikkeiitem.isoDate))
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Nikkei_logo_ja.svg/2560px-Nikkei_logo_ja.svg.png')


      Nijchannel.send({ embeds: [NikkeinewsEmbed] });
    }
  }
  // ============================================================================================================

  for (let i = 0; i < Aljazeefeed.items.length; i++) {
    let Aljazeeitem = Aljazeefeed.items[i];

    if (new Date(Aljazeeitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("Aljazeera Article Published" + Aljazeeitem.title)
      let Alchannel = client.channels.cache.get("929467124714471464")
      const AljazeenewsEmbed = new MessageEmbed()
        .setAuthor({ name: 'Aljazeera', iconURL: 'https://i.imgur.com/GDZRJtM.png', url: 'https://www.aljazeera.com/' })
        .setColor('#fa9100')
        .setTitle(Aljazeeitem.title)
        .setURL(Aljazeeitem.link)
        .setImage(Aljazeeitem.content ? Aljazeeitem.content.match(/<img.+?src=["'](.+?)["'].+?>/)[1] : null)
        .setThumbnail('https://i.imgur.com/GDZRJtM.png')
        .setTimestamp(new Date(Aljazeeitem.isoDate))
        .setDescription(Aljazeeitem.contentSnippet)


      Alchannel.send({ embeds: [AljazeenewsEmbed] });
    }

  }
  // ============================================================================================================

  for (let i = 0; i < NYTechfeed.items.length; i++) {
    let NYTechitem = NYTechfeed.items[i];

    if (new Date(NYTechitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("NYT Article Published" + NYTechitem.title)
      let NYTechchannel = client.channels.cache.get("929467124714471464")
      const NYTechnewsEmbed = new MessageEmbed()
        .setAuthor({ name: 'New York Times Tech', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png', url: 'https://www.nytimes.com/section/technology' })
        .setColor('#0099ff')
        .setTitle(NYTechitem.title)
        .setURL(NYTechitem.link)
        .setDescription(NYTechitem.contentSnippet)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png')
        .setTimestamp(new Date(NYTechitem.isoDate))

      NYTechchannel.send({ embeds: [NYTechnewsEmbed] });
    }

  }
  // ============================================================================================================

  for (let i = 0; i < NYTSciencefeed.items.length; i++) {
    let NYTScienceitem = NYTSciencefeed.items[i];

    if (new Date(NYTScienceitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("NYT Article Published" + NYTScienceitem.title)
      let NYTSciencechannel = client.channels.cache.get("929467124714471464")
      const NYTScienceEmbed = new MessageEmbed()
        .setAuthor({ name: 'New York Times Science', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png', url: 'https://www.nytimes.com/section/science' })
        .setColor('#0099ff')
        .setTitle(NYTScienceitem.title)
        .setURL(NYTScienceitem.link)
        .setDescription(NYTScienceitem.contentSnippet)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png')
        .setTimestamp(new Date(NYTScienceitem.isoDate))

      NYTSciencechannel.send({ embeds: [NYTScienceEmbed] });
    }
  }
  // ============================================================================================================

  for (let i = 0; i < NYTHealthfeed.items.length; i++) {
    let NYTHealthitem = NYTHealthfeed.items[i];

    if (new Date(NYTHealthitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("NYT Article Published" + NYTHealthitem.title)
      let NYTHealthchannel = client.channels.cache.get("929467124714471464")
      const NYTHealthEmbed = new MessageEmbed()
        .setAuthor({ name: 'New York Times Health', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png', url: 'https://www.nytimes.com/section/health' })
        .setColor('#0099ff')
        .setTitle(NYTHealthitem.title)
        .setURL(NYTHealthitem.link)
        .setDescription(NYTHealthitem.contentSnippet)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png')
        .setTimestamp(new Date(NYTHealthitem.isoDate))

      NYTHealthchannel.send({ embeds: [NYTHealthEmbed] });
    }
  }

  // ============================================================================================================

  for (let i = 0; i < ReutersENG.items.length; i++) {
    let ReutersENGitem = ReutersENG.items[i];

    if (new Date(ReutersENGitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("Reuters Article Published" + ReutersENGitem.title)
      let ReutersENGchannel = client.channels.cache.get("929467124714471464")
      const ReutersENGEmbed = new MessageEmbed()
        .setAuthor({ name: 'Reatures ENG', iconURL: 'https://i.imgur.com/klTaUZH.jpg', url: 'https://www.nytimes.com/section/science' })
        .setColor('#0099ff')
        .setTitle(ReutersENGitem.title)
        .setURL(ReutersENGitem.link)
        .setDescription(ReutersENGitem.contentSnippet)
        .setThumbnail('https://i.imgur.com/klTaUZH.jpg')
        .setTimestamp(new Date(ReutersENGitem.isoDate))

      ReutersENGchannel.send({ embeds: [ReutersENGEmbed] });
    }
  }

  //--------------------------------------
  for (let i = 0; i < NYTimesfeed.items.length; i++) {
    let NYTimesitem =  NYTimesfeed.items[i];

    if (new Date(NYTimesitem.isoDate) >= new Date(Date.now() - 1800000)) {
      console.log("NYT Article Published" + NYTimesitem.title)
      let NYTimeschannel = client.channels.cache.get("929467124714471464")
      const NYTimesnewsEmbed = new MessageEmbed()
        .setAuthor({ name: 'New York Times', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png', url: 'https://www.nytimes.com' })
        .setColor('#0099ff')
        .setTitle(NYTimesitem.title)
        .setURL(NYTimesitem.link)
        .setDescription(NYTimesitem.contentSnippet)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png')
        .setTimestamp(new Date(NYTimesitem.isoDate))

        NYTimeschannel.send({ embeds: [NYTimesnewsEmbed] });
    }

  }
}

//=====================================================================
// function addChannelID(id) {
//   channelIDs.push(id) // Push the new ID to the array

//   let newConfigObj = { // Create the new object...
//     //...require('./config.json'), // ...by taking all the current values...
//     channelIDs // ...and updating channelIDs
//   }

//   // Create the new string for the file so that it's not too difficult to read
//   let newFileString = JSON.stringify(newConfigObj, null, 2)

//   fs.writeFileSync('./server.json', newFileString) // Update the file
// }

client.login(token);
