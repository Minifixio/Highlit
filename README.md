![Highlit](https://i.imgur.com/JUwk1w8.png)

# Highlit ? Whats is it ?

**[HIGHLIT.ME](https://highlit.me)** (**CURRENTLY UNAVAILABLE**) is an **open sourced** web application running under Angular which allows you to easily rewatch **Counter-Strike Global Offensive** esport matches when you missed them live. <br>
Match highlights videos are often quite long. Highlit offers a visual and interactive timeline of the match and let you navigate through the best moments of the match and access to them quickly.

See [this video](https://www.youtube.com/watch?v=JRLpymSlAX4) for a quick showcase !

<br><br>
# How it works ?

There are two parts to the project :


## 1) The backend server (nodejs)

The backend server is takes care of getting matches datas, downloading the demos and parsing them. There are several steps to create a demo parsing file :


**1. The Cron Task :**<br>
* Each 30 mins, the server retrieves all the recent matches from [HLTV's results page](https://www.hltv.org/results) and add them to the database.
Then, the older unparsed match is selected to be analyzed. The match demo's are then downloaded and the files are ready to be parsed.

**2. The Demo Reader :**<br>
* The demo reader takes the demo (.dem) file extracted from the downloaded and start analyzing it.
Round timings, tactical pauses, kills, multi-kills and others datas are listed from the analysis.

**3. The Demo Manager :**<br>
* When the parsing ends, the match datas are formatted into a JSON file.
A file is also created referencing all the twitch streams links associated to the match.

**4. The Twitch Analyser :**<br>
* The HLTV's result page refers twitch streams links of the match. The Twitch Analyser will anaylse those streams and count the number of comments sent during each round duration.
A rating is then generated for each round of the match. A round with a high Twitch rating means many comments have been sent during the round on the live stream.

Files are then sorted in folders named after match id's. These folders are also sorted by date for an easier management.
The backend server also hosts the databse.

<br>

## 2) The web app (Angular):

There are two main pages on the app :


**1 - The match selection page :**<br>
* This pages gathers all matches from the database. Matches are sorted by date.
The page indicates if a match is downloaded or not.
When selecting a match, a menu appears. It lets you select the map you want.
There is also a input field to add your desired link from HLTV's result page if the match you are looking for is not avaible on the app.

**2 - The match watching page :**<br>
* The page contains a Twitch player of the match and a scrolling menu of the rounds.
You can see the most importants datas of each round on the left pannel : kills count, multi-kills (triple, quad, aces) and the Twitch rating. I'm currently working on adding new datas.
You can select the round you want to play by clicking on it in the menu.
You can also directly jump into an important action by clicking on the name of the player.
When you select a specific action or round, the player automatically goes to the desired part of the video.


<br><br>
# Contributing

Highlit is an open sourced project. Feel free to download the sources and try it on your own.<br>
Also, any thoughts, advices, issues, fixes, improvements, etc... are really strongly appreciated :)<br>
I'm not very talented in UI design. If you have any skills in the subject it would be great !<br>
Finally, I'm not a very experienced developper so sometimes my code is quite draft...<br>
Enjoy !








