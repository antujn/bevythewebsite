const reviews = [
  {
    author: "DukeNeuk",
    title: "Smart and Fun Game!",
    text: "Bevy is so much fun! The prompts are hilarious and really help to break the ice in a crowd. I\u2019m working at a hostel in Bali and one of my guests had the app and I wanted to share the experience with other guests once she left. We play every morning and it brings the group together so effortlessly. Give it a try with new friends or old and get your party started!",
  },
  {
    author: "AnthonyJane24",
    title: "A wonderful game for partners",
    text: "This app is a fantastic way to get to know your partner better. It offers insightful questions into things about your partner you may not know or understand. Answers you receive today may change in a years time as well. I highly recommend this to any couple regardless of the current length of their relationship.",
  },
  {
    author: "Niece.doll",
    title: "Great game with smooth design",
    text: "This is such a great game to get to know someone. The questions are unique and help you get more than one-word answers. I use it inside of dating apps when the conversation goes kinda stale. I purchased the Early Dating bundle and I enjoy it very much!",
  },
  {
    author: "Angelina, bird enthusiast",
    title: "Not really a \u201Cgame\u201D but great",
    text: "So I found out about it because a friend of mine was using it as a mediative introspection tool. I really liked some of the questions he showed me so I bought a couple of bundles. My friends and I played it together and had a lot of fun.",
  },
  {
    author: "Remark Bil",
    title: "New favourite",
    text: "So fun! Best drinking game we have ever found and we\u2019ve tried quite a few!",
  },
  {
    author: "jp2065",
    title: "Can this shock you if you lie?",
    text: "Hilarious app. My friends and I used it for a gals night and had so much fun.",
  },
  {
    author: "mollhds",
    title: "Very good questions",
    text: "This is the first app I found which has really good truth or dare questions! I would recommend it to others, great for pre drinks or having a laugh with your mates.",
  },
  {
    author: "iMonkey.",
    title: "Good for predrinks",
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
          <div className="rating-block">
            <div className="rating-left">
              <span className="rating-number">4.7</span>
              <span className="rating-outof">out of 5</span>
            </div>
            <div className="rating-bars">
              <div className="rating-row"><span className="rating-row-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><div className="rating-bar"><div className="rating-bar-fill" style={{ width: '81%' }} /></div></div>
              <div className="rating-row"><span className="rating-row-stars">&#9733;&#9733;&#9733;&#9733;</span><div className="rating-bar"><div className="rating-bar-fill" style={{ width: '11%' }} /></div></div>
              <div className="rating-row"><span className="rating-row-stars">&#9733;&#9733;&#9733;</span><div className="rating-bar"><div className="rating-bar-fill" style={{ width: '4%' }} /></div></div>
              <div className="rating-row"><span className="rating-row-stars">&#9733;&#9733;</span><div className="rating-bar"><div className="rating-bar-fill" style={{ width: '0%' }} /></div></div>
              <div className="rating-row"><span className="rating-row-stars">&#9733;</span><div className="rating-bar"><div className="rating-bar-fill" style={{ width: '4%' }} /></div></div>
            </div>
            <div className="rating-right">
              <span className="rating-count">26</span>
              <span className="rating-label">Ratings</span>
            </div>
          </div>
        </article>

        <div className="reviews-marquee">
          <div className="reviews-track">
            {[...reviews, ...reviews].map((review, i) => (
              <blockquote key={`${review.author}-${i}`} className="review-card">
                <div className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="review-title">{review.title}</p>
                <p className="review-text">&ldquo;{review.text}&rdquo;</p>
                <cite className="review-author">{review.author}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
