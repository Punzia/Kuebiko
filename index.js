const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token } = require('./config.json');
const { parse } = require('rss-to-json');
const fs = require("fs");
const articleJSON = require('./articles.json');

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
  //client.user.

  client.user.setActivity("News", {
    type: "WATCHING"
  });
})


client.on('messageCreate', (message, member, permissions) => {
  if (message.content === "!hello") {
    message.reply("Hello!")
  }
  if (message.content === "!honk") {
    message.channel.send(":gooseHonk:")
  }
  
  if (message.content === "!news") {
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
  if (message.content === "!wattson") {
    message.channel.send("https://tenor.com/view/wattson-apex-wattson-cute-apex-wattson-wattson-paqette-natalie-paqette-gif-21365855");
  }
  if (message.content === "!admin") {
    //console.log(permissions.has(Permissions.FLAGS.MANAGE_ROLES));

    if (message.member.permissions.has('ADMINISTRATOR')) {
      message.reply("User has admin!")
    }
    else {
      message.reply("sorry dumbass")
    }


  }
});

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




client.login(token);
