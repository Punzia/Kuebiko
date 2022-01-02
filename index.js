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



//Ready commands
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //logger.info("Logged in! Serving in " + kuebiko.guilds.cache.array().length + " servers");
  //logger.info(prefix+ "help to view a list of commands");
  client.guilds.cache.forEach(guild => {
    console.log(`${guild.name} | ${guild.id}`);

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


client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(`${prefix}honk`)) {
    message.channel.send(":gooseHonk:")
  }

  if (message.content.startsWith(`${prefix}news`)) {
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
  if (message.content.startsWith(`${prefix}serverid`)) {
    let server = message.guild.id
    console.log("serverid is:", server)

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
