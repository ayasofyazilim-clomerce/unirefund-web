import type {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Unirefund SSR",
    short_name: "SSR",
    description: "A Progressive Web App for Unirefund SSR",
    start_url: "/",
    orientation: "portrait",
    display: "fullscreen",
    background_color: "#ffffff",
    theme_color: "#DB0000",
    screenshots: [
      {
        src: "/pwa/AppScreenshot.png",
        sizes: "320x640",
        type: "image/png",
        // @ts-expect-error this is not a standard property, but used by some browsers
        form_factor: "wide",
        label: "App",
      },
      {
        src: "/pwa/AppScreenshot.png",
        sizes: "320x640",
        type: "image/png",
        // @ts-expect-error this is not a standard property, but used by some browsers
        label: "App",
      },
    ],
    icons: [
      {
        src: "/pwa/144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/pwa/192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/pwa/512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
