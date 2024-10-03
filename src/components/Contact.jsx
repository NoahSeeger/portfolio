import React from "react";
import SectionTitle from "./SectionTitle";
import { IoIosMail } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";
function Contact() {
  return (
    <section
      id="CONTACT"
      className="h-[50vh] flex flex-col justify-center items-center gap-12"
    >
      <SectionTitle title={"Treten wir in"} subtitle={"Kontakt"} />
      <section className="flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col md:flex-row border-2 w-fit p-4 rounded-2xl gap-4">
          <div className="flex items-center gap-2">
            <IoIosMail size={24} />
            <a href="mailto:noahseeger@outlook.de" className="link">
              noahseeger@outlook.de
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaLinkedin size={24} />
            <a
              href="https://www.linkedin.com/in/noahseeger/"
              target="_blank"
              className="link "
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Contact;
