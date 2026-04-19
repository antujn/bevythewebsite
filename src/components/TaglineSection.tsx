import Image from "next/image";

export default function TaglineSection() {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/illustrations/illustration5.jpg"
          alt=""
          fill
          className="editorial-img"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/78 via-[#0a0a0a]/55 to-[#050505]/88" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.34)_80%)]" />
      </div>

      <div className="site-shell relative">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="font-display text-[clamp(32px,5vw,60px)] font-normal leading-[1.15] text-white/90">
            Go further,
            <br />
            feel more.
          </h2>

          <div
            style={{ paddingTop: 16, paddingBottom: 16 }}
            className="flex justify-center"
          >
            <div className="h-px w-[120px] bg-white/[0.16]" />
          </div>

          <p className="mx-auto max-w-[480px] text-[16px] font-light leading-[1.78] text-white/54">
            Behind every person you know is a conversation you haven&rsquo;t had
            yet. Bevy helps you start it.
          </p>
        </div>
      </div>
    </section>
  );
}
