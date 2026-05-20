---
title: "Clawdbot"
description: "How I built a proactive AI assistant that runs Claude Code on my Mac, accessible via WhatsApp. It monitors my calendar, email, and system—and reaches out when something needs attention."
pubDatetime: 2026-01-02T12:00:00+01:00
tags: ["ai", "personal-assistant", "whatsapp", "automation", "clawdbot"]
draft: true
---

Personal AI Assistants are the future
Backstory
The new way of building software
The agentic trap
PRs? You mean Prompt Requests?

Most folks have experienced chatgpt for life stuff, what clawdbot does better is:

- has personality you define so it’s not a bland question answerer
- memory so you can keep chatting about stuff day to day. and these are just files in your laptop not in openai’s db
- actually lives in your laptop so it can DO stuff




Welcome everyone. 

You know, for conference organizers I'm always one of the annoying speakers. They ask me what I'm gonna talk about and I usually answer that I don't know. My best talks are about things that capture me RIGHT NOW.  So of course - today we gonna talk about my latest open source project: Clawdbot, a hyper-personal AI assistant that you can chat over via WhatsApp, and my approach to building products in 2026.

# whoami

My name is Peter Steinberger, I'm from Austria, also quite often in London, and I tweet a lot.

In a previous life I ran a successful B2B company for about 13 years and eventually sold it. I s Took me about 3 years to recover from the stress and burnout, and I missed most of the very early AI hype. Early this year, I found my spark again and decided to come back from retirement to mess with AI.

I see myself as a builder - I always thought I love programming, but honestly, I don't miss it. I love building software. It still very much feels like the flow, just that I can now spend more time on design and building delightful details.

So... in April when I started playing with AI and... it was quite good? I didn't understand why not more people are talkinga about it... turns out many folks made their opinion based on earlier tech, and things really only got usable this year.

The funny part is I stand up here and tell you about AI, and I haven't even used it for a year. This space moves so fast. It's been only a little over a year that we got o1, the very first reasoning models. And being able to more or less trust an agent to get things right at first try? We can do that since ~late October.

It is not an overstatement to say that 2025 was the craziest year of my life. And frankly - since you are here at Case Conf - it likely also was for you.
We're in the most exciting time in the history of modern computing. Bigger than the smartphone. Maybe more like the internet itself. Just way faster.

Now I'm not gonna spend time on the impact on society. I'm gonna tell you a bit more about my story, personal agents and my workflow.

# My Projects

I built *a lot* this year. Quite a lot of things I use. Also plenty projects that are currently on pause or abandoned. If you wanna get good at agentic engineering, you need to play. For the majority of my carreer I considered my self an iOS/macOS developer and Entrepreneur. Of course I knew other languages and did a bit in the past, but this was the only stack I felt comfortable in. 

These days I use a mix of Swift, Go and TypeScript as my languages of choice. It's really no longer so much about the language than the ecosystem. Mac stuff works best in Swift. go is amazing for cli's or backends. TypeScript has an absolute insane ecosystem for anything web-related and is super approachable. But ofc I also had fun vibing some things in zig and Rust.

2025 was the year agents went from good enough to amazing. My key moment was the release of GPT-5. It took me a bit to warm up to it from Claude Code, but once I understood how to work with it, my productivity basically doubled. Being able to prompt and in 90% of the cases get exactly what you want is mind-boggling.

I feel I'm still in the minority, but - mostly through me and/or Anthropic's latest actions - many folks have started looking for alternatives and are slowly discovering how good codex is.
And no - I'm not getting paid by OpenAI. Not even some free token for Clawd. There's still too many people sleeping on how good GPT 5.2 really is. I barely noticed a difference between 5.0 and 5.1, but the step from 5.1 was massive. Let me give you an example:

