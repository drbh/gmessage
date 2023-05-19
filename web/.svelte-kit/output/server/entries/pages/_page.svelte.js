import { c as create_ssr_component, b as compute_rest_props, d as spread, f as escape_object, h as escape_attribute_value, i as each, j as add_attribute, v as validate_component, e as escape, n as null_to_empty, a as subscribe } from "../../chunks/index2.js";
import { v4 } from "uuid";
import { createIcon } from "@download/blockies";
import { g as getany, A as APP_THEMES } from "../../chunks/themes.js";
import { w as writable } from "../../chunks/index.js";
const ArrowPath = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z", "clip-rule": "evenodd" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z", "clip-rule": "evenodd" }] } };
const ChatBubbleLeftEllipsis = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z", "clip-rule": "evenodd" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 001.28.53l4.184-4.183a.39.39 0 01.266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0012 2.25zM8.25 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm2.625 1.125a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z", "clip-rule": "evenodd" }] } };
const ClipboardDocument = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-1.402-.791 2.252 2.252 0 011.913-1.576A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z", "clip-rule": "evenodd" }, { "d": "M3.5 6A1.5 1.5 0 002 7.5v9A1.5 1.5 0 003.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L8.44 6.439A1.5 1.5 0 007.378 6H3.5z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z", "clip-rule": "evenodd" }, { "d": "M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" }, { "d": "M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" }] } };
const EllipsisHorizontal = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z", "clip-rule": "evenodd" }] } };
const FaceFrown = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M10 18a8 8 0 100-16 8 8 0 000 16zm-3.536-3.475a.75.75 0 001.061 0 3.5 3.5 0 014.95 0 .75.75 0 101.06-1.06 5 5 0 00-7.07 0 .75.75 0 000 1.06zM9 8.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S7.448 7 8 7s1 .672 1 1.5zm3 1.5c.552 0 1-.672 1-1.5S12.552 7 12 7s-1 .672-1 1.5.448 1.5 1 1.5z", "clip-rule": "evenodd" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z", "clip-rule": "evenodd" }] } };
const FaceSmile = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-4.464a.75.75 0 10-1.061-1.061 3.5 3.5 0 01-4.95 0 .75.75 0 00-1.06 1.06 5 5 0 007.07 0zM9 8.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S7.448 7 8 7s1 .672 1 1.5zm3 1.5c.552 0 1-.672 1-1.5S12.552 7 12 7s-1 .672-1 1.5.448 1.5 1 1.5z", "clip-rule": "evenodd" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z", "clip-rule": "evenodd" }] } };
const MagnifyingGlass = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z", "clip-rule": "evenodd" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z", "clip-rule": "evenodd" }] } };
const PaperAirplane = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" }] } };
const PencilSquare = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" }, { "d": "M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" }, { "d": "M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" }] } };
const PlusSmall = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M12 6v12m6-6H6" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z", "clip-rule": "evenodd" }] } };
const RectangleStack = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.25A2.25 2.25 0 013.25 8h13.5A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" }] } };
const SpeakerWave = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.48A6.985 6.985 0 002 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" }, { "d": "M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" }, { "d": "M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" }] } };
const SquaresPlus = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "d": "M6 3a3 3 0 00-3 3v2.25a3 3 0 003 3h2.25a3 3 0 003-3V6a3 3 0 00-3-3H6zM15.75 3a3 3 0 00-3 3v2.25a3 3 0 003 3H18a3 3 0 003-3V6a3 3 0 00-3-3h-2.25zM6 12.75a3 3 0 00-3 3V18a3 3 0 003 3h2.25a3 3 0 003-3v-2.25a3 3 0 00-3-3H6zM17.625 13.5a.75.75 0 00-1.5 0v2.625H13.5a.75.75 0 000 1.5h2.625v2.625a.75.75 0 001.5 0v-2.625h2.625a.75.75 0 000-1.5h-2.625V13.5z" }] } };
const WrenchScrewdriver = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z", "clip-rule": "evenodd" }, { "d": "M14.5 11.5c.173 0 .345-.007.514-.022l3.754 3.754a2.5 2.5 0 01-3.536 3.536l-4.41-4.41 2.172-2.607c.052-.063.147-.138.342-.196.202-.06.469-.087.777-.067.128.008.257.012.387.012zM6 4.586l2.33 2.33a.452.452 0 01-.08.09L6.8 8.214 4.586 6H3.309a.5.5 0 01-.447-.276l-1.7-3.402a.5.5 0 01.093-.577l.49-.49a.5.5 0 01.577-.094l3.402 1.7A.5.5 0 016 3.31v1.277z" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z", "clip-rule": "evenodd" }, { "d": "M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" }, { "fill-rule": "evenodd", "d": "M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z", "clip-rule": "evenodd" }] } };
const XCircle = { "default": { "a": { "fill": "none", "viewBox": "0 0 24 24", "stroke-width": "1.5", "stroke": "currentColor", "aria-hidden": "true" }, "path": [{ "stroke-linecap": "round", "stroke-linejoin": "round", "d": "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }] }, "mini": { "a": { "viewBox": "0 0 20 20", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z", "clip-rule": "evenodd" }] }, "solid": { "a": { "viewBox": "0 0 24 24", "fill": "currentColor", "aria-hidden": "true" }, "path": [{ "fill-rule": "evenodd", "d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z", "clip-rule": "evenodd" }] } };
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let icon;
  let $$restProps = compute_rest_props($$props, ["src", "size", "solid", "mini"]);
  let { src } = $$props;
  let { size = "100%" } = $$props;
  let { solid = false } = $$props;
  let { mini = false } = $$props;
  if (size !== "100%") {
    if (size.slice(-1) != "x" && size.slice(-1) != "m" && size.slice(-1) != "%") {
      try {
        size = parseInt(size) + "px";
      } catch (error) {
        size = "100%";
      }
    }
  }
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.solid === void 0 && $$bindings.solid && solid !== void 0)
    $$bindings.solid(solid);
  if ($$props.mini === void 0 && $$bindings.mini && mini !== void 0)
    $$bindings.mini(mini);
  icon = src?.[solid ? "solid" : mini ? "mini" : "default"];
  return `<svg${spread(
    [
      escape_object(icon?.a),
      { xmlns: "http://www.w3.org/2000/svg" },
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { "aria-hidden": "true" },
      escape_object($$restProps)
    ],
    {}
  )}>${each(icon?.path ?? [], (a) => {
    return `<path${spread([escape_object(a)], {})}></path>`;
  })}</svg>`;
});
let port = 10999;
let protocol = "http://";
let host = "localhost";
if (typeof window !== "undefined") {
  protocol = window.location.protocol.slice(0, -1) + "://";
  host = window.location.hostname;
}
async function sendMessageToServerStream(userMessage, chatSessionId, incrementalMessageCallback) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: Number(chatSessionId), message: userMessage })
  };
  const response = await fetch(`${protocol}${host}:${port}/stream`, options);
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value);
      incrementalMessageCallback(chunk);
    }
  }
  let messages = await getCurrentChatSession(chatSessionId);
  return messages;
}
async function getCurrentChatSession(chatSessionId) {
  const options = { method: "GET" };
  const response = await fetch(`${protocol}${host}:${port}/messages/${chatSessionId}`, options);
  const json = await response.json();
  return json;
}
const format = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
};
const shortTime = (time) => {
  if (!time)
    return (/* @__PURE__ */ new Date()).toLocaleTimeString([], format);
  else
    return new Date(time).toLocaleTimeString([], format);
};
function convertMessage(message, index) {
  return {
    key: index,
    type: message.role === "user" ? "sent" : "received",
    content: message.content,
    timestamp: shortTime(message.createdAt ?? null),
    stage: message.stage ?? null,
    ...message
  };
}
const ChatHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { handleSettingsClick } = $$props;
  let { menuIsOpen = false } = $$props;
  let { isHoveringPictures: isHoveringPictures2 = false } = $$props;
  let { messages = [] } = $$props;
  function getProfilePicture() {
    if (typeof window === "undefined")
      return;
    return createIcon({ seed: "address", size: 8, scale: 16 }).toDataURL();
  }
  if ($$props.handleSettingsClick === void 0 && $$bindings.handleSettingsClick && handleSettingsClick !== void 0)
    $$bindings.handleSettingsClick(handleSettingsClick);
  if ($$props.menuIsOpen === void 0 && $$bindings.menuIsOpen && menuIsOpen !== void 0)
    $$bindings.menuIsOpen(menuIsOpen);
  if ($$props.isHoveringPictures === void 0 && $$bindings.isHoveringPictures && isHoveringPictures2 !== void 0)
    $$bindings.isHoveringPictures(isHoveringPictures2);
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  return `
<div class="cx-header"><div class="flex items-center justify-between"><div class="flex items-center space-x-4 justify-between w-full"><div class="flex items-center space-x-4">
				
				<div class="flex items-center space-x-4" tabindex="0"><div class="cursor-pointer"><div class="cx-badge"></div>
						<img${add_attribute("src", getProfilePicture(), 0)} alt="profile" class="cx-circle bg-[color:var(--white)]"></div>

					<div${add_attribute(
    "class",
    `
						cursor-pointer
						transform ${isHoveringPictures2 ? "-translate-x-2" : "-translate-x-6"} transition-transform duration-400`,
    0
  )}><div class="cx-badge"></div>
						<div class="cx-circle bg-[color:var(--bright)]"></div></div></div></div>

			
			<div id="chat-menu-button" class=""><div class="hover:text-white">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: EllipsisHorizontal,
      class: "w-6 h-6"
    },
    {},
    {}
  )}</div>
				<div id="chat-menu" ${!menuIsOpen ? "hidden" : ""} class="cx-menu"><div class="flex flex-col text-left">
						<div class="cx-menu-item" tabindex="0">Settings
						</div>
						
						<div class="cx-menu-item" tabindex="0">Download Chat
						</div>
						
						<div class="cx-menu-item" tabindex="0">New Chat
						</div></div></div></div>
			</div></div></div>`;
});
const ChatInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { inputEl } = $$props;
  let { handleKeyUp } = $$props;
  let { updateHeight } = $$props;
  let { sendMessage } = $$props;
  if ($$props.inputEl === void 0 && $$bindings.inputEl && inputEl !== void 0)
    $$bindings.inputEl(inputEl);
  if ($$props.handleKeyUp === void 0 && $$bindings.handleKeyUp && handleKeyUp !== void 0)
    $$bindings.handleKeyUp(handleKeyUp);
  if ($$props.updateHeight === void 0 && $$bindings.updateHeight && updateHeight !== void 0)
    $$bindings.updateHeight(updateHeight);
  if ($$props.sendMessage === void 0 && $$bindings.sendMessage && sendMessage !== void 0)
    $$bindings.sendMessage(sendMessage);
  return `
<div class="absolute bottom-0 w-[calc(100vw-380px)] mx-auto"><div class="cx-chat-input"><div class="flex items-end w-full"><div class="cx-chat-input-inside"><textarea id="chatbox-input" placeholder="Type here..." class="cx-chat-input-textarea" style="height: 22px;"${add_attribute("this", inputEl, 0)}></textarea></div>
			<button class="cx-chat-send-button">${validate_component(Icon, "Icon").$$render($$result, { src: PaperAirplane, class: "w-6 h-6" }, {}, {})}</button></div></div></div>
`;
});
const sinceTimestamp = (timestamp) => {
  return timeDiffToHuman((/* @__PURE__ */ new Date()).getTime(), new Date(timestamp).getTime());
};
const timeDiffToHuman = (timestampA, timestampB) => {
  const currentTimestampUTC = timestampA;
  const sinceLastSeen = currentTimestampUTC - timestampB;
  const secondsSinceLastSeen = Math.floor(sinceLastSeen / 1e3);
  const minutesSinceLastSeen = Math.floor(secondsSinceLastSeen / 60);
  const hoursSinceLastSeen = Math.floor(minutesSinceLastSeen / 60);
  const daysSinceLastSeen = Math.floor(hoursSinceLastSeen / 24);
  let lastSeen = "";
  if (daysSinceLastSeen > 0) {
    lastSeen = `${daysSinceLastSeen} days`;
  } else if (hoursSinceLastSeen > 0) {
    lastSeen = `${hoursSinceLastSeen} hours`;
  } else if (minutesSinceLastSeen > 0) {
    lastSeen = `${minutesSinceLastSeen} minutes`;
  } else {
    lastSeen = `${secondsSinceLastSeen} seconds`;
  }
  return lastSeen;
};
const ChatMessages_svelte_svelte_type_style_lang = "";
const css = {
  code: ".bg-light.svelte-18mddvm.svelte-18mddvm{background-color:#f7f7f7}.chat-container.svelte-18mddvm.svelte-18mddvm::-webkit-scrollbar{width:0.5rem}.chat-container.svelte-18mddvm.svelte-18mddvm::-webkit-scrollbar-track{background-color:#f7f7f7}.chat-container.svelte-18mddvm.svelte-18mddvm::-webkit-scrollbar-thumb{background-color:#d1d1d1;border-radius:1rem}.svelte-18mddvm.svelte-18mddvm{-ms-overflow-style:none;scrollbar-width:none;--webkit-scrollbar:none}.hover-group.svelte-18mddvm:hover .tool-section.svelte-18mddvm{opacity:100%}",
  map: null
};
const ChatMessages = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { inputEl } = $$props;
  let { messages = [] } = $$props;
  let { typingMessage = null } = $$props;
  let { preparingChatSession: preparingChatSession2 = false } = $$props;
  let { pendingText = "" } = $$props;
  let chatContainerRef;
  if ($$props.inputEl === void 0 && $$bindings.inputEl && inputEl !== void 0)
    $$bindings.inputEl(inputEl);
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  if ($$props.typingMessage === void 0 && $$bindings.typingMessage && typingMessage !== void 0)
    $$bindings.typingMessage(typingMessage);
  if ($$props.preparingChatSession === void 0 && $$bindings.preparingChatSession && preparingChatSession2 !== void 0)
    $$bindings.preparingChatSession(preparingChatSession2);
  if ($$props.pendingText === void 0 && $$bindings.pendingText && pendingText !== void 0)
    $$bindings.pendingText(pendingText);
  $$result.css.add(css);
  return `
<div class="bg-transparent w-full mx-auto flex flex-col svelte-18mddvm"><div id="chat-container" class="cx-chat-container scrollbar-none svelte-18mddvm"${add_attribute("this", chatContainerRef, 0)}>${messages.length === 0 && !typingMessage && !preparingChatSession2 ? `<div class="flex mx-auto mt-[30vh] svelte-18mddvm"><div class="h-full flex justify-center items-center text-center text-[color:var(--bright)] opacity-20 text-[40pt] font-[700]  svelte-18mddvm">GPT4ALL
				</div>

				<div class="h-full flex justify-center ml-4 items-center text-center text-[color:var(--bright)] opacity-20  svelte-18mddvm"><div class="border-[2px] border-[color:var(--bright)] py-6 rounded-xl w-[10vw] h-12 flex justify-center items-center svelte-18mddvm"><div class="flex flex-col svelte-18mddvm"><div class="text-[color:var(--bright)] text-[16pt] font-[700] mt-1 svelte-18mddvm">LOCAL</div>
							
							<div class="text-[color:var(--bright)] text-[8pt] font-[700] mt-[-0.35rem] cursor-pointer svelte-18mddvm">@drbh
							</div></div></div></div></div>` : `${each(messages.slice(3), (message, index) => {
    return `${// current message is sent by the user
    new Date(message?.timestamp || 0).getMinutes() - new Date(messages[index + 3 - 1]?.timestamp || 0).getMinutes() >= 1 ? `<div class="flex justify-center items-center mt-4 text-[color:var(--font-color)] opacity-30 text-[10pt] font-[400]  svelte-18mddvm">${escape(new Date(message.timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }))}
					</div>` : ``}
				<div class="${"flex message-container hover-group flex-col " + escape(message.type === "sent" ? "items-end" : "", true) + " svelte-18mddvm"}"><div class="${"shadow-sm hover:shadow-md bg-" + escape(
      message.type === "sent" ? (
        // users color
        "[color:var(--bright)]"
      ) : (
        // bots color
        "[color:var(--secondary)]"
      ),
      true
    ) + " text-" + escape(message.type === "sent" && "white", true) + " rounded-xl px-4 py-2 text-sm max-w-[26rem] min-w-[16rem] svelte-18mddvm"}"><p class="svelte-18mddvm">${escape(message.content)}</p>
						<div class="flex justify-between mt-1 text-xs opacity-50 svelte-18mddvm"><p class="mt-1 mr-4 svelte-18mddvm">${escape(message.timestamp)}</p>
							<p class="mt-1 svelte-18mddvm">${message.type !== "sent" ? `${escape(timeDiffToHuman(new Date(message.timestamp).getTime(), new Date(message.request_timestamp).getTime()))} |` : ``}
								
								${escape(message.content.split(" ").length)} words
								
								${message.type !== "sent" ? `| ${escape((message.content.split(" ").length / (new Date(message.timestamp).getTime() - new Date(message.request_timestamp).getTime()) * 1e3).toFixed(2))}/wps` : ``}
							</p></div>
						</div>

					
					<div class="tool-section opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out svelte-18mddvm">${message.type !== "sent" ? `<div class="flex justify-start mt-2 svelte-18mddvm">
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: ClipboardDocument, class: "w-4 h-4" }, {}, {})}</div>

								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: PencilSquare, class: "w-4 h-4" }, {}, {})}</div>
								
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: SpeakerWave, class: "w-4 h-4" }, {}, {})}</div>

								
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: SquaresPlus, class: "w-4 h-4" }, {}, {})}</div>

								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: FaceFrown, class: "w-4 h-4" }, {}, {})}</div>
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: FaceSmile, class: "w-4 h-4" }, {}, {})}
								</div></div>
							` : `<div class="flex justify-start mt-2 svelte-18mddvm">
								
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: ClipboardDocument, class: "w-4 h-4" }, {}, {})}</div>
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: PencilSquare, class: "w-4 h-4" }, {}, {})}</div>
								
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: SpeakerWave, class: "w-4 h-4" }, {}, {})}</div>

								
								<div class="cx-char-action-button svelte-18mddvm">${validate_component(Icon, "Icon").$$render($$result, { src: ArrowPath, class: "w-4 h-4" }, {}, {})}</div>
							</div>`}</div>
				</div>`;
  })}`}

		${pendingText !== "" ? `<div class="${"shadow-sm hover:shadow-md bg-" + escape("[color:var(--secondary)]", true) + " text-" + escape("white", true) + " rounded-xl px-4 py-2 text-sm max-w-[26rem] min-w-[16rem] svelte-18mddvm"}"><p class="svelte-18mddvm">${escape(pendingText)}</p>
				<div class="flex justify-between mt-1 text-xs opacity-50 svelte-18mddvm"><p class="mt-1 mr-4 svelte-18mddvm"></p>
					<p class="mt-1 svelte-18mddvm">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: ArrowPath,
      class: "w-4 h-4 animate-spin"
    },
    {},
    {}
  )}</p></div>
				</div>` : ``}

		${preparingChatSession2 ? `<div class="flex items-end svelte-18mddvm"><div class="${escape(null_to_empty(`bg-[color:var(--secondary)] text-gray-900 rounded-lg px-4 py-2 text-sm w-[200px]`), true) + " svelte-18mddvm"}"><div class="flex justify-start space-x-1.5 animate-pulse svelte-18mddvm"><span class="h-2 w-2 bg-gray-300 rounded-full svelte-18mddvm"></span>
						<span class="h-2 w-2 bg-gray-300 rounded-full svelte-18mddvm"></span>
						<span class="h-2 w-2 bg-gray-300 rounded-full svelte-18mddvm"></span></div>
					<p class="text-xs mt-1 text-gray-400 svelte-18mddvm">Reticulating splines.</p></div></div>` : ``}

		${typingMessage && pendingText === "" ? `<div class="flex items-end svelte-18mddvm"><div class="${escape(null_to_empty(`bg-[color:var(--secondary)] text-gray-900 rounded-lg px-4 py-2 text-sm w-[200px]`), true) + " svelte-18mddvm"}"><div class="flex justify-start space-x-1.5 animate-pulse svelte-18mddvm"><span class="h-2 w-2 bg-gray-300 rounded-full svelte-18mddvm"></span>
						<span class="h-2 w-2 bg-gray-300 rounded-full svelte-18mddvm"></span>
						<span class="h-2 w-2 bg-gray-300 rounded-full svelte-18mddvm"></span></div>
					<p class="text-xs mt-1 text-gray-400 animate-pulse svelte-18mddvm">thinking</p></div></div>` : ``}</div></div>

`;
});
const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_chatCompletionConfig;
  let $modelConfig, $$unsubscribe_modelConfig;
  let { chatSessionId = "" } = $$props;
  let { themes = [] } = $$props;
  let { setTheme = (themeName) => {
  } } = $$props;
  let { settingsHidden = true } = $$props;
  let { supportedModels = [] } = $$props;
  let { completionConfig = {} } = $$props;
  let { initModelConfig = {} } = $$props;
  const chatCompletionConfig = writable({
    logits_size: {
      type: "number",
      value: 0,
      min: 0,
      max: 999
    },
    tokens_size: {
      type: "number",
      value: 0,
      min: 0,
      max: 999
    },
    n_past: {
      type: "number",
      value: 0,
      min: 0,
      max: 999
    },
    n_ctx: {
      type: "number",
      value: 0,
      min: 0,
      max: 999
    },
    n_predict: {
      type: "number",
      value: 100,
      min: 0,
      max: 999
    },
    top_k: {
      type: "number",
      value: 5,
      min: 0,
      max: 999
    },
    top_p: {
      type: "number",
      value: 0.9,
      min: 0,
      max: 1
    },
    temp: {
      type: "number",
      value: 0.2,
      min: 0,
      max: 1
    },
    n_batch: {
      type: "number",
      value: 4,
      min: 1,
      max: 999
    },
    repeat_penalty: {
      type: "number",
      value: 1.1,
      min: 1,
      max: 10
    },
    repeat_last_n: {
      type: "number",
      value: 64,
      min: 1,
      max: 999
    },
    context_erase: { type: "number", value: 0, min: 0, max: 1 },
    verbose: {
      type: "boolean",
      value: "false",
      options: ["true", "false"]
    }
  });
  $$unsubscribe_chatCompletionConfig = subscribe(chatCompletionConfig, (value) => value);
  const modelConfig = writable({
    model: {
      type: "dropdown",
      value: "ggml-mpt-7b-chat.bin",
      options: supportedModels
    },
    n_threads: {
      type: "number",
      value: 1,
      min: 1,
      max: 999
    }
  });
  $$unsubscribe_modelConfig = subscribe(modelConfig, (value) => $modelConfig = value);
  if ($$props.chatSessionId === void 0 && $$bindings.chatSessionId && chatSessionId !== void 0)
    $$bindings.chatSessionId(chatSessionId);
  if ($$props.themes === void 0 && $$bindings.themes && themes !== void 0)
    $$bindings.themes(themes);
  if ($$props.setTheme === void 0 && $$bindings.setTheme && setTheme !== void 0)
    $$bindings.setTheme(setTheme);
  if ($$props.settingsHidden === void 0 && $$bindings.settingsHidden && settingsHidden !== void 0)
    $$bindings.settingsHidden(settingsHidden);
  if ($$props.supportedModels === void 0 && $$bindings.supportedModels && supportedModels !== void 0)
    $$bindings.supportedModels(supportedModels);
  if ($$props.completionConfig === void 0 && $$bindings.completionConfig && completionConfig !== void 0)
    $$bindings.completionConfig(completionConfig);
  if ($$props.initModelConfig === void 0 && $$bindings.initModelConfig && initModelConfig !== void 0)
    $$bindings.initModelConfig(initModelConfig);
  {
    {
      modelConfig.update((modelConfig2) => {
        modelConfig2.model.options = supportedModels;
        return modelConfig2;
      });
    }
  }
  {
    {
      chatCompletionConfig.update((chatCompletionConfig2) => {
        chatCompletionConfig2.logits_size.value = completionConfig.logits_size;
        chatCompletionConfig2.tokens_size.value = completionConfig.tokens_size;
        chatCompletionConfig2.n_past.value = completionConfig.n_past;
        chatCompletionConfig2.n_ctx.value = completionConfig.n_ctx;
        chatCompletionConfig2.n_predict.value = completionConfig.n_predict;
        chatCompletionConfig2.top_k.value = completionConfig.top_k;
        chatCompletionConfig2.top_p.value = completionConfig.top_p;
        chatCompletionConfig2.temp.value = completionConfig.temp;
        chatCompletionConfig2.n_batch.value = completionConfig.n_batch;
        chatCompletionConfig2.repeat_penalty.value = completionConfig.repeat_penalty;
        chatCompletionConfig2.repeat_last_n.value = completionConfig.repeat_last_n;
        chatCompletionConfig2.context_erase.value = completionConfig.context_erase;
        chatCompletionConfig2.verbose.value = completionConfig.verbose;
        return chatCompletionConfig2;
      });
    }
  }
  {
    {
      modelConfig.update((modelConfig2) => {
        modelConfig2.model.value = initModelConfig.model;
        modelConfig2.n_threads.value = initModelConfig.n_threads;
        return modelConfig2;
      });
    }
  }
  $$unsubscribe_chatCompletionConfig();
  $$unsubscribe_modelConfig();
  return `
<div class="${["cx-settings-pane", settingsHidden ? "hidden" : ""].join(" ").trim()}">
	<div class="cx-settings-header"><div class="opacity-50 text-[14pt] font-[600]">Settings</div>
		<button class="z-50 opacity-50 hover:opacity-100 transition duration-300 ease-in-out">${validate_component(Icon, "Icon").$$render($$result, { src: XCircle, class: "w-6 h-6" }, {}, {})}</button></div>

	
	<div class="flex h-[calc(100%-60px)]">
		<div class="cx-settings-sidebar">
			<div class="cx-recent-conversation justify-start pr-8 text-[color:var(--font-color)] opacity-50">${validate_component(Icon, "Icon").$$render($$result, { src: WrenchScrewdriver, class: "w-5 h-5" }, {}, {})}
				<span>Model Config</span></div>
			
			<div class="cx-recent-conversation justify-start pr-8 text-[color:var(--font-color)] opacity-50">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: ChatBubbleLeftEllipsis,
      class: "w-5 h-5"
    },
    {},
    {}
  )}
				<span>Chat Config</span></div>
			
			<div class="cx-recent-conversation justify-start pr-8 text-[color:var(--font-color)] opacity-50">${validate_component(Icon, "Icon").$$render($$result, { src: RectangleStack, class: "w-5 h-5" }, {}, {})}
				<span>Themes</span></div></div>

		
		<div class="w-[calc(100%-200px)] p-5 overflow-y-scroll">${`<form class="cx-settings-panel"><div class="flex flex-col space-y-2 overflow-y-auto h-full">${each(Object.keys($modelConfig), (key) => {
    return `
							<div class="flex flex-col items-start">

								
								${$modelConfig[key].type === "dropdown" ? `<div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">${escape(key)}</div>
									<select class="cx-settings-input w-full"${add_attribute("id", key, 0)}>${each($modelConfig[key].options, (option) => {
      return `<option${add_attribute("value", option, 0)}>${escape(option)}</option>`;
    })}</select>` : ``}

								
								${$modelConfig[key].type === "number" ? `<div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">${escape(key)}</div>
									<input class="cx-settings-input"${add_attribute("id", key, 0)} type="number"${add_attribute("min", $modelConfig[key].min, 0)}${add_attribute("max", $modelConfig[key].max, 0)}${add_attribute("value", $modelConfig[key].value, 0)}>` : ``}
							</div>`;
  })}

						<div class="mb-4"></div>
						<div class="flex justify-end"><button class="cx-settings-button" type="button">
								${`Save Settings`}</button></div></div></form>`}

			${``}

			${``}</div></div></div>`;
});
let preparingChatSession = false;
let isHoveringPictures = false;
const Chat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const theme = getany();
  let { chatSessionId = "" } = $$props;
  let { messages = [] } = $$props;
  let inputEl;
  let typingMessage = null;
  let menuIsOpen = false;
  let settingsHidden = true;
  let themes = APP_THEMES;
  let supportedModels = [];
  let completionConfig = {};
  let initModelConfig = {};
  function updateHeight() {
    inputEl.style.height = "calc(auto - 30px)";
    inputEl.style.height = inputEl.scrollHeight + "px";
  }
  const incrementalMessageCallback = (msg) => {
    let parsed = { text: "" };
    try {
      parsed = JSON.parse(msg);
    } catch (error) {
    }
    pendingText += parsed.text;
  };
  let pendingText = "";
  const sendMessage = async (event) => {
    const content = inputEl.value.trim();
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    if (messages.length === 0) {
      chatSessionId = localStorage.getItem("chatSessionId") || "";
      messages = [
        {
          type: "",
          content,
          timestamp,
          key: v4()
        },
        {
          type: "",
          content,
          timestamp,
          key: v4()
        },
        {
          type: "",
          content,
          timestamp,
          key: v4()
        }
      ];
      inputEl.value = "";
    }
    if (content) {
      messages = [
        ...messages,
        {
          type: "sent",
          content,
          timestamp,
          key: v4()
        }
      ];
      inputEl.value = "";
      setTimeout(
        () => {
          typingMessage = {
            type: "received",
            content: "Typing...",
            timestamp
          };
        },
        400
      );
      const serverMessagesPromise = sendMessageToServerStream(content, chatSessionId, incrementalMessageCallback);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 12e4));
      const serverMessages = await Promise.race([serverMessagesPromise, timeoutPromise]);
      typingMessage = null;
      pendingText = "";
      if (serverMessages) {
        messages = [
          // ...messages,
          ...serverMessages.map((msg, index) => convertMessage(msg, messages.length + index))
        ];
      } else {
        messages = [
          // ...messages,
          {
            type: "received",
            content: "Sorry, I am not able to respond right now.",
            timestamp
          }
        ];
      }
      return serverMessages;
    }
    return [];
  };
  function handleKeyUp(e) {
    if (e.key === "Enter") {
      sendMessage().then((serverMessages) => {
        messages = serverMessages.map((msg, index) => convertMessage(msg, messages.length + index));
      });
      inputEl.style.height = "24px";
    }
  }
  function setTheme(themeName) {
    const theme2 = themes[themeName];
    if (theme2) {
      theme.setTheme(themeName);
    }
  }
  function handleSettingsClick() {
    setTimeout(
      () => {
        menuIsOpen = false;
      },
      100
    );
    settingsHidden = false;
  }
  if ($$props.chatSessionId === void 0 && $$bindings.chatSessionId && chatSessionId !== void 0)
    $$bindings.chatSessionId(chatSessionId);
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `
<div class="bg-[color:var(--primary-light)] h-full flex flex-col shadow-lg w-full">${validate_component(ChatHeader, "ChatHeader").$$render(
      $$result,
      {
        isHoveringPictures,
        menuIsOpen,
        messages,
        handleSettingsClick
      },
      {},
      {}
    )}
	${validate_component(ChatMessages, "ChatMessages").$$render(
      $$result,
      {
        inputEl,
        messages,
        typingMessage,
        preparingChatSession,
        pendingText
      },
      {},
      {}
    )}
	${validate_component(ChatInput, "ChatInput").$$render(
      $$result,
      {
        handleKeyUp,
        updateHeight,
        sendMessage,
        inputEl
      },
      {
        inputEl: ($$value) => {
          inputEl = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>

<div id="overlay" class="${[
      "fixed top-0 left-0 w-full h-full bg-[#000]/80 opacity-90",
      settingsHidden ? "hidden" : ""
    ].join(" ").trim()}"></div>

${validate_component(Settings, "Settings").$$render(
      $$result,
      {
        chatSessionId,
        setTheme,
        themes,
        settingsHidden,
        supportedModels,
        completionConfig,
        initModelConfig
      },
      {
        settingsHidden: ($$value) => {
          settingsHidden = $$value;
          $$settled = false;
        },
        supportedModels: ($$value) => {
          supportedModels = $$value;
          $$settled = false;
        },
        completionConfig: ($$value) => {
          completionConfig = $$value;
          $$settled = false;
        },
        initModelConfig: ($$value) => {
          initModelConfig = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { recentConversations = [] } = $$props;
  let { resetWithChatSessionId } = $$props;
  let { messageCount } = $$props;
  let searchTerm = "";
  let seachResults = [];
  const withHighlight = (match) => {
    return `<span class="bg-[color:var(--bright)]">${match}</span>`;
  };
  let showNewConvo = false;
  if ($$props.recentConversations === void 0 && $$bindings.recentConversations && recentConversations !== void 0)
    $$bindings.recentConversations(recentConversations);
  if ($$props.resetWithChatSessionId === void 0 && $$bindings.resetWithChatSessionId && resetWithChatSessionId !== void 0)
    $$bindings.resetWithChatSessionId(resetWithChatSessionId);
  if ($$props.messageCount === void 0 && $$bindings.messageCount && messageCount !== void 0)
    $$bindings.messageCount(messageCount);
  {
    {
      if (messageCount === 4) {
        showNewConvo = true;
      }
    }
  }
  return `
