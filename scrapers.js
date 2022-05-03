const puppeteer = require("puppeteer");
const cron = require("node-cron");
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const hoursGone = [];

let x;

async function scrapeProduct() {
  const browser = await puppeteer.launch({
    handless: false,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://ssps.cz", {
    waitUntil: "load",
    timeout: 0,
  } );
  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("ul:nth-child(5) > li")).map(
      (x) => x.textContent
    );
  });
    x = true;
    names.forEach((element) => {
      if (element.includes("2.A") && !hoursGone.includes(element)) {
        if(x){
          while (hoursGone > 0){
            hoursGone.pop();
          }
          x = false;
        }
        hoursGone.push(element);
        const hoursEmbed = new MessageEmbed()
          .setTitle("Odpadlé hodiny")
          .setColor("#0099ff")
          .setDescription(element);

          client.channels.cache.get("882248573503303700").send({ embeds: [hoursEmbed] });
        }
    });
  await browser.close();
}
client.login("OTM2NTM3NTg5MzQ1ODIwNzE0.YfOomQ.uddnPFOy8oFPQMMOiPWq6lFMA9o");
cron.schedule("* 2 * * *", () => {
  scrapeProduct();
});
