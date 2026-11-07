---
name: pixel-film
description: Make a short film, story video or video ad in the "HD-2D" style - a smooth 3D street with a shop (three.js) lit by the time of day (morning, noon, golden hour, dusk, night) with real shadows and sun rays, pixel-art characters as sprites, film-like camera moves, subtitles and original code-made music - rendered with Remotion. Use when the user asks for a pixel short film, a pixel or HD-2D animation, an animated story, ad or explainer with pixel characters, or a product/app promo told as a little film.
---

# Pixel short film (Remotion + three.js + pixel sprites)

Smooth 3D world, pixel-art people. Everything (people, buildings, textures, music, sound effects) is drawn or synthesized by code, so the result is original and needs no assets or licenses. The template is a complete, working starter; this file is all you need.

## Start

New project (copies `template/`, installs, makes the music and sounds, type-checks):

```bash
~/.claude/skills/pixel-film/bin/new-film.sh <folder>
cd <folder> && npm run studio      # compositions: Film (a 36 s starter) and CharSheet (every person and pose)
```

Inside an existing Remotion project instead: copy `template/src/film/`, `template/src/components/ui.tsx`, `template/src/theme.ts`, `template/scripts/` and `template/public/fonts/`, and add the dependencies from `template/package.json` (`three`, `@remotion/three`, `@react-three/fiber`, `@types/three`, `@remotion/bundler`, `@remotion/renderer`; every Remotion package on one exact version).

## Before building, agree on

Ask only what changes the work; otherwise choose and say what you chose.

- **Format.** 16:9 (1920×1080) suits a street, tracking shots, YouTube and the Facebook feed. 9:16 (1080×1920) suits Reels/TikTok/Shorts but the frame is narrow (about half the horizontal field of view), so wide shots and over-the-shoulder shots must be rethought. Ask when unclear: it changes every shot.
- **Story and length.** Write it as a table of scenes with start times on 2 s bars (60 frames at 30 fps): what happens, who says what, the time of day, the camera. 45–80 s suits an ad or a short.
- **Language.** Title cards and subtitles in the audience's language.
- **What to show off** (for a product or app): one clear moment for the feature, placed on the music's drop, using the real product (see "Showing a real app").

## Building blocks (template/src)

| File | What it is | Customize |
|---|---|---|
| `film/people.ts` | Pixel people, 64×112, drawn with canvas shapes then turned into pixel art (colors snapped to a palette, cel shading on the side away from the light, darker lines between parts, outline). Views: front, side (walk cycle `walk0–3`), back. Poses: `idle blink talk happy wave think worried phone pay`, `sideIdle sideTalk`, `back backPhone`, `sitPhone sitHappy`. Sample cast: `owner kid uncle woman grandma man`. | `PEOPLE`: skin, hair and `hairStyle` (bun, short, pony, bald, cap), top/bottom/shoes colors, `topDots`, `dress`, `apron`, `sleeveless`, `glasses`, `mustache`, `belly`, `kid`, `iris`. Check them in CharSheet. New clothing, props or hair go in `drawPerson`, `face`, `hairFront`. |
| `film/Street3D.tsx` | The set. A shop in the middle: interior (shelves of goods, counter, bulb, freezer, stool), front (wide opening above the counter, optional wire grill and hanging strips, sign, counter boards, awning). Neighbours (a glass-front shop, a shuttered shop with a striped awning, houses), second floors with balconies and jalousie windows lit at night, sidewalk, road, posts with lamps and optional sagging wires, a tree, plants, a table and chairs. Lighting by `time` (0 morning, 1 noon, 2 golden hour, 3 dusk, 4 night; fractions blend) with shadows, sky, stars, fog and lamp glows. People are lit billboards that cast shadows. Optional `items` (products on the counter), `cat`, `fx.beam` / `fx.scanX` (a phone scanning the counter). | `SET` at the top: sign words and colors, wall colors, counter boards, grill, hanging strips, products (`public/products/<name>.png`), neighbour names and colors, upper floors, wires. Coordinates: shop front at z = 1.2 (opening x −2..2, y 1..2.3, counter top y = 1.0), someone behind the counter at `[0, 0, 0.25]`, a customer at the front at `[0.7, 0.12, 1.95]`; sidewalk top y = 0.12 from z 1.2 to 3.6, road beyond; buildings along x from −19 to 19. For a different kind of place (café, office, market), change the shop's pieces in the JSX: it is plain boxes, planes and canvas textures. |
| `film/kit.tsx` | `camMove` (eased camera keyframes + handheld drift), `who` (a person on a path: walks in side view facing the way they go, otherwise the scheduled pose; idle blinks), `headAt` (screen point above a head), `Line` (subtitles with speaker colors), `Card` (big caption or time card), `Sfx`, `steps` (footsteps), `PhoneIn` (a phone with app screens), `Dim`, `Fade`, `num`. | `SPEAKER_COLORS`; `HEAD` for kids' head height. |
| `film/Look.tsx` | `FilmLook`: sun rays from the sun's side, a color grade by time of day, vignette, grain, letterbox bars. | Put it over every 3D scene with the same `time`. |
| `film/overlay.tsx`, `film/pixel.ts` | Pixel icons over heads (`bulb sweat heart question coin wifiOff clock zzz`) and `FoundBox` (a box around a found item with a counting % label). | Icons are small letter grids in `pixel.ts`. |
| `components/ui.tsx` | `Phone`: a phone frame showing 1080×1920 screenshots, with zoom keyframes (`cams`), taps and wipes. | — |
| `film/Film.tsx` | The starter: morning crane with the title and a tracking walk; a golden-hour two-shot conversation; night, everyone waves, pull back and up, end card. | Replace with the story. |
| `scripts/make-music.mjs` + `music-plan.json` | An original upbeat track (120 BPM, C–G–Am–F; marimba, pads, bass, a lead hook, risers, a final hit) laid out by the plan, plus cinematic sounds (whoosh, pop, tap, tick, beep, chaching, chime, shutter, scan, detect, check, sparkle, impact, printer, stamp, page, womp). | The plan, in seconds: `sections` (intro / main / break / end), `lead` and `up` ranges, `hits` (drops), `final` (4 s before the end). |
| `scripts/make-sfx.mjs` | 8-bit sounds in `public/audio/8bit/` (talk, coin, idea, cash, step, jump, select, done, scan, detect, womp, pop, tap, whoosh) and an optional chiptune track. | — |
| `scripts/capture-screens.mjs` | Real screens of a web app as phone screenshots (see below). | `scripts/shots.json` |
| `scripts/stills.mjs`, `scripts/audio-check.mjs` | Check frames and music before a long render. | — |

