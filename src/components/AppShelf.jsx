import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { featuredApps } from "../content/apps";

function AppIcon({ app }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className={`app-shelf-icon${imageFailed ? " is-fallback" : ""}`}>
      {app.icon && !imageFailed ? (
        <img
          src={app.icon}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{app.monogram}</span>
      )}
    </span>
  );
}

function AppTile({ app, index, middleIndex, isActive, onActiveChange }) {
  const style = {
    "--stack-x": `${(index - middleIndex) * 1.8}rem`,
    "--stack-y": `${Math.abs(index - middleIndex) * 0.08}rem`,
    "--stack-rotation": `${(index - middleIndex) * 5}deg`,
    "--stack-z": isActive ? featuredApps.length + 1 : featuredApps.length - index,
    "--open-x": `${(index - middleIndex) * 5}rem`,
  };

  const content = (
    <>
      <AppIcon app={app} />
      {isActive && (
        <span className="app-shelf-active-label" aria-hidden="true">
          {app.name}
        </span>
      )}
    </>
  );

  if (!app.href) {
    return (
      <div
        className="app-shelf-card is-unlinked"
        style={style}
        role="img"
        aria-label={app.name}
        onPointerEnter={() => onActiveChange(app.id)}
        onPointerLeave={() => onActiveChange(null)}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      className="app-shelf-card"
      style={style}
      href={app.href}
      target={app.href.startsWith("http") ? "_blank" : undefined}
      rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={`Open ${app.name}`}
      onPointerEnter={() => onActiveChange(app.id)}
      onPointerLeave={() => onActiveChange(null)}
      onFocus={() => onActiveChange(app.id)}
    >
      {content}
    </a>
  );
}

export function AppShelf() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setIsOpen(true);
    }
  }, []);

  const middleIndex = (featuredApps.length - 1) / 2;

  return (
    <section
      id="apps"
      className={`app-shelf${isOpen ? " is-open" : ""}`}
      aria-labelledby="app-shelf-title"
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
          setActiveId(null);
        }
      }}
    >
      <div className="app-shelf-heading">
        <div>
          <h2 id="app-shelf-title">{t("home_apps_label", "Apps")}</h2>
        </div>
      </div>

      <div
        className="app-shelf-stage"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setIsOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            setIsOpen(false);
            setActiveId(null);
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") setIsOpen(true);
        }}
      >
        <div
          className="app-shelf-items"
          style={{ "--app-row-width": `${featuredApps.length * 5}rem` }}
        >
          {featuredApps.map((app, index) => (
            <AppTile
              key={app.id}
              app={app}
              index={index}
              middleIndex={middleIndex}
              isActive={activeId === app.id}
              onActiveChange={setActiveId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
