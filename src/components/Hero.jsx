import React from "react";
import me from "../assets/personal/me.png";
import { FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";

function Hero() {
  return (
    <section className="min-h-screen w-full flex flex-col md:flex-row justify-center items-center gap-8 px-4 py-8">
      <div className="w-64 h-64 md:w-80 md:h-80">
        <img
          src={me}
          alt="Noah Seeger"
          className="rounded-full w-full h-full object-cover shadow-lg"
        />
      </div>
      <div className="text-center md:text-left">
        <span className="text-xl text-gray-600">Hallo, Ich bin</span>
        <h1 className="text-4xl md:text-5xl font-bold my-2">Noah Seeger</h1>
        <h3 className="text-2xl md:text-3xl text-blue-600 mb-4">
          Angehender Entwickler
        </h3>
        <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
          <SocialLink
            href="https://github.com/NoahSeeger"
            icon={<FaGithub size={24} />}
            text="GitHub"
          />
          <SocialLink
            href="#CONTACT"
            icon={<IoIosMail size={24} />}
            text="Kontakt"
          />
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon, text }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 border-2 border-gray-300 rounded-full w-36 font-medium p-3 hover:bg-gray-200 transition duration-300"
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}

export default Hero;