## Camera grammar (what makes it feel like a film)

- **Open** with a crane: high and wide over the street, coming down to street level (`[-5, 7.5, 21] → [-1.5, 2.6, 13.5]`, fov 34).
- **Tracking**: follow a walking person from the road side: camera x = their x + 0.9, z ≈ 7.4, y ≈ 1.35, looking at them, fov 30.
- **Two-shot** at the shop front from the customer's side, not from behind them (camera x ≈ −0.9 when the customer stands at x 0.7), or the customer's sprite hides the other person.
- **Close-up**: a slow push-in (fov 24–28) with the camera **above** counter height (y ≈ 2.1 looking at y ≈ 1.36), so things on the counter don't cover the face.
- **Over the shoulder** from inside, behind someone in the `backPhone` pose: them low in the frame, the counter and the customer outside in view.
- **A line of people**: truck sideways along it.
- **Ending**: everyone waves close to the camera, then pull back **and up** over the whole street (`[0, 1.6, 7.6] → [0, 10.5, 27]`, looking up to `[0, 3.6, 0]`), with the end card on top, then fade to black.
- Time cards (MORNING, NOON, GOLDEN HOUR, NIGHT…) at the top as the light changes; subtitles at the bottom for dialogue (they read better than speech bubbles at film size).
- Start scenes on bar lines (multiples of 60 frames) and set the music plan so the drop lands on the key moment and the final hit on the end card.

## Showing a real app

Show the real product, not a mock-up. For a web app (or the web build of a mobile app): seed it with made-up data, then `node scripts/capture-screens.mjs scripts/shots.json` (needs `npm i -D playwright && npx playwright install chromium`). It shoots 1080×1920 phone screens into `public/shots/`. Give `"camera"` a JPEG and the app's camera sees that image, so scanning or recognition features really run; draw that scene with made-up products (SVG → JPEG with sharp or a canvas) rather than real brands. Put the screens on `PhoneIn` / `Phone` with taps timed to `tap`/`select` sounds. Any number shown in the film (a price, a % match) should be what the app actually produced.

## Check, then render

1. `npm run stills -- 100 400 900 …` → `out/stills/*.jpeg` at half size. Look at frames from every scene: people hiding each other, faces covered, text over signs, a night that looks like day, subtitles over busy areas. Fix before rendering; a full render is slow.
2. `node scripts/audio-check.mjs`: below 250 Hz under ~65% and 250–2000 Hz at 30% or more, or the music sounds like nothing on phone and laptop speakers.
3. `npm run render` (`--gl=swangle`: WebGL on the CPU). With shadows at 1080p expect seconds per frame (80 s of film ≈ 2 h on a small server); run it in the background. Or the user renders from the studio in a browser with a GPU.

## Pitfalls

- **Portrait is narrow**: a person 1 m beside the camera's axis at 2 m away is out of frame. In 9:16, separate subjects vertically (camera high, the near person low in the frame).
- **Sprites block the camera**: a person between the camera and the subject fills the frame (they are big flat planes). Move the camera, not only the person.
- **Bass-heavy music sounds like silence** on small speakers: give the bass harmonics, keep chords and melody in the mids, and don't low-pass hard.
- **Night too bright**: keep ambient and sky light low and let lamps, the sign and lit windows light the scene (the presets do).
- **Textures**: wrap async loads in `delayRender` / `continueRender`, and never request a file that doesn't exist (the render hangs).
- **Determinism**: no `Math.random` in frames or generated audio (seeded random, or Remotion's `random(seed)`), so re-renders match.
- **Fonts** ship in `public/fonts` (Poppins, Caveat, Press Start 2P; SIL Open Font License), so rendering needs no internet.
- **Remotion's own ffmpeg** (`node_modules/@remotion/compositor-*/ffmpeg`) has few filters: decode to PCM WAV for analysis, encode MP3 with libmp3lame, grab frames with `-ss`.

## Rules

- Original characters, places and products only: no real brands, logos or people, and no recreation of a specific existing game, film or show (its characters, art or look), even renamed.
- Claims in an ad must be true of the product. Point out anything the user must confirm before posting (for example "free on the app store" only once it is public).
