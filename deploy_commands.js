const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');


// The commands are WIP currently.
const commands = [
	new SlashCommandBuilder().setName('help').setDescription('Show some helpful commands.'),
	new SlashCommandBuilder().setName('enablejpns').setDescription('Enable the news feed for Japan.'),
	new SlashCommandBuilder().setName('disablejpns').setDescription('Disable the news feed for Japan.'),
	new SlashCommandBuilder().setName('enableworldns').setDescription('Enable the news feed for English'),
	new SlashCommandBuilder().setName('disableworldns').setDescription('Disable the news feed for English'),

]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