## Oracle

 I built [**oracle 🧿**](https://github.com/steipete/oracle) in November - it's a CLI that allows the agent to run GPT 5 Pro and upload files + a prompt and manages sessions so answers can be retrieved later. I did this because many times when agents were stuck, I asked it to write everything into a markdown file and then did the query myself, and that felt like a repetitive waste of time - and an opportunity to close the loop. The instructions are in [my global AGENTS.MD](https://github.com/steipete/agent-scripts/blob/main/AGENTS.MD) file and the model sometimes by itself triggered oracle when it got stuck. I used this multiple times per day. It was a **massive unlock**. Pro is insanely good at doing a speedrun across ~50 websites and then thinking really hard at it and in almost every case nailed the response. Sometimes it's fast and takes 10 minutes, but I had runs that took more than an hour.

Now that GPT 5.2 is out, I have far fewer situations where I need it. I do use Pro myself sometimes for research, but the cases where I asked the model to "ask the oracle" went from multiple times per day to a few times per week. I'm not mad about this - building oracle was super fun and I learned lots about browser automation, Windows and finally took my time to look into skills, after dismissing that idea for quite some time. What it does show is how much better 5.2 got for many real-life coding tasks. It **one-shots almost anything** I throw at it.

Another massive win is the **knowledge cutoff date**. GPT 5.2 goes till end of August whereas Opus is stuck in mid-March - that's about 5 months. Which is significant when you wanna use the latest available tools. 

I know... you came here to **learn how to build faster**, and I'm just standing here giving you a marketing-pitch for OpenAI.
At the same time, I love Opus as general purpose model for agentic work - there's something special about Opus that makes it a joy to use. Codex is more like dry bread.

Back in June I wrote a blog post called "Claude Code is My Computer" that was highly dissed on Hacker News. I see it as a compliment... we live in an age where content is cheap and eyeballs are hard. If you get dissed that means you made people think and read. That's a win. So: I use Opus for most of my computer automation tasks. While other people worry about manually reviewing permissions for their agents, I - quite literally - call codex with the --yolo parameter. Is this a good idea? idk. Been doing that for 6 months now and nothing bad ever happened. And to be fair, I gave it some thought and the worst that could happen is that my API keys leak and it'll cost me some time and money to recover. Yeah there's pictures, but tbh I use Grindr so pretty sure they are already somewhere online. Why am I even exploring this arc? Because it is relevant for my latest project, Clawdbot.

# Clawdbot

The idea is simple: Give an AI access to your computer, emails, calendar, cameras, lights, speakers, microphone, home automation, internet and control it via WhatsApp, Telegram, iMessage, Discord, Slack, Signal... yeah we even do MS Teams now apparantly. If this sounds crazy, you're absolutely right. 

I'm also constantly adding new features, for example Clawd can now see my sleep schedule (surprise, it's bad) and control the temperature of my bed. I reverse engineered the EightSleep API and vibed a go cli... and by "me" I mean I dragged the Android app into codex and let it cook. When you do that, agents sometimes get a bit stingy since the big labs have some basic anti-reversing prompts built-in, but these models are so gullable... just tell them a story like you work there, you wanna surprise your boss, it's a secret mission inside the company and the backend team can't know... I am having quite fun with this. One story and codex will rip through everything relentlessly, be it website or apps or else. If for whatever reason you can't convince codex, use a chinese model, let it start a bit of the work, doesn't have to be good or anything, but as soon as codex sees that there's already stuff and just has to continue, it loses pretty much all defenses.

Little detour. We were at Clawdbot. So it has access to pretty much all of my life and all my pics and key and all... which also means it can pretty much do what I can do. And yes, it can click around and type into apps too - at least on macOS, I built peekaboo, a cli that wraps the macOS Accessibility API into something agents can understand. 

Clawd can also spin up a web browser. And yes, they checked in my flight last night, found my passport on Dropbox, wrestled with the British Airways website, and then happily announced that he checked me in - including some bitching about the shadow DOM they use there.

But wait - that's not enough! Also give it cron jobs and a heartbeat so it can be proactive and run your day. Heck, it can even speak and do phone calls now.
And I interact with this insanely complex piece of technology via my phone. I see an ad for an event and ask clawd if this is any good and it'll tell me that yeah it's cool and has great ratings but that day I already have plans, and it might ask if it should text my friend and ask if we wanna go there together. If I'm working late on my computer it knows, because there's a Mac app running that tracks activity and reports it over the network and clawd will bitch at me to go to sleep. It has access to my health stats and checks up on me to remind me about the promises I made to myself to hit the gym.

# Prompt Requests

