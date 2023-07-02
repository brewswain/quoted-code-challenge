## Getting Started

Firstly, the app is available for preview both on [Vercel](https://quoted-code-challenge-d4dx-hbylt7g9e-brewswain.vercel.app/) and [Netlify](https://frolicking-mousse-0cdc97.netlify.app/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/140d1a64-9a45-4240-b20f-7c0a0d4a1dbc/deploy-status)](https://app.netlify.com/sites/frolicking-mousse-0cdc97/deploys)

![Vercel Status](https://vercelbadge.vercel.app/api/brewswain/quoted-code-challenge)


 ### Netlify site is live, but it's way less performant, every single navigation makes the page refresh and has some layout shift problems, combined with some weird API handling bugs. I did some research and it appears to be on Netlify's side since they're still working out NextJS 13's app router. Therefore, I recommend using Vercel's site, but I'll leave the netlify one live as well as a Proof-of-concept.





However, if you wish to use this app locally, let's get you started correctly!

First, open up your terminal of choice, and use the following commands:

```
git clone https://github.com/brewswain/quoted-code-challenge.git

cd quoted-code-challenge

npm install

npm run dev
```
Once you've executed all the above, open your browser, and go to `localhost:3000`

That's it!


---
## Project Walkthroughs

While definitely not mandatory, I thought it'd be nice to include a couple Looms, all of which are under 5 minutes, that just go over a couple features etc:

- [UI Walkthrough](https://www.loom.com/share/052a6532afd3414bac17890c4a1723a3)
- [Authentication Code Walkthrough](https://www.loom.com/share/2b6239e0e1a944f0b9f69c67dfb09005)
- [Some basic CRUD functionality](https://www.loom.com/share/40be6bda2f3d409e814565ed9625debc)
- [Expanding on the real-time feature of our feed using Callbacks inside of an effect](https://www.loom.com/share/eca8b293c15049f780849616987f0780)
- [A quick look at very light error handling](https://www.loom.com/share/57bac7293a02478eb32ce56bb72a5a1e)

As a reminder, Loom has built in playback speed editing, so I tend to suggest watching at 1.25x speed!
