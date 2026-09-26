# BrandForge Media: 30s website film, production blueprint

Source of truth: the live site (index.html, work pages, src/forge.js, src/style.css). The film uses the site's own fonts, colours, copy, 3D engine and objects. It is the site's design system played in time.

---

## 1. Creative concept

**"The site, forged."** The film shows how a BrandForge website comes into being: a cooled, raw material (the same molten chrome that is the hero of the homepage) is put under heat and pressure. It separates into precise layers, and those layers lock into the site's 12-column grid. The grid becomes the actual homepage. The homepage gains depth and becomes architecture. The architecture starts routing signals and becomes a system. Everything is compressed into one engineered object. That object unfolds into the real portfolio, and then goes dark on the wordmark.

Every transformation is literal to the product: the viewer sees the real header, the real "We forge brands that move." hero, the real chapter layout and the real project pages. The metaphor ("forging") is carried only by physics: heat in the seams, pressure as layers split, precision as parts lock to a grid, and cooling as orange heat settles into a pale steel light once the system is running.

The film is 90% black, graphite, titanium and smoke. Heat appears three times as a narrow line, never as fire.

## 2. Visual system

**Colour (site tokens first)**
| Role | Value | Source |
|---|---|---|
| Deep black (film space) | #050506 → #0A0A0C | brief; darker than the site so the site's own ink reads as a surface |
| Site ink (UI planes) | #0E0D0C | `--ink` |
| Bone (type, titanium tint) | #E9E5DE | `--bone` |
| Dim (mono labels) | #8A847B | `--dim` |
| Brand red (FORGE, rules) | #E8202A | `--forge`, logo red |
| Heat line | #FF5A1F → #FF7A1A | identical to the site studio's "warm forge rim" softbox (0xff5a1f) |
| Cooled signal | #BFE3EE, peaking at #3AE3FF | new; the only colour not already in the site |

Decision on cyan: the site has no cyan. Use it only in shots 5–6 as the cooled state of the heat line, in thin lines covering less than 3% of the frame, so it reads as temperature, not as a new brand colour.

