import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion'
import { Street3D, Vec } from './Street3D'
import { FilmLook } from './Look'
import { Icon } from './overlay'
import { Card, camMove, Fade, headAt, Line, num, Sfx, SPEAKER_COLORS, steps, who } from './kit'

// A starter short film: 36 s, 16:9. Replace the scenes, words and cast with your story; write the
// cards and subtitles in your audience's language.
// Music: scripts/music-plan.json lays out public/audio/bgm.mp3 to these scenes (120 BPM, 1 bar = 60
// frames, so scenes start on multiples of 60): intro 0–6 s, groove from 6 s, breakdown 22–26 s,
// the drop at 26 s (the last scene), final hit at 32 s.
export const SCENES = {
  morning: { from: 0, dur: 360 }, // 0–12 s
  golden: { from: 360, dur: 420 }, // 12–26 s
  night: { from: 780, dur: 300 }, // 26–36 s
}
export const FILM_TOTAL = 1080

// Subtitle colors by speaker.
Object.assign(SPEAKER_COLORS, { OWNER: '#ff8fb1', KID: '#ffd54a' })

const G = 0.12 // the sidewalk's top
const OWNER: Vec = [0, 0, 0.25] // behind the counter
const WINDOW: Vec = [0.7, G, 1.95] // a customer at the shop's front opening

// Morning: a crane down onto the street with the title, then the camera follows the kid walking in.
const Morning = () => {
  const f = useCurrentFrame()
  const time = num(f, [[0, 0], [360, 0.3]]) // 0 morning → toward noon
  const kid = who('kid', f, [[200, [-7.5, G, 2.5]], [360, [-1.2, G, 2.5]]])
  const c =
    f < 200
      ? camMove(f, [[0, [-5, 7.5, 21], [-1, 5.5, 1]], [200, [-1.5, 2.6, 13.5], [0, 1.9, 1.5]]], 34, 0.5)
      : camMove(f, [[200, [kid.pos[0] + 0.9, 1.35, 7.4], [kid.pos[0] + 0.9, 1.05, 2.4]], [360, [kid.pos[0] + 0.9, 1.35, 7.4], [kid.pos[0] + 0.9, 1.05, 2.4]]], 30)
  return (
    <AbsoluteFill>
      <Street3D cam={c} time={time} actors={[who('owner', f, [[0, OWNER]], [[300, 'wave']]), kid]} />
      <FilmLook time={time} />
      <Card at={40} until={180} text="YOUR FILM'S TITLE" size={104} top={300} />
      <Card at={62} until={180} text="a short film" size={38} top={430} />
      <Card at={214} until={300} text="MORNING" />
      <Fade to={30} />
      {steps(205, 360)}
    </AbsoluteFill>
  )
}

// Golden hour: a two-shot at the shop's front, a little conversation.
const Golden = () => {
  const f = useCurrentFrame()
  const time = num(f, [[0, 1.9], [420, 2.4]])
  const c = camMove(f, [[0, [-0.9, 1.5, 6.3], [0.3, 1.25, 1.4]], [420, [-0.7, 1.46, 5.5], [0.3, 1.25, 1.4]]], 28)
  const owner = who('owner', f, [[0, OWNER]], [[0, 'idle'], [40, 'talk'], [110, 'think'], [200, 'happy'], [300, 'talk']])
  const kid = who('kid', f, [[0, WINDOW]], [[0, 'talk'], [40, 'idle'], [150, 'talk'], [200, 'happy']])
  const h = headAt(c, owner)
  return (
    <AbsoluteFill>
      <Street3D cam={c} time={time} actors={[owner, kid]} />
      <FilmLook time={time} />
      <Card at={0} until={70} text="GOLDEN HOUR" />
      <Line at={4} until={38} who="KID" text="Good afternoon!" />
      <Line at={42} until={100} who="OWNER" text="Hi! What can I get you?" />
      <Icon name="bulb" at={200} until={260} x={h.x} y={h.y - 30} scale={10} />
      <Line at={300} until={400} who="OWNER" text="See you tomorrow!" />
      <Sfx at={4} name="8bit/talk" volume={0.25} />
      <Sfx at={200} name="8bit/idea" volume={0.45} />
    </AbsoluteFill>
  )
}

// Night: everyone waves; the camera pulls back and up over the street; the end card.
const Night = () => {
  const f = useCurrentFrame()
  const c = camMove(f, [[0, [0, 1.6, 7.6], [0, 1.6, 1.8]], [50, [0, 1.8, 8.4], [0, 1.7, 1.8]], [300, [0, 10.5, 27], [0, 3.6, 0]]], 34, 0.3)
  const cast = ['kid', 'uncle', 'owner', 'woman', 'grandma', 'man']
  const actors = cast.map((id, i) => {
    const a = who(id, f, [[0, [-2.0 + i * 0.8, G, 3.1]]])
    a.pose = f > 40 && Math.floor((f + i * 6) / 12) % 2 ? 'wave' : 'happy'
    return a
  })
  return (
    <AbsoluteFill>
      <Street3D cam={c} time={4} actors={actors} />
      <FilmLook time={4} />
      <Card at={20} until={290} text="THE END" size={110} top={110} />
      <Fade from={270} to={300} out />
    </AbsoluteFill>
  )
}

export const Film = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Html5Audio src={staticFile('audio/bgm.mp3')} volume={(f) => interpolate(f, [0, 10, FILM_TOTAL - 20, FILM_TOTAL], [0, 0.7, 0.7, 0.55], { extrapolateRight: 'clamp' })} />
    <Sequence from={SCENES.morning.from} durationInFrames={SCENES.morning.dur} name="1 Morning"><Morning /></Sequence>
    <Sequence from={SCENES.golden.from} durationInFrames={SCENES.golden.dur} name="2 Golden hour"><Golden /></Sequence>
    <Sequence from={SCENES.night.from} durationInFrames={SCENES.night.dur} name="3 Night"><Night /></Sequence>
  </AbsoluteFill>
)
