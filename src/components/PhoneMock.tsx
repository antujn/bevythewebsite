import Image from "next/image";

type PhoneMockProps = {
  screenSrc: string;
  screenAlt: string;
  priority?: boolean;
  compact?: boolean;
};

export default function PhoneMock({
  screenSrc,
  screenAlt,
  priority = false,
  compact = false,
}: PhoneMockProps) {
  return (
    <div className={`phone-mock${compact ? " phone-mock--compact" : ""}`}>
      <div className="phone-mock__screen">
        <Image
          src={screenSrc}
          alt={screenAlt}
          fill
          sizes={compact ? "300px" : "380px"}
          className="object-contain"
          priority={priority}
        />
      </div>
      <Image
        src="/images/mockups/iphone-17-pro-mockup.png"
        alt=""
        fill
        sizes={compact ? "300px" : "380px"}
        className="phone-mock__frame"
      />
    </div>
  );
}
