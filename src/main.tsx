import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { config } from "./config.ts";
import thumbnail from "./assets/Thumnail.png";

const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

document.title = config.siteTitle;
setMeta('meta[name="description"]',        "content", config.siteDescription);
setMeta('meta[name="author"]',             "content", `${config.partner1} & ${config.partner2}`);
setMeta('meta[property="og:title"]',       "content", config.siteTitle);
setMeta('meta[property="og:description"]', "content", config.siteDescription);
setMeta('meta[name="twitter:site"]',       "content", config.twitterHandle);
setMeta('meta[property="og:image"]',       "content", thumbnail);
setMeta('meta[name="twitter:image"]',      "content", thumbnail);

createRoot(document.getElementById("root")!).render(<App />);