**Materials**
- Brushed titanium with anisotropic streaks: the raw slab.
- Black chrome: the forge material, the site's hero blob (metalness 1, roughness 0.12).
- Smoked glass (transmission 0.9, tint #0A0A0C, roughness 0.08): cards.
- Dark acrylic: grid planes.
- Polished aluminium: rails.
- Micro-scratches and fingerprints are applied through roughness maps, so nothing reads as sterile CG.

**Lighting.** The site's own studio rig from `forge.js` (overhead softbox, left key, warm forge rim, floor bounce) becomes the film's lighting. Added to it:
- 1–2 mm rim lights.
- One volumetric beam per shot at most.
- Height haze at 3–5% density.
- Bloom threshold 0.9, strength 0.2 or less.

**Typography**
- **Geist:** statements.
- **Instrument Serif Italic:** the second line, exactly like the site's chapter titles, e.g. "Work that / *runs itself.*"
- **Geist Mono uppercase, +0.14em:** labels with the site's "(01)" index style.

Copy is set in sentence case, as on the site, rather than the brief's all caps. Type sits on the site's grid (left column, 150 px margin at 1080p), is never larger than about 9% of frame height, and arrives with the site's line-mask reveal (`.lines`).

**Composition.** The 12-column grid is visible at key moments. Subjects sit on the right third and type on the left third, mirroring the site's chapter layout (object right, copy left). Negative space covers at least 50% of the frame in every shot except the climax.

## 3. Exact 30-second timeline (24 fps, 720 frames)

| # | Time | Frames | Shot | Copy |
|---|---|---|---|---|
| 1 | 0:00.0–0:04.0 | 0–95 | Heat line under titanium (macro) | (01) · Ideas aren't / *enough.* |
| 2 | 0:04.0–0:06.5 | 96–155 | Pressure: the slab splits into layers | — |
| 3 | 0:06.5–0:08.0 | 156–191 | Layers lock to the 12-column grid | They need / *to be built.* |
| 4 | 0:08.0–0:12.0 | 192–287 | The grid becomes the homepage | (02) · Design. |
| 5 | 0:12.0–0:16.0 | 288–383 | The homepage gains depth; UI becomes architecture | (03) · Technology. |
| 6 | 0:16.0–0:20.0 | 384–479 | Signal routing through the system (strongest pulse at 0:18.0) | (04) · Intelligence. |
| 7 | 0:20.0–0:24.0 | 480–575 | Convergence: the hero monolith, slow orbit | — (silence of type) |
| 8 | 0:24.0–0:27.0 | 576–647 | The monolith unfolds into the portfolio ecosystem | Engineered / *into experience.* |
| 9 | 0:27.0–0:29.4 | 648–705 | Blackout, then a rim light draws the wordmark | BRANDFORGE · MEDIA / DIGITAL EXPERIENCES. ENGINEERED. |
| 10 | 0:29.4–0:30.0 | 706–719 | Hold on black | — |

Pacing: 0–6 s restrained · 6–18 s building · 18–25 s peak · 25–30 s release.

## 4. Storyboard

1. **Heat line.** Full-frame macro of a brushed titanium slab. The surface is nearly black, and one diagonal specular streak crosses it. A 1 px orange line travels left to right beneath the surface, lighting micro-scratches from inside as it passes, like light under frosted metal. The mono label "(01)" and the two-line copy sit bottom-left. Nothing else moves.
2. **Pressure.** The slab creaks apart into seven horizontal layers, each 3 mm thick with machined chamfers. Heat glows only in the seams, as the site's dissolve does with its forge-orange edge. The layers drift apart, heavy, with inertia.
3. **Grid.** The layers rotate 90° and snap flat onto an invisible 12-column grid. Each lands with a tiny overshoot and a click. Hairline column rules fade up in bone at 8% opacity. Copy appears.
4. **Design.** Looking straight down, the layers become the real homepage, drawn in light onto dark acrylic, in order:
   - the header (BRAND in bone, FORGE in red, the nav and the "Let's talk" pill)
   - the "(01) Independent digital studio" label
   - the "We forge brands / *that move.*" title, revealing line by line exactly as on the site
   - the hero chips
   - the molten blob materialising in its right-hand position

   "Design." is set in the left margin.
5. **Technology.** The camera tilts from top-down to a glancing 20° angle and tracks laterally. Depth appears:
   - the chapter sections step down in z like floors
   - the "Recent forgings" cards lift off as smoked-glass slabs with the real project screenshots inside
   - the grid rules extrude into thin aluminium ribs

   The site becomes a building you move through.
6. **Intelligence.** Top-down, 50 mm. The contact form's four fields become four input ports on the edge of a system board. A titanium bead with an orange core (an enquiry) enters, and the path it takes is the site's actual enquiry flow:
   - it passes a glass gate that classifies it (the gate's edge turns from orange to steel)
   - it splits along aluminium rails to the right service card (Automation / Shopify / 3D Web / Social)
   - it triggers a card, which prints a "14 days" stat in the site's `chapter__stat` style

   At 0:18 every route fires at once, which is the pulse.
7. **Convergence.** All rails, cards and planes retract inward along their own paths and compress into one hero monolith. A black chrome frame holds stacked smoked-glass site layers, and the molten forge blob is suspended in the core, slowly breathing. Its heat line has cooled to thin steel-cyan filaments. The camera makes a slow 40° orbit with haze and one volumetric beam from above.
8. **Unfold.** The monolith's glass layers hinge open like a book fanning out, and each layer becomes one project page in the site's macOS-style browser frame: Vanta Motors, Kairos Horology, Aurum Estates, Solace Resorts, Noir Atelier and Halcyon Clinics. The four service objects rest on plinths between them: watch, iridescent lamp, velvet chair, cine camera. The camera pulls back wide. Copy sits on the left.
9. **Wordmark.** The lights cut in two beats: the fill goes first, the rim last. In darkness, a single rim light traces the edges of the extruded wordmark, BRAND in brushed titanium and FORGE in dark red lacquer, the same colour split as the site header. "MEDIA" follows in Geist Mono beneath it with wide tracking, then the line "DIGITAL EXPERIENCES. ENGINEERED." Nothing moves except the light.
10. Hold on black.

## 5. Camera specification

| Shot | Lens | Movement | Focus |
|---|---|---|---|
| 1 | 100 mm macro, f/2.8 look | locked, 2% push over 4 s | 1 cm plane on the heat line; streak falls off |
| 2 | 85 mm | slow lateral dolly, 0.3 m | follows the top layer |
| 3 | 85 mm | settles to still on the snap | pulls to the grid plane |
| 4 | 65 mm, top-down | still, then a 4° tilt | deep focus (UI must read) |
| 5 | 35 mm | tilt to 20° glancing, lateral track 1.5 m | rack from the near card to the far chapter |
| 6 | 50 mm, top-down | 8° slow rotation; micro-push on 0:18 | deep focus |
| 7 | 65 mm | 40° orbit over 4 s, eased | on the core; frame edges soft |
| 8 | 35 mm | pull-back 2 m, 5° rise | deep → shallow on the last beat |
| 9 | 85 mm | locked | razor on the wordmark face |

Shutter 180° (motion blur = half a frame). Camera easing is cubic in-out only, and no handheld shake.

## 6. Animation specification

- **Physics feel.** Everything uses mass-based springs: stiffness 120, damping 18, 3–5% overshoot on landings. Heavy objects such as layers and the monolith take 300–500 ms to reach speed. UI elements use the site's own easing `cubic-bezier(0.7, 0, 0.2, 1)`.
- **Heat line.** A shader-driven emissive band in the site's heat orange travels at constant speed. Its trailing edge cools, orange → red → dark, over 0.4 s.
- **Layer split.** Each layer is offset by the previous one plus 90 ms, and the seam glow scales with separation velocity.
- **Grid snap.** Snaps are staggered left to right at 60 ms.
- **UI assembly.** Uses the site's real reveal timings: the `.lines` mask reveal (lines rise from 110%, 0.9 s), and chips fade in with 80 ms stagger.
- **Depth extrude.** Planes travel in z with parallax proportional to their layer index.
- **Signal routing.** The bead moves at constant speed on rails, pausing 120 ms at each gate. A gate "decides" by flipping its edge from orange to steel. Fan-outs stagger at 40 ms.
- **Monolith.** Components retract along reversed paths. The blob keeps the site's noise displacement (`uAmp` 0.2) at 50% speed.
- **Unfold.** Hinges rotate 0 → 72° with spring settle. The product objects dissolve in with the site's own forge-edge dissolve.
- **Wordmark.** No motion, only the rim light sweeping across it (0.9 s).

## 7. Website integration (per shot)

1. The forge material: the homepage hero blob's black chrome, cooled into a slab. The orange is the site's `0xff5a1f` rim light.
2. The site's dissolve shader, whose forge-orange edge becomes the seam glow.
3. The site's 12-column `.grid` system and the hairline `--rule` colour.
4. The real hero section: header (wordmark, nav, pill), "(01) Independent digital studio", "We forge brands / *that move.*", hero chips, blob position.
5. The real chapter stack (Automations / 3D web / Shopify / Social) and the "Recent forgings" `work__grid` cards with the real `/shots/*.webp`.
6. The site's contact form (Name, Email, Budget in ₹, message), its enquiry chips, and the chapter stats ("14 days", "60 fps", "100%", "30 days").
7. The homepage hero blob plus the scroll keyframe idea (one object that becomes each service).
8. The `/work/*` case-study pages and browser-frame covers, plus the four service models used on the homepage.
9. The header and footer BRAND/FORGE wordmark, with the colour split exactly as the site.

## 8. Transition design

| From → To | Physical mechanism |
|---|---|
| 1 → 2 | The heat line reaches the right edge and stops. Pressure builds along that line and the slab splits along it. |
| 2 → 3 | The separated layers rotate flat. Their edges become the column rules. |
| 3 → 4 | Each layer's top face becomes a section of the page, and the text is etched in light along the layer. |
| 4 → 5 | The camera tilt reveals that the "flat" page had thickness all along, and the cards lift. |
| 5 → 6 | The camera rises to top-down. The aluminium ribs of the architecture become the rails of the routing board, same geometry and continuous. |
| 6 → 7 | On the 0:18 pulse, every route retracts to the centre and pulls the cards with it into the monolith. |
| 7 → 8 | The monolith's glass layers hinge open, and each is a project page. |
| 8 → 9 | The pages fold back to black-glass edges. Lights go out, fill first and rim last. The final rim becomes the light that traces the wordmark. |

There are no crossfades, glitches or flashes.

## 9. Sound design timeline

| Time | Layer |
|---|---|
| 0:00 | Room tone at -50 dB; sub pressure (30 Hz) fades in |
| 0:01.2 | Heat line: a filtered electrical hum that pans left to right with it |
| 0:04.0 | Deep metallic stress groan; a sub thump when the slab splits |
| 0:04–0:06 | Seven machined slides, one per layer, tiny and dry |
| 0:06.5 | Grid snap: a train of precision clicks, left to right |
| 0:08–0:12 | Soft digital ticks under each line reveal; air movement |
| 0:12–0:16 | Glass resonance as the cards lift; distant mechanical movement |
| 0:16–0:20 | Servo motion on the gates, relay clicks at each decision; a glass ping on each routed card |
| 0:18.0 | Strongest pulse: every route fires at once (low impact plus a short metallic ring) |
| 0:20–0:24 | Deep drone swell, metallic resonance and slow air as the camera orbits |
| 0:24–0:27 | Hinge servos, a whoosh per page, a glass shimmer |
| 0:27.0 | Everything cut to near silence |
| 0:27.6 | One low impact (40 Hz) on the wordmark rim-light, then a 2.5 s atmospheric decay |
| 0:30.0 | Silence |

## 10. Music progression

Minimal experimental electronic. There's no melody until 0:08, and never a lead.
- **0–6 s:** sub and texture only.
- **6–12 s:** a sparse pulse (a muted tick at about 90–100 BPM).
- **12–18 s:** add a bass motif and filtered percussion.
- **18–25 s:** full pulse, the strongest section.
- **25–27 s:** filter closes.
- **27 s:** music stops; the wordmark impact carries the end.

**Track characteristics to license** (Pixabay, free for commercial use; or Artlist/Epidemic if you have them): minimal / ambient techno or "cinematic minimal electronic", 90–110 BPM, sub-heavy, no vocals, no piano, no risers or EDM drops, and a stem-like arrangement that can be edited to 30 s.

**Sound effects:** layered from royalty-free sound-effect libraries (sub drop, metal stress, servo, relay click, glass ping, air whoosh) and mixed to the timeline above. Sound I synthesise in code isn't good enough (you heard that), so this approach uses only recorded material.

## 11. Rendering method

**Rendered directly in 3D (all shots).** The film is rendered frame by frame with the site's own Three.js engine in GPU-accelerated Chrome. It uses physically based materials, the site's studio environment and real geometry: the site's GLB models, extruded Geist type and the real project screenshots as textures. What this gives:
- **Real depth of field** (depth-based), used only on meshes.
- **Motion blur** by accumulating 8 sub-frames per frame, equal to a 180° shutter.
- **Volumetrics** as a raymarched height fog, plus one cone light per shot.
- **Micro-imperfections** through roughness and scratch maps.
- **Contact shadows** from a soft shadow map.

What this is not: a path tracer. The result looks like high-end real-time cinematic rendering (Unreal-grade), not Octane or Redshift. The designs are kept to what real-time rendering does well: dark scenes, rim light, glass edges and precise geometry.

**AI generation (optional).** Only for shot 1's macro titanium surface plate if we want extra photoreal texture detail, via Runway or Kling image-to-video from a still. I can't run those tools here; the prompts are in section 12. AI isn't used for any UI shot, because it garbles text and interfaces, and the brief says to use the real site.

**Composited afterwards.** Typography is rendered as a live HTML layer over the 3D, so it uses the site's exact fonts and reveals. After that:
- film grain
- a subtle halation on highlights only
- vignette
- the final colour grade
- the sound mix in ffmpeg

## 12. Generation prompts (optional AI plates)

- **Shot 1 plate:** "Extreme macro photograph of a brushed titanium surface in near-total darkness, fine anisotropic brushing marks, microscopic scratches and dust, a single thin diagonal specular highlight, deep black background #050506, 100mm macro lens, f/2.8, shallow depth of field, controlled studio rim light, photoreal, high dynamic range, no text"
- **Shot 1 motion (image-to-video):** "a hair-thin line of warm orange light (#FF5A1F) travels slowly left to right beneath the metal surface, lighting the brushing marks from within, camera locked with a very slow push-in, no other movement, 4 seconds"
- **Shot 7 reference still (look-dev only, not in the edit):** "Engineered monolith of black chrome frame holding stacked smoked glass panels, a molten liquid-metal core suspended inside, thin pale cyan filament lines, near-black studio, single overhead volumetric beam, light haze, 65mm lens, product photography, minimal, Swiss industrial design"

## 13. Negative prompts

"text, letters, logos, watermark, UI, hologram, HUD, neon, purple, blue gradient, rainbow, cyberpunk, city, robot, brain, circuit board cliché, matrix code, sparks, fire, flames, anvil, blacksmith, lens flare, glitch, particles explosion, bokeh balls, oversaturated, plastic, CGI look, cartoon, low detail, noise artifacts, warped geometry, people, hands, laptop, office"

## 14. Post-production

- **Compositing:** 3D beauty, then the HTML type layer, then halation (highlights over 0.9, 3 px, orange-tinted), grain, then vignette (18%).
- **Grade:** blacks lifted to #050506 (never crushed to #000, so they don't band on the web); highlights roll off softly, no clipping. Split tone: shadows neutral-cool, highlights warm bone. Saturation at 90% except the heat line.
- **Grain:** 4K fine grain at 1.5% luminance only; it also stops banding in compression.
- **Motion blur:** 8-subframe accumulation, plus an extra 1.5× on the three transition moves.
- **Type:** the site's fonts; kerning is checked by eye on every title frame; nothing is under 24 px at 1080p.
- **Sound mix:** -14 LUFS integrated, -1 dBTP ceiling; sub is high-passed at 25 Hz; SFX sit under the music by 3–4 dB except the 0:18 pulse and the 0:27.6 impact; mono-compatible.

## 15. Final export specification

| Deliverable | Spec |
|---|---|
| Master | 3840×2160, 24 fps, 30.000 s (720 frames), H.265 10-bit 4:2:2 at CRF 12, plus a lossless PNG frame sequence kept locally |
| Web 1080p AV1 | 1920×1080, 10-bit, CRF 30, ~2.5 Mbps; grain kept |
| Web 1080p VP9 WebM | fallback for browsers without AV1 |
| Web 1080p H.264 MP4 | High profile, CRF 20, `+faststart`; universal fallback |
| Mobile 4:5 (1080×1350) | separate render (see section 16), AV1 and H.264 |
| Poster | frame 0:21.5 (monolith), AVIF + JPG, 1920 and 1080 wide |
| Audio | AAC 192 kbps (web), 320 kbps (master) |

## 16. Website implementation recommendation

- **Placement:** a full-width "(02) The studio" film block between the intro and the service chapters. The film doesn't replace the live 3D hero: the hero stays interactive, and the film is its cinematic twin.
- **Loading:**
  - `preload="none"` with only the poster loaded.
  - The video is attached and played with an IntersectionObserver when the block comes within 50% of the viewport.
  - `muted playsinline` autoplay, since browsers only autoplay without sound.
  - A small mono "Sound on" button plays the full sound design.
- **Formats:** `<source>` order AV1 → VP9 → H.264. Desktop gets 1080p. Mobile gets the 4:5 render at 720 px wide (~1.5 MB). Never serve the 4K master on the site.
- **Mobile crop strategy:** the 16:9 film isn't cropped. The 4:5 version is re-rendered from the same scene with type moved to the top third and subjects to the lower two-thirds. That's easy because the type is an HTML layer.
- **Reduced motion and Save-Data:** under `prefers-reduced-motion` or Save-Data, show the poster plus the text "Digital experiences. Engineered." with a play button; no autoplay.
- **Loop:** the film starts and ends on black, so if looped, a 0.5 s fade through black joins them invisibly. On the site it plays once and rests on the wordmark frame.
- **Compression:** use 10-bit AV1 with grain retained (film-grain synthesis off, real grain on) to avoid banding in dark gradients, and never bump contrast after encoding. Test on a phone at 50% brightness.
- **Performance budget:** the site's JS stays untouched. The video adds about 0 KB until scrolled to, and about 6–9 MB streamed at 1080p on desktop.
