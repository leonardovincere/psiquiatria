import React from 'react';
import { Audio, Composition, Sequence, continueRender, delayRender, staticFile } from 'remotion';
import { FPS, H, W, sec, timeline } from './theme';
import { Closing, Desktop, Mobile, Proof, Result, SearchStage, Turn } from './scenes';
import * as Marca from './marca/scenes';
import marcaTimeline from './marca/timeline.json';

// Fontes da clínica (copiadas por scripts/clinic-data.mjs).
const fontsReady = delayRender('fontes');
Promise.all(
  [
    new FontFace('ClinicHeading', `url(${staticFile('fonts/heading-normal.woff2')})`, { weight: '400 500', style: 'normal' }),
    new FontFace('ClinicHeading', `url(${staticFile('fonts/heading-italic.woff2')})`, { weight: '400 500', style: 'italic' }),
    new FontFace('ClinicBody', `url(${staticFile('fonts/body-normal.woff2')})`, { weight: '400 600' }),
  ].map((ff) => ff.load().then((loaded) => document.fonts.add(loaded))),
).then(() => continueRender(fontsReady));
// Cursiva opcional (theme.fontScript): sem o arquivo, o vídeo usa a fonte dos títulos.
const scriptReady = delayRender('fonte cursiva');
new FontFace('ClinicScript', `url(${staticFile('fonts/script-normal.woff2')})`)
  .load()
  .then((loaded) => document.fonts.add(loaded))
  .catch(() => undefined)
  .finally(() => continueRender(scriptReady));

const S = timeline.scenes;
const span = (k: keyof typeof S) => ({ from: sec(S[k][0]), durationInFrames: sec(S[k][1] - S[k][0]) });

const Whatsapp: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={sec(S.turn[0])}>
      <SearchStage />
    </Sequence>
    <Sequence {...span('turn')}>
      <Turn />
    </Sequence>
    <Sequence {...span('result')}>
      <Result />
    </Sequence>
    <Sequence {...span('desktop')}>
      <Desktop />
    </Sequence>
    <Sequence {...span('mobile')}>
      <Mobile />
    </Sequence>
    <Sequence {...span('proof')}>
      <Proof />
    </Sequence>
    <Sequence {...span('closing')}>
      <Closing />
    </Sequence>
    <Audio src={staticFile('audio/track.wav')} />
  </>
);

// Roteiro "marca própria": a busca de hoje (informações soltas, mais uma na lista) e a virada para o site.
const M = marcaTimeline.scenes;
const mspan = (k: keyof typeof M) => ({ from: sec(M[k][0]), durationInFrames: sec(M[k][1] - M[k][0]) });
const MarcaVideo: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={sec(M.scatter[0])}>
      <Marca.Search />
    </Sequence>
    <Sequence {...mspan('scatter')}>
      <Marca.Scatter />
    </Sequence>
    <Sequence {...mspan('crowd')}>
      <Marca.Crowd />
    </Sequence>
    <Sequence {...mspan('turn')}>
      <Marca.Turn />
    </Sequence>
    <Sequence {...mspan('result')}>
      <Marca.Result />
    </Sequence>
    <Sequence {...mspan('desktop')}>
      <Marca.Desktop />
    </Sequence>
    <Sequence {...mspan('mobile')}>
      <Marca.Mobile />
    </Sequence>
    <Sequence {...mspan('pillars')}>
      <Marca.Pillars />
    </Sequence>
    <Sequence {...mspan('closing')}>
      <Marca.Closing />
    </Sequence>
    <Audio src={staticFile('audio/marca.wav')} />
  </>
);

export const Root: React.FC = () => (
  <>
    <Composition id="whatsapp" component={Whatsapp} durationInFrames={sec(timeline.duration)} fps={FPS} width={W} height={H} />
    <Composition id="marca" component={MarcaVideo} durationInFrames={sec(marcaTimeline.duration)} fps={FPS} width={W} height={H} />
  </>
);
