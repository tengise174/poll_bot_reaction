import { Client, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import "dotenv/config";

// Create a new Discord client
const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

// When the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

// Register the slash command
const pollCommand = new SlashCommandBuilder()
  .setName("асуулга")
  .setDescription("Асуулга үүсгэнэ үү")
  .addStringOption((option) =>
    option
      .setName("асуулт")
      .setDescription("Асуулт")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("сонголт")
      .setDescription("Сонголтоо таслалаар ялган бичнэ үү (Ж нь., тийм,үгүй)")
      .setRequired(true)
  );

// Handle interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "асуулга") {
    const question = interaction.options.getString("асуулт")!;
    const options = interaction.options.getString("сонголт")!.split(",");

    // Validate options
    if (options.length < 2 || options.length > 10) {
      await interaction.reply({
        content: "Таслалаар зааглан 2-10 сонголт бичнэ үү.",
        ephemeral: true,
      });
      return;
    }

    // Create emoji mapping for reactions
    const emojiList = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ];
    const pollOptions = options
      .map((opt, index) => `${emojiList[index]} ${opt.trim()}`)
      .join("\n");

    // Create embed for poll
    const pollEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("📊 " + question)
      .setDescription(pollOptions)
      .setTimestamp()
      .setFooter({ text: `Poll by ${interaction.user.tag}` });

    // Send the poll and add reactions
    const pollMessage = await interaction.reply({
      embeds: [pollEmbed],
      fetchReply: true,
    });

    for (let i = 0; i < options.length; i++) {
        const emoji = emojiList[i];
        if (emoji) {
          await pollMessage.react(emoji);
        } else {
          console.error(`Invalid emoji at index ${i}`);
        }
      }
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

// Register commands when bot starts
client.once("ready", async () => {
  try {
    await client.application?.commands.set([pollCommand]);
    console.log("Slash commands registered!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
});


// install link
// https://discord.com/oauth2/authorize?client_id=1354015904366727209&permissions=18496&integration_type=0&scope=bot+applications.commands