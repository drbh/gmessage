import { c as create_ssr_component, v as validate_component } from "../../chunks/index2.js";
import { g as getany, s as setany, A as APP_THEMES } from "../../chunks/themes.js";
import { w as writable } from "../../chunks/index.js";
const app = "";
const Theme = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  getany();
  const applyTheme = () => {
    document.documentElement.classList.toggle("dark", localStorage.theme === "dark" || !localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  };
  const updateFn = applyTheme.toString();
  const updateScript = "<script>" + updateFn.substring(6) + "<\/script>";
  return `
${$$result.head += `<!-- HEAD_svelte-1cgseeh_START --><!-- HTML_TAG_START -->${updateScript}<!-- HTML_TAG_END --><!-- HEAD_svelte-1cgseeh_END -->`, ""}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let theme = "system";
  const { subscribe, set } = writable(theme);
  function setTheme(value) {
    const { primary, primaryLight, secondary, bright, fontColor } = APP_THEMES[value];
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--primary-light", primaryLight);
    document.documentElement.style.setProperty("--secondary", secondary);
    document.documentElement.style.setProperty("--bright", bright);
    document.documentElement.style.setProperty("--font-color", fontColor);
    if (value !== theme) {
      theme = value;
      set(theme);
    }
  }
  const store = { subscribe, setTheme };
  setany(store);
  return `${validate_component(Theme, "Theme").$$render($$result, {}, {}, {})}
${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
