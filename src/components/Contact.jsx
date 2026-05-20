import React from "react";
import { useTranslation } from "react-i18next";
import SectionTitle from "./SectionTitle";
import { FaLinkedin, FaXTwitter, FaDiscord } from "react-icons/fa6";
import SocialIcon from "./SocialIcon";
import EmailBubble from "./EmailBubble";

function Contact() {
  const { t } = useTranslation();
  return (
    <section
      id="CONTACT"
      className="h-[50vh] flex flex-col justify-center items-center gap-12"
    >
      <SectionTitle
        title={t("contact_section_title", "Treten wir in")}
        subtitle={t("contact_section_subtitle", "Kontakt")}
      />
      <section className="flex flex-col justify-center items-center gap-4">
        <div className="flex flex-wrap justify-center border-2 w-fit p-4 rounded-2xl gap-4">
          <EmailBubble />
          <SocialIcon href="https://www.linkedin.com/in/noahseeger/" label="LinkedIn">
            <FaLinkedin size={24} />
          </SocialIcon>
          <SocialIcon href="https://x.com/thenoahsee" label="X">
            <FaXTwitter size={24} />
          </SocialIcon>
          <SocialIcon href="https://discord.com/users/noahsee" label="Discord">
            <FaDiscord size={24} />
          </SocialIcon>
        </div>
      </section>
    </section>
  );
}

export default Contact;
