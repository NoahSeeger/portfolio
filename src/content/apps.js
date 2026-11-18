import picswipeIcon from "../assets/apps/picswipe.webp";
import quantaIcon from "../assets/apps/quanta.webp";
import birthdayIcon from "../assets/apps/birthday-calendar.webp";

// Direct destinations; visiting the portfolio never loads these external sites.
export const featuredApps = [
  {
    id: "picswipe",
    name: "PicSwipe",
    icon: picswipeIcon,
    href: "https://picswipe.noahseeger.de",
    destination: "Website",
    palette: {
      light: { start: "#c4dcf2", end: "#89add4", ink: "#173553", border: "#88a8c9" },
      dark: { start: "#416e9a", end: "#1d3557", ink: "#f3f8ff", border: "#587ca1" },
    },
  },
  {
    id: "quanta",
    name: "Quanta",
    icon: quantaIcon,
    href: "https://apps.apple.com/app/id6753695596",
    destination: "App Store",
    palette: {
      light: { start: "#197181", end: "#152c50", ink: "#f3ffff", border: "#387084" },
      dark: { start: "#197181", end: "#152c50", ink: "#f3ffff", border: "#387084" },
    },
  },
  {
    id: "birthday-calendar",
    name: "Birthday Calendar",
    icon: birthdayIcon,
    href: "https://apps.apple.com/app/id6753290752",
    destination: "App Store",
    palette: {
      light: { start: "#f8d65a", end: "#efaa45", ink: "#623609", border: "#dca153" },
      dark: { start: "#f8d65a", end: "#efaa45", ink: "#623609", border: "#dca153" },
    },
  },
];