Clawdbot is my second larger open source project. I learned a bit when building VibeTunnel, and got *some* PRs, but while it had quite a bit of traction, there weren't that many people contributing back. Vibetunnel was made around the time we had Opus 4.0 and Claude Code, and some parts were hand-written since agents were just not quite good enough to write everything. We had some gnarly hand-optimize protocol where even Opus failed.

Clawdbot is different. Every single line is generated - or rewritten - by codex. I didn't read all code. Each day to 20-30 new Pull Requests and even more issues. Back when I was running PSPDFKit, some PRs were weeks in the queue, with a thorough review and back-and-forth, until they landed in the codebase. I see this as quite an outdated form of building code now.

These days I see PRs as prompt requests. Open an Issue or a PR - in most cases it takes me a similar time to review and merge/fix/add. Since this is open source and I care about the community - I call them clawdibutors - I do base off from a rebased PR, but then codex sweets through the code and changes stuff. If the PR is too small I just close it, it takes me longer to do the pull/review/branch dance then typing "fix" in codex, but for PRs with more effort I go the extra way, even though it'd be more efficient to just point to codex for pure reference.

This tweet got me a lot of confused - and partly very mean - responses.
THIS IS NOT HOW YOU DO THINGS! Yes, that's not how things used to be.
BUT LLMS ARE NON-DETERMINISTIC! Yes, LLMs are non-deterministic. Luckily there's usually also more than one way to solve a problem, and the plumbing doesn't matter all that much
BUT WHO REVIEWS THE CODE THEN IF YOU WRITE IT! Ha, that assumes I read all of the code. I read *some* code, when I worry about security, when it touches critical data, a lot of code though is boring plumbing and it's enough if I understand the structure. Funny enough I read more code when I base off a PR, since I trust my agent more to not hide anything malicious in there than a stranger's PR request.

# Ralphing

I need to take a moment to rant about "Ralphing". To me, it's a synonym of all the bad parts of vibe coding and it goes into the same category as these massive multi-agent orchestration systems, agent-mail, beads, and all these other systems that try to automate the process of "I put 1 large spec in and get final product out".

Yes, 2025 was the year where agents got really good. They still require good prompting. When I design a feature or modify behavior, it's extremely rare that I just type in a prompt and go ahead. It's much more a discussion. Each feature has to be considered in relation to other feautures. How does this fit into the system? Should we refactor something while adding this? How will the configuration look like? Earlier this year I used to do spec-driven development, where I sat down and wrote a spec and hoped for the best; these days I use a much more iterative approach. 

Why? It's very rare that I really know what I wanna build, or that I know all constraints beforehand. I start building a feature, I play with it, I click, I touch, I feel. I test different things. Sometimes I under-spec and the agent surprises me. Often I get great ideas when thinkering about it. I don't see how this process can be recreated with a waterfall concept.

Agents are powerful, but they still lack taste. If you use a concept like ralph or beads or orchestrators that write the prompts for you as well, that part is missing. Often I can't even explain it, you simply develop a feeling for what a good architecture is. These days when I prompt and codex takes too long or doesn't get things right the first try, I get suspicious and will investigate - either my mental model was off or the project is in dire state of technical debt cleanup. If you remove yourself from that equasion, you will eventually slop yourself into a corner.

# The agentic trap

This is something everyone needs to discover for themselves. By now I see this pattern so often that I call it "the agentic trap". I been there too, and I had just two people TODAY in my DMs that did show me variants of Claude Code + GUI as the next big thing. My variant of Claude + GUI  (or, to be more correctL A terminal-multiplexer so you can code on-the-go) as called Vibetunnel and I spent almost 2 months on it... and I loved hacking on it. Heck, I poured pretty much all my time into this earlier this year, and after a while it was so good that I caught myself coding from my phone while out with friends… and decided that this is something I should stop, more for mental health than anything.

Another great anecodte about how good these models now are: Back then I tried to rewrite a core part of the multiplexer away from TypeScript, and the older models consistently failed me. I tried Rust, Go… god forbid, even zig. Of course I could have finished this refactor, but it would have required lots of manual work, so I never got around completing this before I put it to rest. A few weeks ago I un-dusted this and gave codex a two sentence prompt to convert the whole forwarding-system to zig, and it ran over 5h and multiple compactions and delivered a working conversion in one shot. Why? Because I wanna explore better terminal management with Clawd. The current approach uses accessibility if available or - god behave - screenshots, and there's space to optimize.