<div class="cx-sidebar">
	<div class="cx-search-bar">
		<div class="cx-search-bar-inner">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: MagnifyingGlass,
      class: "ml-4 w-5 h-5 text-[color:var(--bright)]"
    },
    {},
    {}
  )}
			<input type="text" placeholder="Search" class="text-sm w-full outline-none bg-[color:var(--primary-light)]"${add_attribute("value", searchTerm, 0)}>
			${searchTerm.length > 0 ? `<div class="mr-4 w-5 h-5 text-gray-700 transform translate-x-[-0.75rem] hover:-translate-y-[1px] cursor-pointer ">${validate_component(Icon, "Icon").$$render($$result, { src: XCircle }, {}, {})}</div>` : ``}</div>

		<div class="ml-2 w-32 h-full text-gray-700 hover:-translate-y-[0.5px] cursor-pointer ">
			<button class="flex rounded-full shadow-md w-full h-full text-xs text-white items-center justify-center bg-[color:var(--bright)]">NEW
				${validate_component(Icon, "Icon").$$render($$result, { src: PlusSmall, class: "w-4 h-4 ml-1" }, {}, {})}</button></div></div>

	<div class="flex flex-col justify-center"><div class="flex flex-col items-center overflow-y-scroll max-h-[calc(100vh-5rem)]">
			${each(seachResults, (result) => {
    return `
				<div class="flex flex-col w-[calc(100%-4rem)]"><div class="flex items-center justify-between w-full"><div class="text-[color:var(--white)] text-md font-bold">${escape(result.role)}</div>

						
						<div class="text-[color:var(--white)] text-sm">${escape(sinceTimestamp(result.timestamp))}</div></div>
					<div class="text-[color:var(--white)] text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-full"><div class="cx-search-results">
							<img${add_attribute(
      "src",
      createIcon({
        seed: `some-random-string-${result.chat_id}`,
        // seed used to generate icon data, default: random
        // color: '#dfe', // to manually specify the icon color, default: random
        // bgcolor: '#aaa', // choose a different background color, default: white
        size: 15,
        // width/height of the icon in blocks, default: 10
        scale: 3
        // width/height of each block in pixels, default: 5
      }).toDataURL(),
      0
    )} class="w-4 h-4 bg-[color:var(--white)] rounded-full opacity-50">

							<div class="text-[color:var(--saturated)]"><!-- HTML_TAG_START -->${result.content.replace(new RegExp(searchTerm, "gi"), withHighlight)}<!-- HTML_TAG_END --></div>
						</div></div>
				</div>`;
  })}
			${searchTerm.length == 0 ? `${messageCount == 0 ? `
					<div class="cx-recent-conversation"><div class="flex w-full h-10 items-center justify-center text-gray-900 bg-[color:var(--primary-light)] rounded-md animate animate-pulse transistion-all duration-300 ease-in-out "></div></div>` : ``}

				${showNewConvo ? `
					<div class="cx-recent-conversation">
						<img${add_attribute(
    "src",
    createIcon({
      seed: `some-random-string-${"0"}`,
      // seed used to generate icon data, default: random
      // color: '#dfe', // to manually specify the icon color, default: random
      // bgcolor: '#aaa', // choose a different background color, default: white
      size: 15,
      // width/height of the icon in blocks, default: 10
      scale: 3
      // width/height of each block in pixels, default: 5
    }).toDataURL(),
    0
  )} class="w-10 h-10 bg-[color:var(--white)] rounded-full opacity-50">
						<div class="flex flex-col w-[calc(100%-4rem)]"><div class="flex items-center justify-between w-full">
								<div class="text-[color:var(--white)] text-sm">${escape("New Conversation Started")}</div>
								<div class="text-[color:var(--white)] text-xs">${escape("now")}</div></div>
							<div class="text-[color:var(--white)] text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-full">${escape("...")}</div></div></div>` : ``}

				
				${each(recentConversations, (conversation) => {
    return `
					<div class="cx-recent-conversation">
						<img${add_attribute(
      "src",
      createIcon({
        seed: `some-random-string-${conversation.chatId}`,
        // seed used to generate icon data, default: random
        // color: '#dfe', // to manually specify the icon color, default: random
        // bgcolor: '#aaa', // choose a different background color, default: white
        size: 15,
        // width/height of the icon in blocks, default: 10
        scale: 3
        // width/height of each block in pixels, default: 5
      }).toDataURL(),
      0
    )} class="w-10 h-10 bg-[color:var(--white)] rounded-full opacity-50">
						<div class="flex flex-col w-[calc(100%-4rem)]"><div class="flex items-center justify-between w-full">
								<div class="text-[color:var(--white)] text-sm">${escape(conversation.name)}</div>
								<div class="text-[color:var(--white)] text-xs">${escape(conversation.lastSeen)}</div></div>
							<div class="text-[color:var(--white)] text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-full">${escape(conversation.lastMessage)}
							</div></div>
					</div>`;
  })}` : ``}</div></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let recentConversations = [];
  let messages = [];
  const resetWithChatSessionId = () => {
    const chatSessionIdLocal = localStorage.getItem("chatSessionId");
    if (chatSessionIdLocal) {
      getCurrentChatSession(chatSessionIdLocal).then((serverMessages) => {
        messages = serverMessages.map((msg, index) => convertMessage(msg, messages.length + index));
      });
    }
  };
  let messageCount = 0;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        messageCount = messages.length;
      }
    }
    $$rendered = `<div class="flex absolute left-0 top-0 w-full h-full overflow-hidden">${validate_component(Sidebar, "Sidebar").$$render(
      $$result,
      {
        recentConversations,
        resetWithChatSessionId,
        messageCount
      },
      {},
      {}
    )}
	${validate_component(Chat, "Chat").$$render(
      $$result,
      { messages },
      {
        messages: ($$value) => {
          messages = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
