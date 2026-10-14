import { Composition, continueRender, delayRender } from 'remotion';
import { AnimusPreview, DURATION, HEIGHT, WIDTH } from './Video';
import { FPS, fontsLoaded } from './theme';

const handle = delayRender('Carregando fontes');
fontsLoaded.then(() => continueRender(handle));

export const Root: React.FC = () => (
  <Composition id="AnimusPreview" component={AnimusPreview} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
