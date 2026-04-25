"use client";

// 30-second App Store preview. Loop order:
//   Logo (3s) → "best nights aren't planned" (3s) → Finger Game (8.5s)
//   → Alias Mode (6.5s) → BevyAI Chat (4.5s) → CTA (3.5s)
// Master timing exactly mirrors the original
// claude_design/Bevy App Preview 30s.html so the on-site preview reads
// the same as the App Store-bound source file.

import { forwardRef } from "react";
import { Sprite, Stage, type StageHandle } from "./animations";
import { BEVY } from "./bevyShared";
import {
  ProgressPips,
  SceneAIChat,
  SceneAliasMode,
  SceneCTA,
  SceneFingerGame,
  SceneHeadline,
  SceneLogo,
} from "./appPreviewScenes";

const SEGMENTS = [
  { start: 0, end: 3.0 },
  { start: 3.0, end: 6.5 },
  { start: 6.5, end: 15.5 },
  { start: 15.5, end: 22.0 },
  { start: 22.0, end: 26.5 },
  { start: 26.5, end: 30.0 },
];

function Master() {
  return (
    <>
      <Sprite start={0} end={4.2}>
        <SceneLogo />
      </Sprite>
      <Sprite start={4.2} end={7.0}>
        <SceneHeadline />
      </Sprite>
      <Sprite start={7.0} end={15.5}>
        <SceneFingerGame />
      </Sprite>
      <Sprite start={15.5} end={22.0}>
        <SceneAliasMode />
      </Sprite>
      <Sprite start={22.0} end={26.5}>
        <SceneAIChat />
      </Sprite>
      <Sprite start={26.5} end={30.0}>
        <SceneCTA />
      </Sprite>
      <ProgressPips segments={SEGMENTS} />
    </>
  );
}

const AppPreview30s = forwardRef<StageHandle>(function AppPreview30s(_, ref) {
  return (
    <Stage
      ref={ref}
      width={1170}
      height={2532}
      duration={30}
      background={BEVY.ink}
      loop
      autoplay
    >
      <Master />
    </Stage>
  );
});

export default AppPreview30s;
