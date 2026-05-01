# Touhou ～ Tales of Danmaku

![HTML5](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

<p align="center">
    <img src="assets/sprites/ui/maintitle.png">
</p>

---

**東方弾幕譚 (Tales of Danmaku)** is a Touhou fan-made danmaku game playable in the browser, built from scratch in TypeScript using the HTML5 Canvas.

Originally a uni project, the goal was to build a 2D shoot'em up playable in both solo and multiplayer. The player controls a character who must face waves of enemies and bosses while dodging bullets.

The game is inspired by **Embodiment of Scarlet Devil (EoSD)** and uses a **pixel art style**. All sprites were hand-crafted by Nyuke235, with some still serving as placeholders.

<p align="center">
    <img src="docs/img/gameplay.gif" width=440>
</p>

> The game is missing a lot of content, may contain bugs and only stage 1 is currently playable.

## Notice

- Currently, the game must be run locally. You’ll need to clone the repo and use Docker to play (see [Running the game](#running-the-game)). A live online version is planned in the future.
- As this is a learning project, you may encounter some "scaffolded" or messy code. Refactoring is an ongoing part of the roadmap.
- This project is built strictly for educational purposes and personal enjoyment.

## Characters

| Character       | Title                     | Speed  | Shot            | Spell Card                   |
| --------------- | ------------------------- | ------ | --------------- | ---------------------------- |
| Reimu Hakurei   | Shrine Maiden of Paradise | Medium | Exorcism Amulet | Divine Spirit "Fantasy Seal" |
| Marisa Kirisame | Ordinary Magician         | Fast   | Stardust        | Love Sign "Master Spark"     |

## Controls

Controls can be remapped in-game via the **Key Config** menu.

| Action       | Default key  |
| ------------ | ------------ |
| Move         | Arrow keys   |
| Shoot        | `Z`          |
| Bomb         | `X`          |
| Focus        | `Left Shift` |
| Menu select  | `Enter`      |
| Back / Pause | `Escape`     |

## Stages

| Stage       | Title                      | Mid-boss       | Boss                | Status |
| ----------- | -------------------------- | -------------- | ------------------- | ------ |
| Stage 1     | Black Ink Staining the Sky | Rumia (dark)   | Rumia               | ✅️     |
| Stage 2     | Ripples on the Misty Lake  | Daiyousei      | Cirno               | ✅️     |
| Stage 3     | ???                        | Mystia Lorelei | Hong Meiling        | ❌     |
| Stage 4     | ???                        | Koakuma        | Patchouli Knowledge | ❌     |
| Stage 5     | ???                        | Koakuma        | Sakuya Izayoi       | ❌     |
| Stage 6     | ???                        | Sakuya Izayoi  | Remilia Scarlet     | ❌     |
| Stage Extra | ???                        | Hong Meiling   | Scarlet sisters     | ❌     |

## Running the game

```bash
git clone https://github.com/Nyuke235/Touhou-Tales-of-Danmaku
cd Touhou-Tales-of-Danmaku

docker compose up --build
```

The game will be available at `http://localhost:8000`.

## Backend

The game includes a lightweight Express server (port `9000`) that handles two responsibilities:

- **Authentication** (`POST /api/auth`): Registers new users or logs in existing ones. On success, the server returns the user's save data.
- **Save / Load** (`POST /api/save`, `POST /api/load`): Persists and retrieves per-user game progress (unlocked stages, settings, etc.).

User data is stored in a flat JSON file (`server/data/data.json`). The server is spun up alongside the frontend via Docker Compose.

### Known security limitations

The current implementation is intentionally minimal and **not production-ready**:

- Passwords are stored and compared in **plaintext**, no hashing. **DO NOT USE YOUR REAL PASSWORD**
- CORS is fully open (`Access-Control-Allow-Origin: *`).
- There is no rate limiting, session management, or token-based authentication.

These issues are known and will be addressed in a future pass once the core gameplay is further along.

### Multiplayer

While the game is supposed to have a Multiplayer mode option, **online multiplayer is not currently in development**. It remains a planned feature for a later stage of the game.

## Future plans

[Trello](https://trello.com/b/4uOfHXhw/touhou-tales-of-danmaku)

## Credits

- Touhou Project and its characters are the property of Team Shanghai Alice (ZUN). This project follows the [Touhou Project Fan Content Guidelines](https://touhou-project.news/guidelines_en/).
- Music composed by [ZahranW](https://www.youtube.com/@ZahranW) and [TrojanHorse711](https://www.youtube.com/@Trojan711)
- Developed by Nyuke235

## License

This project is licensed under the **MIT License**.
