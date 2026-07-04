# Sonai Star Quest

A polished original side-scrolling platform game that runs directly in the browser.

Main character: **Sonai**, an original girl hero.

This project does **not** include Nintendo/Mario names, sprites, music, sounds, levels, or assets. It is an original classic platformer built with HTML5 Canvas and JavaScript.

## Features

- Browser playable: no install needed for players
- GitHub Pages ready
- Original girl hero: Sonai
- 3 side-scrolling levels
- Smooth platformer physics
- Acceleration, friction, running, variable jump height
- Coyote time and jump buffering for better game feel
- Gems, enemies, stomp attacks, bonus blocks, breakable blocks
- Power-up mode
- Checkpoints
- Moving platforms and springs
- Parallax background
- Sound effects using Web Audio API
- Keyboard and mobile touch controls
- Local best score saved in the browser

## Play locally

From this folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

If `python` does not work on Windows, try:

```bash
py -m http.server 8000
```

## Controls

- Move: Left/Right arrows or A/D
- Jump: Space, W, or Up arrow
- Run: Shift or X
- Pause: P
- Restart: R
- Mute: M

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. Go to **Settings > Pages**.
4. Choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save.

Your game will be available at:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

## File structure

```text
sonai-adventure/
├── index.html
├── styles.css
├── src/
│   └── game.js
├── README.md
├── .nojekyll
└── .github/
    └── workflows/
        └── deploy-pages.yml
```
