// ../../slash/dist/index.mjs
var R = function(z, $, J, F) {
  var Y;
  $[0] = 0;
  for (var Q = 1;Q < $.length; Q++) {
    var Z = $[Q++], M = $[Q] ? ($[0] |= Z ? 1 : 2, J[$[Q++]]) : $[++Q];
    Z === 3 ? F[0] = M : Z === 4 ? F[1] = Object.assign(F[1] || {}, M) : Z === 5 ? (F[1] = F[1] || {})[$[++Q]] = M : Z === 6 ? F[1][$[++Q]] += M + "" : Z ? (Y = z.apply(M, R(z, M, J, ["", null])), F.push(Y), M[0] ? $[0] |= 2 : ($[Q - 2] = 0, $[Q] = Y)) : F.push(M);
  }
  return F;
};
var N = new Map;
function T(z) {
  var $ = N.get(this);
  return $ || ($ = new Map, N.set(this, $)), ($ = R(this, $.get(z) || ($.set(z, $ = function(J) {
    for (var F, Y, Q = 1, Z = "", M = "", q = [0], G = function(W) {
      Q === 1 && (W || (Z = Z.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? q.push(0, W, Z) : Q === 3 && (W || Z) ? (q.push(3, W, Z), Q = 2) : Q === 2 && Z === "..." && W ? q.push(4, W, 0) : Q === 2 && Z && !W ? q.push(5, 0, true, Z) : Q >= 5 && ((Z || !W && Q === 5) && (q.push(Q, 0, Z, Y), Q = 6), W && (q.push(Q, W, 0, Y), Q = 6)), Z = "";
    }, X = 0;X < J.length; X++) {
      X && (Q === 1 && G(), G(X));
      for (var H = 0;H < J[X].length; H++)
        F = J[X][H], Q === 1 ? F === "<" ? (G(), q = [q], Q = 3) : Z += F : Q === 4 ? Z === "--" && F === ">" ? (Q = 1, Z = "") : Z = F + Z[0] : M ? F === M ? M = "" : Z += F : F === '"' || F === "'" ? M = F : F === ">" ? (G(), Q = 1) : Q && (F === "=" ? (Q = 5, Y = Z, Z = "") : F === "/" && (Q < 5 || J[X][H + 1] === ">") ? (G(), Q === 3 && (q = q[0]), Q = q, (q = q[0]).push(2, 0, Q), Q = 0) : F === " " || F === "\t" || F === `
` || F === "\r" ? (G(), Q = 2) : Z += F), Q === 3 && Z === "!--" && (Q = 4, q = q[0]);
    }
    return G(), q;
  }(z)), $), arguments, [])).length > 1 ? $ : $[0];
}
var K = null;
function s(z) {
  let $ = K;
  if (!$ || !$.active || $.links.has(z))
    return;
  let J = z.subscribe(() => {
    if ($.active)
      $.schedule();
  });
  $.links.set(z, J);
}
var B = null;
function S(z) {
  B = z;
}
function L(z) {
  let $ = z, J = new Set, F = { get: () => {
    return s(F), $;
  }, set: (Y) => {
    let Q = typeof Y === "function" ? Y($) : Y;
    if (Object.is(Q, $))
      return;
    $ = Q, J.forEach((Z) => Z($));
  }, subscribe: (Y) => {
    return J.add(Y), () => J.delete(Y);
  } };
  if (Array.isArray(z)) {
    let Y = new WeakMap, Q = new Map, Z = (q) => {
      if (q !== null && typeof q === "object") {
        let X = q;
        if ("id" in X)
          return X.id;
        if ("key" in X)
          return X.key;
        let H = q, W = Y.get(H);
        if (W !== undefined)
          return W;
        let j = Symbol("item");
        return Y.set(H, j), j;
      }
      return `${typeof q}:${String(q)}`;
    }, M = F;
    return M.map = (q) => {
      if (!B)
        throw Error("[slash] list renderer not registered — ensure `hyper` is imported before using listSignal.map()");
      let G = F;
      return B(G, Z, (X) => {
        let W = G.get().indexOf(X);
        return q(X, W);
      });
    }, M;
  }
  return F;
}
function u(z) {
  return !!z && typeof z.get === "function" && typeof z.subscribe === "function";
}
function k(z) {
  return z == null ? "" : typeof z === "string" ? z : String(z);
}
var P = new WeakMap;
function U(z, $) {
  let J = P.get(z);
  if (J)
    J.push($);
  else
    P.set(z, [$]);
}
function D(z) {
  let $ = P.get(z);
  if ($) {
    for (let J of $)
      try {
        J();
      } catch {}
    P.delete(z);
  }
  if (z instanceof Element && z.hasChildNodes())
    z.childNodes.forEach((J) => D(J));
}
function r(z, $) {
  let J = document.createComment("sig:start"), F = document.createComment("sig:end");
  z.appendChild(J), z.appendChild(F);
  let Y = (Z) => {
    let M = J.nextSibling;
    while (M && M !== F) {
      let G = M.nextSibling;
      D(M), z.removeChild(M), M = G;
    }
    let q = document.createDocumentFragment();
    if (Z == null || Z === false)
      ;
    else if (Array.isArray(Z))
      for (let G of Z)
        V(q, G);
    else if (Z instanceof Node)
      O(q, Z);
    else
      q.appendChild(document.createTextNode(k(Z)));
    z.insertBefore(q, F);
  };
  Y($.get());
  let Q = $.subscribe(Y);
  U(J, Q);
}
function O(z, $) {
  if ($.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    z.appendChild($.cloneNode(true));
    return;
  }
  if ($.parentNode && $.parentNode !== z) {
    z.appendChild($.cloneNode(true));
    return;
  }
  z.appendChild($);
}
function V(z, $) {
  if ($ == null || $ === false)
    return;
  if (u($)) {
    r(z, $);
    return;
  }
  if (Array.isArray($)) {
    for (let J of $)
      V(z, J);
    return;
  }
  if ($ instanceof Node) {
    O(z, $);
    return;
  }
  O(z, document.createTextNode(k($)));
}
function m(z, $) {
  if ($ == null || $ === false) {
    z.className = "";
    return;
  }
  if (typeof $ === "string") {
    z.className = $;
    return;
  }
  if (Array.isArray($)) {
    z.className = $.filter(Boolean).map((J) => String(J)).join(" ");
    return;
  }
  if (typeof $ === "object") {
    let J = Object.entries($).filter(([, F]) => Boolean(F)).map(([F]) => F);
    z.className = J.join(" ");
    return;
  }
  z.className = String($);
}
function y(z) {
  return typeof z === "function" || typeof z === "object" && z !== null && "handleEvent" in z;
}
function n(z) {
  return typeof z === "boolean" || typeof z === "object" && z !== null;
}
function l(z) {
  if (!Array.isArray(z))
    return false;
  if (z.length === 0)
    return false;
  let $ = z[0];
  if (!y($))
    return false;
  let J = z.length > 1 ? z[1] : undefined;
  if (J !== undefined && !n(J))
    return false;
  return true;
}
function a(z) {
  if (y(z))
    return { handler: z };
  if (l(z)) {
    let $ = z[0], J = z.length > 1 ? z[1] : undefined;
    return { handler: $, options: J };
  }
  return null;
}
function t(z, $, J) {
  let F = (Q) => {
    if ($ === "class" || $ === "className") {
      m(z, Q);
      return;
    }
    if ($ === "style" && Q && typeof Q === "object") {
      Object.assign(z.style, Q);
      return;
    }
    if ($ === "value") {
      let Z = z, M = Q == null ? "" : String(Q);
      if (Z.value !== M)
        Z.value = M;
      if ("defaultValue" in Z) {
        let q = Z;
        if (q.defaultValue !== M)
          q.defaultValue = M;
      }
      if (Z instanceof HTMLSelectElement)
        for (let q of Array.from(Z.options))
          q.selected = q.value === M;
      return;
    }
    if ($ === "checked") {
      let Z = z, M = Boolean(Q);
      if (Z.checked !== M)
        Z.checked = M;
      if (Z.defaultChecked !== M)
        Z.defaultChecked = M;
      return;
    }
    if ($ in z) {
      if (!Reflect.set(z, $, Q))
        if (Q == null || Q === false)
          z.removeAttribute($);
        else
          z.setAttribute($, String(Q));
    } else if (Q == null || Q === false)
      z.removeAttribute($);
    else
      z.setAttribute($, String(Q));
  };
  F(J.get());
  let Y = J.subscribe(F);
  U(z, Y);
}
function e(z, $, J) {
  if ($ === "children")
    return;
  if (u(J)) {
    t(z, $, J);
    return;
  }
  if ($.startsWith("on") && $[2] === $[2]?.toUpperCase()) {
    let F = $.slice(2).toLowerCase(), Y = a(J);
    if (Y)
      z.addEventListener(F, Y.handler, Y.options), U(z, () => z.removeEventListener(F, Y.handler, Y.options));
    return;
  }
  if ($ === "style" && J && typeof J === "object") {
    Object.assign(z.style, J);
    return;
  }
  if ($ === "class" || $ === "className") {
    m(z, J);
    return;
  }
  if ($ === "value") {
    let F = z, Y = J == null ? "" : String(J);
    if (F.value !== Y)
      F.value = Y;
    if ("defaultValue" in F) {
      let Q = F;
      if (Q.defaultValue !== Y)
        Q.defaultValue = Y;
    }
    if (F instanceof HTMLSelectElement)
      for (let Q of Array.from(F.options))
        Q.selected = Q.value === Y;
    return;
  }
  if ($ === "checked") {
    let F = z, Y = Boolean(J);
    if (F.checked !== Y)
      F.checked = Y;
    if (F.defaultChecked !== Y)
      F.defaultChecked = Y;
    return;
  }
  if ($ in z) {
    if (!Reflect.set(z, $, J))
      if (J == null || J === false)
        z.removeAttribute($);
      else
        z.setAttribute($, String(J));
  } else if (J == null || J === false)
    z.removeAttribute($);
  else
    z.setAttribute($, String(J));
}
var $0 = "http://www.w3.org/2000/svg";
var z0 = new Set(["svg", "path", "g", "circle", "rect", "line", "polyline", "polygon", "ellipse", "defs", "use", "clipPath", "mask", "pattern", "text"]);
function x(z, $, ...J) {
  if (typeof z === "function") {
    let Q = z({ ...$ || {}, children: J });
    if (Q instanceof Node)
      return Q;
    let Z = document.createDocumentFragment();
    return V(Z, Q), Z;
  }
  let F = String(z || "div"), Y = z0.has(F) ? document.createElementNS($0, F) : document.createElement(F);
  if ($)
    for (let [Q, Z] of Object.entries($))
      e(Y, Q, Z);
  for (let Q of J)
    V(Y, Q);
  return Y;
}
var I = T.bind(x);
var f = typeof process < "u" && process?.env?.NODE_ENV !== "production";
function h() {
  try {
    let z = Error().stack?.split(`
`).slice(3);
    if (!z?.length)
      return;
    let $ = z.find((F) => /\.(ts|tsx|js)/.test(F));
    if (!$)
      return;
    let J = $.match(/at\s+(?:.*\()?([^():]+):(\d+):\d+\)?/);
    if (!J)
      return;
    return `${J[1]}:${J[2]}`;
  } catch {
    return;
  }
}
function F0(z) {
  if (typeof z === "string") {
    let F = document.querySelector(z);
    if (!F) {
      let Y = f ? h() : undefined, Q = Y ? ` (called from ${Y})` : "";
      throw Error(`[slash] render(): selector "${z}" not found — ensure the element exists before calling render()${Q}`);
    }
    return F;
  }
  if (z instanceof Element)
    return z;
  let $ = f ? h() : undefined, J = $ ? ` (called from ${$})` : "";
  throw Error(`[slash] render(): container Element is required (received null/undefined)${J}`);
}
function J0(z, $) {
  let J = F0($), F = Array.from(J.childNodes);
  for (let M of F)
    D(M);
  J.textContent = "";
  let Y = typeof z === "function" ? z() : z, Q = Array.isArray(Y) ? Y : [Y];
  for (let M of Q)
    V(J, M);
  let Z = Array.from(J.childNodes);
  return Z.length === 1 ? Z[0] : Z;
}
function Q0(z, $) {
  let J = z.parentNode;
  if (!J)
    return;
  let F = z;
  while (F) {
    let Y = F.nextSibling;
    if (D(F), J.removeChild(F), F === $)
      break;
    F = Y;
  }
}
function Y0(z, $, J) {
  let F = z.parentNode;
  if (!F)
    return;
  let Y = document.createDocumentFragment(), Q = z;
  while (Q) {
    let Z = Q.nextSibling;
    if (Y.appendChild(Q), Q === $)
      break;
    Q = Z;
  }
  F.insertBefore(Y, J);
}
function g(z, $, J, F) {
  let Y = document.createComment("repeat:start"), Q = document.createComment("repeat:end"), Z = document.createDocumentFragment();
  Z.appendChild(Y);
  let M = J(F);
  return V(Z, M), Z.appendChild(Q), z.insertBefore(Z, $), { start: Y, end: Q };
}
function c(z, $, J) {
  let F = document.createTextNode(""), Y = new Map;
  function Q(q) {
    let { parentNode: G, nextSibling: X } = F;
    for (let H of q) {
      let W = $(H), j = g(G, X, J, H);
      Y.set(W, j), X = j.end.nextSibling;
    }
  }
  function Z(q) {
    let G = F.parentNode, X = new Set, H = F;
    for (let W of q) {
      let j = $(W);
      X.add(j);
      let w = Y.get(j);
      if (!w) {
        let A = g(G, H.nextSibling, J, W);
        Y.set(j, A), H = A.end;
      } else {
        let A = H.nextSibling;
        if (w.start !== A)
          Y0(w.start, w.end, A);
        H = w.end;
      }
    }
    for (let [W, j] of Y)
      if (!X.has(W))
        Q0(j.start, j.end), Y.delete(W);
  }
  queueMicrotask(() => Q(z.get()));
  let M = z.subscribe((q) => Z(q));
  return U(F, M), F;
}
S((z, $, J) => c(z, $, J));

// ../src/styles.module.css
var styles_module_default = {
  row: "row_7MSHeA",
  todo: "todo_7MSHeA",
  rm: "rm_7MSHeA",
  button: "button_7MSHeA",
  primary: "primary_7MSHeA",
  secondary: "secondary_7MSHeA"
};

// ../src/client.ts
if (__DEV__) {
  console.log("[DEV] App iniciando em modo desenvolvimento");
  console.log("[DEV] Ambiente:", "development");
}
var todos = L([]);
var name = L("");
var primary = L(true);
var nextId = 1;
var btnClasses = L([
  styles_module_default.button,
  primary.get() ? styles_module_default.primary : styles_module_default.secondary
]);
primary.subscribe((on) => {
  btnClasses.set([styles_module_default.button, on ? styles_module_default.primary : styles_module_default.secondary]);
});
function add() {
  const text = name.get().trim();
  if (!text)
    return;
  const newTodo = { id: nextId++, text };
  todos.set((prev) => [...prev, newTodo]);
  name.set("");
}
function remove(id) {
  todos.set((prev) => prev.filter((t2) => t2.id !== id));
}
function App() {
  return I`
    <section>
      <div class=${styles_module_default.row}>
        <label>
          name:
          <input
            value=${name}
            onInput=${(e2) => name.set(e2.target.value)}
          />
        </label>
        <button onClick=${add}>adicionar</button>
        <button onClick=${() => todos.set([])}>limpar</button>
      </div>

      <div class=${styles_module_default.row}>
        <button class=${btnClasses} onClick=${() => primary.set(!primary.get())}>
          toggle primary
        </button>
      </div>

      <ul class=${styles_module_default.row}>
        <${c} each=${todos} key=${(t2) => t2.id}>
          ${(t2) => I`
            <li class=${styles_module_default.todo}>
              <span>${t2.text}</span>
              <button class=${styles_module_default.rm} onClick=${() => remove(t2.id)}>x</button>
            </li>
          `}
        </${c}>
      </ul>
    </section>
  `;
}
J0(I`<${App} />`, document.getElementById("app"));

//# debugId=3CAD77B1EF54C7C764756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc2xhc2gvZGlzdC9pbmRleC5tanMiLCAiLi4vc3JjL2NsaWVudC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICJ2YXIgUj1mdW5jdGlvbih6LCQsSixGKXt2YXIgWTskWzBdPTA7Zm9yKHZhciBRPTE7UTwkLmxlbmd0aDtRKyspe3ZhciBaPSRbUSsrXSxNPSRbUV0/KCRbMF18PVo/MToyLEpbJFtRKytdXSk6JFsrK1FdO1o9PT0zP0ZbMF09TTpaPT09ND9GWzFdPU9iamVjdC5hc3NpZ24oRlsxXXx8e30sTSk6Wj09PTU/KEZbMV09RlsxXXx8e30pWyRbKytRXV09TTpaPT09Nj9GWzFdWyRbKytRXV0rPU0rXCJcIjpaPyhZPXouYXBwbHkoTSxSKHosTSxKLFtcIlwiLG51bGxdKSksRi5wdXNoKFkpLE1bMF0/JFswXXw9MjooJFtRLTJdPTAsJFtRXT1ZKSk6Ri5wdXNoKE0pfXJldHVybiBGfSxOPW5ldyBNYXA7ZnVuY3Rpb24gVCh6KXt2YXIgJD1OLmdldCh0aGlzKTtyZXR1cm4gJHx8KCQ9bmV3IE1hcCxOLnNldCh0aGlzLCQpKSwoJD1SKHRoaXMsJC5nZXQoeil8fCgkLnNldCh6LCQ9ZnVuY3Rpb24oSil7Zm9yKHZhciBGLFksUT0xLFo9XCJcIixNPVwiXCIscT1bMF0sRz1mdW5jdGlvbihXKXtRPT09MSYmKFd8fChaPVoucmVwbGFjZSgvXlxccypcXG5cXHMqfFxccypcXG5cXHMqJC9nLFwiXCIpKSk/cS5wdXNoKDAsVyxaKTpRPT09MyYmKFd8fFopPyhxLnB1c2goMyxXLFopLFE9Mik6UT09PTImJlo9PT1cIi4uLlwiJiZXP3EucHVzaCg0LFcsMCk6UT09PTImJlomJiFXP3EucHVzaCg1LDAsITAsWik6UT49NSYmKChafHwhVyYmUT09PTUpJiYocS5wdXNoKFEsMCxaLFkpLFE9NiksVyYmKHEucHVzaChRLFcsMCxZKSxRPTYpKSxaPVwiXCJ9LFg9MDtYPEoubGVuZ3RoO1grKyl7WCYmKFE9PT0xJiZHKCksRyhYKSk7Zm9yKHZhciBIPTA7SDxKW1hdLmxlbmd0aDtIKyspRj1KW1hdW0hdLFE9PT0xP0Y9PT1cIjxcIj8oRygpLHE9W3FdLFE9Myk6Wis9RjpRPT09ND9aPT09XCItLVwiJiZGPT09XCI+XCI/KFE9MSxaPVwiXCIpOlo9RitaWzBdOk0/Rj09PU0/TT1cIlwiOlorPUY6Rj09PSdcIid8fEY9PT1cIidcIj9NPUY6Rj09PVwiPlwiPyhHKCksUT0xKTpRJiYoRj09PVwiPVwiPyhRPTUsWT1aLFo9XCJcIik6Rj09PVwiL1wiJiYoUTw1fHxKW1hdW0grMV09PT1cIj5cIik/KEcoKSxRPT09MyYmKHE9cVswXSksUT1xLChxPXFbMF0pLnB1c2goMiwwLFEpLFE9MCk6Rj09PVwiIFwifHxGPT09XCJcXHRcInx8Rj09PWBcbmB8fEY9PT1cIlxcclwiPyhHKCksUT0yKTpaKz1GKSxRPT09MyYmWj09PVwiIS0tXCImJihRPTQscT1xWzBdKX1yZXR1cm4gRygpLHF9KHopKSwkKSxhcmd1bWVudHMsW10pKS5sZW5ndGg+MT8kOiRbMF19dmFyIHA9dHlwZW9mIHF1ZXVlTWljcm90YXNrPT09XCJmdW5jdGlvblwiP3F1ZXVlTWljcm90YXNrOih6KT0+UHJvbWlzZS5yZXNvbHZlKCkudGhlbih6KSxLPW51bGw7ZnVuY3Rpb24gQyh6KXtmb3IobGV0ICQgb2Ygei5saW5rcy52YWx1ZXMoKSl0cnl7JCgpfWNhdGNoe31pZih6LmxpbmtzLmNsZWFyKCksei5jbGVhbnVwRm4pe2xldCAkPXouY2xlYW51cEZuO3ouY2xlYW51cEZuPXZvaWQgMDt0cnl7JCgpfWNhdGNoe319fWZ1bmN0aW9uIHMoeil7bGV0ICQ9SztpZighJHx8ISQuYWN0aXZlfHwkLmxpbmtzLmhhcyh6KSlyZXR1cm47bGV0IEo9ei5zdWJzY3JpYmUoKCk9PntpZigkLmFjdGl2ZSkkLnNjaGVkdWxlKCl9KTskLmxpbmtzLnNldCh6LEopfXZhciBCPW51bGw7ZnVuY3Rpb24gUyh6KXtCPXp9ZnVuY3Rpb24gTCh6KXtsZXQgJD16LEo9bmV3IFNldCxGPXtnZXQ6KCk9PntyZXR1cm4gcyhGKSwkfSxzZXQ6KFkpPT57bGV0IFE9dHlwZW9mIFk9PT1cImZ1bmN0aW9uXCI/WSgkKTpZO2lmKE9iamVjdC5pcyhRLCQpKXJldHVybjskPVEsSi5mb3JFYWNoKChaKT0+WigkKSl9LHN1YnNjcmliZTooWSk9PntyZXR1cm4gSi5hZGQoWSksKCk9PkouZGVsZXRlKFkpfX07aWYoQXJyYXkuaXNBcnJheSh6KSl7bGV0IFk9bmV3IFdlYWtNYXAsUT1uZXcgTWFwLFo9KHEpPT57aWYocSE9PW51bGwmJnR5cGVvZiBxPT09XCJvYmplY3RcIil7bGV0IFg9cTtpZihcImlkXCJpbiBYKXJldHVybiBYLmlkO2lmKFwia2V5XCJpbiBYKXJldHVybiBYLmtleTtsZXQgSD1xLFc9WS5nZXQoSCk7aWYoVyE9PXZvaWQgMClyZXR1cm4gVztsZXQgaj1TeW1ib2woXCJpdGVtXCIpO3JldHVybiBZLnNldChILGopLGp9cmV0dXJuYCR7dHlwZW9mIHF9OiR7U3RyaW5nKHEpfWB9LE09RjtyZXR1cm4gTS5tYXA9KHEpPT57aWYoIUIpdGhyb3cgRXJyb3IoXCJbc2xhc2hdIGxpc3QgcmVuZGVyZXIgbm90IHJlZ2lzdGVyZWQg4oCUIGVuc3VyZSBgaHlwZXJgIGlzIGltcG9ydGVkIGJlZm9yZSB1c2luZyBsaXN0U2lnbmFsLm1hcCgpXCIpO2xldCBHPUY7cmV0dXJuIEIoRyxaLChYKT0+e2xldCBXPUcuZ2V0KCkuaW5kZXhPZihYKTtyZXR1cm4gcShYLFcpfSl9LE19cmV0dXJuIEZ9ZnVuY3Rpb24gaSh6PVtdKXtyZXR1cm4gTCh6KX1mdW5jdGlvbiBiKHope2xldCAkPXthY3RpdmU6ITAsbGlua3M6bmV3IE1hcCxzY2hlZHVsZWQ6ITEscnVuOigpPT57JC5zY2hlZHVsZWQ9ITEsQygkKTtsZXQgSj1LO0s9JDt0cnl7bGV0IEY9eigpO2lmKHR5cGVvZiBGPT09XCJmdW5jdGlvblwiKSQuY2xlYW51cEZuPUZ9ZmluYWxseXtLPUp9fSxzY2hlZHVsZTooKT0+e2lmKCQuc2NoZWR1bGVkfHwhJC5hY3RpdmUpcmV0dXJuOyQuc2NoZWR1bGVkPSEwLHAoKCk9PntpZigkLmFjdGl2ZSkkLnJ1bigpfSl9fTtyZXR1cm4gJC5ydW4oKSwoKT0+eyQuYWN0aXZlPSExLEMoJCl9fWZ1bmN0aW9uIF8oeil7bGV0ICQ9TCh2b2lkIDApLEo9ITEsRj1iKCgpPT57bGV0IFk9eigpO2lmKCFKfHwhT2JqZWN0LmlzKCQuZ2V0KCksWSkpJC5zZXQoWSksSj0hMH0pO3JldHVybntnZXQ6JC5nZXQsc3Vic2NyaWJlOiQuc3Vic2NyaWJlfX12YXIgbz1fO2Z1bmN0aW9uIHUoeil7cmV0dXJuISF6JiZ0eXBlb2Ygei5nZXQ9PT1cImZ1bmN0aW9uXCImJnR5cGVvZiB6LnN1YnNjcmliZT09PVwiZnVuY3Rpb25cIn1mdW5jdGlvbiBrKHope3JldHVybiB6PT1udWxsP1wiXCI6dHlwZW9mIHo9PT1cInN0cmluZ1wiP3o6U3RyaW5nKHopfXZhciBQPW5ldyBXZWFrTWFwO2Z1bmN0aW9uIFUoeiwkKXtsZXQgSj1QLmdldCh6KTtpZihKKUoucHVzaCgkKTtlbHNlIFAuc2V0KHosWyRdKX1mdW5jdGlvbiBEKHope2xldCAkPVAuZ2V0KHopO2lmKCQpe2ZvcihsZXQgSiBvZiAkKXRyeXtKKCl9Y2F0Y2h7fVAuZGVsZXRlKHopfWlmKHogaW5zdGFuY2VvZiBFbGVtZW50JiZ6Lmhhc0NoaWxkTm9kZXMoKSl6LmNoaWxkTm9kZXMuZm9yRWFjaCgoSik9PkQoSikpfWZ1bmN0aW9uIHIoeiwkKXtsZXQgSj1kb2N1bWVudC5jcmVhdGVDb21tZW50KFwic2lnOnN0YXJ0XCIpLEY9ZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcInNpZzplbmRcIik7ei5hcHBlbmRDaGlsZChKKSx6LmFwcGVuZENoaWxkKEYpO2xldCBZPShaKT0+e2xldCBNPUoubmV4dFNpYmxpbmc7d2hpbGUoTSYmTSE9PUYpe2xldCBHPU0ubmV4dFNpYmxpbmc7RChNKSx6LnJlbW92ZUNoaWxkKE0pLE09R31sZXQgcT1kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7aWYoWj09bnVsbHx8Wj09PSExKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkoWikpZm9yKGxldCBHIG9mIFopVihxLEcpO2Vsc2UgaWYoWiBpbnN0YW5jZW9mIE5vZGUpTyhxLFopO2Vsc2UgcS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShrKFopKSk7ei5pbnNlcnRCZWZvcmUocSxGKX07WSgkLmdldCgpKTtsZXQgUT0kLnN1YnNjcmliZShZKTtVKEosUSl9ZnVuY3Rpb24gTyh6LCQpe2lmKCQubm9kZVR5cGU9PT1Ob2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe3ouYXBwZW5kQ2hpbGQoJC5jbG9uZU5vZGUoITApKTtyZXR1cm59aWYoJC5wYXJlbnROb2RlJiYkLnBhcmVudE5vZGUhPT16KXt6LmFwcGVuZENoaWxkKCQuY2xvbmVOb2RlKCEwKSk7cmV0dXJufXouYXBwZW5kQ2hpbGQoJCl9ZnVuY3Rpb24gVih6LCQpe2lmKCQ9PW51bGx8fCQ9PT0hMSlyZXR1cm47aWYodSgkKSl7cih6LCQpO3JldHVybn1pZihBcnJheS5pc0FycmF5KCQpKXtmb3IobGV0IEogb2YgJClWKHosSik7cmV0dXJufWlmKCQgaW5zdGFuY2VvZiBOb2RlKXtPKHosJCk7cmV0dXJufU8oeixkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShrKCQpKSl9ZnVuY3Rpb24gbSh6LCQpe2lmKCQ9PW51bGx8fCQ9PT0hMSl7ei5jbGFzc05hbWU9XCJcIjtyZXR1cm59aWYodHlwZW9mICQ9PT1cInN0cmluZ1wiKXt6LmNsYXNzTmFtZT0kO3JldHVybn1pZihBcnJheS5pc0FycmF5KCQpKXt6LmNsYXNzTmFtZT0kLmZpbHRlcihCb29sZWFuKS5tYXAoKEopPT5TdHJpbmcoSikpLmpvaW4oXCIgXCIpO3JldHVybn1pZih0eXBlb2YgJD09PVwib2JqZWN0XCIpe2xldCBKPU9iamVjdC5lbnRyaWVzKCQpLmZpbHRlcigoWyxGXSk9PkJvb2xlYW4oRikpLm1hcCgoW0ZdKT0+Rik7ei5jbGFzc05hbWU9Si5qb2luKFwiIFwiKTtyZXR1cm59ei5jbGFzc05hbWU9U3RyaW5nKCQpfWZ1bmN0aW9uIHkoeil7cmV0dXJuIHR5cGVvZiB6PT09XCJmdW5jdGlvblwifHx0eXBlb2Ygej09PVwib2JqZWN0XCImJnohPT1udWxsJiZcImhhbmRsZUV2ZW50XCJpbiB6fWZ1bmN0aW9uIG4oeil7cmV0dXJuIHR5cGVvZiB6PT09XCJib29sZWFuXCJ8fHR5cGVvZiB6PT09XCJvYmplY3RcIiYmeiE9PW51bGx9ZnVuY3Rpb24gbCh6KXtpZighQXJyYXkuaXNBcnJheSh6KSlyZXR1cm4hMTtpZih6Lmxlbmd0aD09PTApcmV0dXJuITE7bGV0ICQ9elswXTtpZigheSgkKSlyZXR1cm4hMTtsZXQgSj16Lmxlbmd0aD4xP3pbMV06dm9pZCAwO2lmKEohPT12b2lkIDAmJiFuKEopKXJldHVybiExO3JldHVybiEwfWZ1bmN0aW9uIGEoeil7aWYoeSh6KSlyZXR1cm57aGFuZGxlcjp6fTtpZihsKHopKXtsZXQgJD16WzBdLEo9ei5sZW5ndGg+MT96WzFdOnZvaWQgMDtyZXR1cm57aGFuZGxlcjokLG9wdGlvbnM6Sn19cmV0dXJuIG51bGx9ZnVuY3Rpb24gdCh6LCQsSil7bGV0IEY9KFEpPT57aWYoJD09PVwiY2xhc3NcInx8JD09PVwiY2xhc3NOYW1lXCIpe20oeixRKTtyZXR1cm59aWYoJD09PVwic3R5bGVcIiYmUSYmdHlwZW9mIFE9PT1cIm9iamVjdFwiKXtPYmplY3QuYXNzaWduKHouc3R5bGUsUSk7cmV0dXJufWlmKCQ9PT1cInZhbHVlXCIpe2xldCBaPXosTT1RPT1udWxsP1wiXCI6U3RyaW5nKFEpO2lmKFoudmFsdWUhPT1NKVoudmFsdWU9TTtpZihcImRlZmF1bHRWYWx1ZVwiaW4gWil7bGV0IHE9WjtpZihxLmRlZmF1bHRWYWx1ZSE9PU0pcS5kZWZhdWx0VmFsdWU9TX1pZihaIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpZm9yKGxldCBxIG9mIEFycmF5LmZyb20oWi5vcHRpb25zKSlxLnNlbGVjdGVkPXEudmFsdWU9PT1NO3JldHVybn1pZigkPT09XCJjaGVja2VkXCIpe2xldCBaPXosTT1Cb29sZWFuKFEpO2lmKFouY2hlY2tlZCE9PU0pWi5jaGVja2VkPU07aWYoWi5kZWZhdWx0Q2hlY2tlZCE9PU0pWi5kZWZhdWx0Q2hlY2tlZD1NO3JldHVybn1pZigkIGluIHope2lmKCFSZWZsZWN0LnNldCh6LCQsUSkpaWYoUT09bnVsbHx8UT09PSExKXoucmVtb3ZlQXR0cmlidXRlKCQpO2Vsc2Ugei5zZXRBdHRyaWJ1dGUoJCxTdHJpbmcoUSkpfWVsc2UgaWYoUT09bnVsbHx8UT09PSExKXoucmVtb3ZlQXR0cmlidXRlKCQpO2Vsc2Ugei5zZXRBdHRyaWJ1dGUoJCxTdHJpbmcoUSkpfTtGKEouZ2V0KCkpO2xldCBZPUouc3Vic2NyaWJlKEYpO1UoeixZKX1mdW5jdGlvbiBlKHosJCxKKXtpZigkPT09XCJjaGlsZHJlblwiKXJldHVybjtpZih1KEopKXt0KHosJCxKKTtyZXR1cm59aWYoJC5zdGFydHNXaXRoKFwib25cIikmJiRbMl09PT0kWzJdPy50b1VwcGVyQ2FzZSgpKXtsZXQgRj0kLnNsaWNlKDIpLnRvTG93ZXJDYXNlKCksWT1hKEopO2lmKFkpei5hZGRFdmVudExpc3RlbmVyKEYsWS5oYW5kbGVyLFkub3B0aW9ucyksVSh6LCgpPT56LnJlbW92ZUV2ZW50TGlzdGVuZXIoRixZLmhhbmRsZXIsWS5vcHRpb25zKSk7cmV0dXJufWlmKCQ9PT1cInN0eWxlXCImJkomJnR5cGVvZiBKPT09XCJvYmplY3RcIil7T2JqZWN0LmFzc2lnbih6LnN0eWxlLEopO3JldHVybn1pZigkPT09XCJjbGFzc1wifHwkPT09XCJjbGFzc05hbWVcIil7bSh6LEopO3JldHVybn1pZigkPT09XCJ2YWx1ZVwiKXtsZXQgRj16LFk9Sj09bnVsbD9cIlwiOlN0cmluZyhKKTtpZihGLnZhbHVlIT09WSlGLnZhbHVlPVk7aWYoXCJkZWZhdWx0VmFsdWVcImluIEYpe2xldCBRPUY7aWYoUS5kZWZhdWx0VmFsdWUhPT1ZKVEuZGVmYXVsdFZhbHVlPVl9aWYoRiBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KWZvcihsZXQgUSBvZiBBcnJheS5mcm9tKEYub3B0aW9ucykpUS5zZWxlY3RlZD1RLnZhbHVlPT09WTtyZXR1cm59aWYoJD09PVwiY2hlY2tlZFwiKXtsZXQgRj16LFk9Qm9vbGVhbihKKTtpZihGLmNoZWNrZWQhPT1ZKUYuY2hlY2tlZD1ZO2lmKEYuZGVmYXVsdENoZWNrZWQhPT1ZKUYuZGVmYXVsdENoZWNrZWQ9WTtyZXR1cm59aWYoJCBpbiB6KXtpZighUmVmbGVjdC5zZXQoeiwkLEopKWlmKEo9PW51bGx8fEo9PT0hMSl6LnJlbW92ZUF0dHJpYnV0ZSgkKTtlbHNlIHouc2V0QXR0cmlidXRlKCQsU3RyaW5nKEopKX1lbHNlIGlmKEo9PW51bGx8fEo9PT0hMSl6LnJlbW92ZUF0dHJpYnV0ZSgkKTtlbHNlIHouc2V0QXR0cmlidXRlKCQsU3RyaW5nKEopKX12YXIgJDA9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLHowPW5ldyBTZXQoW1wic3ZnXCIsXCJwYXRoXCIsXCJnXCIsXCJjaXJjbGVcIixcInJlY3RcIixcImxpbmVcIixcInBvbHlsaW5lXCIsXCJwb2x5Z29uXCIsXCJlbGxpcHNlXCIsXCJkZWZzXCIsXCJ1c2VcIixcImNsaXBQYXRoXCIsXCJtYXNrXCIsXCJwYXR0ZXJuXCIsXCJ0ZXh0XCJdKTtmdW5jdGlvbiB4KHosJCwuLi5KKXtpZih0eXBlb2Ygej09PVwiZnVuY3Rpb25cIil7bGV0IFE9eih7Li4uJHx8e30sY2hpbGRyZW46Sn0pO2lmKFEgaW5zdGFuY2VvZiBOb2RlKXJldHVybiBRO2xldCBaPWRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtyZXR1cm4gVihaLFEpLFp9bGV0IEY9U3RyaW5nKHp8fFwiZGl2XCIpLFk9ejAuaGFzKEYpP2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygkMCxGKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KEYpO2lmKCQpZm9yKGxldFtRLFpdb2YgT2JqZWN0LmVudHJpZXMoJCkpZShZLFEsWik7Zm9yKGxldCBRIG9mIEopVihZLFEpO3JldHVybiBZfXZhciBJPVQuYmluZCh4KSxmPXR5cGVvZiBwcm9jZXNzPFwidVwiJiZwcm9jZXNzPy5lbnY/Lk5PREVfRU5WIT09XCJwcm9kdWN0aW9uXCI7ZnVuY3Rpb24gaCgpe3RyeXtsZXQgej1FcnJvcigpLnN0YWNrPy5zcGxpdChgXG5gKS5zbGljZSgzKTtpZighej8ubGVuZ3RoKXJldHVybjtsZXQgJD16LmZpbmQoKEYpPT4vXFwuKHRzfHRzeHxqcykvLnRlc3QoRikpO2lmKCEkKXJldHVybjtsZXQgSj0kLm1hdGNoKC9hdFxccysoPzouKlxcKCk/KFteKCk6XSspOihcXGQrKTpcXGQrXFwpPy8pO2lmKCFKKXJldHVybjtyZXR1cm5gJHtKWzFdfToke0pbMl19YH1jYXRjaHtyZXR1cm59fWZ1bmN0aW9uIEYwKHope2lmKHR5cGVvZiB6PT09XCJzdHJpbmdcIil7bGV0IEY9ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih6KTtpZighRil7bGV0IFk9Zj9oKCk6dm9pZCAwLFE9WT9gIChjYWxsZWQgZnJvbSAke1l9KWA6XCJcIjt0aHJvdyBFcnJvcihgW3NsYXNoXSByZW5kZXIoKTogc2VsZWN0b3IgXCIke3p9XCIgbm90IGZvdW5kIOKAlCBlbnN1cmUgdGhlIGVsZW1lbnQgZXhpc3RzIGJlZm9yZSBjYWxsaW5nIHJlbmRlcigpJHtRfWApfXJldHVybiBGfWlmKHogaW5zdGFuY2VvZiBFbGVtZW50KXJldHVybiB6O2xldCAkPWY/aCgpOnZvaWQgMCxKPSQ/YCAoY2FsbGVkIGZyb20gJHskfSlgOlwiXCI7dGhyb3cgRXJyb3IoYFtzbGFzaF0gcmVuZGVyKCk6IGNvbnRhaW5lciBFbGVtZW50IGlzIHJlcXVpcmVkIChyZWNlaXZlZCBudWxsL3VuZGVmaW5lZCkke0p9YCl9ZnVuY3Rpb24gSjAoeiwkKXtsZXQgSj1GMCgkKSxGPUFycmF5LmZyb20oSi5jaGlsZE5vZGVzKTtmb3IobGV0IE0gb2YgRilEKE0pO0oudGV4dENvbnRlbnQ9XCJcIjtsZXQgWT10eXBlb2Ygej09PVwiZnVuY3Rpb25cIj96KCk6eixRPUFycmF5LmlzQXJyYXkoWSk/WTpbWV07Zm9yKGxldCBNIG9mIFEpVihKLE0pO2xldCBaPUFycmF5LmZyb20oSi5jaGlsZE5vZGVzKTtyZXR1cm4gWi5sZW5ndGg9PT0xP1pbMF06Wn1mdW5jdGlvbiBRMCh6LCQpe2xldCBKPXoucGFyZW50Tm9kZTtpZighSilyZXR1cm47bGV0IEY9ejt3aGlsZShGKXtsZXQgWT1GLm5leHRTaWJsaW5nO2lmKEQoRiksSi5yZW1vdmVDaGlsZChGKSxGPT09JClicmVhaztGPVl9fWZ1bmN0aW9uIFkwKHosJCxKKXtsZXQgRj16LnBhcmVudE5vZGU7aWYoIUYpcmV0dXJuO2xldCBZPWRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxRPXo7d2hpbGUoUSl7bGV0IFo9US5uZXh0U2libGluZztpZihZLmFwcGVuZENoaWxkKFEpLFE9PT0kKWJyZWFrO1E9Wn1GLmluc2VydEJlZm9yZShZLEopfWZ1bmN0aW9uIGcoeiwkLEosRil7bGV0IFk9ZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcInJlcGVhdDpzdGFydFwiKSxRPWRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJyZXBlYXQ6ZW5kXCIpLFo9ZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1ouYXBwZW5kQ2hpbGQoWSk7bGV0IE09SihGKTtyZXR1cm4gVihaLE0pLFouYXBwZW5kQ2hpbGQoUSksei5pbnNlcnRCZWZvcmUoWiwkKSx7c3RhcnQ6WSxlbmQ6UX19ZnVuY3Rpb24gYyh6LCQsSil7bGV0IEY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIiksWT1uZXcgTWFwO2Z1bmN0aW9uIFEocSl7bGV0e3BhcmVudE5vZGU6RyxuZXh0U2libGluZzpYfT1GO2ZvcihsZXQgSCBvZiBxKXtsZXQgVz0kKEgpLGo9ZyhHLFgsSixIKTtZLnNldChXLGopLFg9ai5lbmQubmV4dFNpYmxpbmd9fWZ1bmN0aW9uIFoocSl7bGV0IEc9Ri5wYXJlbnROb2RlLFg9bmV3IFNldCxIPUY7Zm9yKGxldCBXIG9mIHEpe2xldCBqPSQoVyk7WC5hZGQoaik7bGV0IHc9WS5nZXQoaik7aWYoIXcpe2xldCBBPWcoRyxILm5leHRTaWJsaW5nLEosVyk7WS5zZXQoaixBKSxIPUEuZW5kfWVsc2V7bGV0IEE9SC5uZXh0U2libGluZztpZih3LnN0YXJ0IT09QSlZMCh3LnN0YXJ0LHcuZW5kLEEpO0g9dy5lbmR9fWZvcihsZXRbVyxqXW9mIFkpaWYoIVguaGFzKFcpKVEwKGouc3RhcnQsai5lbmQpLFkuZGVsZXRlKFcpfXF1ZXVlTWljcm90YXNrKCgpPT5RKHouZ2V0KCkpKTtsZXQgTT16LnN1YnNjcmliZSgocSk9PloocSkpO3JldHVybiBVKEYsTSksRn1TKCh6LCQsSik9PmMoeiwkLEopKTtmdW5jdGlvbiB2KHope3JldHVybiEheiYmdHlwZW9mIHouZ2V0PT09XCJmdW5jdGlvblwiJiZ0eXBlb2Ygei5zdWJzY3JpYmU9PT1cImZ1bmN0aW9uXCJ9ZnVuY3Rpb24gajAoeiwkKXtpZih0eXBlb2YgJD09PVwiYm9vbGVhblwiKXJldHVybntbel06JH07cmV0dXJuIF8oKCk9Pih7W3pdOiEhJC5nZXQoKX0pKX1mdW5jdGlvbiBfMCguLi56KXtsZXQgJD1kKHopLEo9JC5zb21lKChZKT0+dihZKSksRj0oKT0+RSgkKTtyZXR1cm4gSj9fKEYpOkYoKX1mdW5jdGlvbiBkKHosJD1bXSl7Zm9yKGxldCBKIG9mIHopaWYoQXJyYXkuaXNBcnJheShKKSlkKEosJCk7ZWxzZSAkLnB1c2goSik7cmV0dXJuICR9ZnVuY3Rpb24gRSh6KXtsZXQgJD1bXTtmb3IobGV0IEogb2Ygeil7aWYoIUopY29udGludWU7aWYodihKKSl7bGV0IEY9Si5nZXQoKTtpZih0eXBlb2YgRj09PVwic3RyaW5nXCIpeyQucHVzaChGKTtjb250aW51ZX1pZihBcnJheS5pc0FycmF5KEYpKXskLnB1c2goRShGKSk7Y29udGludWV9aWYoRiYmdHlwZW9mIEY9PT1cIm9iamVjdFwiKXtmb3IobGV0W1ksUV1vZiBPYmplY3QuZW50cmllcyhGKSlpZihRKSQucHVzaChZKTtjb250aW51ZX1jb250aW51ZX1pZih0eXBlb2YgSj09PVwic3RyaW5nXCIpeyQucHVzaChKKTtjb250aW51ZX1pZihBcnJheS5pc0FycmF5KEopKXskLnB1c2goRShKKSk7Y29udGludWV9aWYodHlwZW9mIEo9PT1cIm9iamVjdFwiKXtmb3IobGV0W0YsWV1vZiBPYmplY3QuZW50cmllcyhKKSlpZihZKSQucHVzaChGKTtjb250aW51ZX19cmV0dXJuICQuZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpfWZ1bmN0aW9uIEEwKHosJD1cImlucHV0XCIpe2xldCBKPXt2YWx1ZTp6fTtpZigkPT09XCJpbnB1dFwifHwkPT09XCJib3RoXCIpSi5vbklucHV0PShGKT0+ei5zZXQoRi50YXJnZXQudmFsdWUpO2lmKCQ9PT1cImNoYW5nZVwifHwkPT09XCJib3RoXCIpSi5vbkNoYW5nZT0oRik9Pnouc2V0KEYudGFyZ2V0LnZhbHVlKTtyZXR1cm4gSn1mdW5jdGlvbiBEMCh6KXtyZXR1cm57Y2hlY2tlZDp6LG9uQ2hhbmdlOigkKT0+e3ouc2V0KCQudGFyZ2V0LmNoZWNrZWQpfX19ZnVuY3Rpb24gSzAoeiwkKXtyZXR1cm57Y2hlY2tlZDpfKCgpPT56LmdldCgpPT09JCksb25DaGFuZ2U6KEopPT57aWYoSi50YXJnZXQuY2hlY2tlZCl6LnNldCgkKX0sdmFsdWU6JH19ZnVuY3Rpb24gUDAoeil7cmV0dXJue3ZhbHVlOnosb25DaGFuZ2U6KCQpPT57ei5zZXQoJC50YXJnZXQudmFsdWUpfSxvbklucHV0OigkKT0+e3ouc2V0KCQudGFyZ2V0LnZhbHVlKX19fXZhciBVMD0oeik9PnoudGFyZ2V0LnZhbHVlLFQwPSh6KT0+ei50YXJnZXQuY2hlY2tlZCxCMD0oeik9PnoudGFyZ2V0LnZhbHVlO2Z1bmN0aW9uIEwwKHosJCxKLEYsWSl7bGV0IFE9KFopPT57bGV0IE09Wi50YXJnZXQ7aWYoIU0pcmV0dXJuO2xldCBxPU0uY2xvc2VzdChKKTtpZighcXx8IXouY29udGFpbnMocSkpcmV0dXJuO2xldCBHPU9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YoWikpLFose3RhcmdldDpxLGN1cnJlbnRUYXJnZXQ6cX0pO0YoRyl9O3JldHVybiB6LmFkZEV2ZW50TGlzdGVuZXIoJCxRLFkpLCgpPT56LnJlbW92ZUV2ZW50TGlzdGVuZXIoJCxRLFkpfWZ1bmN0aW9uIFowKHope2xldCAkPW5ldyBGb3JtRGF0YSh6KSxKPXt9O3JldHVybiAkLmZvckVhY2goKEYsWSk9PntsZXQgUT1KW1ldO2lmKFE9PT12b2lkIDApSltZXT1GO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShRKSlRLnB1c2goRik7ZWxzZSBKW1ldPVtRLEZdfSksSn1mdW5jdGlvbiBPMCh6KXtyZXR1cm4oJCk9PnskLnByZXZlbnREZWZhdWx0KCkseihaMCgkLmN1cnJlbnRUYXJnZXQpLCQpfX1mdW5jdGlvbiBJMCh6KXtyZXR1cm4oJCk9PnooJCl9ZnVuY3Rpb24gRTAoeil7cmV0dXJuKCQpPT56KCQpfWV4cG9ydHtJIGFzIHRzeCxqMCBhcyB0b2dnbGVDbGFzcyxBMCBhcyB0ZXh0RmllbGRDb250cm9sLEowIGFzIHJlbmRlcixLMCBhcyByYWRpb0NvbnRyb2wsTzAgYXMgb25TdWJtaXQsSTAgYXMgb25SZXNldCxFMCBhcyBvbkJ1dHRvbkNsaWNrLG8gYXMgbWVtbyxJIGFzIGpzeCxJIGFzIGh0bWwseCBhcyBoLFUwIGFzIGdldFRleHQsQjAgYXMgZ2V0U2VsZWN0VmFsdWUsVDAgYXMgZ2V0Q2hlY2tlZCxaMCBhcyBmb3JtVG9PYmplY3QsYiBhcyBlZmZlY3QsRCBhcyBkZXN0cm95Tm9kZSxMMCBhcyBkZWxlZ2F0ZSxfMCBhcyBjeCxpIGFzIGNyZWF0ZVNpZ25hbEFycmF5LEwgYXMgY3JlYXRlU2lnbmFsLF8gYXMgY29tcHV0ZWQsRDAgYXMgY2hlY2tib3hDb250cm9sLFAwIGFzIFNlbGVjdENvbnRyb2wsYyBhcyBSZXBlYXR9O1xuXG4vLyMgZGVidWdJZD03NzVDQjhFQ0VDQUYxRTM0NjQ3NTZFMjE2NDc1NkUyMVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iLAogICAgIi8vIGFwcHMvcGxheWdyb3VuZC9zcmMvY2xpZW50LnRzXG5pbXBvcnQgeyBodG1sLCByZW5kZXIsIGNyZWF0ZVNpZ25hbCwgUmVwZWF0IH0gZnJvbSBcInNsYXNoXCI7XG5pbXBvcnQgc3R5bGVzIGZyb20gXCIuL3N0eWxlcy5tb2R1bGUuY3NzXCI7XG5cbi8vIExvZ3Mgw7p0ZWlzIGFwZW5hcyBlbSBkZXNlbnZvbHZpbWVudG9cbmlmIChfX0RFVl9fKSB7XG4gIGNvbnNvbGUubG9nKFwiW0RFVl0gQXBwIGluaWNpYW5kbyBlbSBtb2RvIGRlc2Vudm9sdmltZW50b1wiKTtcbiAgY29uc29sZS5sb2coXCJbREVWXSBBbWJpZW50ZTpcIiwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYpO1xufVxuXG50eXBlIFRvZG8gPSB7IGlkOiBudW1iZXI7IHRleHQ6IHN0cmluZyB9O1xuXG5jb25zdCB0b2RvcyA9IGNyZWF0ZVNpZ25hbDxUb2RvPihbXSk7XG5jb25zdCBuYW1lID0gY3JlYXRlU2lnbmFsKFwiXCIpO1xuY29uc3QgcHJpbWFyeSA9IGNyZWF0ZVNpZ25hbCh0cnVlKTtcbmxldCBuZXh0SWQgPSAxO1xuXG4vLyBjbGFzc2VzIHJlYXRpdmFzIGRvIGJvdMOjbyAoYXJyYXkgZGUgc3RyaW5ncyBldml0YSBjb21wdXRlZCBrZXlzKVxuY29uc3QgYnRuQ2xhc3NlcyA9IGNyZWF0ZVNpZ25hbDxzdHJpbmdbXT4oW1xuICBzdHlsZXMuYnV0dG9uLFxuICBwcmltYXJ5LmdldCgpID8gc3R5bGVzLnByaW1hcnkgOiBzdHlsZXMuc2Vjb25kYXJ5LFxuXSk7XG5cbi8vIHNpbmNyb25pemEgcXVhbmRvIG8gXCJwcmltYXJ5XCIgbXVkYVxucHJpbWFyeS5zdWJzY3JpYmUoKG9uKSA9PiB7XG4gIGJ0bkNsYXNzZXMuc2V0KFtzdHlsZXMuYnV0dG9uLCBvbiA/IHN0eWxlcy5wcmltYXJ5IDogc3R5bGVzLnNlY29uZGFyeV0pO1xufSk7XG5cbmZ1bmN0aW9uIGFkZCgpIHtcbiAgY29uc3QgdGV4dCA9IG5hbWUuZ2V0KCkudHJpbSgpO1xuICBpZiAoIXRleHQpIHJldHVybjtcbiAgY29uc3QgbmV3VG9kbzogVG9kbyA9IHsgaWQ6IG5leHRJZCsrLCB0ZXh0IH07XG4gIHRvZG9zLnNldCgocHJldikgPT4gWy4uLnByZXYsIG5ld1RvZG9dKTtcbiAgbmFtZS5zZXQoXCJcIik7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShpZDogbnVtYmVyKSB7XG4gIHRvZG9zLnNldCgocHJldikgPT4gcHJldi5maWx0ZXIoKHQpID0+IHQuaWQgIT09IGlkKSk7XG59XG5cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgcmV0dXJuIGh0bWxgXG4gICAgPHNlY3Rpb24+XG4gICAgICA8ZGl2IGNsYXNzPSR7c3R5bGVzLnJvd30+XG4gICAgICAgIDxsYWJlbD5cbiAgICAgICAgICBuYW1lOlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdmFsdWU9JHtuYW1lfVxuICAgICAgICAgICAgb25JbnB1dD0keyhlOiBFdmVudCkgPT4gbmFtZS5zZXQoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9JHthZGR9PmFkaWNpb25hcjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9JHsoKSA9PiB0b2Rvcy5zZXQoW10pfT5saW1wYXI8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPSR7c3R5bGVzLnJvd30+XG4gICAgICAgIDxidXR0b24gY2xhc3M9JHtidG5DbGFzc2VzfSBvbkNsaWNrPSR7KCkgPT4gcHJpbWFyeS5zZXQoIXByaW1hcnkuZ2V0KCkpfT5cbiAgICAgICAgICB0b2dnbGUgcHJpbWFyeVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8dWwgY2xhc3M9JHtzdHlsZXMucm93fT5cbiAgICAgICAgPCR7UmVwZWF0fSBlYWNoPSR7dG9kb3N9IGtleT0keyh0OiBUb2RvKSA9PiB0LmlkfT5cbiAgICAgICAgICAkeyAodDogVG9kbykgPT4gaHRtbGBcbiAgICAgICAgICAgIDxsaSBjbGFzcz0ke3N0eWxlcy50b2RvfT5cbiAgICAgICAgICAgICAgPHNwYW4+JHt0LnRleHR9PC9zcGFuPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSR7c3R5bGVzLnJtfSBvbkNsaWNrPSR7KCkgPT4gcmVtb3ZlKHQuaWQpfT54PC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIGB9XG4gICAgICAgIDwvJHtSZXBlYXR9PlxuICAgICAgPC91bD5cbiAgICA8L3NlY3Rpb24+XG4gIGA7XG59XG5cbnJlbmRlcihodG1sYDwke0FwcH0gLz5gLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcFwiKSEpO1xuXG4iCiAgXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsSUFBSSxJQUFFLFFBQVEsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFO0FBQUEsRUFBQyxJQUFJO0FBQUEsRUFBRSxFQUFFLEtBQUc7QUFBQSxFQUFFLFNBQVEsSUFBRSxFQUFFLElBQUUsRUFBRSxRQUFPLEtBQUk7QUFBQSxJQUFDLElBQUksSUFBRSxFQUFFLE1BQUssSUFBRSxFQUFFLE1BQUksRUFBRSxNQUFJLElBQUUsSUFBRSxHQUFFLEVBQUUsRUFBRSxTQUFPLEVBQUUsRUFBRTtBQUFBLElBQUcsTUFBSSxJQUFFLEVBQUUsS0FBRyxJQUFFLE1BQUksSUFBRSxFQUFFLEtBQUcsT0FBTyxPQUFPLEVBQUUsTUFBSSxDQUFDLEdBQUUsQ0FBQyxJQUFFLE1BQUksS0FBRyxFQUFFLEtBQUcsRUFBRSxNQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBSSxJQUFFLE1BQUksSUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQUssSUFBRSxLQUFHLEtBQUcsSUFBRSxFQUFFLE1BQU0sR0FBRSxFQUFFLEdBQUUsR0FBRSxHQUFFLENBQUMsSUFBRyxJQUFJLENBQUMsQ0FBQyxHQUFFLEVBQUUsS0FBSyxDQUFDLEdBQUUsRUFBRSxLQUFHLEVBQUUsTUFBSSxLQUFHLEVBQUUsSUFBRSxLQUFHLEdBQUUsRUFBRSxLQUFHLE1BQUksRUFBRSxLQUFLLENBQUM7QUFBQSxFQUFDO0FBQUEsRUFBQyxPQUFPO0FBQUE7QUFBN1QsSUFBZ1UsSUFBRSxJQUFJO0FBQUksU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLEVBQUMsSUFBSSxJQUFFLEVBQUUsSUFBSSxJQUFJO0FBQUEsRUFBRSxPQUFPLE1BQUksSUFBRSxJQUFJLEtBQUksRUFBRSxJQUFJLE1BQUssQ0FBQyxLQUFJLElBQUUsRUFBRSxNQUFLLEVBQUUsSUFBSSxDQUFDLE1BQUksRUFBRSxJQUFJLEdBQUUsSUFBRSxRQUFRLENBQUMsR0FBRTtBQUFBLElBQUMsU0FBUSxHQUFFLEdBQUUsSUFBRSxHQUFFLElBQUUsSUFBRyxJQUFFLElBQUcsSUFBRSxDQUFDLENBQUMsR0FBRSxJQUFFLFFBQVEsQ0FBQyxHQUFFO0FBQUEsTUFBQyxNQUFJLE1BQUksTUFBSSxJQUFFLEVBQUUsUUFBUSx3QkFBdUIsRUFBRSxNQUFJLEVBQUUsS0FBSyxHQUFFLEdBQUUsQ0FBQyxJQUFFLE1BQUksTUFBSSxLQUFHLE1BQUksRUFBRSxLQUFLLEdBQUUsR0FBRSxDQUFDLEdBQUUsSUFBRSxLQUFHLE1BQUksS0FBRyxNQUFJLFNBQU8sSUFBRSxFQUFFLEtBQUssR0FBRSxHQUFFLENBQUMsSUFBRSxNQUFJLEtBQUcsS0FBRyxDQUFDLElBQUUsRUFBRSxLQUFLLEdBQUUsR0FBRSxNQUFHLENBQUMsSUFBRSxLQUFHLE9BQUssS0FBRyxDQUFDLEtBQUcsTUFBSSxPQUFLLEVBQUUsS0FBSyxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsSUFBRSxJQUFHLE1BQUksRUFBRSxLQUFLLEdBQUUsR0FBRSxHQUFFLENBQUMsR0FBRSxJQUFFLEtBQUksSUFBRTtBQUFBLE9BQUksSUFBRSxFQUFFLElBQUUsRUFBRSxRQUFPLEtBQUk7QUFBQSxNQUFDLE1BQUksTUFBSSxLQUFHLEVBQUUsR0FBRSxFQUFFLENBQUM7QUFBQSxNQUFHLFNBQVEsSUFBRSxFQUFFLElBQUUsRUFBRSxHQUFHLFFBQU87QUFBQSxRQUFJLElBQUUsRUFBRSxHQUFHLElBQUcsTUFBSSxJQUFFLE1BQUksT0FBSyxFQUFFLEdBQUUsSUFBRSxDQUFDLENBQUMsR0FBRSxJQUFFLEtBQUcsS0FBRyxJQUFFLE1BQUksSUFBRSxNQUFJLFFBQU0sTUFBSSxPQUFLLElBQUUsR0FBRSxJQUFFLE1BQUksSUFBRSxJQUFFLEVBQUUsS0FBRyxJQUFFLE1BQUksSUFBRSxJQUFFLEtBQUcsS0FBRyxJQUFFLE1BQUksT0FBSyxNQUFJLE1BQUksSUFBRSxJQUFFLE1BQUksT0FBSyxFQUFFLEdBQUUsSUFBRSxLQUFHLE1BQUksTUFBSSxPQUFLLElBQUUsR0FBRSxJQUFFLEdBQUUsSUFBRSxNQUFJLE1BQUksUUFBTSxJQUFFLEtBQUcsRUFBRSxHQUFHLElBQUUsT0FBSyxRQUFNLEVBQUUsR0FBRSxNQUFJLE1BQUksSUFBRSxFQUFFLEtBQUksSUFBRSxJQUFHLElBQUUsRUFBRSxJQUFJLEtBQUssR0FBRSxHQUFFLENBQUMsR0FBRSxJQUFFLEtBQUcsTUFBSSxPQUFLLE1BQUksUUFBTSxNQUFJO0FBQUEsS0FDcGpDLE1BQUksUUFBTSxFQUFFLEdBQUUsSUFBRSxLQUFHLEtBQUcsSUFBRyxNQUFJLEtBQUcsTUFBSSxVQUFRLElBQUUsR0FBRSxJQUFFLEVBQUU7QUFBQSxJQUFHO0FBQUEsSUFBQyxPQUFPLEVBQUUsR0FBRTtBQUFBLElBQUcsQ0FBQyxDQUFDLEdBQUUsSUFBRyxXQUFVLENBQUMsQ0FBQyxHQUFHLFNBQU8sSUFBRSxJQUFFLEVBQUU7QUFBQTtBQUFHLElBQXVGLElBQUU7QUFBc0osU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLEVBQUMsSUFBSSxJQUFFO0FBQUEsRUFBRSxJQUFHLENBQUMsS0FBRyxDQUFDLEVBQUUsVUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQUEsSUFBRTtBQUFBLEVBQU8sSUFBSSxJQUFFLEVBQUUsVUFBVSxNQUFJO0FBQUEsSUFBQyxJQUFHLEVBQUU7QUFBQSxNQUFPLEVBQUUsU0FBUztBQUFBLEdBQUU7QUFBQSxFQUFFLEVBQUUsTUFBTSxJQUFJLEdBQUUsQ0FBQztBQUFBO0FBQUUsSUFBSSxJQUFFO0FBQUssU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLEVBQUMsSUFBRTtBQUFBO0FBQUUsU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLEVBQUMsSUFBSSxJQUFFLEdBQUUsSUFBRSxJQUFJLEtBQUksSUFBRSxFQUFDLEtBQUksTUFBSTtBQUFBLElBQUMsT0FBTyxFQUFFLENBQUMsR0FBRTtBQUFBLEtBQUcsS0FBSSxDQUFDLE1BQUk7QUFBQSxJQUFDLElBQUksSUFBRSxPQUFPLE1BQUksYUFBVyxFQUFFLENBQUMsSUFBRTtBQUFBLElBQUUsSUFBRyxPQUFPLEdBQUcsR0FBRSxDQUFDO0FBQUEsTUFBRTtBQUFBLElBQU8sSUFBRSxHQUFFLEVBQUUsUUFBUSxDQUFDLE1BQUksRUFBRSxDQUFDLENBQUM7QUFBQSxLQUFHLFdBQVUsQ0FBQyxNQUFJO0FBQUEsSUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUUsTUFBSSxFQUFFLE9BQU8sQ0FBQztBQUFBLElBQUU7QUFBQSxFQUFFLElBQUcsTUFBTSxRQUFRLENBQUMsR0FBRTtBQUFBLElBQUMsSUFBSSxJQUFFLElBQUksU0FBUSxJQUFFLElBQUksS0FBSSxJQUFFLENBQUMsTUFBSTtBQUFBLE1BQUMsSUFBRyxNQUFJLFFBQU0sT0FBTyxNQUFJLFVBQVM7QUFBQSxRQUFDLElBQUksSUFBRTtBQUFBLFFBQUUsSUFBRyxRQUFPO0FBQUEsVUFBRSxPQUFPLEVBQUU7QUFBQSxRQUFHLElBQUcsU0FBUTtBQUFBLFVBQUUsT0FBTyxFQUFFO0FBQUEsUUFBSSxJQUFJLElBQUUsR0FBRSxJQUFFLEVBQUUsSUFBSSxDQUFDO0FBQUEsUUFBRSxJQUFHLE1BQVM7QUFBQSxVQUFFLE9BQU87QUFBQSxRQUFFLElBQUksSUFBRSxPQUFPLE1BQU07QUFBQSxRQUFFLE9BQU8sRUFBRSxJQUFJLEdBQUUsQ0FBQyxHQUFFO0FBQUEsTUFBQztBQUFBLE1BQUMsT0FBTSxHQUFHLE9BQU8sS0FBSyxPQUFPLENBQUM7QUFBQSxPQUFLLElBQUU7QUFBQSxJQUFFLE9BQU8sRUFBRSxNQUFJLENBQUMsTUFBSTtBQUFBLE1BQUMsSUFBRyxDQUFDO0FBQUEsUUFBRSxNQUFNLE1BQU0saUdBQWdHO0FBQUEsTUFBRSxJQUFJLElBQUU7QUFBQSxNQUFFLE9BQU8sRUFBRSxHQUFFLEdBQUUsQ0FBQyxNQUFJO0FBQUEsUUFBQyxJQUFJLElBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDO0FBQUEsUUFBRSxPQUFPLEVBQUUsR0FBRSxDQUFDO0FBQUEsT0FBRTtBQUFBLE9BQUc7QUFBQSxFQUFDO0FBQUEsRUFBQyxPQUFPO0FBQUE7QUFBMmQsU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLEVBQUMsT0FBTSxDQUFDLENBQUMsS0FBRyxPQUFPLEVBQUUsUUFBTSxjQUFZLE9BQU8sRUFBRSxjQUFZO0FBQUE7QUFBVyxTQUFTLENBQUMsQ0FBQyxHQUFFO0FBQUEsRUFBQyxPQUFPLEtBQUcsT0FBSyxLQUFHLE9BQU8sTUFBSSxXQUFTLElBQUUsT0FBTyxDQUFDO0FBQUE7QUFBRSxJQUFJLElBQUUsSUFBSTtBQUFRLFNBQVMsQ0FBQyxDQUFDLEdBQUUsR0FBRTtBQUFBLEVBQUMsSUFBSSxJQUFFLEVBQUUsSUFBSSxDQUFDO0FBQUEsRUFBRSxJQUFHO0FBQUEsSUFBRSxFQUFFLEtBQUssQ0FBQztBQUFBLEVBQU87QUFBQSxNQUFFLElBQUksR0FBRSxDQUFDLENBQUMsQ0FBQztBQUFBO0FBQUUsU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLEVBQUMsSUFBSSxJQUFFLEVBQUUsSUFBSSxDQUFDO0FBQUEsRUFBRSxJQUFHLEdBQUU7QUFBQSxJQUFDLFNBQVEsS0FBSztBQUFBLE1BQUUsSUFBRztBQUFBLFFBQUMsRUFBRTtBQUFBLFFBQUUsTUFBSztBQUFBLElBQUUsRUFBRSxPQUFPLENBQUM7QUFBQSxFQUFDO0FBQUEsRUFBQyxJQUFHLGFBQWEsV0FBUyxFQUFFLGNBQWM7QUFBQSxJQUFFLEVBQUUsV0FBVyxRQUFRLENBQUMsTUFBSSxFQUFFLENBQUMsQ0FBQztBQUFBO0FBQUUsU0FBUyxDQUFDLENBQUMsR0FBRSxHQUFFO0FBQUEsRUFBQyxJQUFJLElBQUUsU0FBUyxjQUFjLFdBQVcsR0FBRSxJQUFFLFNBQVMsY0FBYyxTQUFTO0FBQUEsRUFBRSxFQUFFLFlBQVksQ0FBQyxHQUFFLEVBQUUsWUFBWSxDQUFDO0FBQUEsRUFBRSxJQUFJLElBQUUsQ0FBQyxNQUFJO0FBQUEsSUFBQyxJQUFJLElBQUUsRUFBRTtBQUFBLElBQVksT0FBTSxLQUFHLE1BQUksR0FBRTtBQUFBLE1BQUMsSUFBSSxJQUFFLEVBQUU7QUFBQSxNQUFZLEVBQUUsQ0FBQyxHQUFFLEVBQUUsWUFBWSxDQUFDLEdBQUUsSUFBRTtBQUFBLElBQUM7QUFBQSxJQUFDLElBQUksSUFBRSxTQUFTLHVCQUF1QjtBQUFBLElBQUUsSUFBRyxLQUFHLFFBQU0sTUFBSTtBQUFBO0FBQUEsSUFBUyxTQUFHLE1BQU0sUUFBUSxDQUFDO0FBQUEsTUFBRSxTQUFRLEtBQUs7QUFBQSxRQUFFLEVBQUUsR0FBRSxDQUFDO0FBQUEsSUFBTyxTQUFHLGFBQWE7QUFBQSxNQUFLLEVBQUUsR0FBRSxDQUFDO0FBQUEsSUFBTztBQUFBLFFBQUUsWUFBWSxTQUFTLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUFBLElBQUUsRUFBRSxhQUFhLEdBQUUsQ0FBQztBQUFBO0FBQUEsRUFBRyxFQUFFLEVBQUUsSUFBSSxDQUFDO0FBQUEsRUFBRSxJQUFJLElBQUUsRUFBRSxVQUFVLENBQUM7QUFBQSxFQUFFLEVBQUUsR0FBRSxDQUFDO0FBQUE7QUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFFLEdBQUU7QUFBQSxFQUFDLElBQUcsRUFBRSxhQUFXLEtBQUssd0JBQXVCO0FBQUEsSUFBQyxFQUFFLFlBQVksRUFBRSxVQUFVLElBQUUsQ0FBQztBQUFBLElBQUU7QUFBQSxFQUFNO0FBQUEsRUFBQyxJQUFHLEVBQUUsY0FBWSxFQUFFLGVBQWEsR0FBRTtBQUFBLElBQUMsRUFBRSxZQUFZLEVBQUUsVUFBVSxJQUFFLENBQUM7QUFBQSxJQUFFO0FBQUEsRUFBTTtBQUFBLEVBQUMsRUFBRSxZQUFZLENBQUM7QUFBQTtBQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUUsR0FBRTtBQUFBLEVBQUMsSUFBRyxLQUFHLFFBQU0sTUFBSTtBQUFBLElBQUc7QUFBQSxFQUFPLElBQUcsRUFBRSxDQUFDLEdBQUU7QUFBQSxJQUFDLEVBQUUsR0FBRSxDQUFDO0FBQUEsSUFBRTtBQUFBLEVBQU07QUFBQSxFQUFDLElBQUcsTUFBTSxRQUFRLENBQUMsR0FBRTtBQUFBLElBQUMsU0FBUSxLQUFLO0FBQUEsTUFBRSxFQUFFLEdBQUUsQ0FBQztBQUFBLElBQUU7QUFBQSxFQUFNO0FBQUEsRUFBQyxJQUFHLGFBQWEsTUFBSztBQUFBLElBQUMsRUFBRSxHQUFFLENBQUM7QUFBQSxJQUFFO0FBQUEsRUFBTTtBQUFBLEVBQUMsRUFBRSxHQUFFLFNBQVMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQUE7QUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFFLEdBQUU7QUFBQSxFQUFDLElBQUcsS0FBRyxRQUFNLE1BQUksT0FBRztBQUFBLElBQUMsRUFBRSxZQUFVO0FBQUEsSUFBRztBQUFBLEVBQU07QUFBQSxFQUFDLElBQUcsT0FBTyxNQUFJLFVBQVM7QUFBQSxJQUFDLEVBQUUsWUFBVTtBQUFBLElBQUU7QUFBQSxFQUFNO0FBQUEsRUFBQyxJQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUU7QUFBQSxJQUFDLEVBQUUsWUFBVSxFQUFFLE9BQU8sT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHO0FBQUEsSUFBRTtBQUFBLEVBQU07QUFBQSxFQUFDLElBQUcsT0FBTyxNQUFJLFVBQVM7QUFBQSxJQUFDLElBQUksSUFBRSxPQUFPLFFBQVEsQ0FBQyxFQUFFLE9BQU8sSUFBRyxPQUFLLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQUssQ0FBQztBQUFBLElBQUUsRUFBRSxZQUFVLEVBQUUsS0FBSyxHQUFHO0FBQUEsSUFBRTtBQUFBLEVBQU07QUFBQSxFQUFDLEVBQUUsWUFBVSxPQUFPLENBQUM7QUFBQTtBQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUU7QUFBQSxFQUFDLE9BQU8sT0FBTyxNQUFJLGNBQVksT0FBTyxNQUFJLFlBQVUsTUFBSSxRQUFNLGlCQUFnQjtBQUFBO0FBQUUsU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLEVBQUMsT0FBTyxPQUFPLE1BQUksYUFBVyxPQUFPLE1BQUksWUFBVSxNQUFJO0FBQUE7QUFBSyxTQUFTLENBQUMsQ0FBQyxHQUFFO0FBQUEsRUFBQyxJQUFHLENBQUMsTUFBTSxRQUFRLENBQUM7QUFBQSxJQUFFLE9BQU07QUFBQSxFQUFHLElBQUcsRUFBRSxXQUFTO0FBQUEsSUFBRSxPQUFNO0FBQUEsRUFBRyxJQUFJLElBQUUsRUFBRTtBQUFBLEVBQUcsSUFBRyxDQUFDLEVBQUUsQ0FBQztBQUFBLElBQUUsT0FBTTtBQUFBLEVBQUcsSUFBSSxJQUFFLEVBQUUsU0FBTyxJQUFFLEVBQUUsS0FBUTtBQUFBLEVBQUUsSUFBRyxNQUFTLGFBQUcsQ0FBQyxFQUFFLENBQUM7QUFBQSxJQUFFLE9BQU07QUFBQSxFQUFHLE9BQU07QUFBQTtBQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUU7QUFBQSxFQUFDLElBQUcsRUFBRSxDQUFDO0FBQUEsSUFBRSxPQUFNLEVBQUMsU0FBUSxFQUFDO0FBQUEsRUFBRSxJQUFHLEVBQUUsQ0FBQyxHQUFFO0FBQUEsSUFBQyxJQUFJLElBQUUsRUFBRSxJQUFHLElBQUUsRUFBRSxTQUFPLElBQUUsRUFBRSxLQUFRO0FBQUEsSUFBRSxPQUFNLEVBQUMsU0FBUSxHQUFFLFNBQVEsRUFBQztBQUFBLEVBQUM7QUFBQSxFQUFDLE9BQU87QUFBQTtBQUFLLFNBQVMsQ0FBQyxDQUFDLEdBQUUsR0FBRSxH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QyxHQUFFLEVBQUUsWUFBWSxDQUFDLEdBQUUsTUFBSTtBQUFBLE1BQUU7QUFBQSxJQUFNLElBQUU7QUFBQSxFQUFDO0FBQUE7QUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRTtBQUFBLEVBQUMsSUFBSSxJQUFFLEVBQUU7QUFBQSxFQUFXLElBQUcsQ0FBQztBQUFBLElBQUU7QUFBQSxFQUFPLElBQUksSUFBRSxTQUFTLHVCQUF1QixHQUFFLElBQUU7QUFBQSxFQUFFLE9BQU0sR0FBRTtBQUFBLElBQUMsSUFBSSxJQUFFLEVBQUU7QUFBQSxJQUFZLElBQUcsRUFBRSxZQUFZLENBQUMsR0FBRSxNQUFJO0FBQUEsTUFBRTtBQUFBLElBQU0sSUFBRTtBQUFBLEVBQUM7QUFBQSxFQUFDLEVBQUUsYUFBYSxHQUFFLENBQUM7QUFBQTtBQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUUsR0FBRSxHQUFFLEdBQUU7QUFBQSxFQUFDLElBQUksSUFBRSxTQUFTLGNBQWMsY0FBYyxHQUFFLElBQUUsU0FBUyxjQUFjLFlBQVksR0FBRSxJQUFFLFNBQVMsdUJBQXVCO0FBQUEsRUFBRSxFQUFFLFlBQVksQ0FBQztBQUFBLEVBQUUsSUFBSSxJQUFFLEVBQUUsQ0FBQztBQUFBLEVBQUUsT0FBTyxFQUFFLEdBQUUsQ0FBQyxHQUFFLEVBQUUsWUFBWSxDQUFDLEdBQUUsRUFBRSxhQUFhLEdBQUUsQ0FBQyxHQUFFLEVBQUMsT0FBTSxHQUFFLEtBQUksRUFBQztBQUFBO0FBQUUsU0FBUyxDQUFDLENBQUMsR0FBRSxHQUFFLEdBQUU7QUFBQSxFQUFDLElBQUksSUFBRSxTQUFTLGVBQWUsRUFBRSxHQUFFLElBQUUsSUFBSTtBQUFBLEVBQUksU0FBUyxDQUFDLENBQUMsR0FBRTtBQUFBLElBQUMsTUFBSSxZQUFXLEdBQUUsYUFBWSxNQUFHO0FBQUEsSUFBRSxTQUFRLEtBQUssR0FBRTtBQUFBLE1BQUMsSUFBSSxJQUFFLEVBQUUsQ0FBQyxHQUFFLElBQUUsRUFBRSxHQUFFLEdBQUUsR0FBRSxDQUFDO0FBQUEsTUFBRSxFQUFFLElBQUksR0FBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLElBQUk7QUFBQSxJQUFXO0FBQUE7QUFBQSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUU7QUFBQSxJQUFDLElBQUksSUFBRSxFQUFFLFlBQVcsSUFBRSxJQUFJLEtBQUksSUFBRTtBQUFBLElBQUUsU0FBUSxLQUFLLEdBQUU7QUFBQSxNQUFDLElBQUksSUFBRSxFQUFFLENBQUM7QUFBQSxNQUFFLEVBQUUsSUFBSSxDQUFDO0FBQUEsTUFBRSxJQUFJLElBQUUsRUFBRSxJQUFJLENBQUM7QUFBQSxNQUFFLElBQUcsQ0FBQyxHQUFFO0FBQUEsUUFBQyxJQUFJLElBQUUsRUFBRSxHQUFFLEVBQUUsYUFBWSxHQUFFLENBQUM7QUFBQSxRQUFFLEVBQUUsSUFBSSxHQUFFLENBQUMsR0FBRSxJQUFFLEVBQUU7QUFBQSxNQUFHLEVBQUs7QUFBQSxRQUFDLElBQUksSUFBRSxFQUFFO0FBQUEsUUFBWSxJQUFHLEVBQUUsVUFBUTtBQUFBLFVBQUUsR0FBRyxFQUFFLE9BQU0sRUFBRSxLQUFJLENBQUM7QUFBQSxRQUFFLElBQUUsRUFBRTtBQUFBO0FBQUEsSUFBSTtBQUFBLElBQUMsVUFBUSxHQUFFLE1BQUs7QUFBQSxNQUFFLElBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQztBQUFBLFFBQUUsR0FBRyxFQUFFLE9BQU0sRUFBRSxHQUFHLEdBQUUsRUFBRSxPQUFPLENBQUM7QUFBQTtBQUFBLEVBQUUsZUFBZSxNQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUFBLEVBQUUsSUFBSSxJQUFFLEVBQUUsVUFBVSxDQUFDLE1BQUksRUFBRSxDQUFDLENBQUM7QUFBQSxFQUFFLE9BQU8sRUFBRSxHQUFFLENBQUMsR0FBRTtBQUFBO0FBQUUsRUFBRSxDQUFDLEdBQUUsR0FBRSxNQUFJLEVBQUUsR0FBRSxHQUFFLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ0cvNUQsSUFBSSxTQUFTO0FBQUEsRUFDWCxRQUFRLElBQUksNkNBQTZDO0FBQUEsRUFDekQsUUFBUSxJQUFJLG1CQUFtQixhQUFvQjtBQUNyRDtBQUlBLElBQU0sUUFBUSxFQUFtQixDQUFDLENBQUM7QUFDbkMsSUFBTSxPQUFPLEVBQWEsRUFBRTtBQUM1QixJQUFNLFVBQVUsRUFBYSxJQUFJO0FBQ2pDLElBQUksU0FBUztBQUdiLElBQU0sYUFBYSxFQUF1QjtBQUFBLEVBQ3hDLHNCQUFPO0FBQUEsRUFDUCxRQUFRLElBQUksSUFBSSxzQkFBTyxVQUFVLHNCQUFPO0FBQzFDLENBQUM7QUFHRCxRQUFRLFVBQVUsQ0FBQyxPQUFPO0FBQUEsRUFDeEIsV0FBVyxJQUFJLENBQUMsc0JBQU8sUUFBUSxLQUFLLHNCQUFPLFVBQVUsc0JBQU8sU0FBUyxDQUFDO0FBQUEsQ0FDdkU7QUFFRCxTQUFTLEdBQUcsR0FBRztBQUFBLEVBQ2IsTUFBTSxPQUFPLEtBQUssSUFBSSxFQUFFLEtBQUs7QUFBQSxFQUM3QixJQUFJLENBQUM7QUFBQSxJQUFNO0FBQUEsRUFDWCxNQUFNLFVBQWdCLEVBQUUsSUFBSSxVQUFVLEtBQUs7QUFBQSxFQUMzQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQztBQUFBLEVBQ3RDLEtBQUssSUFBSSxFQUFFO0FBQUE7QUFHYixTQUFTLE1BQU0sQ0FBQyxJQUFZO0FBQUEsRUFDMUIsTUFBTSxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxPQUFNLEdBQUUsT0FBTyxFQUFFLENBQUM7QUFBQTtBQUdyRCxTQUFTLEdBQUcsR0FBRztBQUFBLEVBQ2IsT0FBTztBQUFBO0FBQUEsbUJBRVUsc0JBQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxvQkFJTjtBQUFBLHNCQUNFLENBQUMsT0FBYSxLQUFLLElBQUssR0FBRSxPQUE0QixLQUFLO0FBQUE7QUFBQTtBQUFBLDBCQUd2RDtBQUFBLDBCQUNBLE1BQU0sTUFBTSxJQUFJLENBQUMsQ0FBQztBQUFBO0FBQUE7QUFBQSxtQkFHekIsc0JBQU87QUFBQSx3QkFDRixzQkFBc0IsTUFBTSxRQUFRLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsa0JBSzVELHNCQUFPO0FBQUEsV0FDZCxVQUFlLGFBQWEsQ0FBQyxPQUFZLEdBQUU7QUFBQSxZQUN6QyxDQUFDLE9BQVk7QUFBQSx3QkFDRixzQkFBTztBQUFBLHNCQUNULEdBQUU7QUFBQSw4QkFDTSxzQkFBTyxjQUFjLE1BQU0sT0FBTyxHQUFFLEVBQUU7QUFBQTtBQUFBO0FBQUEsWUFHeEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1aLEdBQU8sS0FBUSxVQUFVLFNBQVMsZUFBZSxLQUFLLENBQUU7IiwKICAiZGVidWdJZCI6ICIzQ0FENzdCMUVGNTRDN0M3NjQ3NTZFMjE2NDc1NkUyMSIsCiAgIm5hbWVzIjogW10KfQ==
