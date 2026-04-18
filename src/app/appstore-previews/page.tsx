import Image from "next/image";

import { previewSlides } from "@/components/previewSlides";

type AppStorePreviewPageProps = {
  searchParams: Promise<{ slide?: string }>;
};

function clampSlideIndex(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(previewSlides.length - 1, value));
}

export default async function AppStorePreviewsPage({
  searchParams,
}: AppStorePreviewPageProps) {
  const params = await searchParams;
  const requestedSlide = Number.parseInt(params.slide ?? "1", 10) - 1;
  const slide = previewSlides[clampSlideIndex(requestedSlide)];

  return (
    <main className="preview-export-root">
      <article className={`preview-story preview-story--${slide.theme} preview-story--${slide.id}`}>
        <Image
          src={slide.backgroundSrc}
          alt=""
          fill
          sizes="100vw"
          className="preview-story-bg"
          priority
        />

        <div className="preview-story-content">
          <h3 className="preview-story-title">{slide.title}</h3>

          <div
            className={`preview-story-stage ${
              slide.supportingImageSrcs?.length ? "preview-story-stage--multi" : ""
            } ${slide.stageMode === "brand" ? "preview-story-stage--brand" : ""}`}
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
                  <article key={`${slide.id}-${review.author}`} className="preview-review-card">
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
                        sizes="100vw"
                        className="preview-phone-shot"
                        style={{ objectPosition: slide.imageObjectPosition ?? "50% 50%" }}
                        priority
                      />
                    </div>
                    <Image
                      src="/images/mockups/iphone-17-pro-mockup.png"
                      alt=""
                      fill
                      sizes="100vw"
                      className="phone-mock__frame"
                    />
                  </div>
                </div>

                {slide.supportingImageSrcs?.slice(0, 2).map((supportingSrc, supportingIndex, all) => (
                  <div
                    key={`${slide.id}-support-${supportingIndex}`}
                    className={`preview-phone-shell ${
                      all.length === 1
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
                          sizes="100vw"
                          className="preview-phone-shot"
                          style={{
                            objectPosition:
                              slide.supportingImageObjectPositions?.[supportingIndex] ?? "50% 50%",
                          }}
                        />
                      </div>
                      <Image
                        src="/images/mockups/iphone-17-pro-mockup.png"
                        alt=""
                        fill
                        sizes="100vw"
                        className="phone-mock__frame"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
