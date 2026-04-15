"use client";
import { CSSProperties, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDownload } from "./DownloadContext";

type PreviewFocus = {
  label: string;
  detail: string;
  align?: "left" | "center" | "right";
  imageSrc?: string;
  objectPosition?: CSSProperties["objectPosition"];
};

type PreviewSlide = {
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

const previewSlides: PreviewSlide[] = [
  {
    id: "hero",
    theme: "crimson",
    backgroundSrc: "/images/previews/backgrounds/background1.jpeg",
    imageSrc: "/images/previews/screenshots/hero-screen.png",
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
    imageSrc: "/images/previews/screenshots/bundle-significant-other-2.png",
    imageObjectPosition: "50% 24%",
    supportingImageSrcs: ["/images/previews/screenshots/bundle-significant-other-3.png"],
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
    imageSrc: "/images/previews/screenshots/bundle-nsfw-3.png",
    imageObjectPosition: "50% 40%",
    supportingImageSrcs: ["/images/previews/screenshots/bundle-nsfw-2.png"],
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
    imageSrc: "/images/previews/screenshots/play-screen.png",
    supportingImageSrcs: ["/images/previews/screenshots/finger-game.png"],
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
    imageSrc: "/images/previews/screenshots/bundle-early-dating-1.png",
    imageObjectPosition: "50% 24%",
    supportingImageSrcs: ["/images/previews/screenshots/bundle-early-dating-3.png"],
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
    imageSrc: "/images/previews/screenshots/user-custom-card.png",
    imageObjectPosition: "50% 56%",
    supportingImageSrcs: ["/images/previews/screenshots/bundle-significant-other-3.png"],
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
    imageSrc: "/images/previews/screenshots/ai-chat.png",
    imageObjectPosition: "50% 38%",
    supportingImageSrcs: ["/images/previews/screenshots/bundle-early-dating-2.png"],
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
    imageSrc: "/images/previews/screenshots/widget.png",
    imageObjectPosition: "50% 12%",
    supportingImageSrcs: ["/images/previews/screenshots/splash.png"],
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
    imageSrc: "/images/previews/screenshots/bundle-house-party-1.png",
    imageObjectPosition: "50% 38%",
    supportingImageSrcs: ["/images/previews/screenshots/bundle-house-party-2.png"],
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
    imageSrc: "/images/previews/screenshots/ai-chat.png",
    stageMode: "reviews",
    eyebrow: "Player Love",
    title: "Loved at house parties and pre-drinks.",
    subtitle: "Real App Store feedback from Bevy players.",
    reviewItems: [
      {
        author: "Remark Bil",
        text: "So fun! Best drinking game we have ever found and we’ve tried quite a few!",
      },
      {
        author: "iMonkey.",
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isPreviewsOpen, setIsPreviewsOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { triggerDownload } = useDownload();
  const totalPreviews = previewSlides.length;

  const openPreviews = () => {
    setPreviewIndex(0);
    setIsPreviewsOpen(true);
  };

  const closePreviews = () => {
    setIsPreviewsOpen(false);
  };

  const goPrevPreview = () => {
    setPreviewIndex((prev) => (prev - 1 + totalPreviews) % totalPreviews);
  };

  const goNextPreview = () => {
    setPreviewIndex((prev) => (prev + 1) % totalPreviews);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!isPreviewsOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewsOpen(false);
        return;
      }

      if (event.key === "ArrowLeft") {
        setPreviewIndex((prev) => (prev - 1 + totalPreviews) % totalPreviews);
        return;
      }

      if (event.key === "ArrowRight") {
        setPreviewIndex((prev) => (prev + 1) % totalPreviews);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPreviewsOpen, totalPreviews]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-all duration-700 ${
          scrolled
            ? "border-white/[0.12] bg-[#090909]/88 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="site-shell grid h-[84px] grid-cols-[1fr_auto_1fr] items-center">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-3 justify-self-start"
          >
            <Image
              src="/images/icons/bevy-logo.png"
              alt="Bevy"
              width={44}
              height={44}
              priority
            />
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.2em] text-white/52 sm:block">
              Bevy
            </span>
          </Link>

          <span
            className={`hidden text-[11px] font-medium uppercase tracking-[0.24em] text-white/40 lg:block transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            Truth or Dare, Reimagined
          </span>

          <div className="header-cta-group justify-self-end">
            <button
              type="button"
              onClick={openPreviews}
              className="previews-btn"
            >
              Previews
            </button>

            <button
              type="button"
              onClick={triggerDownload}
              className="try-free-btn"
            >
              Try for free
            </button>
          </div>
        </div>
      </header>

      {isPreviewsOpen && (
        <div className="preview-modal-overlay" onClick={closePreviews}>
          <div
            className="preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Bevy app preview slides"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="preview-modal-close"
              aria-label="Close previews"
              onClick={closePreviews}
            >
              &times;
            </button>

            <div className="preview-modal-top">
              <p className="preview-modal-kicker">App Store Preview Flow</p>
              <p className="preview-modal-counter">
                {previewIndex + 1} / {totalPreviews}
              </p>
            </div>

            <div className="preview-slider-wrap">
              <button
                type="button"
                className="preview-nav preview-nav--prev"
                aria-label="Previous preview"
                onClick={goPrevPreview}
              >
                &#8249;
              </button>

              <div className="preview-slider-window">
                <div
                  className="preview-slider-track"
                  style={{ transform: `translateX(-${previewIndex * 100}%)` }}
                >
                  {previewSlides.map((slide, index) => (
                    <figure className="preview-slide" key={slide.id}>
                      <article
                        className={`preview-story preview-story--${slide.theme} preview-story--${slide.id}`}
                      >
                        <Image
                          src={slide.backgroundSrc}
                          alt=""
                          fill
                          sizes="(max-width: 900px) 84vw, 460px"
                          className="preview-story-bg"
                        />

                        <div className="preview-story-content">
                          <h3 className="preview-story-title">{slide.title}</h3>

                          <div
                            className={`preview-story-stage ${
                              slide.supportingImageSrcs?.length
                                ? "preview-story-stage--multi"
                                : ""
                            } ${
                              slide.stageMode === "brand"
                                ? "preview-story-stage--brand"
                                : ""
                            }`}
                          >
                            {slide.stageMode === "brand" ? (
                              <div className="preview-brand-stage">
                                <p className="preview-brand-tagline">
                                  <span>Truth or Dare.</span>
                                  <span>Reimagined.</span>
                                </p>

                                <div className="preview-brand-row">
                                  <Image
                                    src="/images/icons/bevy-logo.png"
                                    alt="Bevy logo"
                                    width={36}
                                    height={36}
                                    className="preview-brand-logo"
                                  />
                                  <p className="preview-brand-name">Bevy</p>
                                </div>
                              </div>
                            ) : slide.stageMode === "reviews" ? (
                              <div className="preview-reviews-stage">
                                {slide.reviewItems?.slice(0, 2).map((review) => (
                                  <article
                                    key={`${slide.id}-${review.author}`}
                                    className="preview-review-card"
                                  >
                                    <p className="preview-review-stars" aria-label="5 out of 5 stars">
                                      ★★★★★
                                    </p>
                                    <p className="preview-review-copy">“{review.text}”</p>
                                    <p className="preview-review-author">- {review.author}</p>
                                  </article>
                                ))}
                              </div>
                            ) : (
                              <>
                                <div className="preview-phone-shell preview-phone-shell--main">
                                  <div className="phone-mock phone-mock--compact">
                                    <div className="phone-mock__screen">
                                      <Image
                                        src={slide.imageSrc}
                                        alt={slide.title}
                                        fill
                                        sizes="(max-width: 900px) 56vw, 300px"
                                        priority={index === 0}
                                        className="preview-phone-shot"
                                        style={{
                                          objectPosition:
                                            slide.imageObjectPosition ?? "50% 50%",
                                        }}
                                      />
                                    </div>
                                    <Image
                                      src="/images/mockups/iphone-17-pro-mockup.png"
                                      alt=""
                                      fill
                                      sizes="(max-width: 900px) 58vw, 300px"
                                      className="phone-mock__frame"
                                    />
                                  </div>
                                </div>
                                {slide.supportingImageSrcs?.slice(0, 2).map(
                                  (
                                    supportingSrc,
                                    supportingIndex,
                                    allSupporting,
                                  ) => (
                                    <div
                                      key={`${slide.id}-support-${supportingIndex}`}
                                      className={`preview-phone-shell ${
                                        allSupporting.length === 1
                                          ? "preview-phone-shell--right"
                                          : supportingIndex === 0
                                            ? "preview-phone-shell--left"
                                            : "preview-phone-shell--right"
                                      }`}
                                      aria-hidden
                                    >
                                      <div className="phone-mock phone-mock--compact">
                                        <div className="phone-mock__screen">
                                          <Image
                                            src={supportingSrc}
                                            alt=""
                                            fill
                                            sizes="(max-width: 900px) 28vw, 170px"
                                            className="preview-phone-shot"
                                            style={{
                                              objectPosition:
                                                slide.supportingImageObjectPositions?.[
                                                  supportingIndex
                                                ] ?? "50% 50%",
                                            }}
                                          />
                                        </div>
                                        <Image
                                          src="/images/mockups/iphone-17-pro-mockup.png"
                                          alt=""
                                          fill
                                          sizes="(max-width: 900px) 28vw, 170px"
                                          className="phone-mock__frame"
                                        />
                                      </div>
                                    </div>
                                  ),
                                )}
                              </>
                            )}

                          </div>
                        </div>
                      </article>
                    </figure>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="preview-nav preview-nav--next"
                aria-label="Next preview"
                onClick={goNextPreview}
              >
                &#8250;
              </button>
            </div>

            <div className="preview-dots" aria-label="Preview slide picker">
              {previewSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`preview-dot ${index === previewIndex ? "is-active" : ""}`}
                  aria-label={`Show preview ${index + 1}`}
                  onClick={() => setPreviewIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
