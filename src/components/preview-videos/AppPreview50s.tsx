"use client";

// 50-second App Store preview. Same opening + showcase trio as the 30s
// loop, then expands the proof beat into a big intro + three real
// review screens, and ends on a CTA with a download pill.
//
// File on disk is named "Bevy App Preview 45s.html" but its Stage runs
// at duration={50}, so the user-facing label is 50s.

import { forwardRef } from "react";
import { Sprite, Stage, type StageHandle } from "./animations";
import { BEVY, RSQUO } from "./bevyShared";
import {
  ProgressPips,
  ReviewScreen,
  SceneAIChat,
  SceneAliasMode,
  SceneCTA,
  SceneFingerGame,
  SceneHeadline,
  SceneLogo,
  SceneProofIntro,
} from "./appPreviewScenes";

const SEGMENTS = [
  { start: 0, end: 3.2 },
  { start: 3.2, end: 7.0 },
  { start: 7.0, end: 17.0 },
  { start: 17.0, end: 23.5 },
  { start: 23.5, end: 29.5 },
  { start: 29.5, end: 44.5 },
  { start: 44.5, end: 50.0 },
];

function Review1() {
  return (
    <ReviewScreen
      eyebrow="★ App Store Review"
      quote={`Bevy is so much fun! I${RSQUO}m working at a hostel in Bali and we play every morning. It brings the group together so effortlessly.`}
      author="DukeNeuk"
    />
  );
}

function Review2() {
  return (
    <ReviewScreen
      eyebrow="★ App Store Review"
      quote="A fantastic way to get to know your partner better. Insightful questions into things about your partner you may not know or understand."
      author="AnthonyJane24"
    />
  );
}

function Review3() {
  return (
    <ReviewScreen
      eyebrow="★ App Store Review"
      quote="The questions are unique and help you get more than one-word answers. I use it inside of dating apps when the conversation goes kinda stale."
      author="Niece.doll"
    />
  );
}

function Master() {
  return (
    <>
      <Sprite start={0} end={4.7}>
        <SceneLogo showReviewChip />
      </Sprite>
      <Sprite start={4.7} end={7.5}>
        <SceneHeadline />
      </Sprite>
      <Sprite start={7.5} end={17.0}>
        <SceneFingerGame />
      </Sprite>
      <Sprite start={17.0} end={23.5}>
        <SceneAliasMode />
      </Sprite>
      <Sprite start={23.5} end={29.5}>
        <SceneAIChat />
      </Sprite>
      <Sprite start={29.5} end={32.5}>
        <SceneProofIntro />
      </Sprite>
      <Sprite start={32.5} end={36.5}>
        <Review1 />
      </Sprite>
      <Sprite start={36.5} end={40.5}>
        <Review2 />
      </Sprite>
      <Sprite start={40.5} end={44.5}>
        <Review3 />
      </Sprite>
      <Sprite start={44.5} end={50.0}>
        <SceneCTA showDownloadPill />
      </Sprite>
      <ProgressPips segments={SEGMENTS} />
    </>
  );
}

const AppPreview50s = forwardRef<StageHandle>(function AppPreview50s(_, ref) {
  return (
    <Stage
      ref={ref}
      width={1170}
      height={2532}
      duration={50}
      background={BEVY.ink}
      loop
      autoplay
    >
      <Master />
    </Stage>
  );
});

export default AppPreview50s;
