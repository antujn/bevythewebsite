import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Disclaimer - Bevy",
  description:
    "Legal Disclaimer, Waiver, and Release of Liability for the Bevy mobile application.",
};

export default function LegalDisclaimer() {
  return (
    <LegalLayout title="Legal Disclaimer">
      <p><strong>Last updated: 04/04/2026</strong></p>
      <h3>BEVY WAIVER AND RELEASE OF LIABILITY, ASSUMPTION OF RISK, AND INDEMNITY AGREEMENT</h3>

      <p><strong>IMPORTANT: PLEASE READ THIS LEGAL DISCLAIMER CAREFULLY BEFORE USING THE BEVY APPLICATION. THIS DOCUMENT FORMS PART OF YOUR AGREEMENT WITH US, TOGETHER WITH OUR <a href="/terms">TERMS OF SERVICE</a> AND <a href="/privacy">PRIVACY POLICY</a>.</strong></p>

      <h2>1. Participation Agreement</h2>
      <p>You, the consumer and end-user of this product, including every other user and participant with whom you may engage in Bevy activities, acknowledge that you shall abide by and be bound by all terms of this agreement and will comply with all applicable laws while participating in Bevy activities. By downloading, installing, or using the Bevy application, you confirm that you have read, understood, and agree to be bound by all terms herein. If you do not agree, you must not use the Bevy application.</p>

      <h2>2. AI-Generated Content Disclaimer</h2>
      <p>Bevy uses artificial intelligence to generate truth or dare prompts and related content. You acknowledge and agree that:</p>
      <ul>
        <li>AI-generated content is provided for entertainment purposes only and does not constitute professional advice of any kind.</li>
        <li>Despite our best efforts, AI-generated content may occasionally be inaccurate, inappropriate, offensive, misleading, or unsuitable.</li>
        <li>We do not guarantee that AI-generated content will be free from errors, bias, harmful suggestions, or inappropriate material.</li>
        <li>You are solely responsible for evaluating the suitability, safety, and appropriateness of any AI-generated content before acting on it.</li>
        <li>We expressly disclaim any and all liability for any actions taken by you or any third party based on AI-generated content.</li>
        <li>You must not treat AI-generated prompts as instructions, directives, or commands. All content is merely a suggestion for entertainment.</li>
        <li>If you encounter harmful, inappropriate, or dangerous content, please report it immediately to bevytheapp@gmail.com.</li>
      </ul>

      <h2>3. Assumption of Risk</h2>
      <p>You understand and acknowledge that engaging in truth or dare activities inherently involves risks including personal injury, emotional distress, property damage, and other losses. There may be risks not known or foreseeable at this time, including risks from the unpredictable nature of AI-generated content. You are aware of potential risks including physical injury, emotional harm, embarrassment, property damage, and in extreme cases, serious injury or death. You are under no obligation to perform any dare or answer any truth prompt. You are solely responsible for assessing safety before undertaking any activity. You should not participate while under the influence of substances that impair judgement. You should not participate if you have any medical or psychological condition that could be aggravated.</p>
      <p><strong>YOU HEREBY ASSUME FULL RESPONSIBILITY AND VOLUNTARILY ASSUME ALL RISK for all damages, injuries, and losses that you and any other party may sustain in connection with Bevy activities.</strong></p>

      <h2>4. Health and Safety Warnings</h2>
      <ul>
        <li>Do not perform any dare that involves illegal activity, danger, or harm.</li>
        <li>Do not perform any dare involving motor vehicles, heavy machinery, or equipment requiring full attention.</li>
        <li>Do not perform any dare involving consuming substances to which you or others may be allergic.</li>
        <li>Do not use the Service in situations where distraction could lead to injury (driving, swimming, cycling, etc.).</li>
        <li>Ensure all participants are willing, consenting adults. Never coerce anyone to participate.</li>
        <li>Respect the physical and emotional boundaries of all participants at all times.</li>
        <li>If anyone feels unsafe, stop immediately.</li>
        <li>If any injury occurs, seek appropriate medical attention immediately.</li>
      </ul>

      <h2>5. No Professional Advice</h2>
      <p>The Service and all content provided through it is for entertainment purposes only. Nothing constitutes medical, legal, psychological, financial, safety, or any other kind of professional advice. Always seek the advice of a qualified professional.</p>

      <h2>6. Release and Waiver</h2>
      <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,</strong> you hereby RELEASE, WAIVE, DISCHARGE, and COVENANT NOT TO SUE Anant Jain, the operator of this product, together with any affiliates, agents, contractors, service providers, and representatives (collectively, the &ldquo;Releasees&rdquo;), from any liability for all claims, demands, losses, expenses, or damages arising from: participating in Bevy activities; acting on or relying upon AI-generated content; any interaction with other users; or any technical malfunction, error, or failure of the Service.</p>
      <p><strong>NOTHING IN THIS DISCLAIMER SHALL EXCLUDE OR LIMIT LIABILITY FOR: (A) DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE; (B) FRAUD OR FRAUDULENT MISREPRESENTATION; OR (C) ANY OTHER LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER THE LAWS OF ENGLAND AND WALES.</strong></p>

      <h2>7. Indemnification</h2>
      <p>You agree that if you or anyone on your behalf makes a claim against the Releasees as a result of Bevy activities, including activities prompted by AI-generated content, YOU SHALL INDEMNIFY, REIMBURSE, and HOLD HARMLESS the Releasees from all injuries, costs, damages, claims, and incidental damages, including legal fees.</p>

      <h2>8. Third-Party Content and Services</h2>
      <p>The Service may integrate with or link to third-party services, including AI providers, analytics services, and advertising networks. We are not responsible for the content, privacy practices, or terms of any third-party service.</p>

      <h2>9. Governing Law and Jurisdiction</h2>
      <p>This Legal Disclaimer shall be governed by and construed in accordance with the laws of England and Wales. Subject to the dispute resolution provisions in our Terms of Service, the courts of England and Wales shall have exclusive jurisdiction.</p>

      <h2>10. Severability</h2>
      <p>If any provision is determined to be invalid, all other provisions remain valid and enforceable.</p>

      <h2>11. Amendments</h2>
      <p>We reserve the right to modify this Legal Disclaimer at any time by posting the updated version and updating the &ldquo;Last updated&rdquo; date. Your continued use constitutes acceptance of those changes.</p>

      <h2>12. Entire Agreement</h2>
      <p>This Legal Disclaimer, together with our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>, constitutes the entire agreement between you and the Company regarding the matters addressed herein.</p>

      <h2>13. Acknowledgement</h2>
      <p><strong>BY DOWNLOADING, INSTALLING, OR USING THE BEVY APPLICATION, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND THIS LEGAL DISCLAIMER AND ARE AWARE THAT BY USING THIS PRODUCT YOU MAY BE WAIVING IMPORTANT LEGAL RIGHTS TO THE MAXIMUM EXTENT PERMITTED BY LAW.</strong></p>

      <h2>14. Contact Us</h2>
      <p>By email: bevytheapp@gmail.com<br />Operator: Anant Jain<br />Location: London, United Kingdom</p>
    </LegalLayout>
  );
}
