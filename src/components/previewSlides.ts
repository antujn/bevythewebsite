import type { CSSProperties } from "react";

export type PreviewFocus = {
  label: string;
  detail: string;
  align?: "left" | "center" | "right";
  imageSrc?: string;
  objectPosition?: CSSProperties["objectPosition"];
};

export type PreviewSlide = {
  id: string;
  theme: "crimson" | "amber" | "blue" | "gold" | "ember" | "night";
  backgroundSrc: string;
  imageSrc: string;
  stageMode?: "phones" | "brand" | "reviews";
  imageObjectPosition?: CSSProperties["objectPosition"];
  supportingImageSrcs?: string[];
  supportingImageObjectPositions?: CSSProperties["objectPosition"][];
  reviewItems?: Array<{ author: string; text: string }>;
  eyebrow: string;
  title: string;
  subtitle: string;
  focus?: PreviewFocus;
};

export const previewSlides: PreviewSlide[] = [
  {
    id: "hero",
    theme: "crimson",
    backgroundSrc: "/images/previews/backgrounds/background1.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/bundle-significant-other-1.png",
    stageMode: "brand",
    eyebrow: "The Intro",
    title: "Skip awkward. Start chemistry.",
    subtitle:
      "Onboarding lands the vibe instantly and gets players into the game fast.",
    focus: {
      label: "First impression",
      detail: "Brand + AI positioning in one clean hero screen.",
      align: "center",
      objectPosition: "50% 18%",
    },
  },
  {
    id: "prompts",
    theme: "crimson",
    backgroundSrc: "/images/previews/backgrounds/background2.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/bundle-significant-other-2.png",
    imageObjectPosition: "50% 24%",
    supportingImageSrcs: ["/images/previews/screenshots/iphone/bundle-significant-other-3.png"],
    supportingImageObjectPositions: ["50% 24%"],
    eyebrow: "Prompt Design",
    title: "Cards that command attention.",
    subtitle:
      "Large typography keeps every Truth and Dare easy to read and react to.",
    focus: {
      label: "Readable card UI",
      detail: "Strong contrast keeps prompts clear in low light.",
      align: "left",
      objectPosition: "50% 24%",
    },
  },
  {
    id: "party",
    theme: "crimson",
    backgroundSrc: "/images/previews/backgrounds/background3.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/bundle-nsfw-3.png",
    imageObjectPosition: "50% 40%",
    supportingImageSrcs: ["/images/previews/screenshots/iphone/bundle-nsfw-2.png"],
    supportingImageObjectPositions: ["50% 40%"],
    eyebrow: "After Dark",
    title: "Turn up the tension.",
    subtitle:
      "NSFW packs escalate the game when everyone is comfortable going bolder.",
    focus: {
      label: "Spicier deck",
      detail: "The UI keeps pace as prompts get more daring.",
      align: "center",
      objectPosition: "50% 40%",
    },
  },
  {
    id: "modes",
    theme: "amber",
    backgroundSrc: "/images/previews/backgrounds/background4.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/play-screen.png",
    eyebrow: "Pick A Mode",
    title: "Run the room your way.",
    subtitle:
      "Switch from Finger Game to Alias in seconds based on the crowd.",
    focus: {
      label: "Quick mode switch",
      detail: "Each option is visually distinct, even at a glance.",
      align: "right",
      objectPosition: "50% 38%",
    },
  },
  {
    id: "ai",
    theme: "gold",
    backgroundSrc: "/images/previews/backgrounds/background5.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/bundle-early-dating-1.png",
    imageObjectPosition: "50% 24%",
    supportingImageSrcs: ["/images/previews/screenshots/iphone/bundle-early-dating-3.png"],
    supportingImageObjectPositions: ["50% 24%"],
    eyebrow: "Date Night",
    title: "Keep first dates flowing.",
    subtitle:
      "Early Dating prompts help new couples skip small talk and connect faster.",
    focus: {
      label: "Conversation assist",
      detail: "Balanced prompts keep things playful, not forced.",
      align: "right",
      objectPosition: "50% 24%",
    },
  },
  {
    id: "achievements",
    theme: "ember",
    backgroundSrc: "/images/previews/backgrounds/background6.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/user-custom-card.png",
    imageObjectPosition: "50% 56%",
    supportingImageSrcs: ["/images/previews/screenshots/iphone/bundle-significant-other-3.png"],
    supportingImageObjectPositions: ["50% 56%"],
    eyebrow: "Personalize",
    title: "Write cards that fit your story.",
    subtitle:
      "Create private prompts and replay them whenever the mood feels right.",
    focus: {
      label: "Custom card builder",
      detail: "Create, save, and replay your own prompts.",
      align: "left",
      objectPosition: "50% 56%",
    },
  },
  {
    id: "widget",
    theme: "blue",
    backgroundSrc: "/images/previews/backgrounds/background7.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/ai-chat.png",
    imageObjectPosition: "50% 38%",
    supportingImageSrcs: ["/images/previews/screenshots/iphone/bundle-early-dating-2.png"],
    supportingImageObjectPositions: ["50% 38%"],
    eyebrow: "AI Assist",
    title: "Never run out of momentum with BevyAI.",
    subtitle: "Bevy AI keeps conversations flowing when the room goes quiet.",
    focus: {
      label: "Natural chat flow",
      detail: "Prompt + response format feels familiar immediately.",
      align: "right",
      objectPosition: "50% 38%",
    },
  },
  {
    id: "custom",
    theme: "night",
    backgroundSrc: "/images/previews/backgrounds/background8.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/widget.png",
    imageObjectPosition: "50% 12%",
    eyebrow: "Outside The App",
    title: "A fresh card delivered to your home screen every day.",
    subtitle: "Daily prompts keep Bevy present between sessions.",
    focus: {
      label: "Widget surface",
      detail: "One glance gives players a ready-made conversation starter.",
      align: "center",
      objectPosition: "50% 18%",
    },
  },
  {
    id: "nsfw",
    theme: "night",
    backgroundSrc: "/images/previews/backgrounds/background9.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/bundle-house-party-1.png",
    imageObjectPosition: "50% 38%",
    supportingImageSrcs: ["/images/previews/screenshots/iphone/bundle-house-party-2.png"],
    supportingImageObjectPositions: ["50% 38%"],
    eyebrow: "House Party",
    title: "Pre-game energy in one tap.",
    subtitle:
      "House Party bundles keep the room loud before everyone heads out.",
    focus: {
      label: "Pre-gaming mode",
      detail: "Fast prompts keep the group hyped and moving.",
      align: "right",
      objectPosition: "50% 38%",
    },
  },
  {
    id: "dating",
    theme: "night",
    backgroundSrc: "/images/previews/backgrounds/background10.jpeg",
    imageSrc: "/images/previews/screenshots/iphone/ai-chat.png",
    stageMode: "reviews",
    eyebrow: "Player Love",
    title: "Loved at house parties and pre-drinks.",
    subtitle: "Real App Store feedback from Bevy players.",
    reviewItems: [
      {
        author: "Cassidy C.",
        text: "So fun! Best drinking game we have ever found and we’ve tried quite a few!",
      },
      {
        author: "Wendy S.",
        text: "Used this with some friends I had over last Friday before we went out and everyone loved it.",
      },
    ],
    focus: {
      label: "4.7 App Store rating",
      detail: "Trusted by real players for pre-gaming and date nights.",
      align: "center",
      objectPosition: "50% 50%",
    },
  },
];
