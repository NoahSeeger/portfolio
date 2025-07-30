import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaShieldAlt,
  FaUserShield,
  FaServer,
  FaEnvelope,
  FaFont,
  FaShareAlt,
  FaBalanceScale,
} from "react-icons/fa";

function DatenschutzModal({ isOpen, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const sections = [
    {
      id: "verantwortlicher",
      icon: FaUserShield,
      title: "Verantwortlicher",
      content: (
        <div>
          <p className="font-semibold text-[#422B67] text-lg mb-2">
            Noah Seeger
          </p>
          <p className="text-gray-600">
            E-Mail:{" "}
            <a
              href="mailto:noahseeger@outlook.de"
              className="text-[#422B67] hover:underline font-medium"
            >
              noahseeger@outlook.de
            </a>
          </p>
        </div>
      ),
    },
    {
      id: "hosting",
      icon: FaServer,
      title: "Hosting",
      content: (
        <p className="text-gray-700 leading-relaxed">
          Diese Website wird bei{" "}
          <span className="font-semibold text-[#422B67]">Netlify</span>{" "}
          gehostet. Beim Aufruf der Seite speichert der Hosting-Anbieter
          automatisch Daten (z. B. IP-Adresse, Browsertyp, Uhrzeit), um einen
          sicheren Betrieb der Website zu gewährleisten. Diese Daten werden in
          der Regel nach kurzer Zeit gelöscht und nicht mit anderen Datenquellen
          zusammengeführt.
        </p>
      ),
    },
    {
      id: "email",
      icon: FaEnvelope,
      title: "E-Mail-Kontakt",
      content: (
        <p className="text-gray-700 leading-relaxed">
          Wenn du mir per E-Mail schreibst, werden die übermittelten Daten (z.
          B. Name, E-Mail-Adresse) ausschließlich zur Bearbeitung deiner Anfrage
          verwendet.
        </p>
      ),
    },
    {
      id: "fonts",
      icon: FaFont,
      title: "Externe Schriftarten (Google Fonts)",
      content: (
        <p className="text-gray-700 leading-relaxed">
          Auf dieser Website werden Schriftarten von{" "}
          <span className="font-semibold text-[#422B67]">Google Fonts</span>{" "}
          eingebunden. Beim Laden der Seite wird dafür eine Verbindung zu
          Servern von Google hergestellt. Dabei kann deine IP-Adresse übertragen
          werden. Die Nutzung erfolgt auf Grundlage meines berechtigten
          Interesses an einer einheitlichen Darstellung der Website.
        </p>
      ),
    },
    {
      id: "social",
      icon: FaShareAlt,
      title: "Social Media Links",
      content: (
        <p className="text-gray-700 leading-relaxed">
          Auf der Website befinden sich Links zu Profilen auf Plattformen wie
          LinkedIn und YouTube. Beim Klick auf einen Link verlässt du meine
          Website und es gelten die Datenschutzrichtlinien der jeweiligen
          Anbieter.
        </p>
      ),
    },
    {
      id: "rechte",
      icon: FaBalanceScale,
      title: "Deine Rechte",
      content: (
        <p className="text-gray-700 leading-relaxed">
          Du hast das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung deiner Daten sowie das Recht auf
          Widerspruch. Bei Fragen kannst du dich jederzeit an mich wenden.
        </p>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.4,
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#422B67] to-[#422B67]/90 text-white p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div>
                  <h1 className="text-lg font-bold md:text-lg">
                    Datenschutzerklärung
                  </h1>
                  <p className="text-white/80 text-sm">
                    Transparenz und Schutz deiner Daten
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors group"
              >
                <FaTimes className="text-lg group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <motion.div
                className="p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Intro */}
                <motion.p
                  className="text-lg text-gray-600 mb-8 leading-relaxed text-center"
                  variants={itemVariants}
                >
                  Hier erfährst du, wie deine Daten auf dieser Website behandelt
                  werden.
                </motion.p>

                {/* Content Sections */}
                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <motion.section
                      key={section.id}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100/50 transition-colors duration-300"
                      variants={itemVariants}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-[#422B67]/10 to-[#422B67]/5 text-[#422B67]">
                            <section.icon className="text-lg" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="text-[#422B67] text-base font-normal">
                              {index + 1}.
                            </span>
                            {section.title}
                          </h2>
                          <div className="prose prose-gray max-w-none text-sm">
                            {section.content}
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  ))}

                  {/* Important Notice */}
                  <motion.div
                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200/50"
                    variants={itemVariants}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                          <FaShieldAlt className="text-lg" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-800 mb-2">
                          Wichtiger Hinweis
                        </h3>
                        <p className="text-green-700 leading-relaxed text-sm">
                          Diese Website verwendet{" "}
                          <span className="font-semibold">keine Cookies</span>,
                          <span className="font-semibold"> kein Tracking</span>{" "}
                          und
                          <span className="font-semibold">
                            {" "}
                            keine eingebetteten Drittinhalte
                          </span>{" "}
                          wie YouTube oder Google Maps. Ein Cookie-Banner ist
                          daher nicht erforderlich.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Contact Section */}
                <motion.div
                  className="mt-8 text-center"
                  variants={itemVariants}
                >
                  <div className="bg-gradient-to-r from-[#422B67]/5 to-[#422B67]/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Fragen zur Datenschutzerklärung?
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Bei Fragen oder Anliegen zum Datenschutz kannst du mich
                      jederzeit kontaktieren.
                    </p>
                    <a
                      href="mailto:noahseeger@outlook.de"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#422B67] to-[#422B67]/90 text-white font-semibold rounded-full hover:from-[#422B67]/90 hover:to-[#422B67]/80 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                    >
                      <FaEnvelope className="text-xs" />
                      Kontakt aufnehmen
                    </a>
                  </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                  className="mt-8 pt-6 border-t border-gray-200 text-center"
                  variants={itemVariants}
                >
                  <p className="text-gray-400 text-sm">
                    © 2024 Noah Seeger. Alle Rechte vorbehalten.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Footer link component for easy integration
export function DatenschutzLink() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-gray-400 hover:text-white transition-colors text-sm underline-offset-4 hover:underline"
      >
        Datenschutzerklärung
      </button>
      <DatenschutzModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default DatenschutzModal;
