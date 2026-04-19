"use client";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useDownload } from "./DownloadContext";
import { previewSlides } from "./previewSlides";

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
    if (!isPreviewsOpen) return;

    const rail = previewRailRef.current;
    if (!rail) return;

    rail.scrollTo({ left: 0, behavior: "auto" });
  }, [isPreviewsOpen]);

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
              <p className="preview-modal-kicker">App Store Preview Flow</p>
              <div className="preview-modal-top-right">
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
                                <span className="block font-display font-bold italic text-[#e9d8a6]">chemistry.</span>
                              </>
                            ) : slide.id === "prompts" ? (
                              <>
                                <span className="block font-sans font-extrabold">Cards that command</span>
                                <span className="block font-display font-bold italic text-[#e9d8a6]">attention.</span>
                              </>
                            ) : slide.id === "party" ? (
                              <>
                                <span className="block font-sans font-extrabold">Turn up</span>
                                <span className="block font-display font-bold italic text-[#e9d8a6]">the tension.</span>
                              </>
                            ) : slide.id === "modes" ? (
                              <>
                                <span className="block font-sans font-extrabold">Run the room</span>
                                <span className="block font-display font-bold italic text-[#e9d8a6]">your way.</span>
                              </>
                            ) : slide.id === "ai" ? (
                              <>
                                <span className="block font-sans font-extrabold">
                                  Keep <span className="whitespace-nowrap">first dates</span>
                                </span>
                                <span className="block font-display font-bold italic text-[#e9d8a6]">flowing.</span>
                              </>
                            ) : slide.id === "achievements" ? (
                              <>
                                <span className="block font-sans font-extrabold">Write cards that fit</span>
                                <span className="block font-display font-bold italic text-[#e9d8a6]">your story.</span>
                              </>
                            ) : slide.id === "widget" ? (
                              <>
                                <span className="block font-sans font-extrabold">Never run out of</span>
                                <span className="block font-sans font-extrabold">
                                  <span className="font-display font-bold italic text-[#e9d8a6]">momentum</span>{" "}
                                  <span className="whitespace-nowrap">with BevyAI.</span>
                                </span>
                              </>
                            ) : slide.id === "custom" ? (
                              <>
                                <span className="block font-sans font-extrabold whitespace-nowrap">Fresh cards</span>
                                <span className="block font-sans font-extrabold whitespace-nowrap">right to your</span>
                                <span className="block font-display font-bold italic text-[#e9d8a6] whitespace-nowrap">
                                  home screen.
                                </span>
                              </>
                            ) : slide.id === "nsfw" ? (
                              <>
                                <span className="block font-sans font-extrabold">Pre-game energy in</span>
                                <span className="block font-display font-bold italic text-[#e9d8a6]">one tap.</span>
                              </>
                            ) : slide.id === "dating" ? (
                              <>
                                <span className="block">A favorite at <span className="whitespace-nowrap">house parties</span></span>
                                <span className="block">and <span className="whitespace-nowrap">pre-drinks.</span></span>
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
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
