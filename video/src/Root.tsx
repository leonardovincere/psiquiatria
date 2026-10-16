import React from 'react';
import { Audio, Composition, Sequence, continueRender, delayRender, staticFile } from 'remotion';
import { FPS, H, W, sec, timeline } from './theme';
import { Closing, Desktop, Mobile, Proof, Result, SearchStage, Turn } from './scenes';

// Fontes da clínica (copiadas por scripts/clinic-data.mjs).
const fontsReady = delayRender('fontes');
Promise.all(
  [
    new FontFace('ClinicHeading', `url(${staticFile('fonts/heading-normal.woff2')})`, { weight: '400 500', style: 'normal' }),
    new FontFace('ClinicHeading', `url(${staticFile('fonts/heading-italic.woff2')})`, { weight: '400 500', style: 'italic' }),
    new FontFace('ClinicBody', `url(${staticFile('fonts/body-normal.woff2')})`, { weight: '400 600' }),
  ].map((ff) => ff.load().then((loaded) => document.fonts.add(loaded))),
).then(() => continueRender(fontsReady));

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

export const Root: React.FC = () => (
  <Composition id="whatsapp" component={Whatsapp} durationInFrames={sec(timeline.duration)} fps={FPS} width={W} height={H} />
);
