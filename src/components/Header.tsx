"use client";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useDownload } from "./DownloadContext";
import PreviewHandouts from "./PreviewHandouts";
import PreviewIcons from "./PreviewIcons";
import { previewSlides } from "./previewSlides";

// PreviewVideos pulls in three full preview Stages (each with its own
// rAF loop + <video> elements). Loading it lazily keeps the modal trigger
// itself cheap and avoids shipping the 30s/50s/90s scene code to anyone
// who never opens the modal. SSR is off because the Stage relies on
// ResizeObserver / requestAnimationFrame.
const PreviewVideos = dynamic(() => import("./preview-videos/PreviewVideos"), {
  ssr: false,
});

type PreviewTab = "slides" | "videos" | "icons" | "handouts";
type VideoKey = "30s" | "50s" | "90s";

const VIDEO_TABS: { key: VideoKey; label: string; sublabel: string }[] = [
  { key: "30s", label: "30s", sublabel: "App Store" },
  { key: "50s", label: "50s", sublabel: "App Store" },
  { key: "90s", label: "90s", sublabel: "Cinematic" },
];

const NAV_HOVER_SPRING = { type: "spring" as const, stiffness: 400, damping: 24 };
const NAV_LINK_CLASS =
  "text-[10px] font-semibold uppercase tracking-[0.18em] text-white/56 transition-colors hover:text-white/90";

