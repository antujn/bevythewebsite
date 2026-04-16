"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDownload } from "./DownloadContext";
import { previewSlides } from "./previewSlides";

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
