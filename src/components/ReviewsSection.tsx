const reviews = [
  {
    author: "DukeNeuk",
    text: "Bevy is so much fun! The prompts are hilarious and really help to break the ice in a crowd. We play every morning and it brings the group together so effortlessly. Give it a try with new friends or old and get your party started!",
  },
  {
    author: "AnthonyJane24",
    text: "This app is a fantastic way to get to know your partner better. It offers insightful questions into things about your partner you may not know or understand. I highly recommend this to any couple regardless of the current length of their relationship.",
  },
  {
    author: "Niece.doll",
    text: "This is such a great game to get to know someone. The questions are unique and help you get more than one-word answers. I use it inside of dating apps when the conversation goes kinda stale. I enjoy it very much!",
  },
  {
    author: "mollhds",
    text: "This is the first app I found which has really good truth or dare questions! I would recommend it to others, great for pre drinks or having a laugh with your mates.",
  },
  {
    author: "Angelina",
    text: "So I found out about it because a friend of mine was using it as a mediative introspection tool. I really liked some of the questions he showed me so I bought a couple of bundles. My friends and I played it together and had a lot of fun.",
  },
  {
    author: "iMonkey.",
    text: "Used this with some friends I had over last Friday before we went out and everyone loved it.",
  },
];

export default function ReviewsSection() {
  return (
    <section className="section-space">
      <div className="site-shell">
        <article
          style={{
            maxWidth: 680,
            marginInline: "auto",
            textAlign: "center",
          }}
        >
          <p className="kicker">Reviews</p>
          <h2 className="section-title">What people are saying.</h2>
          <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
        </article>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <blockquote key={review.author} className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">&ldquo;{review.text}&rdquo;</p>
              <cite className="review-author">— {review.author}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