// iPhone 6.9" App Store required preview dimensions (portrait).
const APPSTORE_TARGET_WIDTH = 1320;
const APPSTORE_TARGET_HEIGHT = 2868;
const HIDE_SUPPORTING_PHONE_IDS = new Set([
  "modes",
  "achievements",
  "widget",
  "custom",
]);

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isPreviewsOpen, setIsPreviewsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PreviewTab>("slides");
  const [activeVideoTab, setActiveVideoTab] = useState<VideoKey>("30s");
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [videoFullscreenSignal, setVideoFullscreenSignal] = useState(0);
  const [iconsDownloadSignal, setIconsDownloadSignal] = useState(0);
  const [isDownloadingIcons, setIsDownloadingIcons] = useState(false);
  const [handoutsDownloadSignal, setHandoutsDownloadSignal] = useState(0);
  const [isDownloadingHandouts, setIsDownloadingHandouts] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const storyRefs = useRef<Array<HTMLElement | null>>([]);
  const previewRailRef = useRef<HTMLDivElement | null>(null);
  const previewsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { triggerDownload } = useDownload();

  const downloadPreview = async (index: number) => {
    const slide = previewSlides[index];
    if (!slide || downloadingId) return;

    // Look up by unique per-slide class rather than ref index to avoid any
    // React ref-callback timing issues. Each slide gets `preview-story--<id>`.
    const story =
      (document.querySelector(
        `.preview-story--${slide.id}`,
      ) as HTMLElement | null) ?? storyRefs.current[index];
    if (!story) return;

    setDownloadingId(slide.id);

    try {
      const { domToCanvas } = await import("modern-screenshot");

      if (typeof document !== "undefined" && document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Skip nodes that aren't actually rendered (display: none). This is
      // critical on slides like `achievements` and `widget` where the JSX
      // renders a supporting phone mock that CSS immediately hides. Those
      // hidden <img>s are often never decoded by the browser, so letting
      // modern-screenshot touch them triggers a cold fetch and stalls for
      // seconds.
      const isNodeVisible = (node: Node): boolean => {
        if (!(node instanceof HTMLElement)) return true;
        // offsetParent is null when the element or an ancestor has
        // display: none (except for position: fixed, which we accept).
        if (node.offsetParent === null) {
          const pos = window.getComputedStyle(node).position;
          if (pos !== "fixed") return false;
        }
        return true;
      };

      // Only wait for images that are actually going to appear in the capture.
      const images = Array.from(story.querySelectorAll("img")).filter(
        isNodeVisible,
      );
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve();
          }
          return new Promise<void>((resolve) => {
            img.addEventListener(
              "load",
              () => resolve(),
              { once: true },
            );
            img.addEventListener(
              "error",
              () => resolve(),
              { once: true },
            );
          });
        }),
      );

      // Capture at the element's natural modal size, then scale to App Store
      // output dimensions. This keeps the original on-site composition stable.
      const naturalWidth = story.offsetWidth;
      const naturalHeight = story.offsetHeight;
      const scale =
        naturalWidth > 0
          ? Math.max(2, APPSTORE_TARGET_WIDTH / naturalWidth)
          : 3;

      // Prevent dark edge halos: rounded corners/border/shadow can introduce
      // semi-transparent edge pixels that flatten against black in JPEG.
      // Temporarily remove visual chrome for the capture, then restore.
      const prevInline = {
        borderRadius: story.style.borderRadius,
        border: story.style.border,
        boxShadow: story.style.boxShadow,
      };
      story.style.borderRadius = "0";
      story.style.border = "0";
      story.style.boxShadow = "none";

      // Capture the live element straight from the modal DOM. modern-screenshot
      // uses the SVG foreignObject technique with a cloned snapshot internally,
      // so it respects modern CSS (backdrop-filter, gradients, shadows,
      // object-fit, etc.) where html2canvas falls over.
      let rawCanvas: HTMLCanvasElement;
      try {
        rawCanvas = await domToCanvas(story, {
          scale,
          backgroundColor: "#000000",
          width: naturalWidth,
          height: naturalHeight,
          // Skip the whole subtree for hidden nodes so modern-screenshot
          // doesn't fetch / decode their images.
          filter: isNodeVisible,
          style: {
            transform: "none",
            margin: "0",
            width: `${naturalWidth}px`,
            height: `${naturalHeight}px`,
          },
        });
      } finally {
        story.style.borderRadius = prevInline.borderRadius;
        story.style.border = prevInline.border;
        story.style.boxShadow = prevInline.boxShadow;
      }

      const target = document.createElement("canvas");
      target.width = APPSTORE_TARGET_WIDTH;
      target.height = APPSTORE_TARGET_HEIGHT;
      const ctx = target.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context for target canvas");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, target.width, target.height);
      ctx.drawImage(
        rawCanvas,
        0,
        0,
        rawCanvas.width,
        rawCanvas.height,
        0,
        0,
        target.width,
        target.height,
      );

      // JPEG at 0.92 keeps quality high but cuts file size dramatically vs PNG.
      const dataUrl = target.toDataURL("image/jpeg", 0.92);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `bevy-preview-${slide.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download preview image", error);
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadAllPreviews = async () => {
    if (downloadingId || isDownloadingAll) return;

    setIsDownloadingAll(true);
    try {
      for (let i = 0; i < previewSlides.length; i += 1) {
        await downloadPreview(i);
        // Small delay helps browsers register separate downloads.
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const openPreviews = () => {
    // Always re-open on the slides tab so returning users land on the
    // App Store flow they expect.
    setActiveTab("slides");
    setIsPreviewsOpen(true);
  };

  const closePreviews = () => {
    setIsPreviewsOpen(false);
  };

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (window.location.hash !== "#hero") {
      window.history.replaceState(null, "", "/#hero");
    }
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!isPreviewsOpen) return;

    // Lock background scroll while the modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Remember where focus came from so we can restore it on close.
    // Snapshot the trigger ref now too (React warns about reading it in
    // the cleanup function otherwise).
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const triggerAtOpen = previewsTriggerRef.current;

    // Move focus into the modal: prefer the close button so Escape/Enter
    // is a one-tap dismiss for keyboard users.
    const modal = modalRef.current;
    const closeBtn = modal?.querySelector<HTMLButtonElement>(
      ".preview-modal-close",
    );
    // Defer so the element is actually mounted + visible before focusing
    const focusTimer = window.setTimeout(() => closeBtn?.focus(), 0);

    const FOCUSABLE_SELECTOR =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !modal) return;

      // Focus trap: cycle Tab/Shift+Tab within the modal's focusables
      const focusables = Array.from(
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("aria-hidden"));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !modal.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      // Restore focus to the element that opened the modal
      (previouslyFocused ?? triggerAtOpen)?.focus();
    };
  }, [isPreviewsOpen]);

  useEffect(() => {
    if (activeTab !== "videos") {
      setIsVideoFullscreen(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isPreviewsOpen) return;

    const rail = previewRailRef.current;
    if (!rail) return;

    rail.scrollTo({ left: 0, behavior: "auto" });
  }, [isPreviewsOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-all duration-700 ${
          // Scrolled state uses a wine-black tint (mirrors the
          // --bg-nav design token in globals.css) rather than a
          // neutral near-black, so the nav sits inside the site's
          // unified cinematic atmosphere. If --bg-nav changes,
          // update this literal too (Tailwind arbitrary-value opacity
          // modifiers don't reliably resolve CSS vars).
          scrolled
            ? "border-white/[0.12] bg-[#160808]/88 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="site-shell grid h-[84px] grid-cols-[1fr_auto_1fr] items-center">
          <Link
            href="/#hero"
            prefetch={false}
            className="flex items-center gap-3 justify-self-start"
            onClick={handleBrandClick}
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

          <nav className="hidden items-center gap-4 lg:flex">
            {[
              { href: "#s1-anchor", label: "Experience" },
              { href: "#bundles-heading", label: "Collection" },
              { href: "#gameplay-heading", label: "Gameplay" },
              { href: "#reviews-top", label: "Reviews" },
              { href: "#faq-heading", label: "FAQ" },
            ].map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={NAV_LINK_CLASS}
                whileHover={{ y: -2 }}
                transition={NAV_HOVER_SPRING}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="header-cta-group justify-self-end">
            <motion.button
              ref={previewsTriggerRef}
              type="button"
              onClick={openPreviews}
              className="previews-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={NAV_HOVER_SPRING}
              aria-haspopup="dialog"
              aria-expanded={isPreviewsOpen}
              aria-controls="previews-modal"
            >
              Previews
            </motion.button>

            <motion.button
              type="button"
              onClick={triggerDownload}
              className="try-free-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={NAV_HOVER_SPRING}
            >
              Try for free
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isPreviewsOpen && (
          <motion.div
            className="preview-modal-overlay"
            onClick={closePreviews}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.div
              ref={modalRef}
              id="previews-modal"
              className="preview-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Bevy app preview slides"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="preview-modal-top">
              <div
                className="preview-modal-tabs"
                role="tablist"
                aria-label="Preview type"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "slides"}
                  className={`preview-modal-tab ${activeTab === "slides" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("slides")}
                >
                  Slides
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "videos"}
                  className={`preview-modal-tab ${activeTab === "videos" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("videos")}
                >
                  Videos
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "icons"}
                  className={`preview-modal-tab ${activeTab === "icons" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("icons")}
                >
                  Icons
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "handouts"}
                  className={`preview-modal-tab ${activeTab === "handouts" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("handouts")}
                >
                  Handouts
                </button>
              </div>

              {activeTab === "videos" && (
                <div
                  className="preview-video-subtabs"
                  role="tablist"
                  aria-label="Video duration"
                >
                  {VIDEO_TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={activeVideoTab === t.key}
                      className={`preview-video-subtab ${activeVideoTab === t.key ? "is-active" : ""}`}
                      onClick={() => setActiveVideoTab(t.key)}
                    >
                      <span className="preview-video-subtab__label">{t.label}</span>
                      <span className="preview-video-subtab__sublabel">
                        {t.sublabel}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="preview-modal-top-right">
                {activeTab === "slides" && (
                  <button
                    type="button"
                    className="preview-download-btn"
                    onClick={downloadAllPreviews}
                    disabled={
                      isDownloadingAll || downloadingId !== null
                    }
                    aria-label="Download all previews as images"
                  >
                    {isDownloadingAll ? "Preparing..." : "Download All"}
                  </button>
                )}
                {activeTab === "icons" && (
                  <button
                    type="button"
                    className="preview-download-btn"
                    onClick={() => setIconsDownloadSignal((prev) => prev + 1)}
                    disabled={isDownloadingIcons}
                    aria-label="Download all icon variants as PNG"
                  >
                    {isDownloadingIcons ? "Preparing..." : "Download All"}
                  </button>
                )}
                {activeTab === "handouts" && (
                  <button
                    type="button"
                    className="preview-download-btn"
                    onClick={() =>
                      setHandoutsDownloadSignal((prev) => prev + 1)
                    }
                    disabled={isDownloadingHandouts}
                    aria-label="Download poster + visiting card as PNG"
                  >
                    {isDownloadingHandouts ? "Preparing..." : "Download All"}
                  </button>
                )}
                {activeTab === "videos" && (
                  <button
                    type="button"
                    className="preview-video-fullscreen-btn"
                    onClick={() =>
                      setVideoFullscreenSignal((prev) => prev + 1)
                    }
                    aria-label={
                      isVideoFullscreen
                        ? "Exit fullscreen preview"
                        : "Enter fullscreen preview"
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      aria-hidden="true"
                      focusable="false"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 9V4h5" />
                      <path d="M20 9V4h-5" />
                      <path d="M4 15v5h5" />
                      <path d="M20 15v5h-5" />
                    </svg>
                    {isVideoFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </button>
                )}
                <button
                  type="button"
                  className="preview-modal-close"
                  aria-label="Close previews"
                  onClick={closePreviews}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M6 6L18 18M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>

            {activeTab === "slides" ? (
            <div className="preview-slider-wrap">
              <div
                className="preview-slider-window"
                ref={previewRailRef}
              >
                <div
                  className="preview-slider-track"
                >
                  {previewSlides.map((slide, index) => (
                    <figure className="preview-slide" key={slide.id}>
                      <article
                        ref={(node) => {
                          storyRefs.current[index] = node;
                        }}
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
                          <h3
                            className={`preview-story-title ${
                              slide.id === "hero" ||
                              slide.id === "prompts" ||
                              slide.id === "party" ||
                              slide.id === "modes" ||
                              slide.id === "ai" ||
                              slide.id === "achievements" ||
                              slide.id === "widget" ||
                              slide.id === "custom" ||
                              slide.id === "nsfw"
                                ? "preview-story-title--hero"
                                : ""
                            }`}
                          >
                            {slide.id === "hero" ? (
                              <>
                                <span className="block font-sans font-extrabold">Start the</span>
                                <span className="block font-display font-bold title-accent">chemistry.</span>
                              </>
                            ) : slide.id === "prompts" ? (
                              <>
                                <span className="block font-sans font-extrabold">Cards that command</span>
                                <span className="block font-display font-bold title-accent">attention.</span>
                              </>
                            ) : slide.id === "party" ? (
                              <>
                                <span className="block font-sans font-extrabold">Turn up</span>
                                <span className="block font-display font-bold title-accent">the tension.</span>
                              </>
                            ) : slide.id === "modes" ? (
                              <>
                                <span className="block font-sans font-extrabold">Run the room</span>
                                <span className="block font-display font-bold title-accent">your way.</span>
                              </>
                            ) : slide.id === "ai" ? (
                              <>
                                <span className="block font-sans font-extrabold">
                                  Keep <span className="whitespace-nowrap">first dates</span>
                                </span>
                                <span className="block font-display font-bold title-accent">flowing.</span>
                              </>
                            ) : slide.id === "achievements" ? (
                              <>
                                <span className="block font-sans font-extrabold">Write cards that fit</span>
                                <span className="block font-display font-bold title-accent">your story.</span>
                              </>
                            ) : slide.id === "widget" ? (
                              <>
                                <span className="block font-sans font-extrabold">Never run out of</span>
                                <span className="block font-sans font-extrabold">
                                  <span className="font-display font-bold title-accent">momentum</span>{" "}
                                  {/* "with BevyAI." matches the Playfair italic
                                      treatment of "momentum" so the whole payoff
                                      reads as one continuous serif phrase rather
                                      than a sans "tail" on a serif head. */}
                                  <span className="font-display font-bold title-accent whitespace-nowrap">with BevyAI.</span>
                                </span>
                              </>
                            ) : slide.id === "custom" ? (
                              <>
                                <span className="block font-sans font-extrabold whitespace-nowrap">Fresh cards</span>
                                <span className="block font-sans font-extrabold whitespace-nowrap">right to your</span>
                                <span className="block font-display font-bold title-accent whitespace-nowrap">
                                  home screen.
                                </span>
                              </>
                            ) : slide.id === "nsfw" ? (
                              <>
                                <span className="block font-sans font-extrabold">Pre-game energy in</span>
                                <span className="block font-display font-bold title-accent">one tap.</span>
                              </>
                            ) : slide.id === "dating" ? (
                              <>
                                {/* Dating slide couplet: "A favorite at …"
                                    premise in sans (matches every other
                                    preview slide), with the two evocative
                                    nouns — "house parties" / "pre-drinks." —
                                    pulled into Playfair italic so they read
                                    as the cream-gold accent moments. */}
                                <span className="block font-sans font-extrabold">
                                  A favorite at{" "}
                                  <span className="font-display font-bold title-accent whitespace-nowrap">house parties</span>
                                </span>
                                {/* Line 2 collapses to a single Playfair italic
                                    phrase ("& pre-drinks.") so the ampersand
                                    gets the same cream-gold editorial treatment
                                    as the noun it connects. */}
                                <span className="block font-display font-bold title-accent whitespace-nowrap">
                                  &amp; pre-drinks.
                                </span>
                              </>
                            ) : (
                              slide.title
                            )}
                          </h3>

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
                                {/* Brand couplet on the hero slide:
                                    "Truth or Dare." in sans (matches the
                                    rest of the brand row), "Reimagined."
                                    in Playfair italic cream-gold — same
                                    treatment every other preview payoff
                                    gets (see .title-accent + the
                                    .preview-brand-tagline scoped override
                                    in globals.css). */}
                                <p className="preview-brand-tagline">
                                  <span>Truth or Dare.</span>
                                  <span className="font-display font-bold title-accent">
                                    Reimagined.
                                  </span>
                                </p>

                                <div className="preview-brand-row">
                                  <Image
                                    src="/images/icons/bevy-logo.png"
                                    alt="Bevy logo"
                                    width={36}
                                    height={36}
                                    className="preview-brand-logo"
                                  />
                                  <p className="preview-brand-name font-display font-extrabold">Bevy</p>
                                </div>
                              </div>
                            ) : slide.stageMode === "reviews" ? (
                              <div className="preview-reviews-stage">
                                {slide.reviewItems?.slice(0, 3).map((review) => (
                                  <article
                                    key={`${slide.id}-${review.author}`}
                                    className="preview-review-card"
                                  >
                                    <p className="preview-review-stars" aria-label="5 out of 5 stars">
                                      ★★★★★
                                    </p>
                                    <p className="preview-review-copy">“{review.text}”</p>
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
                                {!HIDE_SUPPORTING_PHONE_IDS.has(slide.id) &&
                                  slide.supportingImageSrcs?.slice(0, 2).map(
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
            </div>
            ) : activeTab === "videos" ? (
              <PreviewVideos
                active={activeVideoTab}
                onActiveChange={setActiveVideoTab}
                onFullscreenChange={setIsVideoFullscreen}
                fullscreenToggleSignal={videoFullscreenSignal}
                showControls={false}
              />
            ) : activeTab === "icons" ? (
              <PreviewIcons
                downloadAllSignal={iconsDownloadSignal}
                onDownloadStateChange={setIsDownloadingIcons}
              />
            ) : (
              <PreviewHandouts
                downloadAllSignal={handoutsDownloadSignal}
                onDownloadStateChange={setIsDownloadingHandouts}
              />
            )}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
