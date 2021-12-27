const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token } = require('./config.json');
const { parse } = require('rss-to-json');
const fs = require("fs");
const articleJSON = require('./articles.json')



//Ready commands
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //client.user.

  client.user.setActivity("News", {
    type: "WATCHING"
  });
})


client.on('messageCreate', message => {
  if (message.content === "!hello") {
    message.reply("Hello!")
  }
  if (message.content === "!honk") {
    message.channel.send(":gooseHonk:")
  }
  if (message.content === "!news") {
    const newsEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(articleJSON.title)
      .setURL(articleJSON.link)
      .setDescription(articleJSON.description)
    message.channel.send({ embeds: [newsEmbed] });

  }
});

function Article(title, link, published) {
  this.title = title;
  this.link = link;
  
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
  for (var i = 0; i < 10; i++) {
    var item = rss.items[i];
    //var _description = item.description;


    var article = new Article(item.title, item.link, new Date(item.published));
    guardianArticles.push(article);
    console.log(article);

    // Write article object to file..
    //fs.writeFileSync("./articles.json", JSON.stringify(article, null, 4));

    // Read back from the file...
    //7const articleFromFile = JSON.parse(fs.readFileSync("./articles.json", "utf8"));
    //console.log("Articles from file:", articleFromFile);
  }
});


//client.login(token);