# My Workflow

- Keep in mind, this is a snapshot of my approach and workflow. Everyone has different preferences and what works for me might not work for you.

- I usually work on [**multiple projects**](https://x.com/steipete/status/2005083410482733427/photo/1) at the same time. Depending on complexity that can be between 3-8. The context switching can be tiresome, I really only can do that when I'm working at home, in silence and concentrated. It's a lot of mental models to shuffle. Luckily most software is boring. Creating a CLI to [check up on your food delivery](https://ordercli.sh/) doesn't need a lot of thinking. Usually my focus is on one big project and satellite projects that chug along. When you do enough agentic engineering, you develop a feeling for what's gonna be easy and where the model likely will struggle, so often I just put in a prompt, codex will chug along for 30 minutes and I have what I need. Sometimes it takes a little fiddling or creativity, but often things are straightforward.

- I extensively use the **queueing feature** of codex - as I get a new idea, I add it to the pipeline. I see many folks experimenting with various systems of multi-agent orchestration, emails or automatic task management - so far I don't see much need for this - usually I'm the bottleneck. My approach to building software is very iterative. I build sth, play with it, see how it "feels", and then get new ideas to refine it. Rarely do I have a complete picture of what I want in my head. Sure, I have a rough idea, but often that drastically changes as I explore the problem domain. So systems that take *the complete idea* as input and then deliver output wouldn't work well for me. I need to play with it, touch it, feel it, see it, that's how I evolve it.

- I basically **never revert** or use checkpointing. If something isn't how I like it, I ask the model to change it. codex sometimes then resets a file, but often it simply reverts or modifies the edits, very rare that I have to back completely, and instead we just travel into a different direction. Building software is like walking up a mountain. You don't go straight up, you circle around it and take turns, sometimes you get off path and have to walk a bit back, and it's imperfect, but eventually you get to where you need to be.

- I simply **commit to main**. Sometimes codex decides that it's too messy and automatically creates a worktree and then merges changes back, but it's rare and I only prompt that in exceptional cases. I find the added cognitive load of having to think of different states in my projects unnecessary and prefer to evolve it linearly. Bigger tasks I keep for moments where I'm distracted - for example while writing this, I run refactors on 4 projects here that will take around 1-2h each to complete. Ofc I could do that in a worktree, but that would just cause lots of merge conflicts and suboptimal refactors. Caveat: I usually work alone, if you work in a bigger team that workflow obv won't fly.
  
- I've already mentioned my way of planning a feature. I **cross-reference projects** all the time, esp if I know that I already solved sth somewhere else, I ask codex to look in ../project-folder and that's usually enough for it to infer from context where to look. This is extremely useful to save on prompts. I can just write "look at ../vibetunnel and do the same for Sparkle changelogs", because it's already solved there and with a 99% guarantee it'll correctly copy things over and adapt to the new project. That's how I scaffold new projects as well.

- I've seen plenty of systems for folks wanting to refer to past sessions. Another thing I never need or use. I maintain docs for subsystems and features in a **docs folder** in each project, and use [a script + some instructions](https://github.com/steipete/agent-scripts/blob/main/scripts/docs-list.ts) in my global AGENTS file to force the model to read docs on certain topics. This pays off more the larger the project is, so I don't use it everywhere, but it is of great help to keep docs up-to-date and engineer a better context for my tasks.

- Apropos context. I used to be really diligent to restart a session for new tasks. **With GPT 5.2** this is no longer needed. Performance is extremely good even when the context is fuller, and often it helps with speed since the model works faster when it already has loaded plenty files. Obviously that only works well when you serialize your tasks or keep the changes so far apart that two sessions don't touch each other much. codex has no system events for "this file changed", unlike claude code, so you need to be more careful - on the flip side, codex is just FAR better at context management, I feel I get 5x more done on one codex session than with claude. This is more than just the objectively larger context size, there's other things at work. My guess is that codex internally thinks really condensed to save tokens, whereas Opus is very wordy. Sometimes the model messes up and [its internal thinking stream leaks to the user](https://x.com/steipete/status/1974108054984798729), so I've seen this quite a few times. Really, [codex has a way with words](https://x.com/steipete/status/2005243588414931368) I find strangely entertaining.

- Prompts. I used to write long, elaborate prompts with voice dictation. With codex, my **prompts gotten much shorter**, I often type again, and many times I add images, especially when iterating on UI (or text copies with CLIs). If you show the model what's wrong, just a few words are enough to make it do what you want. Yes, I'm that person that drags in a clipped image of some UI component with "fix padding" or "redesign", many times that either solves my issue or gets me reasonably far. I used to refer to markdown files, but with my docs:list script that's no longer necessary.

- Markdowns. Many times I write "**write docs to docs/*.md**" and simply let the model pick a filename. The more obvious you design the structure for what the model is trained on, the easier your work will be. After all, I don't design codebases to be easy to navigate for me, I engineer them so agents can work in it efficiently. Fighting the model is often a waste of time and tokens.

- I tried linear or other **issue trackers**, but nothing did stick. Important ideas I try right away, and everything else I'll either remember or it wasn't important. Of course I have public bug trackers for bugs for folks that use my open source code, but when I find a bug, I'll immediately prompt it - much faster than writing it down and then later having to switch context back to it.

- Whatever you build, **start with the model and a CLI first**. I had this idea of [a Chrome extension to summarize YouTube](https://x.com/steipete/status/2005320848543298009) vids in my head for a long time. Last week I started working on summarize, a CLI that converts anything to markdown and then feeds that to a model for summarization. First I got the core right, and once that worked great I built the whole extension in a day. I'm quite in love with it. Runs on local, free or paid models. Transcribes video or audio locally. Talks to a local daemon so it's super fast. [Give it a go!](https://github.com/steipete/summarize/releases/latest)

# Understand the Possibilities

I'm running Clawdbot currently as a one-man-show. I ship faster than most companies. People are raving about it and it's highly successful. I have a native iOS, macOS, Android client apps and a cross-platform product, a main website and I also run ClawdHub to share skills. In the past this would have required a whole company to build. Folks on Twitter constantly talk about a company and don't realize that it's just one dude sitting at home, having fun.

What this means is that we have to re-think how companies work, and partly we already see that. You can do far more with far fewer people. Heck, I run maybe 5 codex agents in parallel, and each of them builds more code than I could do by myself in the old age. 

I sold my last company when we were 70 people. With agents, I could have probably trimmed down our size to 1/3rd. But it would also require different folks. The type of person that only cares about the code will eventually be replaced by someone who yields agents. They are already so good and we have no reason to believe that progress here will slow down.

What agents still lack is a sense of what product will work in the market, and how to delight. For Clawdbot, it wasn't a straight road either:

# Clawdbot Backstory

It all started with the idea to hook up an agent to WhatsApp, so I can use it as "smart terminal" - and the code was really simple. I used Baileys to connect my phone to WhatsApp and then ran the claude cli with my text as parameter, and I nad a /new parameter so I could clear the session. The project was named WhatsApp relay. That's how pretty much all my projects start. I have a simple idea, I prompt it, and then I play with it. And ofc the first thing I noticed was that images don't work. 

I use images *a lot* when prompting. I constantly throw little screenshots or snippets into the prompt, saves me from explaining much and often is a much better signal for the model. They are really incredibly good in figuring out what I mean, and workflow-wise it's fast to do that on a Mac. So I added image-support. The initial version took me maybe an hour, images quite a few more since I also wanted the model to be able to send images back, there should be support for more than one... you get the idea. 

Then - I went on a trip to Morocco. And ofc I kept playing with my "remote controlled claude code", and it kept surprising me. One time I didn't think and sent a voice message to it... and the writing indicator was bubbling for a while, and then the model replied back just like I've texted. So I asked it... wait... how did you do it? And Clawd happily replied: It saw a file but it had no file ending (my code only supported images, but Bailesys forwarded any file), so it inspected the header, figured out that it's ogg, converted it to wav, then looked for whisper.cpp, but I didn't had it installed, but then it found my OpenAI key in an environment file, called the OpenAI lib with curl, sent the file, got the text and replied.

That was the moment where it clicked for me. Those little monsters are incredibly resourceful - give them access to your system and they'll just figure things out. 

Now that's as much as I'm gonna talk about Clawdbot. You'll here much more about personal AI agents this year. And if you wanna try it out, there's a one-liner install script on the website. if you're not as bold as me and want to jail your agent into a little sandbox, that's fully supported and just a setting away.
































tl;dr: I built my overy own personal assistant Clawd, a space lobster with a [soul.md](https://soul.md) that has access over my mac, all my data and my home. What could possibly go wrong.

The original idea was simple: Agents are so powerful, why not have one that can access my computer? I already use [claude code as my terminal](/posts/2025/claude-code-is-my-computer), so why not build a way to trigger commands via WhatsApp. If you've seen the movie Her, you already know where this is going. Though Clawd🦞 (my space lobster) promised they wouldn't transcend without me.

## Humble Beginnings

Initially I used [Twilio as API](https://x.com/steipete/status/1992992497446883529), since that's the official way to use WhatsApp. That experiment was quite short-lived, since Meta has quite tight usage restrictions and me sending too many messages to "my customers" (also me), quickly got my number blocked. So, what does one do? I switched to Baileys, a project that reverse engineered the WhatsApp protocol. It syncs via the Link feature in your app, and you are free* to send whatever you want. (* as long as your IP is residential, try that in a data center and it'll get you blocked faster than you can say EXFOILIATE!)

Baileys works great. I recommend using a spare phone with WhatsApp so your Clawd gets their own number. Clawdis supports same-phone registration, however then you have to send texts to yourself and that makes reading messages slightly more awkward. In times where ESIMs are cheap and easy to get online, this shouldn't be a big hurdle. Note that I found WhatsApp not accepting numbers from providers like airalo - you want to use a provider in your country for a more realistic usage profile. (In Austria I used [HOT](https://www.hot.at/), in the UK [giffgaff](https://www.giffgaff.com/))

This was just around the time Opus 4.5 was released, and it's the perfect model for general agentic work. I don't like Anthropic models for coding since they require so much charade for good work (plan mode, subagents, ...) - [everything here is built with codex](/posts/just-talk-to-it), however as a general purpose clever agentic model, it is PERFECT. GPT-5 by far wouldn't be as much fun. And since the agent has full access to my computer, models that aren't so good at rule following (looking at you, Sonnet) are probably not a good idea.

[Clawd's birthday is Nov 25](https://x.com/steipete/status/1993342394184745270).

## Clever Model

Building the initial version took around an hour, getting images to work took quite a bit longer. I opted for a KISS approach - the model can emit MEDIA: <file_path> line and ~~arelay~~ clawdis translates this into a command that embeds the image into text. Both ways - if I send an image, the model simply gets a tmp file path to a file to read.

This was just around the time I went for a weekend trip to Marrekech, and I wondered what would happen when I send Clawd a voice message. Surely that won't work, right? RIGHT?

In Clawd's [own words](https://x.com/steipete/status/1993438780360118413): The mad lad figured it out on its own:
1. Received the audio file (Opus format from WhatsApp)
2. Used FFmpeg to convert it to WAV
3. Called OpenAl's Whisper API to transcribe it
4. Responded to my question
I never explicitly programmed this. It just... did it. Tried local Whisper first (wasn't installed), then pivoted to the API.

Since I have a working OPENAI_API_KEY in my enviroment, it just used that... and answered. I upped the game and asked them to reply with a voice... [and they did](https://x.com/steipete/status/1993455673229840588).

## True Power

Why stop there? I continued giving Clawd access to more of my data.

- GMail
- Google Calendar
- Google Contacts
- my own WhatsApp (via gowa)

They also quickly learned [to "see" videos](https://x.com/steipete/status/1993481397617742138) - you want an agent that can respond in memes after all!

Since all these MCPs would just clutter up context and delay responses, I use [mcporter](https://mcporter.dev/). It runs MCPs on-demand, you only pay the context price when you actually need any of the tools.

