Love Website — How to use

Files included:
- index.html
- style.css
- script.js
- README.md

What's included:
- A name input with OK: when she types her name and clicks OK (or presses Enter) the name:
  - appears in the "To:" header,
  - is inserted into the message text where %%NAME%% appears,
  - is saved to localStorage so it persists across page loads,
  - triggers a small heart burst and will attempt to play the background music (a user gesture allows playback).
- Open/Replay buttons: typewriter animation for the message.
- Confetti and floating hearts for celebration.
- Photo area: click to add a local image (embedded in the page via Data URL).
- Background music slot: place a file named jeene_laga_hun.mp3 in the same folder for the song to play.

Music and copyright:
- I cannot provide copyrighted audio. If you have "Jeene Laga Hoon", place it in the folder with the exact filename:
    jeene_laga_hun.mp3
- The page will try to play it on your (her) click, which browsers allow.

How to personalize later:
- Change the "From: [Your Name]" in index.html to your name.
- Update the message contents in script.js if you want a different message later (the current template uses %%NAME%% to be replaced with the recipient's name).
- Optionally I can produce a single-file HTML with embedded image/audio (audio will make the single file large).

Sharing:
- Zip the folder and send it, or host on GitHub Pages or any static host and share the URL.
