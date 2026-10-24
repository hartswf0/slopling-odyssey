var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// ../../node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "../../node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// ../../node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// src/engine/TimerManager.ts
var TimerManager = class extends import_index.default {
  constructor() {
    super(...arguments);
    __publicField(this, "timers", /* @__PURE__ */ new Map());
  }
  /**
   * Start a timer that counts down
   */
  startTimer(name, duration, targetBeat) {
    this.stopTimer(name);
    const timer = {
      name,
      remainingTime: duration,
      totalTime: duration,
      targetBeat
    };
    timer.intervalId = window.setInterval(() => {
      timer.remainingTime--;
      this.emit("timerTick", { name, remainingTime: timer.remainingTime });
      if (timer.remainingTime <= 0) {
        this.emit("timerExpired", { name, targetBeat: timer.targetBeat });
        this.stopTimer(name);
      }
    }, 1e3);
    this.timers.set(name, timer);
    this.emit("timerStarted", { name, duration, targetBeat });
  }
  /**
   * Stop a timer
   */
  stopTimer(name) {
    const timer = this.timers.get(name);
    if (timer) {
      if (timer.intervalId) {
        clearInterval(timer.intervalId);
      }
      this.timers.delete(name);
      this.emit("timerStopped", { name });
    }
  }
  /**
   * Stop all timers
   */
  stopAllTimers() {
    for (const [name] of this.timers) {
      this.stopTimer(name);
    }
  }
  /**
   * Get remaining time for a timer
   */
  getRemainingTime(name) {
    return this.timers.get(name)?.remainingTime || 0;
  }
  /**
   * Check if timer exists
   */
  hasTimer(name) {
    return this.timers.has(name);
  }
  /**
   * Get all active timers
   */
  getActiveTimers() {
    return Array.from(this.timers.values());
  }
  /**
   * Get timer target beat
   */
  getTimerTarget(name) {
    return this.timers.get(name)?.targetBeat;
  }
};

// src/utils/characterRef.ts
function resolveCharacter(ref, characters) {
  if (!ref || !characters || characters.length === 0) return null;
  const byId = characters.find((c) => c.id === ref);
  if (byId) return byId;
  const lower = ref.toLowerCase();
  const byName = characters.find((c) => c.name?.toLowerCase() === lower);
  if (byName) return byName;
  const byDisplay = characters.find((c) => c.displayName?.toLowerCase() === lower);
  if (byDisplay) return byDisplay;
  return null;
}
function resolveCharacterKey(ref, characters) {
  if (!ref) return null;
  const resolved = resolveCharacter(ref, characters);
  return resolved ? resolved.id : ref;
}

// src/engine/roles.ts
var PLAYER_ROLE_ID = "player";
function normalizeRoles(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const r of raw) {
    const id = typeof r?.id === "string" ? stripRolePrefix(r.id.trim()) : "";
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const candidates = Array.isArray(r.candidates) ? r.candidates.filter((c) => typeof c === "string" && c.length > 0) : [];
    out.push({
      ...r,
      id,
      candidates,
      selection: r.selection === "random" || r.selection === "fixed" ? r.selection : "cast"
    });
  }
  return out;
}
function isRoleRef(ref) {
  return typeof ref === "string" && ref.length > 1 && ref.startsWith("@");
}
function stripRolePrefix(ref) {
  return ref.startsWith("@") ? ref.slice(1) : ref;
}
function fallbackHolder(role) {
  return role.defaultCharacterId || role.candidates[0] || null;
}
var PRONOUN_PRESETS = {
  she: { they: "she", them: "her", their: "her", theirs: "hers", themself: "herself", is: "is", has: "has", was: "was" },
  he: { they: "he", them: "him", their: "his", theirs: "his", themself: "himself", is: "is", has: "has", was: "was" },
  they: { they: "they", them: "them", their: "their", theirs: "theirs", themself: "themself", is: "are", has: "have", was: "were" }
};
var PRONOUN_KEYS = ["they", "them", "their", "theirs", "themself", "is", "has", "was"];
function pronounSetFor(character) {
  const p = character?.pronouns;
  if (typeof p === "string" && p in PRONOUN_PRESETS) return PRONOUN_PRESETS[p];
  if (p && typeof p === "object") {
    const base = PRONOUN_PRESETS.they;
    const out = { ...base };
    for (const k of PRONOUN_KEYS) {
      if (typeof p[k] === "string" && p[k].trim()) out[k] = p[k].trim();
    }
    if (typeof p.they === "string" && p.they.trim().toLowerCase() !== "they") {
      if (!p.is) out.is = "is";
      if (!p.has) out.has = "has";
      if (!p.was) out.was = "was";
    }
    return out;
  }
  return PRONOUN_PRESETS.they;
}
function rolePlaceholderText(holder, key) {
  if (!holder) return void 0;
  const raw = key || "name";
  const lower = raw.toLowerCase();
  let text;
  if (lower === "name" || lower === "displayname") {
    text = holder.displayName || holder.name;
  } else if (PRONOUN_KEYS.includes(lower)) {
    text = pronounSetFor(holder)[lower];
  }
  if (text === void 0) return void 0;
  const capitalise = raw[0] !== raw[0].toLowerCase();
  return capitalise ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// src/utils/characterVariant.ts
function resolveCharacterWithVariant(base, variant) {
  if (!variant) return base;
  const overlay = {};
  if (variant.displayName !== void 0) overlay.displayName = variant.displayName;
  if (variant.characterDescription !== void 0) overlay.description = variant.characterDescription;
  if (variant.portrait !== void 0) overlay.portrait = variant.portrait;
  if (variant.traits !== void 0) overlay.traits = variant.traits;
  if (variant.dossierPolicy !== void 0) overlay.dossierPolicy = variant.dossierPolicy;
  if (variant.initialMood !== void 0) overlay.initialMood = variant.initialMood;
  if (variant.initialSentiments !== void 0) overlay.initialSentiments = variant.initialSentiments;
  return { ...base, ...overlay };
}
function findCharacterVariant(character, variantId) {
  if (!character || !variantId || !character.variants) return void 0;
  return character.variants.find((v) => v.id === variantId);
}

// src/engine/PersonalityTraits.ts
var DEFAULT_TRAIT_MODULATIONS = [
  // Neuroticism — emotional reactivity, mostly the negative emotions.
  { trait: "neuroticism", emotion: "fear", weight: 0.5 },
  { trait: "neuroticism", emotion: "sadness", weight: 0.4 },
  { trait: "neuroticism", emotion: "anger", weight: 0.3 },
  { trait: "neuroticism", emotion: "shame", weight: 0.3 },
  { trait: "neuroticism", emotion: "joy", weight: -0.2 },
  // Extraversion — positive affect, sociability.
  { trait: "extraversion", emotion: "joy", weight: 0.4 },
  { trait: "extraversion", emotion: "pride", weight: 0.3 },
  { trait: "extraversion", emotion: "interest", weight: 0.3 },
  // Agreeableness — cooperation; dampens anger and disgust.
  { trait: "agreeableness", emotion: "anger", weight: -0.4 },
  { trait: "agreeableness", emotion: "disgust", weight: -0.3 },
  // Openness — engagement with novelty.
  { trait: "openness", emotion: "interest", weight: 0.4 },
  { trait: "openness", emotion: "surprise", weight: 0.2 },
  // Conscientiousness — left mostly out of the affect path on purpose
  // (it shows up much more in goal/planning behaviour, which lives in
  // Step 8). One subtle row: high conscientiousness amplifies shame.
  { trait: "conscientiousness", emotion: "shame", weight: 0.2 }
];
function modulateEmotionDelta(baseDelta, emotion, traits, modulations) {
  if (!traits || !modulations || modulations.length === 0) return baseDelta;
  if (baseDelta === 0) return 0;
  const lowerEmotion = emotion.toLowerCase();
  let scale = 1;
  for (const m of modulations) {
    if (m.emotion.toLowerCase() !== lowerEmotion) continue;
    const traitValue = traits[m.trait];
    if (typeof traitValue !== "number") continue;
    const centered = (traitValue - 0.5) * 2;
    scale += centered * m.weight;
  }
  if (scale < 0) scale = 0;
  if (scale > 4) scale = 4;
  return baseDelta * scale;
}

// src/engine/variableValues.ts
function parseBoolean(value) {
  const v = value.trim().toLowerCase();
  if (v === "true") return true;
  if (v === "false" || v === "") return false;
  return void 0;
}
function parseNumber(value) {
  if (value.trim() === "") return void 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : void 0;
}
function coerceToDeclaredType(value, type) {
  if (typeof value !== "string") return value;
  if (type === "boolean") return parseBoolean(value) ?? value;
  if (type === "number") return parseNumber(value) ?? value;
  return value;
}
function alignForComparison(left, right) {
  if (typeof left === "string" && typeof right !== "string") {
    const [r, l] = alignForComparison(right, left);
    return [l, r];
  }
  if (typeof right !== "string") return [left, right];
  if (typeof left === "boolean") {
    const b = parseBoolean(right);
    return b === void 0 ? [left, right] : [left, b];
  }
  if (typeof left === "number") {
    const n = parseNumber(right);
    return n === void 0 ? [left, right] : [left, n];
  }
  return [left, right];
}

// src/engine/SensorService.ts
var RECENT_LOCATION_MS = 6e4;
var FRESH_LOCATION_MS = 5e3;
var WebSensorService = class extends import_index.default {
  constructor() {
    super(...arguments);
    __publicField(this, "locationWatchId", null);
    __publicField(this, "locationSubscribers", /* @__PURE__ */ new Set());
    __publicField(this, "orientationSubscribers", /* @__PURE__ */ new Set());
    __publicField(this, "orientationListenerInstalled", false);
    __publicField(this, "orientationHandler", null);
    // S3 cache — populated by the same underlying watcher that fans
    // readings out to active subscribers. Synchronous condition evaluators
    // read these directly without awaiting.
    __publicField(this, "lastLocation", null);
    __publicField(this, "lastOrientation", null);
    // The Bluetooth stub keeps an empty beacon cache for symmetry; v2 will
    // populate it when scanBeacons gains a real implementation.
    __publicField(this, "lastBeacons", []);
    /** When lastLocation was received (not the fix's own timestamp). */
    __publicField(this, "lastLocationAt", 0);
    /** Error code of the last failed getCurrentLocation (1 = permission denied). */
    __publicField(this, "lastLocationErrorCode", null);
  }
  async getCurrentLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) return null;
    if (this.lastLocation && Date.now() - this.lastLocationAt <= FRESH_LOCATION_MS) {
      return this.lastLocation;
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const reading = this.normalizePosition(pos);
          this.lastLocation = reading;
          this.lastLocationAt = Date.now();
          this.lastLocationErrorCode = null;
          resolve(reading);
        },
        (err) => {
          const code = err?.code;
          this.lastLocationErrorCode = typeof code === "number" ? code : null;
          const recent = this.lastLocation && Date.now() - this.lastLocationAt <= RECENT_LOCATION_MS;
          console.warn(
            `[SensorService] getCurrentLocation failed (code ${code ?? "?"}: ${err?.message ?? "unknown"})` + (recent && code !== 1 ? " \u2014 using the reading from moments ago" : "")
          );
          resolve(recent && code !== 1 ? this.lastLocation : null);
        },
        // maximumAge: a fix up to 5 s old is as good as a new one for a
        // story beat, and answers at once.
        { enableHighAccuracy: true, timeout: 1e4, maximumAge: 5e3 }
      );
    });
  }
  watchLocation(callback, opts) {
    this.locationSubscribers.add(callback);
    if (this.lastLocation && this.locationWatchId !== null) {
      const known = this.lastLocation;
      queueMicrotask(() => {
        if (this.locationSubscribers.has(callback)) callback(known);
      });
    }
    if (this.locationWatchId === null && typeof navigator !== "undefined" && navigator.geolocation) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        (pos) => {
          const reading = this.normalizePosition(pos);
          this.lastLocation = reading;
          this.lastLocationAt = Date.now();
          for (const sub of Array.from(this.locationSubscribers)) sub(reading);
        },
        (err) => console.warn("[SensorService] watchLocation error", err),
        {
          enableHighAccuracy: opts?.accuracy !== "low",
          timeout: 3e4,
          maximumAge: opts?.intervalMs ?? 1e3
        }
      );
    }
    return () => {
      this.locationSubscribers.delete(callback);
      if (this.locationSubscribers.size === 0 && this.locationWatchId !== null) {
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          navigator.geolocation.clearWatch(this.locationWatchId);
        }
        this.locationWatchId = null;
      }
    };
  }
  scanBeacons(_callback) {
    console.warn("[SensorService] Bluetooth scanning not yet implemented (v2)");
    return () => {
    };
  }
  watchOrientation(callback) {
    this.orientationSubscribers.add(callback);
    if (!this.orientationListenerInstalled && typeof window !== "undefined") {
      this.orientationHandler = (e) => {
        const reading = {
          alpha: e.alpha,
          beta: e.beta ?? 0,
          gamma: e.gamma ?? 0,
          absolute: e.absolute ?? false,
          timestamp: Date.now()
        };
        this.lastOrientation = reading;
        for (const sub of Array.from(this.orientationSubscribers)) sub(reading);
      };
      window.addEventListener("deviceorientation", this.orientationHandler);
      this.orientationListenerInstalled = true;
    }
    return () => {
      this.orientationSubscribers.delete(callback);
      if (this.orientationSubscribers.size === 0 && this.orientationListenerInstalled && this.orientationHandler && typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", this.orientationHandler);
        this.orientationListenerInstalled = false;
        this.orientationHandler = null;
      }
    };
  }
  getCapabilities() {
    return {
      gps: typeof navigator !== "undefined" && !!navigator.geolocation,
      beacons: false,
      // not in v1 — see scanBeacons stub
      orientation: typeof window !== "undefined" && "DeviceOrientationEvent" in window,
      camera: typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia,
      mock: false
    };
  }
  // ---- cached-reading getters (S3) ----
  getLastKnownLocation() {
    return this.lastLocation;
  }
  getLastKnownOrientation() {
    return this.lastOrientation;
  }
  getLastKnownBeacons() {
    return this.lastBeacons;
  }
  /**
   * Start a passive watcher that keeps the cache fresh. Reuses the
   * existing watchLocation plumbing — the no-op subscriber callback is
   * just a hook that bumps the subscriber count so the underlying
   * watcher stays alive. Returns an unsubscribe.
   */
  ensureLocationCacheActive() {
    return this.watchLocation(() => {
    });
  }
  ensureOrientationCacheActive() {
    return this.watchOrientation(() => {
    });
  }
  ensureBeaconCacheActive() {
    return this.scanBeacons(() => {
    });
  }
  // ---- permission state API (S3) ----
  async getPermissionState(name) {
    const caps = this.getCapabilities();
    if (name === "gps" && !caps.gps || name === "orientation" && !caps.orientation || name === "camera" && !caps.camera || name === "beacons" && !caps.beacons) {
      return "unavailable";
    }
    if (typeof navigator !== "undefined" && navigator.permissions?.query) {
      const queryName = mapPermissionName(name);
      if (queryName) {
        try {
          const status = await navigator.permissions.query({ name: queryName });
          return status.state;
        } catch {
        }
      }
    }
    return "prompt";
  }
  async requestPermission(name) {
    const initial = await this.getPermissionState(name);
    if (initial === "granted" || initial === "denied" || initial === "unavailable") {
      return initial;
    }
    if (name === "gps") {
      const reading = await this.getCurrentLocation();
      if (reading) return "granted";
      return this.lastLocationErrorCode === 1 ? "denied" : "granted";
    }
    if (name === "camera") {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((t) => t.stop());
          return "granted";
        } catch {
          return "denied";
        }
      }
      return "unavailable";
    }
    if (name === "orientation") {
      const evt = typeof window !== "undefined" ? window.DeviceOrientationEvent : void 0;
      if (evt?.requestPermission) {
        try {
          const result = await evt.requestPermission();
          return result === "granted" ? "granted" : "denied";
        } catch {
          return "denied";
        }
      }
      return "granted";
    }
    return "unavailable";
  }
  // Mock-injection methods are no-ops on the production service. Logged at
  // warn so accidental mock-call from a non-MockSensorService context surfaces
  // during development.
  setMockLocation(_loc) {
    console.warn("[SensorService] setMockLocation ignored on WebSensorService");
  }
  setMockBeacons(_b) {
    console.warn("[SensorService] setMockBeacons ignored on WebSensorService");
  }
  setMockOrientation(_r) {
    console.warn("[SensorService] setMockOrientation ignored on WebSensorService");
  }
  setMockPermissionState(_n, _s) {
    console.warn("[SensorService] setMockPermissionState ignored on WebSensorService");
  }
  normalizePosition(pos) {
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude ?? void 0,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: pos.timestamp
    };
  }
};
function mapPermissionName(name) {
  switch (name) {
    case "gps":
      return "geolocation";
    case "camera":
      return "camera";
    default:
      return null;
  }
}
var MockSensorService = class extends import_index.default {
  constructor() {
    super(...arguments);
    __publicField(this, "currentLocation", null);
    __publicField(this, "currentBeacons", []);
    __publicField(this, "currentOrientation", {
      alpha: 0,
      beta: 0,
      gamma: 0,
      absolute: false,
      timestamp: Date.now()
    });
    __publicField(this, "locationSubscribers", /* @__PURE__ */ new Set());
    __publicField(this, "beaconSubscribers", /* @__PURE__ */ new Set());
    __publicField(this, "orientationSubscribers", /* @__PURE__ */ new Set());
    // S3 — permission states default to 'granted' so authoring just works.
    // The Mock panel can flip individual permissions to 'denied' / 'prompt'
    // for testing the fallback paths.
    __publicField(this, "permissionStates", {
      gps: "granted",
      camera: "granted",
      orientation: "granted",
      beacons: "granted"
    });
  }
  /**
   * Seed initial location from the project's LocationSettings. Called
   * by StoryContext at construction time (after the story is set), and
   * whenever the project's mockLocation changes.
   */
  seedFromSettings(loc) {
    if (loc && typeof loc.lat === "number" && typeof loc.lng === "number") {
      this.currentLocation = {
        lat: loc.lat,
        lng: loc.lng,
        accuracy: 5,
        timestamp: Date.now()
      };
    }
  }
  async getCurrentLocation() {
    return this.currentLocation;
  }
  watchLocation(callback) {
    this.locationSubscribers.add(callback);
    if (this.currentLocation) callback(this.currentLocation);
    return () => {
      this.locationSubscribers.delete(callback);
    };
  }
  scanBeacons(callback) {
    this.beaconSubscribers.add(callback);
    callback(this.currentBeacons);
    return () => {
      this.beaconSubscribers.delete(callback);
    };
  }
  watchOrientation(callback) {
    this.orientationSubscribers.add(callback);
    callback(this.currentOrientation);
    return () => {
      this.orientationSubscribers.delete(callback);
    };
  }
  getCapabilities() {
    return { gps: true, beacons: true, orientation: true, camera: false, mock: true };
  }
  setMockLocation(loc) {
    this.currentLocation = loc;
    for (const sub of Array.from(this.locationSubscribers)) sub(loc);
    this.emit("mockLocationChanged", loc);
  }
  setMockBeacons(beacons) {
    this.currentBeacons = beacons;
    for (const sub of Array.from(this.beaconSubscribers)) sub(beacons);
    this.emit("mockBeaconsChanged", beacons);
  }
  setMockOrientation(reading) {
    this.currentOrientation = reading;
    for (const sub of Array.from(this.orientationSubscribers)) sub(reading);
    this.emit("mockOrientationChanged", reading);
  }
  // ---- cached-reading getters (S3) ----
  getLastKnownLocation() {
    return this.currentLocation;
  }
  getLastKnownOrientation() {
    return this.currentOrientation;
  }
  getLastKnownBeacons() {
    return this.currentBeacons;
  }
  // Mock service is in-memory — caches are always "active" and there's
  // no underlying watcher to spawn. Return a no-op unsubscribe.
  ensureLocationCacheActive() {
    return () => {
    };
  }
  ensureOrientationCacheActive() {
    return () => {
    };
  }
  ensureBeaconCacheActive() {
    return () => {
    };
  }
  // ---- permission state API (S3) ----
  async getPermissionState(name) {
    return this.permissionStates[name] ?? "granted";
  }
  async requestPermission(name) {
    const current2 = this.permissionStates[name] ?? "granted";
    if (current2 === "prompt") {
      this.permissionStates[name] = "granted";
      return "granted";
    }
    return current2;
  }
  setMockPermissionState(name, state) {
    this.permissionStates[name] = state;
    this.emit("mockPermissionChanged", { name, state });
  }
};
function createSensorService(opts) {
  if (opts?.mockMode) return new MockSensorService();
  if (typeof navigator !== "undefined" && navigator.geolocation) return new WebSensorService();
  return new MockSensorService();
}

// src/engine/StoryContext.ts
var PLAYTHROUGH_VARIABLE = "playthrough";
function isLiteralBaseline(b) {
  return !b || b === "literal";
}
function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 63710088e-1;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
function clonePlain(v) {
  if (Array.isArray(v)) return v.map(clonePlain);
  if (v && typeof v === "object") {
    const out = {};
    for (const k in v) out[k] = clonePlain(v[k]);
    return out;
  }
  return v;
}
var _StoryContext = class _StoryContext extends import_index.default {
  constructor(initialState, story, opts) {
    super();
    __publicField(this, "state");
    /**
     * Per-character flag tracking whether the variant was explicitly chosen
     * via `setActiveCharacterVariant` (i.e., a setCharacterVariant Effect or
     * direct API call). Distinguishes explicit user pick from the
     * default-variant auto-apply that runs in seedCharacterAffectFromStory.
     * Reset on full reset() and selectiveReset({history:true}). Not
     * persisted in the serialized state — variant *id* is, but "how it
     * was set" is session-local.
     */
    __publicField(this, "explicitVariantSet", {});
    __publicField(this, "history", []);
    __publicField(this, "choiceHistory", []);
    /** Played conversations, oldest first (see recordConversationLine). */
    __publicField(this, "conversations", []);
    /** Conversations entered again whose next line starts a new visit. */
    __publicField(this, "conversationRevisits", /* @__PURE__ */ new Set());
    __publicField(this, "aiOutputHistory", []);
    __publicField(this, "timeline", []);
    __publicField(this, "story");
    __publicField(this, "timerManager");
    /**
     * Sensor service for XR beats (v0.9.48+). Lazily resolves to either
     * WebSensorService (PWA / mobile playback) or MockSensorService
     * (desktop authoring via PreviewWindow). Beats access this via
     * getSensorService(); they should not construct their own.
     */
    __publicField(this, "sensorService");
    /**
     * Permission state cache (v0.9.48 / S3+). Populated by
     * `ensureXRPermission` (or any code that calls
     * `recordPermissionState`) so synchronous condition evaluators
     * (`permissionGranted`) can branch without awaiting. Keys are the
     * SensorPermissionName strings; values are the most recent observed
     * PermissionState. Untouched permissions resolve to undefined and
     * are treated as "not granted" by the condition evaluator (fail-
     * closed semantics — a beat that wants to gate on a permission
     * must run a probe first).
     */
    __publicField(this, "permissionStateCache", /* @__PURE__ */ new Map());
    // Debug features
    __publicField(this, "debugSession");
    __publicField(this, "analysisCache", {});
    __publicField(this, "aiSuggestions", []);
    /**
     * Owner resolution for BARE counter names. Legacy stories (and plenty of
     * current authoring) define a counter ON a character — Red's 'aggressive'
     * — while their effects and conditions reference it by bare name, because
     * they predate scoped counters. Routing those bare references to the
     * global store meant the writes landed where no meter looks: the debug
     * rail showed the value climbing while Red's HUD sat at its seeded zero.
     *
     * Rule: a bare name routes to a character's scoped store iff EXACTLY ONE
     * character defines a counter of that name. No owner or several owners ⇒
     * the historical story-global behavior, unchanged. Resolution is by
     * DEFINITION (the character's authored counters), never by runtime value,
     * and is cached — the character roster does not change mid-run.
     */
    __publicField(this, "implicitCounterOwnerCache", /* @__PURE__ */ new Map());
    /**
     * An in-story restart — the Restart button of an End Screen or AI Summary.
     * Applies the ending's reset ('all', a selective set, or null for none),
     * keeps what the author marked "keep across restarts" (story variables,
     * character counters, a character's chosen variant) and counts the
     * playthrough. A host restart (player menu, preview) calls reset() instead:
     * that one is a fresh start and keeps nothing.
     */
    /** Set by restartPlaythrough: the ending that restarted, until it exits. */
    __publicField(this, "restartedFromBeatId", null);
    this.state = {
      currentBeatId: "0",
      variables: {},
      counters: {},
      inventory: [],
      characterInventories: {},
      characterCounters: {},
      characterVariables: {},
      characterFlags: {},
      characterMoods: {},
      characterSentiments: {},
      characterEmotionLevels: {},
      characterReflections: {},
      characterGoalStatus: {},
      activeCharacterVariants: {},
      appearedCharacters: {},
      roleHolders: {},
      initialMoods: {},
      initialEmotionLevels: {},
      initialSentiments: {},
      affectBookmarks: {},
      visitedBeats: /* @__PURE__ */ new Set(),
      visitedChoices: /* @__PURE__ */ new Set(),
      timers: {},
      geoPoints: {},
      ...initialState
    };
    this.story = story;
    this.timerManager = new TimerManager();
    this.sensorService = opts?.existingSensorService ?? createSensorService({ mockMode: opts?.mockMode });
    if (opts?.mockMode && !opts?.existingSensorService && this.sensorService instanceof MockSensorService) {
      const mockLoc = story?.getSettings?.()?.location?.mockLocation;
      if (mockLoc) this.sensorService.seedFromSettings(mockLoc);
    }
    if (story) {
      this.seedCharacterAffectFromStory();
      this.seedCharacterCountersFromStory();
      this.seedCharacterInventoriesFromStory();
    }
    this.seedStoryVariables();
    this.seedRoles();
    this.timerManager.on("timerExpired", (data) => this.emit("timerExpired", data));
    this.timerManager.on("timerTick", (data) => this.emit("timerTick", data));
  }
  /**
   * Get the SensorService for this context. Beats use this to access
   * GPS / beacons / orientation. The same service instance lives for
   * the lifetime of the context — beats subscribe and unsubscribe but
   * don't construct their own.
   */
  getSensorService() {
    return this.sensorService;
  }
  /**
   * Record an observed permission state in the cache. Called by
   * `ensureXRPermission` and any other code that probes a permission,
   * so the synchronous `permissionGranted` condition evaluator has a
   * value to read. Idempotent — overwrites any prior cached value.
   */
  recordPermissionState(name, state) {
    this.permissionStateCache.set(name, state);
    this.emit("permissionStateChanged", { name, state });
  }
  /**
   * Read a previously-cached permission state. Returns undefined when
   * the permission has never been probed in this session — synchronous
   * caller (the condition evaluator) interprets undefined as
   * not-granted.
   */
  getCachedPermissionState(name) {
    return this.permissionStateCache.get(name);
  }
  getVariable(name) {
    const v = this.state.variables[name];
    if (v === void 0 && name === PLAYTHROUGH_VARIABLE) return this.getPlaythrough();
    return v;
  }
  setVariable(name, value) {
    value = coerceToDeclaredType(value, this.declaredVariableType(name));
    this.state.variables[name] = value;
    this.emit("variableChanged", { name, value });
  }
  /** Named GPS point set (empty array when unset). */
  getGeoPoints(name) {
    if (!this.state.geoPoints) this.state.geoPoints = {};
    return this.state.geoPoints[name] ? this.state.geoPoints[name].map((p) => ({ ...p })) : [];
  }
  /** Store a named GPS point set (Set GPS Location beat). Empty array clears it. */
  setGeoPoints(name, points) {
    if (!this.state.geoPoints) this.state.geoPoints = {};
    this.state.geoPoints[name] = (points || []).map((p) => ({ ...p }));
    this.emit("geoPointsChanged", { name, points: this.state.geoPoints[name] });
  }
  resolveImplicitCounterOwner(name) {
    if (!this.story) return null;
    const cached = this.implicitCounterOwnerCache.get(name);
    if (cached !== void 0) return cached;
    const characters = this.story.getCharacters?.();
    let owner = null;
    if (Array.isArray(characters)) {
      const owners = characters.filter((ch) => Array.isArray(ch?.counters) && ch.counters.some((c) => c?.name === name));
      if (owners.length === 1) owner = owners[0].id ?? owners[0].name ?? null;
    }
    this.implicitCounterOwnerCache.set(name, owner);
    return owner;
  }
  /**
   * Is `name` a counter this story can read? True for a story-global counter
   * once something has written it, and for a counter declared on exactly one
   * character (which reads its seeded value from the start).
   */
  hasCounter(name) {
    return Object.prototype.hasOwnProperty.call(this.state.counters, name) || this.resolveImplicitCounterOwner(name) !== null;
  }
  getCounter(name) {
    const owner = this.resolveImplicitCounterOwner(name);
    if (owner) return this.getCharacterCounter(owner, name);
    return this.state.counters[name] || 0;
  }
  setCounter(name, value) {
    const owner = this.resolveImplicitCounterOwner(name);
    if (owner) {
      this.setCharacterCounter(owner, name, value);
      return;
    }
    this.state.counters[name] = value;
    this.emit("counterChanged", { name, value });
  }
  incrementCounter(name, value = 1) {
    const owner = this.resolveImplicitCounterOwner(name);
    if (owner) {
      this.incrementCharacterCounter(owner, name, value);
      return;
    }
    this.state.counters[name] = (Number(this.state.counters[name]) || 0) + Number(value);
    this.emit("counterChanged", { name, value: this.state.counters[name] });
  }
  addToInventory(item, quantity = 1) {
    const existing = this.state.inventory.find((entry) => entry.name === item);
    if (existing) {
      existing.quantity += quantity;
      this.emit("inventoryChanged", { action: "add", item, quantity, newTotal: existing.quantity });
    } else {
      this.state.inventory.push({ name: item, quantity });
      this.emit("inventoryChanged", { action: "add", item, quantity, newTotal: quantity });
    }
  }
  removeFromInventory(item, quantity = 1) {
    const existing = this.state.inventory.find((entry) => entry.name === item);
    if (existing) {
      existing.quantity -= quantity;
      if (existing.quantity <= 0) {
        const index = this.state.inventory.findIndex((entry) => entry.name === item);
        this.state.inventory.splice(index, 1);
        this.emit("inventoryChanged", { action: "remove", item, quantity, newTotal: 0 });
      } else {
        this.emit("inventoryChanged", { action: "remove", item, quantity, newTotal: existing.quantity });
      }
    }
  }
  hasInInventory(item) {
    const existing = this.state.inventory.find((entry) => entry.name === item);
    return existing !== void 0 && existing.quantity > 0;
  }
  getInventoryQuantity(item) {
    const existing = this.state.inventory.find((entry) => entry.name === item);
    return existing?.quantity ?? 0;
  }
  // Character-specific inventory methods.
  //
  // The `character` arg accepts a Character.id (canonical), a name, or a
  // displayName — we resolve to the canonical id-keyed bucket via
  // resolveCharacterKey. If a legacy bucket exists under one of the alias
  // strings (because an older story wrote to "Granny" before promotion),
  // ensureCanonicalCharacterBucket merges it into the canonical bucket the
  // first time the character is touched. After that, all aliases route to
  // the same storage and stay in sync.
  /**
   * Ensure the canonical-id bucket exists and absorb any legacy alias buckets.
   * Returns the canonical key to use, or null if the ref should route to the
   * global player inventory ('player' / empty).
   */
  ensureCanonicalCharacterBucket(ref) {
    if (this.isPlayerInventoryRef(ref)) return null;
    const canonical = this.resolveCharRef(ref);
    if (!canonical) return null;
    const characters = this.story?.getCharacters?.();
    const character = characters?.find((c) => c.id === canonical);
    const aliasKeys = /* @__PURE__ */ new Set();
    if (character) {
      if (character.name && character.name !== canonical) aliasKeys.add(character.name);
      if (character.displayName && character.displayName !== canonical) aliasKeys.add(character.displayName);
    }
    if (ref !== canonical) aliasKeys.add(ref);
    if (!this.state.characterInventories[canonical]) {
      this.state.characterInventories[canonical] = [];
    }
    const target = this.state.characterInventories[canonical];
    for (const alias of aliasKeys) {
      const aliasBucket = this.state.characterInventories[alias];
      if (!aliasBucket || aliasBucket === target) continue;
      for (const entry of aliasBucket) {
        const existing = target.find((e) => e.name === entry.name);
        if (existing) existing.quantity += entry.quantity;
        else target.push({ ...entry });
      }
      delete this.state.characterInventories[alias];
    }
    return canonical;
  }
  addInventoryItem(character, item, quantity = 1) {
    if (this.isPlayerInventoryRef(character)) {
      this.addToInventory(item, quantity);
      return;
    }
    const key = this.ensureCanonicalCharacterBucket(character) ?? character;
    if (!this.state.characterInventories[key]) {
      this.state.characterInventories[key] = [];
    }
    const charInventory = this.state.characterInventories[key];
    const existing = charInventory.find((entry) => entry.name === item);
    if (existing) {
      existing.quantity += quantity;
      this.emit("inventoryChanged", { action: "add", character: key, item, quantity, newTotal: existing.quantity });
    } else {
      charInventory.push({ name: item, quantity });
      this.emit("inventoryChanged", { action: "add", character: key, item, quantity, newTotal: quantity });
    }
  }
  removeInventoryItem(character, item, quantity = 1) {
    if (this.isPlayerInventoryRef(character)) {
      this.removeFromInventory(item, quantity);
      return;
    }
    const key = this.ensureCanonicalCharacterBucket(character) ?? character;
    const charInventory = this.state.characterInventories[key];
    if (!charInventory) return;
    const existing = charInventory.find((entry) => entry.name === item);
    if (!existing) return;
    existing.quantity -= quantity;
    if (existing.quantity <= 0) {
      const index = charInventory.findIndex((entry) => entry.name === item);
      charInventory.splice(index, 1);
      this.emit("inventoryChanged", { action: "remove", character: key, item, quantity, newTotal: 0 });
    } else {
      this.emit("inventoryChanged", { action: "remove", character: key, item, quantity, newTotal: existing.quantity });
    }
  }
  hasInventoryItem(character, item) {
    if (this.isPlayerInventoryRef(character)) {
      return this.hasInInventory(item);
    }
    const key = this.ensureCanonicalCharacterBucket(character) ?? character;
    const charInventory = this.state.characterInventories[key];
    if (!charInventory) return false;
    const existing = charInventory.find((entry) => entry.name === item);
    return existing !== void 0 && existing.quantity > 0;
  }
  /**
   * What a character carries now, for HUDs. A defined character's bucket is
   * keyed by its id (whatever name or link the granting beat used); the
   * player's character also holds the global player inventory, which is
   * where 'player' / Player-pinned beats and effects put items.
   */
  getCharacterInventoryEntries(charRef) {
    const key = this.resolveCharRef(charRef);
    const own = key && this.state.characterInventories[key] || this.state.characterInventories[charRef] || [];
    const characters = this.story?.getCharacters?.();
    const isPlayerCharacter = this.isPlayerInventoryRef(charRef) || characters?.find((c) => c?.id === key)?.role === "player";
    if (!isPlayerCharacter) return own.map((entry) => ({ ...entry }));
    const merged = this.state.inventory.map((entry) => ({ ...entry }));
    for (const entry of own) {
      const existing = merged.find((e) => e.name === entry.name);
      if (existing) existing.quantity += entry.quantity;
      else merged.push({ ...entry });
    }
    return merged;
  }
  getCharacterInventoryQuantity(character, item) {
    if (this.isPlayerInventoryRef(character)) {
      return this.getInventoryQuantity(item);
    }
    const key = this.ensureCanonicalCharacterBucket(character) ?? character;
    const charInventory = this.state.characterInventories[key];
    if (!charInventory) return 0;
    const existing = charInventory.find((entry) => entry.name === item);
    return existing?.quantity ?? 0;
  }
  // ======== Character-scoped state (Layer 2) ========
  //
  // Counters / variables / flags namespaced under a Character ref. The ref
  // can be a Character.id (canonical), a Character.name, or a Character
  // displayName — the resolver normalises all three to the same id-keyed
  // bucket. If the ref doesn't match any defined Character, the original
  // string is used as the bucket key, so inline-only personas and legacy
  // free-text speakers still get coherent storage.
  //
  // These coexist with the un-namespaced `variables` and `counters` for
  // story-global state. Beats opt in to character-scoped storage explicitly.
  // ======== Cast roles (docs/Character-Roles-Design.md) ========
  /** The roles declared in Project Settings. */
  getRoles() {
    return normalizeRoles(this.story?.getSettings?.()?.roles);
  }
  getRole(roleRef) {
    const id = stripRolePrefix(roleRef);
    return this.getRoles().find((r) => r.id === id);
  }
  /**
   * The Character.id holding a role: the cast holder, else the default,
   * else the first candidate. null for an unknown role or one with no
   * candidates.
   */
  getRoleHolder(roleRef) {
    const role = this.getRole(roleRef);
    if (!role) return null;
    return this.state.roleHolders[role.id] || fallbackHolder(role);
  }
  /** Holders as cast so far (roles not cast yet are absent). */
  getRoleHolders() {
    return { ...this.state.roleHolders };
  }
  /** Has something cast this role (or drawn it at story start)? */
  isRoleCast(roleRef) {
    return !!this.state.roleHolders[stripRolePrefix(roleRef)];
  }
  /**
   * Cast a role. Applies what was authored: recasting a role that is not
   * marked recastable is flagged while authoring (story review), not
   * silently ignored here.
   */
  castRole(roleRef, characterRef) {
    const role = this.getRole(roleRef);
    if (!role) {
      console.warn(`castRole: no role '${roleRef}' in Project Settings`);
      return;
    }
    const characters = this.story?.getCharacters?.();
    const character = resolveCharacter(this.resolveRoleRef(characterRef), characters);
    const characterId = character?.id ?? characterRef;
    const previous = this.state.roleHolders[role.id];
    if (previous === characterId) return;
    this.state.roleHolders[role.id] = characterId;
    this.emit("roleCast", { role: role.id, characterId, previous });
  }
  /**
   * '@confidant' → the holder's Character.id. The implicit 'player' key
   * follows a role with id 'player' when the story declares one. Anything
   * else (and an unknown role) comes back unchanged.
   */
  resolveRoleRef(ref) {
    if (isRoleRef(ref)) return this.getRoleHolder(ref) ?? ref;
    if (ref === PLAYER_ROLE_ID && this.getRole(PLAYER_ROLE_ID)) return this.getRoleHolder(PLAYER_ROLE_ID) ?? ref;
    return ref;
  }
  /**
   * Draw 'random' roles and set 'fixed' ones at story start. 'cast' roles
   * stay open until a castRole (they read as their default meanwhile).
   * Never replaces a holder already set.
   */
  seedRoles() {
    for (const role of this.getRoles()) {
      if (this.state.roleHolders[role.id]) continue;
      if (role.selection === "random" && role.candidates.length > 0) {
        this.state.roleHolders[role.id] = role.candidates[Math.floor(Math.random() * role.candidates.length)];
      } else if (role.selection === "fixed") {
        const holder = fallbackHolder(role);
        if (holder) this.state.roleHolders[role.id] = holder;
      }
    }
  }
  /** The protagonist's bag belongs to the player, whoever plays (D6). */
  isPlayerInventoryRef(ref) {
    return !ref || ref === PLAYER_ROLE_ID || ref === "@" + PLAYER_ROLE_ID;
  }
  /** Resolve a character ref to its canonical storage key, using this story's character list. */
  resolveCharRef(ref) {
    if (!ref) return null;
    ref = this.resolveRoleRef(ref);
    const characters = this.story?.getCharacters?.();
    return resolveCharacterKey(ref, characters);
  }
  // -- Counters --
  getCharacterCounter(charRef, name) {
    const key = this.resolveCharRef(charRef);
    if (!key) return 0;
    return this.state.characterCounters[key]?.[name] ?? 0;
  }
  /**
   * All scoped counters for one character (copy). Unlike getCharacterCounter
   * this distinguishes "unset" from 0 — display surfaces (meter frames) need
   * scoped-first fallback chains: scoped ?? global ?? authored default.
   */
  getCharacterCountersFor(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return {};
    return { ...this.state.characterCounters[key] || {} };
  }
  /** Full scoped-counter map (copy), keyed by resolved character key. */
  getAllCharacterCounters() {
    const out = {};
    for (const [k, v] of Object.entries(this.state.characterCounters)) out[k] = { ...v };
    return out;
  }
  setCharacterCounter(charRef, name, value) {
    const key = this.resolveCharRef(charRef);
    if (!key) return;
    if (!this.state.characterCounters[key]) this.state.characterCounters[key] = {};
    const previous = this.state.characterCounters[key][name] ?? 0;
    this.state.characterCounters[key][name] = value;
    this.emit("characterCounterChanged", { characterRef: key, name, value, previous });
  }
  incrementCharacterCounter(charRef, name, delta = 1) {
    const key = this.resolveCharRef(charRef);
    if (!key) return 0;
    const next = (Number(this.state.characterCounters[key]?.[name]) || 0) + Number(delta);
    this.setCharacterCounter(charRef, name, next);
    return next;
  }
  // -- Variables --
  getCharacterVariable(charRef, name) {
    const key = this.resolveCharRef(charRef);
    if (!key) return void 0;
    return this.state.characterVariables[key]?.[name];
  }
  setCharacterVariable(charRef, name, value) {
    const key = this.resolveCharRef(charRef);
    if (!key) return;
    if (!this.state.characterVariables[key]) this.state.characterVariables[key] = {};
    const previous = this.state.characterVariables[key][name];
    this.state.characterVariables[key][name] = value;
    this.emit("characterVariableChanged", { characterRef: key, name, value, previous });
  }
  // -- Flags --
  getCharacterFlag(charRef, name) {
    const key = this.resolveCharRef(charRef);
    if (!key) return false;
    return this.state.characterFlags[key]?.[name] ?? false;
  }
  setCharacterFlag(charRef, name, value) {
    const key = this.resolveCharRef(charRef);
    if (!key) return;
    if (!this.state.characterFlags[key]) this.state.characterFlags[key] = {};
    const previous = this.state.characterFlags[key][name] ?? false;
    this.state.characterFlags[key][name] = value;
    this.emit("characterFlagChanged", { characterRef: key, name, value, previous });
  }
  /** All character-scoped state (counters, variables, flags) for one character — handy for dossier building / debug panels. */
  getCharacterState(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return { counters: {}, variables: {}, flags: {} };
    return {
      counters: { ...this.state.characterCounters[key] || {} },
      variables: { ...this.state.characterVariables[key] || {} },
      flags: { ...this.state.characterFlags[key] || {} }
    };
  }
  // ======== Character mood + sentiments (Layer 3 / Step 4) ========
  static clampUnit(v) {
    if (Number.isNaN(v)) return 0;
    return Math.min(1, Math.max(-1, v));
  }
  /** Current 2D mood for the character. Defaults to neutral { 0, 0 } when unset. */
  getCharacterMood(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return { valence: 0, arousal: 0 };
    return { ...this.state.characterMoods[key] || { valence: 0, arousal: 0 } };
  }
  /** Replace the character's mood. Each axis is clamped to [-1, 1]. */
  setCharacterMood(charRef, mood) {
    const key = this.resolveCharRef(charRef);
    if (!key) return;
    this.captureInitialMood(key);
    const current2 = this.state.characterMoods[key] || { valence: 0, arousal: 0 };
    const next = {
      valence: _StoryContext.clampUnit(mood.valence ?? current2.valence),
      arousal: _StoryContext.clampUnit(mood.arousal ?? current2.arousal)
    };
    this.state.characterMoods[key] = next;
    this.emit("characterMoodChanged", { characterRef: key, mood: next, previous: current2 });
  }
  // ---------------------------------------------------------------------------
  // Baseline capture (v0.9.45)
  //
  // Continuous-valued affect slots (mood, emotion levels, sentiment strengths)
  // get a parallel "initial" snapshot that condition baselines can compare
  // against. The capture is *idempotent first-touch*: each helper writes
  // only when no entry exists yet. Mutators call these *before* applying a
  // delta, so the initial reflects the value as of the first time the slot
  // was about to change. seedCharacterAffectFor also calls these so authored
  // initialMood / initialSentiments end up as the baseline rather than 0.
  // ---------------------------------------------------------------------------
  /** Record the current mood as the initial mood for `key` if not already captured. */
  captureInitialMood(key) {
    if (this.state.initialMoods[key]) return;
    const current2 = this.state.characterMoods[key] || { valence: 0, arousal: 0 };
    this.state.initialMoods[key] = { valence: current2.valence, arousal: current2.arousal };
  }
  /** Record the current emotion level as the initial level for (key, emotion) if not yet captured. */
  captureInitialEmotion(key, emotionLower) {
    if (!this.state.initialEmotionLevels[key]) this.state.initialEmotionLevels[key] = {};
    if (this.state.initialEmotionLevels[key][emotionLower] !== void 0) return;
    const current2 = this.state.characterEmotionLevels[key]?.[emotionLower] ?? 0;
    this.state.initialEmotionLevels[key][emotionLower] = current2;
  }
  /**
   * Record the current sentiment strength toward (toEntityRef, emotion) as
   * the initial value if not yet captured. New sentiment slots default to
   * 0 — capture before the first delta is applied locks that 0 in as the
   * baseline, which is correct ("trust started at zero").
   */
  captureInitialSentiment(key, toEntityRef, emotion) {
    if (!this.state.initialSentiments[key]) this.state.initialSentiments[key] = [];
    const list = this.state.initialSentiments[key];
    const present = list.some((s) => s.toEntityRef === toEntityRef && s.emotion === emotion);
    if (present) return;
    const live = (this.state.characterSentiments[key] || []).find(
      (s) => s.toEntityRef === toEntityRef && s.emotion === emotion
    );
    list.push({
      toEntityRef,
      emotion,
      strength: live?.strength ?? 0,
      createdAt: live?.createdAt ?? Date.now()
    });
  }
  /** Look up the captured initial mood for a character (or zero). */
  getInitialMood(key) {
    return this.state.initialMoods[key] || { valence: 0, arousal: 0 };
  }
  /** Look up the captured initial emotion level for (key, emotion) or zero. */
  getInitialEmotion(key, emotionLower) {
    return this.state.initialEmotionLevels[key]?.[emotionLower] ?? 0;
  }
  /** Look up the captured initial sentiment strength for (key, target[, emotion]) or zero. */
  getInitialSentiment(key, toEntityRef, emotion) {
    const list = this.state.initialSentiments[key] || [];
    if (emotion) {
      const found = list.find((s) => s.toEntityRef === toEntityRef && s.emotion === emotion);
      return found?.strength ?? 0;
    }
    return list.filter((s) => s.toEntityRef === toEntityRef).reduce((sum, s) => sum + s.strength, 0);
  }
  // ---------------------------------------------------------------------------
  // Affect bookmarks (v0.9.45) — author-named snapshots of mood / emotion /
  // sentiment state used as a baseline for "X has improved since the
  // bookmark moment Y" condition checks. Driven by the bookmarkAffectState
  // effect; readable via getAffectBookmark for debug / inspection.
  // ---------------------------------------------------------------------------
  /**
   * Snapshot mood / emotion / sentiment state under `name`. With `target`
   * given, only that character's slots are captured (other characters'
   * slots in the same-named prior snapshot are preserved). With `target`
   * omitted, every character's slots are captured. Writing the same name
   * with a wider scope overwrites narrower prior captures.
   */
  takeAffectBookmark(name, options) {
    if (!name) return;
    const targetKey = options?.target ? this.resolveCharRef(options.target) : void 0;
    const prior = this.state.affectBookmarks[name];
    const next = prior ? {
      moods: { ...prior.moods },
      emotionLevels: { ...prior.emotionLevels },
      sentiments: { ...prior.sentiments }
    } : { moods: {}, emotionLevels: {}, sentiments: {} };
    const charKeys = targetKey ? [targetKey] : /* @__PURE__ */ new Set([
      ...Object.keys(this.state.characterMoods),
      ...Object.keys(this.state.characterEmotionLevels),
      ...Object.keys(this.state.characterSentiments)
    ]);
    for (const key of charKeys) {
      const m = this.state.characterMoods[key];
      if (m) next.moods[key] = { valence: m.valence, arousal: m.arousal };
      const levels = this.state.characterEmotionLevels[key];
      if (levels) next.emotionLevels[key] = { ...levels };
      const sentiments = this.state.characterSentiments[key];
      if (sentiments) next.sentiments[key] = sentiments.map((s) => ({ ...s }));
    }
    this.state.affectBookmarks[name] = next;
    this.emit("affectBookmarkTaken", { name, target: targetKey });
  }
  /** Read a bookmark snapshot by name. Returns undefined when none exists. */
  getAffectBookmark(name) {
    return this.state.affectBookmarks[name];
  }
  /** All bookmark names currently recorded. Useful for editor dropdowns. */
  getAffectBookmarkNames() {
    return Object.keys(this.state.affectBookmarks);
  }
  /**
   * Resolve a baseline mood value for `(key, axis)` against the requested
   * source ('initial' or { bookmark: name }). Missing entries read as 0
   * — the slot's default rest state — so a delta-vs-baseline check on a
   * never-touched character behaves the same as a literal threshold.
   */
  resolveMoodBaseline(key, axis, baseline) {
    if (!baseline || baseline === "literal") return 0;
    if (baseline === "initial") {
      const init = this.getInitialMood(key);
      return axis === "arousal" ? init.arousal : init.valence;
    }
    const snap = this.state.affectBookmarks[baseline.bookmark];
    if (!snap) return 0;
    const m = snap.moods[key];
    if (!m) return 0;
    return axis === "arousal" ? m.arousal : m.valence;
  }
  /** Same idea as resolveMoodBaseline, for a single emotion level. */
  resolveEmotionBaseline(key, emotionLower, baseline) {
    if (!baseline || baseline === "literal") return 0;
    if (baseline === "initial") return this.getInitialEmotion(key, emotionLower);
    const snap = this.state.affectBookmarks[baseline.bookmark];
    return snap?.emotionLevels[key]?.[emotionLower] ?? 0;
  }
  /**
   * Same idea as resolveMoodBaseline, for a sentiment toward a target
   * (optionally filtered by emotion). When emotion is omitted, sums all
   * sentiments toward the target — matches the "overall feeling" read in
   * getSentimentTo.
   */
  resolveSentimentBaseline(key, toEntityRef, emotion, baseline) {
    if (!baseline || baseline === "literal") return 0;
    if (baseline === "initial") return this.getInitialSentiment(key, toEntityRef, emotion);
    const snap = this.state.affectBookmarks[baseline.bookmark];
    const list = snap?.sentiments[key] || [];
    if (emotion) {
      const found = list.find((s) => s.toEntityRef === toEntityRef && s.emotion === emotion);
      return found?.strength ?? 0;
    }
    return list.filter((s) => s.toEntityRef === toEntityRef).reduce((sum, s) => sum + s.strength, 0);
  }
  /** Add deltas to the mood, clamped per axis. The most common authoring path. */
  nudgeCharacterMood(charRef, dValence = 0, dArousal = 0) {
    const key = this.resolveCharRef(charRef);
    if (!key) return { valence: 0, arousal: 0 };
    this.captureInitialMood(key);
    const current2 = this.state.characterMoods[key] || { valence: 0, arousal: 0 };
    const next = {
      valence: _StoryContext.clampUnit(current2.valence + dValence),
      arousal: _StoryContext.clampUnit(current2.arousal + dArousal)
    };
    this.state.characterMoods[key] = next;
    this.emit("characterMoodChanged", { characterRef: key, mood: next, previous: current2 });
    return next;
  }
  /** All sentiments held by the character. Returns a clone — caller can't mutate state. */
  getCharacterSentiments(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return [];
    return (this.state.characterSentiments[key] || []).map((s) => ({ ...s }));
  }
  /**
   * Sentiment strength from `fromCharRef` toward `toEntityRef` for `emotion`.
   * Returns 0 when no matching sentiment exists. Use this in conditions like
   * "if granny.sentimentTo(player, 'trust') >= 0.5".
   */
  getSentimentTo(fromCharRef, toEntityRef, emotion) {
    const sentiments = this.getCharacterSentiments(fromCharRef);
    let total = 0;
    for (const s of sentiments) {
      if (s.toEntityRef !== toEntityRef) continue;
      if (emotion && s.emotion !== emotion) continue;
      total = emotion ? s.strength : total + s.strength;
      if (emotion) break;
    }
    return total;
  }
  /**
   * Add or strengthen a directed emotional memory. When a sentiment with the
   * same `(toEntityRef, emotion)` already exists, strengths sum (clamped to
   * [-1, 1]) and `createdAt` is preserved. Otherwise a new sentiment is
   * recorded with the current timestamp.
   */
  addCharacterSentiment(fromCharRef, toEntityRef, emotion, deltaStrength) {
    const key = this.resolveCharRef(fromCharRef);
    if (!key) return null;
    this.captureInitialSentiment(key, toEntityRef, emotion);
    if (!this.state.characterSentiments[key]) this.state.characterSentiments[key] = [];
    const list = this.state.characterSentiments[key];
    const existingIdx = list.findIndex((s) => s.toEntityRef === toEntityRef && s.emotion === emotion);
    let next;
    if (existingIdx >= 0) {
      const existing = list[existingIdx];
      next = {
        ...existing,
        strength: _StoryContext.clampUnit(existing.strength + deltaStrength)
      };
      list[existingIdx] = next;
    } else {
      next = {
        toEntityRef,
        emotion,
        strength: _StoryContext.clampUnit(deltaStrength),
        createdAt: Date.now()
      };
      list.push(next);
    }
    this.emit("characterSentimentChanged", {
      characterRef: key,
      toEntityRef,
      emotion,
      strength: next.strength,
      delta: deltaStrength
    });
    return next;
  }
  // ======== Character emotions (Step 5 — emotion nodes) ========
  /** Current intensity of a single emotion for the character (∈ [0, 1]). */
  getCharacterEmotion(charRef, emotion) {
    const key = this.resolveCharRef(charRef);
    if (!key || !emotion) return 0;
    const lower = emotion.toLowerCase();
    return this.state.characterEmotionLevels[key]?.[lower] ?? 0;
  }
  /** All non-zero emotions for the character — keyed by emotion name (lowercase). */
  getCharacterEmotions(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return {};
    return { ...this.state.characterEmotionLevels[key] || {} };
  }
  /** Replace one emotion's intensity directly. Clamped to [0, 1]. */
  setCharacterEmotion(charRef, emotion, value) {
    const key = this.resolveCharRef(charRef);
    if (!key || !emotion) return;
    const lower = emotion.toLowerCase();
    this.captureInitialEmotion(key, lower);
    if (!this.state.characterEmotionLevels[key]) this.state.characterEmotionLevels[key] = {};
    const previous = this.state.characterEmotionLevels[key][lower] ?? 0;
    const next = Math.max(0, Math.min(1, value));
    this.state.characterEmotionLevels[key][lower] = next;
    this.emit("characterEmotionChanged", { characterRef: key, emotion: lower, value: next, previous });
  }
  /**
   * Fire an emotion at the character: bumps the emotion's level by `delta`
   * (clamped to [0, 1]) AND nudges the character's mood by delta × the
   * emotion's weights from the story's EmotionPalette. This is the primary
   * authoring path — `setCharacterEmotion` is the lower-level escape hatch
   * for cases where mood shouldn't be auto-nudged.
   */
  fireCharacterEmotion(charRef, emotion, delta) {
    const key = this.resolveCharRef(charRef);
    if (!key || !emotion) return 0;
    const lower = emotion.toLowerCase();
    this.captureInitialEmotion(key, lower);
    const character = this.getMergedCharacter(key);
    const modulations = this.story?.getTraitModulations?.();
    const effectiveDelta = modulateEmotionDelta(delta, lower, character?.traits, modulations);
    if (!this.state.characterEmotionLevels[key]) this.state.characterEmotionLevels[key] = {};
    const previous = this.state.characterEmotionLevels[key][lower] ?? 0;
    const next = Math.max(0, Math.min(1, previous + effectiveDelta));
    this.state.characterEmotionLevels[key][lower] = next;
    this.emit("characterEmotionChanged", { characterRef: key, emotion: lower, value: next, previous, delta: effectiveDelta });
    const palette = this.story?.getEmotionPalette?.();
    const def = palette?.find((e) => (e.name || "").toLowerCase() === lower);
    if (def) {
      const dV = Number(def.weightToValence ?? 0) * effectiveDelta;
      const dA = Number(def.weightToArousal ?? 0) * effectiveDelta;
      if (dV !== 0 || dA !== 0) this.nudgeCharacterMood(charRef, dV, dA);
    }
    return next;
  }
  /**
   * Decay every emotion's intensity for the character (or all characters
   * when charRef is omitted). Each emotion is reduced by its declared
   * decayRate × current value; emotions that drop below 0.005 are removed
   * from the map to keep state sparse. Typically called once per beat-entry
   * by markBeatVisited.
   */
  decayCharacterEmotions(charRef) {
    const palette = this.story?.getEmotionPalette?.();
    if (!palette || palette.length === 0) return;
    const rateByEmotion = /* @__PURE__ */ new Map();
    for (const e of palette) {
      rateByEmotion.set((e.name || "").toLowerCase(), Number(e.decayRate ?? 0));
    }
    const targetKeys = charRef ? [this.resolveCharRef(charRef)].filter(Boolean) : Object.keys(this.state.characterEmotionLevels);
    for (const key of targetKeys) {
      const levels = this.state.characterEmotionLevels[key];
      if (!levels) continue;
      for (const [emotion, value] of Object.entries(levels)) {
        const rate = rateByEmotion.get(emotion) ?? 0;
        if (rate <= 0) continue;
        const next = value * (1 - rate);
        if (next < 5e-3) {
          delete levels[emotion];
        } else {
          levels[emotion] = next;
        }
      }
    }
  }
  /**
   * Return a shallow copy of the character's reflections in append order
   * (oldest → newest). Empty array when none have been recorded.
   */
  getCharacterReflections(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return [];
    return (this.state.characterReflections[key] || []).map((r) => ({ ...r }));
  }
  /**
   * Append a reflection to a character's memory. Returns the appended entry
   * (with timestamp filled in) for callers that want to chain or echo it.
   * Empty / whitespace-only text is rejected silently — there's no value in
   * storing an empty reflection and downstream dossier rendering would skip
   * it anyway.
   *
   * Eviction policy when the per-character cap is reached: drop the oldest
   * entry whose salience is below the new entry's salience; if all stored
   * entries are at-or-above the new entry's salience, drop the literal-oldest.
   * This keeps highly salient reflections in the window even when the
   * character is generating churn.
   */
  appendCharacterReflection(charRef, text, options) {
    const key = this.resolveCharRef(charRef);
    if (!key) return null;
    const trimmed = (text || "").trim();
    if (!trimmed) return null;
    const entry = {
      timestamp: options?.timestamp ?? Date.now(),
      text: trimmed,
      ...options?.beatId ? { beatId: options.beatId } : {},
      ...options?.salience !== void 0 ? { salience: Math.max(0, Math.min(1, options.salience)) } : {}
    };
    if (!this.state.characterReflections[key]) this.state.characterReflections[key] = [];
    const list = this.state.characterReflections[key];
    list.push(entry);
    if (list.length > _StoryContext.REFLECTION_CAP) {
      const incomingSalience = entry.salience ?? 0.5;
      let evictIdx = -1;
      for (let i = 0; i < list.length - 1; i += 1) {
        const s = list[i].salience ?? 0.5;
        if (s < incomingSalience) {
          evictIdx = i;
          break;
        }
      }
      if (evictIdx === -1) evictIdx = 0;
      list.splice(evictIdx, 1);
    }
    this.emit("characterReflectionAdded", { characterRef: key, reflection: { ...entry } });
    return { ...entry };
  }
  // ---------------------------------------------------------------------------
  // Character variants
  //
  // A character can carry several persona profiles (Alex-introvert vs
  // Alex-extrovert; Player-man vs Player-woman). The variant is partial —
  // only fields it sets override the base. The runtime tracks which
  // variant is active per character; readers like fireCharacterEmotion,
  // the dossier, and condition evaluation use `getMergedCharacter` so
  // they see the effective traits / mood / dossierPolicy / displayName
  // for the currently-active variant.
  // ---------------------------------------------------------------------------
  /** Active variant id for a character, or undefined when none is set. */
  getActiveCharacterVariant(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return void 0;
    return this.state.activeCharacterVariants[key];
  }
  /**
   * True iff the character's variant was explicitly chosen via a
   * setCharacterVariant Effect or direct setActiveCharacterVariant call
   * during this play. False when the active variant is just the engine-
   * applied default from `Character.defaultVariantId`. Use to gate
   * runtime UI ("HUD shows once the player has picked") on actual choice
   * rather than authored default.
   */
  hasExplicitlySetVariant(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return false;
    return !!this.explicitVariantSet[key];
  }
  /**
   * Is this character's persona settled, so runtime UI (HUDs) may show
   * them? A character without variants always is. With variants: once one
   * was chosen explicitly (setCharacterVariant), or — for
   * variantSelectionPolicy 'random' — once the story-start draw happened:
   * the draw IS the choice, and nothing else would ever settle it (a
   * random-policy character's meters otherwise never appeared). An authored
   * defaultVariantId alone still waits for the player's pick.
   */
  hasSettledVariant(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return false;
    if (this.explicitVariantSet[key]) return true;
    const characters = this.story?.getCharacters?.();
    const base = characters?.find((c) => c?.id === key);
    const variants = Array.isArray(base?.variants) ? base.variants.filter((v) => v?.id) : [];
    if (variants.length === 0) return true;
    return base.variantSelectionPolicy === "random" && !!this.state.activeCharacterVariants[key];
  }
  /** A character ref, role ref or speaker name → the defined character's id (null for a free-text speaker). */
  resolveCharacterId(ref) {
    if (!ref) return null;
    const characters = this.story?.getCharacters?.();
    return resolveCharacter(this.resolveRoleRef(ref), characters)?.id ?? null;
  }
  /** Record that the player has met this character (a beat or node featuring them ran). */
  markCharacterAppeared(charRef) {
    if (!charRef) return;
    const characters = this.story?.getCharacters?.();
    const character = resolveCharacter(this.resolveRoleRef(charRef), characters);
    if (!character?.id || this.state.appearedCharacters[character.id]) return;
    this.state.appearedCharacters[character.id] = true;
    this.emit("characterAppeared", { characterRef: character.id });
  }
  /**
   * Has the player met this character? Recorded as beats run; for a story
   * started mid-way (a "Start as if…" preset, a restored save from before
   * this was tracked) any visited beat that features them counts too.
   */
  hasCharacterAppeared(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return false;
    if (this.state.appearedCharacters[key]) return true;
    const story = this.story;
    if (!story?.getBeat) return false;
    for (const beatId of this.state.visitedBeats) {
      const beat = story.getBeat(beatId);
      const refs = beat?.constructor?.featuredCharacterRefs?.(beat) ?? [];
      if (refs.some((r) => this.resolveCharRef(r) === key)) return true;
    }
    return false;
  }
  /**
   * Should this character's HUDs (meters, mood frame, inventory) show now?
   * See hudReveal below; a meter panel for someone not yet on stage would
   * announce them early.
   */
  isCharacterHudRevealed(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return false;
    const characters = this.story?.getCharacters?.();
    const base = characters?.find((c) => c?.id === key);
    const playerRole = this.getRole(PLAYER_ROLE_ID);
    if (playerRole?.candidates.includes(key)) {
      return this.isRoleCast(PLAYER_ROLE_ID) && this.getRoleHolder(PLAYER_ROLE_ID) === key;
    }
    const reveal = base?.hudReveal ?? (base?.role === "player" ? "fromStart" : "onAppearance");
    if (reveal === "onVariantChosen") return this.hasSettledVariant(key);
    return reveal === "fromStart" || this.hasCharacterAppeared(key);
  }
  /**
   * Merge the base character with whichever variant is currently active.
   * Falls back to the base record when no variant has been chosen. Used by
   * dossier rendering, trait modulation, mood seeding, etc. — anywhere a
   * downstream reader cares about the *effective* persona.
   */
  getMergedCharacter(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return void 0;
    const characters = this.story?.getCharacters?.();
    const base = characters?.find((c) => c?.id === key);
    if (!base) return void 0;
    const variantId = this.state.activeCharacterVariants[key];
    if (!variantId) return base;
    const variant = findCharacterVariant(base, variantId);
    if (!variant) return base;
    return resolveCharacterWithVariant(base, variant);
  }
  /**
   * Switch which variant is active for a character. Returns the previous
   * variant id (or undefined). When `options.seedAffect` is true (default),
   * the runtime re-seeds mood + sentiments from the merged variant —
   * appropriate when the variant is chosen at story-start. Authors
   * driving mid-story personality shifts should pass false explicitly so
   * accumulated affect survives.
   */
  setActiveCharacterVariant(charRef, variantId, options) {
    const key = this.resolveCharRef(charRef);
    if (!key) return void 0;
    const previous = this.state.activeCharacterVariants[key];
    const leaving = options?.mode === "shift" ? this.getMergedCharacter(key) : void 0;
    if (variantId != null && variantId !== "") {
      this.explicitVariantSet[key] = true;
    } else {
      delete this.explicitVariantSet[key];
    }
    if (variantId == null || variantId === "") {
      delete this.state.activeCharacterVariants[key];
    } else {
      this.state.activeCharacterVariants[key] = variantId;
    }
    if (previous === variantId) return previous;
    this.emit("characterVariantChanged", { characterRef: key, variantId, previous });
    const seed = options?.seedAffect !== false;
    if (seed && options?.mode === "shift") {
      this.shiftAffectBetweenPersonas(key, leaving, this.getMergedCharacter(key));
    } else if (seed) {
      delete this.state.characterMoods[key];
      delete this.state.characterSentiments[key];
      delete this.state.characterEmotionLevels[key];
      this.seedCharacterAffectFor(key);
    }
    return previous;
  }
  /**
   * A mid-story variant switch (2026-09-26): the character keeps what they
   * have lived through and the authored change is applied ON TOP — each mood
   * axis and each sentiment the new persona seeds moves by (its seed −
   * the previous persona's seed, 0 if it had none) — added if absent;
   * feelings the new persona does not mention stay as lived.
   * Emotions and the "since the start" baselines are left alone. A full
   * reseed erased every relationship built so far (Late Light: the whole
   * Act I trust arc, so the Visit could never happen).
   */
  shiftAffectBetweenPersonas(key, from, to) {
    if (!to) return;
    const fromMood = from?.initialMood ?? { valence: 0, arousal: 0 };
    const toMood = to.initialMood ?? fromMood;
    const dV = (toMood.valence ?? 0) - (fromMood.valence ?? 0);
    const dA = (toMood.arousal ?? 0) - (fromMood.arousal ?? 0);
    if (dV !== 0 || dA !== 0) {
      const current2 = this.state.characterMoods[key] ?? { valence: fromMood.valence ?? 0, arousal: fromMood.arousal ?? 0 };
      const next = { valence: _StoryContext.clampUnit(current2.valence + dV), arousal: _StoryContext.clampUnit(current2.arousal + dA) };
      this.state.characterMoods[key] = next;
      this.emit("characterMoodChanged", { characterRef: key, mood: next, previous: current2 });
    }
    const seedOf = (persona, ref, emotion) => (persona?.initialSentiments ?? []).find((s) => s?.toEntityRef === ref && s?.emotion === emotion)?.strength ?? 0;
    const pairs = /* @__PURE__ */ new Map();
    for (const s of to.initialSentiments ?? []) {
      if (s?.toEntityRef && s?.emotion) pairs.set(`${s.toEntityRef}|${s.emotion}`, { ref: s.toEntityRef, emotion: s.emotion });
    }
    if (!this.state.characterSentiments[key]) this.state.characterSentiments[key] = [];
    const list = this.state.characterSentiments[key];
    let changed = false;
    for (const { ref, emotion } of pairs.values()) {
      const delta = seedOf(to, ref, emotion) - seedOf(from, ref, emotion);
      if (delta === 0) continue;
      const existing = list.find((s) => s.toEntityRef === ref && s.emotion === emotion);
      if (existing) existing.strength = _StoryContext.clampUnit(existing.strength + delta);
      else list.push({ toEntityRef: ref, emotion, strength: _StoryContext.clampUnit(delta), createdAt: Date.now() });
      changed = true;
    }
    if (changed) this.emit("characterSentimentChanged", { characterRef: key });
  }
  /**
   * Read the runtime status of a single goal on a character. Defaults to
   * 'open' for goals the runtime hasn't touched (and for goals it doesn't
   * know about — the runtime has no opinion until something happens).
   */
  getGoalStatus(charRef, goalId) {
    const key = this.resolveCharRef(charRef);
    if (!key || !goalId) return "open";
    return this.state.characterGoalStatus[key]?.[goalId] || "open";
  }
  /** All known goal statuses for a character (defensive copy). */
  getCharacterGoalStatuses(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return {};
    return { ...this.state.characterGoalStatus[key] || {} };
  }
  /**
   * Set the runtime status of a goal. Returns the previous status so callers
   * can distinguish a real transition from a no-op. When the status actually
   * changes, fires GAMYGDALA-style emotions per `GOAL_EMOTIONS` (scaled by
   * the authored goal priority) unless `options.suppressEmotion` is set.
   */
  setGoalStatus(charRef, goalId, status, options) {
    const key = this.resolveCharRef(charRef);
    if (!key || !goalId) return null;
    const previous = this.state.characterGoalStatus[key]?.[goalId] || "open";
    if (previous === status) return previous;
    if (!this.state.characterGoalStatus[key]) this.state.characterGoalStatus[key] = {};
    this.state.characterGoalStatus[key][goalId] = status;
    this.emit("characterGoalStatusChanged", { characterRef: key, goalId, status, previous });
    if (!options?.suppressEmotion) {
      const characters = this.story?.getCharacters?.();
      const character = characters?.find((c) => c?.id === key);
      const goal = character?.goals?.find((g) => g.id === goalId);
      const priority = typeof goal?.priority === "number" ? Math.max(0, Math.min(1, goal.priority)) : 0.5;
      for (const fire of _StoryContext.GOAL_EMOTIONS[status]) {
        const delta = fire.weight * priority;
        if (delta !== 0) this.fireCharacterEmotion(key, fire.emotion, delta);
      }
    }
    return previous;
  }
  /**
   * Re-evaluate every goal with a satisfaction predicate for `charRef`.
   * Goals already in a terminal state ('met' / 'failed' / 'abandoned') are
   * skipped — once a goal closes, only an explicit setGoalStatus reopens it.
   * Open goals whose predicate evaluates true flip to 'met' and trigger the
   * goal-emotion side-effects. Returns the number of goals that flipped so
   * tests / callers can detect motion.
   */
  evaluateCharacterGoals(charRef) {
    const key = this.resolveCharRef(charRef);
    if (!key) return 0;
    const characters = this.story?.getCharacters?.();
    const character = characters?.find((c) => c?.id === key);
    const goals = character?.goals || [];
    let flipped = 0;
    for (const g of goals) {
      if (!g.satisfaction) continue;
      const status = this.getGoalStatus(key, g.id);
      if (status !== "open") continue;
      if (this.checkCondition(g.satisfaction)) {
        this.setGoalStatus(key, g.id, "met");
        flipped += 1;
      }
    }
    return flipped;
  }
  /** Re-evaluate goals across every character that has authored goals. */
  evaluateAllCharacterGoals() {
    const characters = this.story?.getCharacters?.();
    if (!characters) return 0;
    let total = 0;
    for (const c of characters) {
      if (!c?.id || !Array.isArray(c.goals) || c.goals.length === 0) continue;
      total += this.evaluateCharacterGoals(c.id);
    }
    return total;
  }
  // Timer methods
  setTimer(name, value, target) {
    this.state.timers[name] = { value, target };
    this.timerManager.startTimer(name, value, target);
    this.emit("timerSet", { name, value, target });
  }
  clearTimer(name) {
    delete this.state.timers[name];
    this.timerManager.stopTimer(name);
    this.emit("timerCleared", { name });
  }
  getTimer(name) {
    if (this.timerManager.hasTimer(name)) {
      return this.timerManager.getRemainingTime(name);
    }
    return this.state.timers[name]?.value || 0;
  }
  getTimerTarget(name) {
    return this.state.timers[name]?.target;
  }
  getTimerManager() {
    return this.timerManager;
  }
  // Fictional time methods
  getFictionalTime() {
    return this.state.fictionalTime ? { ...this.state.fictionalTime } : void 0;
  }
  setFictionalTime(time) {
    this.state.fictionalTime = { ...time };
    this.emit("fictionalTimeChanged", this.state.fictionalTime);
  }
  /**
   * Advance (or subtract with negative amount) the fictional time.
   * Uses JS Date transiently for correct month-length/leap-year arithmetic.
   */
  advanceFictionalTime(amount, unit) {
    const ft = this.state.fictionalTime;
    if (!ft) return;
    const d = new Date(ft.year, ft.month - 1, ft.day, ft.hour, ft.minute);
    const u = unit === "week" ? "weeks" : unit;
    switch (u) {
      case "minutes":
        d.setMinutes(d.getMinutes() + amount);
        break;
      case "hours":
        d.setHours(d.getHours() + amount);
        break;
      case "days":
        d.setDate(d.getDate() + amount);
        break;
      // 'weeks' was missing — AI generation legitimately emits it as a
      // natural story time-skip unit. Without this case the switch fell
      // through and time silently never advanced (the "advances once to
      // Jan 31 then stuck" bug: the first jump used 'days', every
      // subsequent one used 'weeks' = no-op).
      case "weeks":
        d.setDate(d.getDate() + amount * 7);
        break;
      case "months":
        d.setMonth(d.getMonth() + amount);
        break;
      case "years":
        d.setFullYear(d.getFullYear() + amount);
        break;
    }
    this.state.fictionalTime = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes()
    };
    this.emit("fictionalTimeChanged", this.state.fictionalTime);
  }
  /**
   * Format fictional time for display.
   * @param format One of: 'time-12h', 'time-24h', 'date', 'datetime-12h', 'datetime-24h', 'day-number', 'year'
   * @param initialTime Optional initial time for 'day-number' calculation
   */
  formatFictionalTime(format, initialTime) {
    const ft = this.state.fictionalTime;
    if (!ft) return "";
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const formatTime12h = (h, m) => {
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
    };
    const formatTime24h = (h, m) => {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };
    const formatDate = () => {
      return `${ft.day} ${monthNames[ft.month - 1]} ${ft.year}`;
    };
    switch (format) {
      case "time-12h":
        return formatTime12h(ft.hour, ft.minute);
      case "time-24h":
        return formatTime24h(ft.hour, ft.minute);
      case "date":
        return formatDate();
      case "datetime-12h":
        return `${formatDate()}, ${formatTime12h(ft.hour, ft.minute)}`;
      case "datetime-24h":
        return `${formatDate()}, ${formatTime24h(ft.hour, ft.minute)}`;
      case "day-number": {
        if (!initialTime) return "Day 1";
        const current2 = new Date(ft.year, ft.month - 1, ft.day);
        const initial = new Date(initialTime.year, initialTime.month - 1, initialTime.day);
        const diffMs = current2.getTime() - initial.getTime();
        const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
        return `Day ${diffDays + 1}`;
      }
      case "year":
        return String(ft.year);
      default:
        return `${formatDate()}, ${formatTime12h(ft.hour, ft.minute)}`;
    }
  }
  checkCondition(condition) {
    if (condition.type === "counterCompare") {
      if (!condition.counter1 || !condition.counter2) {
        console.warn("counterCompare condition missing counter1 or counter2");
        return false;
      }
      const ccOwner = condition.character;
      const counter1Value = ccOwner ? this.getCharacterCounter(ccOwner, condition.counter1) : this.state.counters[condition.counter1] || 0;
      const counter2Value = ccOwner ? this.getCharacterCounter(ccOwner, condition.counter2) : this.state.counters[condition.counter2] || 0;
      switch (condition.operator) {
        case "==":
          return counter1Value === counter2Value;
        case "!=":
          return counter1Value !== counter2Value;
        case ">":
          return counter1Value > counter2Value;
        case "<":
          return counter1Value < counter2Value;
        case ">=":
          return counter1Value >= counter2Value;
        case "<=":
          return counter1Value <= counter2Value;
        default:
          return false;
      }
    }
    if (condition.type === "visitedBeat") {
      const beatId = condition.beatId || condition.variableName || condition.left;
      if (!beatId) {
        console.warn("visitedBeat condition missing beatId");
        return false;
      }
      const hasVisited = this.state.visitedBeats.has(beatId);
      if (condition.operator === "!=" || condition.operator === "not") {
        return !hasVisited;
      }
      return hasVisited;
    }
    if (condition.type === "fictionalTime") {
      const current2 = this.state.fictionalTime;
      if (!current2 || !condition.compareTime) return false;
      const currentMs = new Date(current2.year, current2.month - 1, current2.day, current2.hour, current2.minute).getTime();
      const compareMs = new Date(
        condition.compareTime.year,
        condition.compareTime.month - 1,
        condition.compareTime.day,
        condition.compareTime.hour,
        condition.compareTime.minute
      ).getTime();
      console.log(`[StoryContext] FictionalTime check: current=${currentMs} ${condition.operator} compare=${compareMs}`);
      switch (condition.operator) {
        case ">":
          return currentMs > compareMs;
        case "<":
          return currentMs < compareMs;
        case "==":
          return currentMs === compareMs;
        case ">=":
          return currentMs >= compareMs;
        case "<=":
          return currentMs <= compareMs;
        case "!=":
          return currentMs !== compareMs;
        default:
          return false;
      }
    }
    if (condition.type === "inventory") {
      const itemToCheck = condition.item || condition.value || condition.right;
      if (!itemToCheck) {
        console.warn("inventory condition missing item to check");
        return false;
      }
      const entry = this.state.inventory.find((e) => e.name === itemToCheck);
      const itemQuantity = entry?.quantity ?? 0;
      const hasItem = itemQuantity > 0;
      const itemNames = this.state.inventory.map((e) => `${e.name}(x${e.quantity})`);
      if (condition.quantityCheck && condition.quantityOperator) {
        let leftValue2;
        const compareSource = condition.compareSource || "inventory";
        if (compareSource === "variable") {
          const rawVar = condition.compareVariable || "";
          const compareVar = rawVar.startsWith("$") ? rawVar.substring(1) : rawVar;
          const resolved = this.getVariable(compareVar) ?? this.state.counters[compareVar] ?? 0;
          leftValue2 = typeof resolved === "number" ? resolved : parseInt(resolved) || 0;
        } else {
          leftValue2 = itemQuantity;
        }
        let threshold;
        if (typeof condition.quantityValue === "string") {
          const varName2 = condition.quantityValue.startsWith("$") ? condition.quantityValue.substring(1) : condition.quantityValue;
          const resolved = this.getVariable(varName2) ?? this.state.counters[varName2] ?? 0;
          threshold = typeof resolved === "number" ? resolved : parseInt(resolved) || 0;
        } else {
          threshold = condition.quantityValue ?? 0;
        }
        const leftLabel = compareSource === "variable" ? `$${condition.compareVariable}` : `"${itemToCheck}" qty`;
        console.log(`[StoryContext] Quantity check: ${leftLabel}=${leftValue2} ${condition.quantityOperator} ${threshold}`);
        switch (condition.quantityOperator) {
          case "==":
            return leftValue2 === threshold;
          case "!=":
            return leftValue2 !== threshold;
          case ">":
            return leftValue2 > threshold;
          case "<":
            return leftValue2 < threshold;
          case ">=":
            return leftValue2 >= threshold;
          case "<=":
            return leftValue2 <= threshold;
          default:
            return false;
        }
      }
      console.log(`[StoryContext] Inventory check: "${itemToCheck}" in [${itemNames.join(", ")}] = ${hasItem}`);
      if (condition.operator === "!=" || condition.operator === "not") {
        return !hasItem;
      }
      return hasItem;
    }
    if (condition.type === "mood") {
      const character = condition.character;
      const axis = condition.moodAxis || "valence";
      if (!character) {
        console.warn("mood condition missing required character field");
        return false;
      }
      const key = this.resolveCharRef(character);
      const mood = this.getCharacterMood(character);
      const currentVal = axis === "arousal" ? mood.arousal : mood.valence;
      const baselineVal = key ? this.resolveMoodBaseline(key, axis, condition.baseline) : 0;
      const left = isLiteralBaseline(condition.baseline) ? currentVal : currentVal - baselineVal;
      const right = Number(condition.value ?? condition.right ?? 0);
      switch (condition.operator) {
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        default:
          return false;
      }
    }
    if (condition.type === "emotion") {
      const character = condition.character;
      const emotionName = condition.emotionName;
      if (!character || !emotionName) {
        console.warn("emotion condition missing character or emotionName");
        return false;
      }
      const key = this.resolveCharRef(character);
      const lower = emotionName.toLowerCase();
      const currentVal = this.getCharacterEmotion(character, emotionName);
      const baselineVal = key ? this.resolveEmotionBaseline(key, lower, condition.baseline) : 0;
      const left = isLiteralBaseline(condition.baseline) ? currentVal : currentVal - baselineVal;
      const right = Number(condition.value ?? condition.right ?? 0);
      switch (condition.operator) {
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        default:
          return false;
      }
    }
    if (condition.type === "characterVariant") {
      const character = condition.character;
      if (!character) {
        console.warn("characterVariant condition missing character");
        return false;
      }
      const left = this.getActiveCharacterVariant(character) || "";
      const right = String(condition.variantId ?? condition.value ?? "");
      switch (condition.operator) {
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        default:
          return false;
      }
    }
    if (condition.type === "roleHolder") {
      const roleId = condition.role;
      if (!roleId) {
        console.warn("roleHolder condition missing role");
        return false;
      }
      const holder = this.getRoleHolder(roleId) || "";
      const wanted = this.resolveCharRef(condition.character || String(condition.value ?? "")) || "";
      switch (condition.operator) {
        case "==":
          return holder === wanted;
        case "!=":
          return holder !== wanted;
        default:
          return false;
      }
    }
    if (condition.type === "goal") {
      const character = condition.character;
      const goalId = condition.goalId;
      if (!character || !goalId) {
        console.warn("goal condition missing character or goalId");
        return false;
      }
      const left = this.getGoalStatus(character, goalId);
      const right = String(condition.goalStatus ?? condition.value ?? "met");
      switch (condition.operator) {
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        default:
          return false;
      }
    }
    if (condition.type === "trait") {
      const character = condition.character;
      const traitName = condition.traitName;
      if (!character || !traitName) {
        console.warn("trait condition missing character or traitName");
        return false;
      }
      const charRecord = this.getMergedCharacter(character);
      const left = Number(charRecord?.traits?.[traitName] ?? 0);
      const right = Number(condition.value ?? condition.right ?? 0);
      switch (condition.operator) {
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        default:
          return false;
      }
    }
    if (condition.type === "sentiment") {
      const character = condition.character;
      const target = condition.sentimentTarget;
      if (!character || !target) {
        console.warn("sentiment condition missing character or sentimentTarget");
        return false;
      }
      const key = this.resolveCharRef(character);
      const currentVal = this.getSentimentTo(character, target, condition.sentimentEmotion);
      const baselineVal = key ? this.resolveSentimentBaseline(key, target, condition.sentimentEmotion, condition.baseline) : 0;
      const left = isLiteralBaseline(condition.baseline) ? currentVal : currentVal - baselineVal;
      const right = Number(condition.value ?? condition.right ?? 0);
      switch (condition.operator) {
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        default:
          return false;
      }
    }
    if (condition.type === "gpsProximity") {
      const targetLat = Number(condition.targetLat ?? NaN);
      const targetLng = Number(condition.targetLng ?? NaN);
      const radius = Number(condition.radiusMeters ?? 0);
      if (Number.isNaN(targetLat) || Number.isNaN(targetLng) || radius <= 0) {
        console.warn("gpsProximity condition needs targetLat, targetLng, radiusMeters > 0");
        return false;
      }
      const reading = this.sensorService.getLastKnownLocation();
      if (!reading) return false;
      const distance = haversineMeters(reading.lat, reading.lng, targetLat, targetLng);
      const within = distance <= radius;
      return condition.proximityMode === "outside" ? !within : within;
    }
    if (condition.type === "indoorProximity") {
      const uuid = condition.beaconUuid;
      const minRssi = Number(condition.minRssi ?? -100);
      if (!uuid) {
        console.warn("indoorProximity condition missing beaconUuid");
        return false;
      }
      const beacons = this.sensorService.getLastKnownBeacons();
      const match = beacons.find((b) => {
        if (b.uuid !== uuid) return false;
        if (condition.beaconMajor !== void 0 && b.major !== condition.beaconMajor) return false;
        if (condition.beaconMinor !== void 0 && b.minor !== condition.beaconMinor) return false;
        return true;
      });
      if (!match) return false;
      return match.rssi >= minRssi;
    }
    if (condition.type === "permissionGranted") {
      const requested = condition.permissions || [];
      if (requested.length === 0) return true;
      for (const p of requested) {
        const cached = this.permissionStateCache.get(p);
        if (cached !== "granted") return false;
      }
      return true;
    }
    const varName = (condition.variableName || condition.variable || condition.left)?.trim();
    if (!varName) {
      console.warn(`Condition of type ${condition.type} missing required variableName`);
      return false;
    }
    let leftValue;
    let rightValue = condition.value !== void 0 ? condition.value : condition.right;
    switch (condition.type) {
      case "counter": {
        const ctrOwner = condition.character;
        leftValue = ctrOwner ? this.getCharacterCounter(ctrOwner, varName) : this.getCounter(varName);
        if (rightValue === void 0 || rightValue === null || Number.isNaN(Number(rightValue))) {
          rightValue = 0;
        } else {
          rightValue = Number(rightValue);
        }
        console.log(`[StoryContext] Counter check: "${varName}"${ctrOwner ? ` @${ctrOwner}` : ""} = ${leftValue}, comparing ${condition.operator} ${rightValue}`);
        break;
      }
      case "variable":
        leftValue = this.getVariable(varName);
        [leftValue, rightValue] = alignForComparison(leftValue, rightValue);
        break;
      case "timer":
        leftValue = this.state.timers[varName]?.value || 0;
        if (rightValue === void 0 || rightValue === null || Number.isNaN(Number(rightValue))) {
          rightValue = 0;
        } else {
          rightValue = Number(rightValue);
        }
        break;
      default:
        leftValue = this.resolveValue(varName);
        break;
    }
    switch (condition.operator) {
      case "==":
        return leftValue === rightValue;
      case "!=":
        return leftValue !== rightValue;
      case ">":
        return leftValue > rightValue;
      case "<":
        return leftValue < rightValue;
      case ">=":
        return leftValue >= rightValue;
      case "<=":
        return leftValue <= rightValue;
      case "contains":
        if (Array.isArray(leftValue)) return leftValue.includes(rightValue);
        return typeof leftValue === "string" && rightValue !== void 0 && rightValue !== null ? leftValue.toLowerCase().includes(String(rightValue).toLowerCase()) : false;
      // Offered by the Condition beat for variables; had no case, so both
      // always came out false.
      case "exists":
        return leftValue !== void 0 && leftValue !== null && leftValue !== "";
      case "notExists":
        return leftValue === void 0 || leftValue === null || leftValue === "";
      default:
        return false;
    }
  }
  applyEffect(effect) {
    switch (effect.type) {
      // Sound is a renderer concern; core just signals. Hosts subscribe
      // (PreviewWindow / PlayerEngine) and route to the audio pipeline.
      case "playSound":
        this.emit("playSound", {
          sound: effect.target,
          volume: typeof effect.value === "number" ? effect.value : void 0
        });
        break;
      // Music volume, faded or at once — hosts route it to their audio
      // (PreviewWindow / PlayerEngine), like playSound. value = percent of
      // the project's own music level; target 'all' = everything.
      case "setVolume": {
        const pct = Number(effect.value);
        this.emit("setVolume", {
          target: effect.target === "all" ? "all" : "music",
          volume: Number.isFinite(pct) ? Math.max(0, Math.min(1, pct / 100)) : 1,
          fadeMs: Math.max(0, Number(effect.fadeSeconds) || 0) * 1e3
        });
        break;
      }
      case "setVariable":
        this.setVariable(effect.target, effect.value);
        break;
      case "addInventory":
        this.addToInventory(effect.target);
        break;
      case "removeInventory":
        this.removeFromInventory(effect.target);
        break;
      // When `effect.character` is set the counter is scoped to that
      // character's per-character store (mirrors setVariable.character);
      // omitted ⇒ the story-global counter, unchanged.
      // Effect values can arrive as strings ("2" — e.g. typed while the effect
      // was a setVariable, then switched to a counter type), and `0 + "2"`
      // concatenates. Coerce here so every caller gets arithmetic.
      case "incrementCounter": {
        const delta = Number(effect.value) || 1;
        if (effect.character) {
          this.incrementCharacterCounter(effect.character, effect.target, delta);
        } else {
          this.incrementCounter(effect.target, delta);
        }
        break;
      }
      case "setCounter": {
        const value = Number(effect.value ?? 0) || 0;
        if (effect.character) {
          this.setCharacterCounter(effect.character, effect.target, value);
        } else {
          this.setCounter(effect.target, value);
        }
        break;
      }
      // Step 4 / Phase A: character affect effects. The deltas live on the
      // effect record itself (`valenceDelta` / `arousalDelta` / `strengthDelta`)
      // so the existing effect-editor UI can treat them as any other field.
      // `target` is the character ref (id, name, or displayName) — resolved
      // by the underlying nudgeCharacterMood / addCharacterSentiment.
      case "nudgeMood": {
        const dV = Number(effect.valenceDelta ?? 0);
        const dA = Number(effect.arousalDelta ?? 0);
        if (dV !== 0 || dA !== 0) {
          this.nudgeCharacterMood(effect.target, dV, dA);
        }
        break;
      }
      case "addSentiment": {
        const t = effect.sentimentTarget;
        const e = effect.sentimentEmotion;
        const d = Number(effect.strengthDelta ?? 0);
        if (t && e && d !== 0) {
          this.addCharacterSentiment(effect.target, t, e, d);
        }
        break;
      }
      // Step 5 — fire an emotion at the character. The runtime auto-nudges
      // mood by the palette weights when the emotion is recognised; unknown
      // emotion names still update the level but skip the mood side-effect.
      case "fireEmotion": {
        const name = effect.emotion;
        const delta = Number(effect.emotionDelta ?? 0);
        if (name && delta !== 0) {
          this.fireCharacterEmotion(effect.target, name, delta);
        }
        break;
      }
      // Step 7 / Mode B — record a reflection on the character's memory.
      // Effects fire from a beat or choice, so they're a natural place to
      // author "this character now feels X about what just happened".
      case "addReflection": {
        const text = (effect.reflectionText || "").trim();
        if (text) {
          this.appendCharacterReflection(effect.target, text, {
            salience: typeof effect.reflectionSalience === "number" ? effect.reflectionSalience : void 0
          });
        }
        break;
      }
      // Step 8 — change a character's runtime goal status. Auto-fires
      // GAMYGDALA-style emotions for the new status unless suppressed.
      case "setGoalStatus": {
        const goalId = effect.goalId;
        const status = effect.goalStatus;
        if (goalId && status) {
          this.setGoalStatus(effect.target, goalId, status, {
            suppressEmotion: !!effect.suppressEmotion
          });
        }
        break;
      }
      // Switch a character's active variant. Re-seeds the character's
      // mood / sentiments from the variant's authored values unless
      // `suppressSeed` is set — appropriate for story-start switches.
      case "setCharacterVariant": {
        const variantId = effect.variantId;
        if (variantId !== void 0) {
          this.setActiveCharacterVariant(effect.target, variantId, {
            seedAffect: !effect.suppressSeed,
            mode: "shift"
          });
        }
        break;
      }
      // Cast a role: target = role id ('confidant' or '@confidant'),
      // character = who fills it from now on.
      case "castRole": {
        if (effect.target && effect.character) this.castRole(effect.target, effect.character);
        break;
      }
      // v0.9.45 — snapshot mood / emotion / sentiment state under a name
      // so subsequent condition baselines can compare against it. With
      // scope 'all' (default), every character's slots are captured. With
      // scope 'character' and a target, only that character is captured.
      case "bookmarkAffectState": {
        const name = effect.bookmarkName;
        if (!name) break;
        const scope = effect.scope;
        if (scope === "character" && effect.target) {
          this.takeAffectBookmark(name, { target: effect.target });
        } else {
          this.takeAffectBookmark(name);
        }
        break;
      }
    }
  }
  markBeatVisited(beatId) {
    if (this.restartedFromBeatId === beatId) {
      this.restartedFromBeatId = null;
      return;
    }
    this.decayCharacterEmotions();
    this.evaluateAllCharacterGoals();
    this.state.visitedBeats.add(beatId);
    this.history.push(beatId);
    const beat = this.story?.getBeat(beatId);
    this.timeline.push({
      type: "beat-enter",
      timestamp: Date.now(),
      beatId,
      beatName: beat?.name,
      beatType: beat?.type
    });
  }
  markChoiceVisited(beatId, choiceId) {
    this.state.visitedChoices.add(`${beatId}:${choiceId}`);
  }
  getVisitedChoicesForBeat(beatId) {
    const prefix = `${beatId}:`;
    return Array.from(this.state.visitedChoices).filter((key) => key.startsWith(prefix)).map((key) => key.substring(prefix.length));
  }
  /**
   * Record a player choice for rich AI context
   * Called by choice beats (DialogTree, MovementChoice, PickProp, HyperText)
   */
  recordChoice(choice) {
    const ts = Date.now();
    this.choiceHistory.push({ ...choice, timestamp: ts });
    this.timeline.push({
      type: "choice",
      timestamp: ts,
      beatId: choice.beatId,
      beatName: choice.beatName,
      beatType: choice.beatType,
      choiceText: choice.choiceText,
      choiceContext: choice.choiceContext
    });
  }
  /**
   * Get the rich choice history for AI prompts
   */
  getChoiceHistory() {
    return [...this.choiceHistory];
  }
  /**
   * Get recent choices (for context-limited AI prompts)
   */
  getRecentChoices(limit = 10) {
    return this.choiceHistory.slice(-limit);
  }
  /**
   * A dialog tree beat starts (again). Its lines join the same conversation
   * in the message history; on a later visit the first new line is marked.
   */
  beginConversation(beatId) {
    if (this.conversations.some((c) => c.beatId === beatId && c.lines.length > 0)) {
      this.conversationRevisits.add(beatId);
    }
  }
  /** Add a line the player saw (or said) to a conversation's history. */
  recordConversationLine(beatId, line) {
    if (!line.text) return;
    let record = this.conversations.find((c) => c.beatId === beatId);
    if (!record) {
      record = { beatId, lines: [], updatedAt: 0 };
      this.conversations.push(record);
    }
    const entry = { ...line };
    if (this.conversationRevisits.delete(beatId)) entry.newVisit = true;
    record.lines.push(entry);
    record.updatedAt = Date.now();
    this.emit("conversationRecorded", { beatId });
  }
  /** Played conversations, most recently active first. */
  getConversations() {
    return this.conversations.map((c) => ({ ...c, lines: c.lines.map((l) => ({ ...l })) })).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  /**
   * Record AI-generated output for session logging and future AI context
   */
  recordAIOutput(output) {
    const ts = Date.now();
    this.aiOutputHistory.push({ ...output, timestamp: ts });
    this.timeline.push({
      type: "ai-output",
      timestamp: ts,
      beatId: output.beatId,
      beatName: output.beatName,
      beatType: output.beatType,
      text: output.text
    });
  }
  /**
   * Get all AI output history
   */
  getAIOutputHistory() {
    return [...this.aiOutputHistory];
  }
  /**
   * Record a timeline event for the unified session log
   */
  recordTimelineEvent(event) {
    this.timeline.push({
      ...event,
      timestamp: Date.now()
    });
  }
  /**
   * Get the full timeline of events
   */
  getTimeline() {
    return [...this.timeline];
  }
  resolveValue(ref) {
    if (!ref) {
      return void 0;
    }
    if (ref.startsWith("var:")) {
      return this.getVariable(ref.substring(4));
    }
    if (ref.startsWith("counter:")) {
      return this.state.counters[ref.substring(8)] || 0;
    }
    if (ref === "inventory") {
      return this.state.inventory.map((entry) => entry.name);
    }
    return ref;
  }
  getState() {
    return Object.freeze({ ...this.state });
  }
  getVisitedBeats() {
    return Array.from(this.state.visitedBeats);
  }
  getVariables() {
    return { ...this.state.variables };
  }
  getCounters() {
    return { ...this.state.counters };
  }
  /**
   * Get inventory as array of item names (backward compatible)
   * Each item appears once regardless of quantity
   */
  getInventory() {
    return this.state.inventory.map((entry) => entry.name);
  }
  /**
   * Get full inventory entries with quantities
   */
  getInventoryEntries() {
    return this.state.inventory.map((entry) => ({ ...entry }));
  }
  getTimers() {
    return { ...this.state.timers };
  }
  reset() {
    const oldCounterNames = Object.keys(this.state.counters);
    this.timerManager.stopAllTimers();
    this.state = {
      currentBeatId: this.story?.getFirstBeatId() || "0",
      variables: {},
      counters: {},
      inventory: [],
      characterInventories: {},
      characterCounters: {},
      characterVariables: {},
      characterFlags: {},
      characterMoods: {},
      characterSentiments: {},
      characterEmotionLevels: {},
      characterReflections: {},
      characterGoalStatus: {},
      activeCharacterVariants: {},
      appearedCharacters: {},
      roleHolders: {},
      initialMoods: {},
      initialEmotionLevels: {},
      initialSentiments: {},
      affectBookmarks: {},
      visitedBeats: /* @__PURE__ */ new Set(),
      visitedChoices: /* @__PURE__ */ new Set(),
      timers: {},
      geoPoints: {}
    };
    this.explicitVariantSet = {};
    this.restartedFromBeatId = null;
    this.history = [];
    this.choiceHistory = [];
    this.conversations = [];
    this.conversationRevisits.clear();
    this.aiOutputHistory = [];
    this.timeline = [];
    this.seedCharacterAffectFromStory();
    this.seedCharacterCountersFromStory();
    this.seedCharacterInventoriesFromStory();
    this.seedStoryVariables();
    this.seedRoles();
    this.emit("reset");
    for (const name of oldCounterNames) {
      this.emit("counterChanged", { name, value: 0 });
    }
    this.emit("inventoryChanged");
  }
  /**
   * Selective reset - only clear the categories set to true.
   * Allows EndScreen beats to preserve certain state (e.g. keep variables but reset counters).
   */
  selectiveReset(options) {
    const oldCounterNames = options.counters ? Object.keys(this.state.counters) : [];
    if (options.variables) {
      this.state.variables = {};
      this.seedStoryVariables();
    }
    if (options.characters) {
      this.state.characterVariables = {};
      this.state.characterFlags = {};
      this.state.characterMoods = {};
      this.state.characterSentiments = {};
      this.state.characterEmotionLevels = {};
      this.state.characterReflections = {};
      this.state.characterGoalStatus = {};
      this.state.activeCharacterVariants = {};
      this.state.appearedCharacters = {};
      this.state.roleHolders = {};
      this.seedRoles();
      this.state.initialMoods = {};
      this.state.initialEmotionLevels = {};
      this.state.initialSentiments = {};
      this.state.affectBookmarks = {};
      this.explicitVariantSet = {};
      this.seedCharacterAffectFromStory();
    }
    if (options.counters) {
      this.state.counters = {};
      this.state.characterCounters = {};
      this.seedCharacterCountersFromStory();
    }
    if (options.inventory) {
      this.state.inventory = [];
      this.state.characterInventories = {};
      this.seedCharacterInventoriesFromStory();
    }
    if (options.timers) {
      this.timerManager.stopAllTimers();
      this.state.timers = {};
    }
    if (options.fictionalTime) {
      delete this.state.fictionalTime;
    }
    if (options.visitedTracking) {
      this.state.visitedBeats = /* @__PURE__ */ new Set();
      this.state.visitedChoices = /* @__PURE__ */ new Set();
    }
    if (options.history) {
      this.history = [];
      this.choiceHistory = [];
      this.conversations = [];
      this.conversationRevisits.clear();
      this.aiOutputHistory = [];
      this.timeline = [];
    }
    this.state.currentBeatId = this.story?.getFirstBeatId() || "0";
    this.emit("selectiveReset", options);
    for (const name of oldCounterNames) {
      this.emit("counterChanged", { name, value: 0 });
    }
    if (options.inventory) {
      this.emit("inventoryChanged");
    }
  }
  getStory() {
    if (!this.story) {
      throw new Error("Story not set in context");
    }
    return this.story;
  }
  setStory(story) {
    this.story = story;
    this.seedCharacterAffectFromStory();
    this.seedCharacterCountersFromStory();
    this.seedCharacterInventoriesFromStory();
    this.seedStoryVariables();
    this.seedRoles();
  }
  /**
   * Story variables start at the value the author gave them in Project
   * Settings (`settings.variables[].defaultValue`) — the runtime used to
   * ignore it, so every variable started undefined. Never overwrites a value
   * that is already set.
   */
  seedStoryVariables() {
    for (const def of this.storyVariableDefinitions()) {
      if (!def?.name || def.defaultValue === void 0 || def.defaultValue === "") continue;
      if (this.state.variables[def.name] !== void 0) continue;
      this.state.variables[def.name] = coerceToDeclaredType(def.defaultValue, def.type);
    }
  }
  storyVariableDefinitions() {
    const defs = this.story?.getSettings?.()?.variables;
    return Array.isArray(defs) ? defs : [];
  }
  declaredVariableType(name) {
    return this.storyVariableDefinitions().find((d) => d?.name === name)?.type;
  }
  /** Which playthrough this is: 1 on the first, +1 on every in-story restart. */
  getPlaythrough() {
    const n = Number(this.state.playthrough);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }
  restartPlaythrough(reset, fromBeatId) {
    const run = this.getPlaythrough();
    const from = fromBeatId ?? this.state.currentBeatId;
    const kept = this.captureKeptAcrossRestarts();
    if (reset === "all") this.reset();
    else if (reset) this.selectiveReset(reset);
    this.restoreKeptAcrossRestarts(kept);
    this.restartedFromBeatId = reset === "all" || reset && reset.visitedTracking ? from : null;
    this.state.playthrough = run + 1;
    this.emit("variableChanged", { name: PLAYTHROUGH_VARIABLE, value: run + 1 });
  }
  captureKeptAcrossRestarts() {
    const variables = {};
    for (const def of this.storyVariableDefinitions()) {
      if (def?.keepOnRestart && def.name && this.state.variables[def.name] !== void 0) {
        variables[def.name] = this.state.variables[def.name];
      }
    }
    const counters = [];
    const variants = [];
    const characters = this.story?.getCharacters?.() ?? [];
    for (const c of characters) {
      const key = c?.id ? this.resolveCharRef(c.id) : void 0;
      if (!key) continue;
      for (const def of Array.isArray(c.counters) ? c.counters : []) {
        const value = this.state.characterCounters[key]?.[def?.name];
        if (def?.keepOnRestart && def.name && typeof value === "number") counters.push({ key, name: def.name, value });
      }
      const variantId = this.state.activeCharacterVariants[key];
      if (c.keepVariantOnRestart && variantId) variants.push({ key, variantId });
    }
    const roles = {};
    for (const role of this.getRoles()) {
      const holder = this.state.roleHolders[role.id];
      if (role.keepOnRestart && holder) roles[role.id] = holder;
    }
    return { variables, counters, variants, roles };
  }
  restoreKeptAcrossRestarts(kept) {
    for (const [roleId, characterId] of Object.entries(kept.roles)) this.state.roleHolders[roleId] = characterId;
    for (const [name, value] of Object.entries(kept.variables)) this.setVariable(name, value);
    for (const { key, variantId } of kept.variants) {
      if (this.state.activeCharacterVariants[key] !== variantId) {
        this.setActiveCharacterVariant(key, variantId, { seedAffect: true, mode: "reseed" });
      }
    }
    for (const { key, name, value } of kept.counters) this.setCharacterCounter(key, name, value);
  }
  /**
   * Seed character mood + sentiments from authored Character.initialMood /
   * initialSentiments values. Only fills slots that are currently empty —
   * runtime changes already in flight (e.g. from UpdateAffect beats) are
   * never overwritten. Called automatically from setStory and reset; safe
   * to call manually if the story is mutated and the new characters need
   * their starting affect propagated.
   */
  seedCharacterAffectFromStory() {
    const story = this.story;
    if (!story) return;
    const characters = story.getCharacters?.();
    if (!characters) return;
    for (const char of characters) {
      if (!char?.id) continue;
      if (!this.state.activeCharacterVariants[char.id]) {
        const variants = Array.isArray(char.variants) ? char.variants.filter((v) => v?.id) : [];
        if (char.variantSelectionPolicy === "random" && variants.length > 0) {
          const pick = variants[Math.floor(Math.random() * variants.length)];
          this.state.activeCharacterVariants[char.id] = pick.id;
        } else if (char.defaultVariantId) {
          this.state.activeCharacterVariants[char.id] = char.defaultVariantId;
        }
      }
      this.seedCharacterAffectFor(char.id);
    }
  }
  /**
   * Seed each character's authored counters (Character.counters[]) into the
   * runtime per-character store. Without this, an author defining
   * "Wolf.health = 100" in the character editor never reaches
   * `characterCounters` at runtime — reads return the 0 default and the
   * meter never moves while a `setVariable type:counter` beat that targets
   * the same character mutates a value the editor can't see. This connects
   * the two halves of the per-character counter system.
   *
   * Only fills slots that are currently empty, mirroring affect seeding:
   * a value already present (loaded from a saved game, or mutated by a beat
   * that ran before this call) is never overwritten. Idempotent; called
   * from the constructor, reset, and setStory.
   */
  /**
   * Hand out the items listed on each character (Character → Inventory) at
   * the start of the story. The player's character gets them in the player
   * inventory — where 'player' beats, effects and conditions look — every
   * other character in their own. Only items the owner doesn't hold yet are
   * added, so seeding again (setStory after the constructor) never doubles.
   */
  seedCharacterInventoriesFromStory() {
    var _a;
    const characters = this.story?.getCharacters?.();
    if (!characters) return;
    let seeded = false;
    for (const char of characters) {
      if (!char?.id) continue;
      const merged = this.getMergedCharacter(char.id) || char;
      const items = Array.isArray(merged.inventory) ? merged.inventory : [];
      if (items.length === 0) continue;
      const isPlayer = char.role === "player";
      const key = isPlayer ? null : this.resolveCharRef(char.id) ?? char.id;
      for (const item of items) {
        const name = typeof item?.name === "string" ? item.name.trim() : "";
        if (!name) continue;
        const quantity = typeof item.quantity === "number" && item.quantity > 0 ? Math.floor(item.quantity) : 1;
        const bucket = isPlayer ? this.state.inventory : (_a = this.state.characterInventories)[key] ?? (_a[key] = []);
        if (bucket.some((entry) => entry.name === name)) continue;
        bucket.push({ name, quantity });
        seeded = true;
      }
    }
    if (seeded) this.emit("inventoryChanged");
  }
  seedCharacterCountersFromStory() {
    const story = this.story;
    if (!story) return;
    const characters = story.getCharacters?.();
    if (!characters) return;
    for (const char of characters) {
      if (!char?.id) continue;
      const key = this.resolveCharRef(char.id);
      if (!key) continue;
      const merged = this.getMergedCharacter(key);
      const defs = merged?.counters;
      if (!Array.isArray(defs) || defs.length === 0) continue;
      for (const def of defs) {
        const name = def?.name;
        if (!name) continue;
        if (!this.state.characterCounters[key]) this.state.characterCounters[key] = {};
        if (this.state.characterCounters[key][name] !== void 0) continue;
        const value = typeof def.value === "number" ? def.value : 0;
        this.state.characterCounters[key][name] = value;
        this.emit("characterCounterChanged", {
          characterRef: key,
          name,
          value,
          previous: 0
        });
      }
    }
  }
  /**
   * Seed mood + sentiments for one character from the merged record (so the
   * active variant's `initialMood` / `initialSentiments` win over the base).
   * Used both by the cross-character startup walk and by
   * setActiveCharacterVariant after a runtime variant switch.
   */
  seedCharacterAffectFor(charId) {
    const merged = this.getMergedCharacter(charId);
    if (!merged) return;
    if (merged.initialMood && !this.state.characterMoods[charId]) {
      const next = {
        valence: _StoryContext.clampUnit(merged.initialMood.valence ?? 0),
        arousal: _StoryContext.clampUnit(merged.initialMood.arousal ?? 0)
      };
      this.state.characterMoods[charId] = next;
      this.state.initialMoods[charId] = { valence: next.valence, arousal: next.arousal };
      this.emit("characterMoodChanged", { characterRef: charId, mood: next, previous: { valence: 0, arousal: 0 } });
    }
    if (merged.initialSentiments && merged.initialSentiments.length > 0) {
      if (!this.state.characterSentiments[charId]) this.state.characterSentiments[charId] = [];
      if (!this.state.initialSentiments[charId]) this.state.initialSentiments[charId] = [];
      const existing = this.state.characterSentiments[charId];
      const initialList = this.state.initialSentiments[charId];
      let seededAny = false;
      for (const seed of merged.initialSentiments) {
        if (!seed?.toEntityRef || !seed?.emotion) continue;
        const present = existing.some(
          (s) => s.toEntityRef === seed.toEntityRef && s.emotion === seed.emotion
        );
        if (!present) {
          const strength = _StoryContext.clampUnit(seed.strength ?? 0);
          existing.push({
            toEntityRef: seed.toEntityRef,
            emotion: seed.emotion,
            strength,
            createdAt: Date.now()
          });
          if (!initialList.some((s) => s.toEntityRef === seed.toEntityRef && s.emotion === seed.emotion)) {
            initialList.push({
              toEntityRef: seed.toEntityRef,
              emotion: seed.emotion,
              strength,
              createdAt: Date.now()
            });
          }
          seededAny = true;
        }
      }
      if (seededAny) {
        this.emit("characterSentimentChanged", { characterRef: charId });
      }
    }
  }
  /**
   * Update a character's display name
   * This keeps the character ID stable while allowing dynamic renaming
   */
  updateCharacterDisplayName(characterId, displayName) {
    if (!this.story) {
      console.warn("Cannot update character display name: story not set in context");
      return;
    }
    const characters = this.story.getCharacters();
    const character = characters.find((c) => c.id === characterId);
    if (character) {
      character.displayName = displayName;
      this.emit("characterRenamed", { characterId, displayName });
    } else {
      console.warn(`Character with id '${characterId}' not found`);
    }
  }
  // ======== Debug Session Management ========
  /**
   * Start a new debug session
   */
  startDebugSession() {
    const sessionId = `debug_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.debugSession = {
      sessionId,
      startTime: Date.now(),
      currentPath: [],
      pathHistory: []
    };
    this.emit("debugSessionStarted", { sessionId });
    return sessionId;
  }
  /**
   * End the current debug session
   */
  endDebugSession() {
    if (this.debugSession) {
      if (this.debugSession.currentPath.length > 0) {
        this.debugSession.pathHistory.push([...this.debugSession.currentPath]);
      }
      this.emit("debugSessionEnded", { sessionId: this.debugSession.sessionId });
      this.debugSession = void 0;
    }
  }
  /**
   * Get the current path in the debug session
   */
  getCurrentPath() {
    return this.debugSession ? [...this.debugSession.currentPath] : [];
  }
  /**
   * Get all completed paths from the debug session
   */
  getPathHistory() {
    return this.debugSession ? [...this.debugSession.pathHistory] : [];
  }
  /**
   * Add a beat to the current debug path
   */
  addToDebugPath(beatId) {
    if (this.debugSession) {
      this.debugSession.currentPath.push(beatId);
    }
  }
  /**
   * Complete the current path and start a new one (e.g., when reaching an end beat)
   */
  completeDebugPath() {
    if (this.debugSession && this.debugSession.currentPath.length > 0) {
      this.debugSession.pathHistory.push([...this.debugSession.currentPath]);
      this.debugSession.currentPath = [];
    }
  }
  // ======== Analysis Caching ========
  /**
   * Cache reachability analysis results
   */
  cacheReachabilityResults(results, aiAnalysis) {
    this.analysisCache.reachability = {
      timestamp: Date.now(),
      results,
      aiAnalysis
    };
  }
  /**
   * Get cached reachability results
   */
  getCachedReachability() {
    return this.analysisCache.reachability?.results || null;
  }
  /**
   * Cache path analysis results
   */
  cachePathResults(results, aiAnalysis) {
    this.analysisCache.paths = {
      timestamp: Date.now(),
      results,
      aiAnalysis
    };
  }
  /**
   * Get cached path results
   */
  getCachedPaths() {
    return this.analysisCache.paths?.results || null;
  }
  /**
   * Invalidate all analysis caches (call when story structure changes)
   */
  invalidateAnalysisCache() {
    this.analysisCache = {};
    this.emit("analysisCacheInvalidated");
  }
  /**
   * Check if cached analysis is still valid (not older than maxAge in milliseconds)
   */
  isCacheValid(cacheType, maxAge = 6e4) {
    const cache = this.analysisCache[cacheType];
    if (!cache) return false;
    return Date.now() - cache.timestamp < maxAge;
  }
  // ======== AI Suggestion Management ========
  /**
   * Add an AI-generated suggestion
   */
  addAISuggestion(suggestion) {
    const id = `suggestion_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const fullSuggestion = {
      ...suggestion,
      id,
      timestamp: Date.now(),
      applied: false
    };
    this.aiSuggestions.push(fullSuggestion);
    this.emit("aiSuggestionAdded", fullSuggestion);
    return id;
  }
  /**
   * Mark a suggestion as applied
   */
  applySuggestion(suggestionId) {
    const suggestion = this.aiSuggestions.find((s) => s.id === suggestionId);
    if (suggestion) {
      suggestion.applied = true;
      this.emit("aiSuggestionApplied", suggestion);
    }
  }
  /**
   * Get all AI suggestions, optionally filtered
   */
  getSuggestions(filter) {
    let suggestions = [...this.aiSuggestions];
    if (filter) {
      if (filter.applied !== void 0) {
        suggestions = suggestions.filter((s) => s.applied === filter.applied);
      }
      if (filter.type) {
        suggestions = suggestions.filter((s) => s.type === filter.type);
      }
    }
    return suggestions;
  }
  /**
   * Clear all AI suggestions
   */
  clearAISuggestions() {
    this.aiSuggestions = [];
    this.emit("aiSuggestionsCleared");
  }
  /**
   * Remove a specific AI suggestion
   */
  removeAISuggestion(suggestionId) {
    const index = this.aiSuggestions.findIndex((s) => s.id === suggestionId);
    if (index !== -1) {
      this.aiSuggestions.splice(index, 1);
      this.emit("aiSuggestionRemoved", { suggestionId });
    }
  }
  /** Snapshot of the affect state only (see AFFECT_KEYS) — a plain deep
   *  copy of those fields (cheap: path analysis takes one per step). */
  getAffectSnapshot() {
    const st = this.state;
    const out = {};
    for (const k of _StoryContext.AFFECT_KEYS) if (st[k] !== void 0) out[k] = clonePlain(st[k]);
    return out;
  }
  /** Replace the affect state with a snapshot; everything else is kept. */
  restoreAffectSnapshot(snapshot) {
    const st = this.state;
    for (const k of _StoryContext.AFFECT_KEYS) {
      if (k === "roleHolders" && snapshot[k] === void 0) continue;
      const v = snapshot[k] ?? {};
      if (k === "initialMoods" || k === "affectBookmarks") st[k] = { ...v };
      else if (k === "initialEmotionLevels" || k === "initialSentiments") {
        const out = {};
        for (const c in v) out[c] = Array.isArray(v[c]) ? [...v[c]] : { ...v[c] };
        st[k] = out;
      } else st[k] = clonePlain(v);
    }
  }
  /**
   * Path analysis: hand over the live affect state WITHOUT copying and
   * detach it (the context gets fresh empty maps), so the caller owns it
   * and nothing here can mutate it later. Half the cost of a snapshot.
   */
  detachAffectSnapshot() {
    const st = this.state;
    const out = {};
    for (const k of _StoryContext.AFFECT_KEYS) {
      out[k] = st[k];
      st[k] = {};
    }
    return out;
  }
  /**
   * Path analysis: load a simulated state — its affect snapshot plus plain
   * variables, counters and items — without the full deserializer.
   */
  loadSimulationState(affect, variables, counters, items) {
    this.restoreAffectSnapshot(affect);
    const st = this.state;
    st.variables = { ...variables };
    st.counters = { ...counters };
    st.inventory = items.map((name) => ({ name, quantity: 1 }));
  }
  serialize() {
    const cloneNamespacedNumbers = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { ...v }]));
    const cloneNamespacedAny = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { ...v }]));
    const cloneNamespacedBools = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { ...v }]));
    return {
      currentBeatId: this.state.currentBeatId,
      variables: { ...this.state.variables },
      ...this.state.playthrough !== void 0 ? { playthrough: this.state.playthrough } : {},
      counters: { ...this.state.counters },
      inventory: this.state.inventory.map((entry) => ({ ...entry })),
      characterInventories: Object.fromEntries(
        Object.entries(this.state.characterInventories).map(([k, v]) => [k, v.map((entry) => ({ ...entry }))])
      ),
      characterCounters: cloneNamespacedNumbers(this.state.characterCounters),
      characterVariables: cloneNamespacedAny(this.state.characterVariables),
      characterFlags: cloneNamespacedBools(this.state.characterFlags),
      characterMoods: Object.fromEntries(
        Object.entries(this.state.characterMoods).map(([k, v]) => [k, { ...v }])
      ),
      characterSentiments: Object.fromEntries(
        Object.entries(this.state.characterSentiments).map(([k, v]) => [k, v.map((s) => ({ ...s }))])
      ),
      characterEmotionLevels: Object.fromEntries(
        Object.entries(this.state.characterEmotionLevels).map(([k, v]) => [k, { ...v }])
      ),
      characterReflections: Object.fromEntries(
        Object.entries(this.state.characterReflections).map(([k, v]) => [k, v.map((r) => ({ ...r }))])
      ),
      characterGoalStatus: Object.fromEntries(
        Object.entries(this.state.characterGoalStatus).map(([k, v]) => [k, { ...v }])
      ),
      activeCharacterVariants: { ...this.state.activeCharacterVariants },
      appearedCharacters: { ...this.state.appearedCharacters },
      roleHolders: { ...this.state.roleHolders },
      // v0.9.45 — baseline + bookmark snapshots so save/load preserves
      // delta-vs-initial / delta-vs-bookmark comparisons across sessions.
      initialMoods: Object.fromEntries(
        Object.entries(this.state.initialMoods).map(([k, v]) => [k, { ...v }])
      ),
      initialEmotionLevels: Object.fromEntries(
        Object.entries(this.state.initialEmotionLevels).map(([k, v]) => [k, { ...v }])
      ),
      initialSentiments: Object.fromEntries(
        Object.entries(this.state.initialSentiments).map(([k, v]) => [k, v.map((s) => ({ ...s }))])
      ),
      affectBookmarks: Object.fromEntries(
        Object.entries(this.state.affectBookmarks).map(([name, snap]) => [
          name,
          {
            moods: Object.fromEntries(Object.entries(snap.moods).map(([k, v]) => [k, { ...v }])),
            emotionLevels: Object.fromEntries(Object.entries(snap.emotionLevels).map(([k, v]) => [k, { ...v }])),
            sentiments: Object.fromEntries(Object.entries(snap.sentiments).map(([k, v]) => [k, v.map((s) => ({ ...s }))]))
          }
        ])
      ),
      visitedBeats: Array.from(this.state.visitedBeats),
      visitedChoices: Array.from(this.state.visitedChoices),
      timers: { ...this.state.timers },
      history: [...this.history],
      choiceHistory: this.choiceHistory.map((c) => ({ ...c })),
      conversations: this.conversations.map((c) => ({ ...c, lines: c.lines.map((l) => ({ ...l })) })),
      fictionalTime: this.state.fictionalTime ? { ...this.state.fictionalTime } : void 0,
      geoPoints: Object.fromEntries(
        Object.entries(this.state.geoPoints || {}).map(([k, v]) => [k, v.map((p) => ({ ...p }))])
      )
    };
  }
  /**
   * Load state from a serialized save
   * Restores the context to the saved state
   * Handles both old format (string[]) and new format (InventoryEntry[])
   */
  loadFromSerialized(serialized) {
    this.timerManager.stopAllTimers();
    const migrateInventory = (inv) => {
      if (!inv || inv.length === 0) return [];
      if (typeof inv[0] === "string") {
        return inv.map((name) => ({ name, quantity: 1 }));
      }
      return inv.map((entry) => ({ ...entry }));
    };
    const cloneNs = (m) => m ? Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { ...v }])) : {};
    this.state = {
      currentBeatId: serialized.currentBeatId,
      variables: { ...serialized.variables },
      ...serialized.playthrough !== void 0 ? { playthrough: serialized.playthrough } : {},
      counters: { ...serialized.counters },
      inventory: migrateInventory(serialized.inventory),
      characterInventories: Object.fromEntries(
        Object.entries(serialized.characterInventories || {}).map(([k, v]) => [k, migrateInventory(v)])
      ),
      characterCounters: cloneNs(serialized.characterCounters),
      characterVariables: cloneNs(serialized.characterVariables),
      characterFlags: cloneNs(serialized.characterFlags),
      characterMoods: serialized.characterMoods ? Object.fromEntries(Object.entries(serialized.characterMoods).map(([k, v]) => [k, { ...v }])) : {},
      characterSentiments: serialized.characterSentiments ? Object.fromEntries(Object.entries(serialized.characterSentiments).map(([k, v]) => [k, v.map((s) => ({ ...s }))])) : {},
      characterEmotionLevels: serialized.characterEmotionLevels ? Object.fromEntries(Object.entries(serialized.characterEmotionLevels).map(([k, v]) => [k, { ...v }])) : {},
      characterReflections: serialized.characterReflections ? Object.fromEntries(Object.entries(serialized.characterReflections).map(([k, v]) => [k, v.map((r) => ({ ...r }))])) : {},
      characterGoalStatus: serialized.characterGoalStatus ? Object.fromEntries(Object.entries(serialized.characterGoalStatus).map(([k, v]) => [k, { ...v }])) : {},
      activeCharacterVariants: serialized.activeCharacterVariants ? { ...serialized.activeCharacterVariants } : {},
      appearedCharacters: serialized.appearedCharacters ? { ...serialized.appearedCharacters } : {},
      roleHolders: serialized.roleHolders ? { ...serialized.roleHolders } : {},
      // v0.9.45 — restore baseline snapshots and named bookmarks; default
      // to empty maps for older saves (forward-compat).
      initialMoods: serialized.initialMoods ? Object.fromEntries(Object.entries(serialized.initialMoods).map(([k, v]) => [k, { ...v }])) : {},
      initialEmotionLevels: serialized.initialEmotionLevels ? Object.fromEntries(Object.entries(serialized.initialEmotionLevels).map(([k, v]) => [k, { ...v }])) : {},
      initialSentiments: serialized.initialSentiments ? Object.fromEntries(Object.entries(serialized.initialSentiments).map(([k, v]) => [k, v.map((s) => ({ ...s }))])) : {},
      affectBookmarks: serialized.affectBookmarks ? Object.fromEntries(Object.entries(serialized.affectBookmarks).map(([name, snap]) => [
        name,
        {
          moods: Object.fromEntries(Object.entries(snap.moods || {}).map(([k, v]) => [k, { ...v }])),
          emotionLevels: Object.fromEntries(Object.entries(snap.emotionLevels || {}).map(([k, v]) => [k, { ...v }])),
          sentiments: Object.fromEntries(Object.entries(snap.sentiments || {}).map(([k, v]) => [k, v.map((s) => ({ ...s }))]))
        }
      ])) : {},
      visitedBeats: new Set(serialized.visitedBeats),
      visitedChoices: new Set(serialized.visitedChoices || []),
      timers: { ...serialized.timers },
      fictionalTime: serialized.fictionalTime ? { ...serialized.fictionalTime } : void 0,
      geoPoints: serialized.geoPoints ? Object.fromEntries(Object.entries(serialized.geoPoints).map(([k, v]) => [k, v.map((p) => ({ ...p }))])) : {}
    };
    this.history = [...serialized.history];
    this.choiceHistory = serialized.choiceHistory ? serialized.choiceHistory.map((c) => ({ ...c })) : [];
    this.conversations = Array.isArray(serialized.conversations) ? serialized.conversations.map((c) => ({ ...c, lines: (c.lines || []).map((l) => ({ ...l })) })) : [];
    this.conversationRevisits.clear();
    for (const [name, timer] of Object.entries(serialized.timers)) {
      if (timer.value > 0) {
        this.timerManager.startTimer(name, timer.value, timer.target);
      }
    }
    this.emit("stateLoaded", { serialized });
  }
  /**
   * Get the current beat ID
   */
  getCurrentBeatId() {
    return this.state.currentBeatId;
  }
  /**
   * Set the current beat ID
   */
  setCurrentBeatId(beatId) {
    this.state.currentBeatId = beatId;
    this.emit("beatChanged", { beatId });
  }
  /**
   * Get the beat history
   */
  getHistory() {
    return [...this.history];
  }
};
// ---------------------------------------------------------------------------
// Reflection memory (Step 7 — Mode B)
// ---------------------------------------------------------------------------
/**
 * Per-character cap on stored reflections. The runtime keeps the most recent
 * `REFLECTION_CAP` entries; older entries are evicted in FIFO order. This is
 * a token-budget guardrail for the dossier — a few dozen entries is plenty
 * for a session-length conversation. Authors who need a larger window can
 * raise this on a per-project basis later (Step 8 territory).
 */
__publicField(_StoryContext, "REFLECTION_CAP", 32);
// ---------------------------------------------------------------------------
// Goals (Step 8 — Phase A)
//
// Goals are authored on Character.goals[]; this block tracks their runtime
// status and re-evaluates satisfaction predicates on every beat-enter (via
// `evaluateCharacterGoals`, called from markBeatVisited). When a goal flips
// from `open` to `met` / `failed`, the runtime fires GAMYGDALA-style
// emotions (pride/joy on success, shame/sadness on failure) scaled by the
// goal's authored priority. Authors can opt out via `suppressEmotion` on
// the setGoalStatus effect for goals that should change quietly.
// ---------------------------------------------------------------------------
/** Default emotion firings on goal status transitions. The lookup is
 *  case-insensitive against the project's EmotionPalette so renaming
 *  emotions doesn't break the auto-fire path — unknown names just no-op. */
__publicField(_StoryContext, "GOAL_EMOTIONS", {
  open: [],
  met: [{ emotion: "pride", weight: 0.7 }, { emotion: "joy", weight: 0.4 }],
  failed: [{ emotion: "shame", weight: 0.6 }, { emotion: "sadness", weight: 0.4 }],
  abandoned: []
});
// ======== Save/Load Serialization ========
/**
 * Serialize the current story state for saving
 * Converts Sets to Arrays for JSON compatibility
 */
/** The fields of the serialized state that make up the characters' inner
 *  life: moods, sentiments, emotions, reflections, goals, variants, who
 *  the player has met, and the baselines / bookmarks feelings conditions
 *  compare against. */
__publicField(_StoryContext, "AFFECT_KEYS", [
  "characterMoods",
  "characterSentiments",
  "characterEmotionLevels",
  "characterReflections",
  "characterGoalStatus",
  "activeCharacterVariants",
  "appearedCharacters",
  "initialMoods",
  "initialEmotionLevels",
  "initialSentiments",
  "affectBookmarks",
  // Who plays each cast role: path analysis follows castings like feelings.
  "roleHolders"
]);
var StoryContext = _StoryContext;

// src/engine/StoryEngine.ts
var StoryEngine = class extends import_index.default {
  constructor(renderer, opts) {
    super();
    __publicField(this, "story", null);
    __publicField(this, "context");
    __publicField(this, "renderer");
    __publicField(this, "running", false);
    __publicField(this, "paused", false);
    __publicField(this, "currentBeatId", null);
    __publicField(this, "timerInterruptBeat", null);
    /**
     * v0.9.48+ — `opts.mockMode` forces the StoryContext to use the
     * MockSensorService for XR sensor access. PreviewWindow / desktop
     * authoring passes `true` so authors can simulate location and
     * orientation without real hardware. Production playback omits this
     * and gets WebSensorService via capability detection.
     */
    __publicField(this, "mockMode");
    this.renderer = renderer;
    this.mockMode = !!opts?.mockMode;
    this.context = new StoryContext(void 0, void 0, { mockMode: this.mockMode });
    this.context.on("timerExpired", this.handleTimerExpired.bind(this));
  }
  handleTimerExpired(data) {
    if (data.targetBeat && this.running) {
      console.log(`Timer ${data.name} expired, jumping to ${data.targetBeat}`);
      this.emit("timerExpired", data);
      this.timerInterruptBeat = data.targetBeat;
    }
  }
  async loadStory(story) {
    this.story = story;
    const existingSensorService = this.context.getSensorService();
    this.context = new StoryContext(
      { currentBeatId: story.getFirstBeatId() },
      story,
      { mockMode: this.mockMode, existingSensorService }
    );
    this.context.on("timerExpired", this.handleTimerExpired.bind(this));
    this.emit("storyLoaded", story);
  }
  async start(startBeatId) {
    if (!this.story) {
      throw new Error("No story loaded");
    }
    this.running = true;
    this.currentBeatId = startBeatId || this.story.getFirstBeatId();
    this.context.setCurrentBeatId(this.currentBeatId);
    while (this.running && this.currentBeatId) {
      if (this.timerInterruptBeat) {
        this.currentBeatId = this.timerInterruptBeat;
        this.context.setCurrentBeatId(this.currentBeatId);
        this.timerInterruptBeat = null;
      }
      const beat = this.story.getBeat(this.currentBeatId);
      if (!beat) {
        throw new Error(`Beat not found: ${this.currentBeatId}`);
      }
      try {
        console.log(`[StoryEngine] Executing beat ${this.currentBeatId} (type: ${beat.type})`);
        const nextBeatId = await beat.execute(this.context, this.renderer);
        console.log(`[StoryEngine] Beat ${this.currentBeatId} returned nextBeatId:`, JSON.stringify(nextBeatId));
        if (nextBeatId === "__restart__") {
          console.log("[StoryEngine] Restart signal - restarting from first beat");
          this.currentBeatId = this.story.getFirstBeatId();
          this.context.setCurrentBeatId(this.currentBeatId);
          continue;
        }
        if (this.timerInterruptBeat) {
          this.currentBeatId = this.timerInterruptBeat;
          this.timerInterruptBeat = null;
        } else {
          this.currentBeatId = nextBeatId || null;
        }
        if (this.currentBeatId) {
          this.context.setCurrentBeatId(this.currentBeatId);
        }
      } catch (error) {
        console.error("Story execution error:", error);
        this.running = false;
        throw error;
      }
    }
    this.emit("storyEnded");
  }
  stop() {
    this.running = false;
    this.paused = false;
    this.context.getTimerManager().stopAllTimers();
    this.emit("storyStopped");
  }
  /**
   * Pause story execution
   * The story loop will exit but state is preserved
   */
  pause() {
    if (this.running && !this.paused) {
      this.paused = true;
      this.running = false;
      this.context.getTimerManager().stopAllTimers();
      this.emit("storyPaused", { beatId: this.currentBeatId });
    }
  }
  /**
   * Resume from paused state
   */
  async resume() {
    if (this.paused && this.currentBeatId) {
      this.paused = false;
      const timers = this.context.getTimers();
      for (const [name, timer] of Object.entries(timers)) {
        if (timer.value > 0) {
          this.context.getTimerManager().startTimer(name, timer.value, timer.target);
        }
      }
      this.emit("storyResumed", { beatId: this.currentBeatId });
      await this.start(this.currentBeatId);
    }
  }
  /**
   * Check if the engine is paused
   */
  isPaused() {
    return this.paused;
  }
  /**
   * Check if the engine is running
   */
  isRunning() {
    return this.running;
  }
  /**
   * Load state from a serialized save and optionally resume
   * @param serialized The serialized story state
   * @param autoResume If true, automatically resume playing from the saved beat
   */
  async loadState(serialized, autoResume = false) {
    console.log(`[StoryEngine] loadState called, autoResume=${autoResume}, currentBeatId=${serialized.currentBeatId}`);
    if (!this.story) {
      throw new Error("No story loaded. Call loadStory() first.");
    }
    console.log(`[StoryEngine] Stopping current execution, running=${this.running}`);
    this.stop();
    console.log(`[StoryEngine] Loading serialized state into context`);
    this.context.loadFromSerialized(serialized);
    this.currentBeatId = serialized.currentBeatId;
    console.log(`[StoryEngine] Updated currentBeatId to: ${this.currentBeatId}`);
    this.emit("stateLoaded", { serialized, beatId: this.currentBeatId });
    if (autoResume && this.currentBeatId) {
      console.log(`[StoryEngine] Auto-resuming from beat: ${this.currentBeatId}`);
      await this.start(this.currentBeatId);
      console.log(`[StoryEngine] start() completed`);
    }
  }
  /**
   * Get the current serialized state for saving
   */
  getSerializedState() {
    return this.context.serialize();
  }
  /**
   * Get the loaded story
   */
  getStory() {
    return this.story;
  }
  getContext() {
    return this.context;
  }
  getCurrentBeatId() {
    return this.currentBeatId;
  }
};

// src/engine/EmotionPalette.ts
var DEFAULT_EMOTION_PALETTE = [
  { name: "joy", weightToValence: 0.7, weightToArousal: 0.4, decayRate: 0.2, description: "Happy / delighted" },
  { name: "anger", weightToValence: -0.5, weightToArousal: 0.7, decayRate: 0.25, description: "Hostile / aggressive" },
  { name: "fear", weightToValence: -0.6, weightToArousal: 0.6, decayRate: 0.2, description: "Threatened / anxious" },
  { name: "sadness", weightToValence: -0.7, weightToArousal: -0.4, decayRate: 0.1, description: "Grief / sorrow" },
  { name: "surprise", weightToValence: 0, weightToArousal: 0.8, decayRate: 0.4, description: "Startled \u2014 fast decay" },
  { name: "disgust", weightToValence: -0.5, weightToArousal: 0.2, decayRate: 0.25, description: "Aversion / revulsion" },
  { name: "pride", weightToValence: 0.5, weightToArousal: 0.2, decayRate: 0.15, description: "Self-satisfaction" },
  { name: "shame", weightToValence: -0.6, weightToArousal: -0.2, decayRate: 0.1, description: "Self-reproach" },
  { name: "interest", weightToValence: 0.3, weightToArousal: 0.3, decayRate: 0.3, description: "Curiosity / engagement" }
];

// src/engine/Story.ts
var Story = class {
  constructor(metadata) {
    __publicField(this, "beats", /* @__PURE__ */ new Map());
    __publicField(this, "metadata");
    __publicField(this, "settings", {});
    __publicField(this, "environment", { props: [], nodes: [] });
    __publicField(this, "characters", []);
    __publicField(this, "clusters", []);
    __publicField(this, "containerBeatPositions", []);
    __publicField(this, "assets", []);
    // Step 5 — author-editable emotion palette. Defaults to Ekman 6 + pride /
    // shame / interest until the project explicitly sets something else.
    __publicField(this, "emotionPalette", DEFAULT_EMOTION_PALETTE.map((e) => ({ ...e })));
    // Step 6 — author-editable trait → emotion modulation table. Defaults
    // to a Big-Five wiring (neuroticism amplifies negative emotions, etc.)
    // that is safe to ship even when the character has no traits set.
    __publicField(this, "traitModulations", DEFAULT_TRAIT_MODULATIONS.map((m) => ({ ...m })));
    this.metadata = {
      firstBeatId: "0",
      title: "Untitled Story",
      ...metadata
    };
  }
  addBeat(beat) {
    this.beats.set(beat.id, beat);
  }
  getBeat(id) {
    return this.beats.get(id);
  }
  getFirstBeatId() {
    if (this.metadata.firstBeatId && this.beats.has(this.metadata.firstBeatId)) {
      return this.metadata.firstBeatId;
    }
    for (const [id, beat] of this.beats) {
      if (beat.type === "titleScreen") return id;
    }
    const first = this.beats.keys().next().value;
    return first || "0";
  }
  setFirstBeatId(id) {
    this.metadata.firstBeatId = id;
  }
  setMetadata(metadata) {
    this.metadata = { ...this.metadata, ...metadata };
  }
  getMetadata() {
    return this.metadata;
  }
  addEnvironmentItem(type, item) {
    if (type === "prop") {
      this.environment.props.push(item);
    } else if (type === "node") {
      this.environment.nodes.push(item);
    }
  }
  addCharacter(character) {
    this.characters.push(character);
  }
  getAllBeats() {
    return Array.from(this.beats.values());
  }
  setSettings(settings) {
    this.settings = settings;
  }
  getSettings() {
    return this.settings;
  }
  setEnvironment(environment) {
    this.environment = environment;
  }
  getEnvironment() {
    return this.environment;
  }
  setCharacters(characters) {
    this.characters = characters;
  }
  getCharacters() {
    return this.characters;
  }
  // Step 5 — emotion palette accessors.
  getEmotionPalette() {
    return this.emotionPalette;
  }
  setEmotionPalette(palette) {
    this.emotionPalette = palette.map((e) => ({ ...e }));
  }
  // Step 6 — trait modulation accessors.
  getTraitModulations() {
    return this.traitModulations;
  }
  setTraitModulations(modulations) {
    this.traitModulations = modulations.map((m) => ({ ...m }));
  }
  setClusters(clusters) {
    this.clusters = clusters;
    if (this.metadata.clusters) {
      this.metadata.clusters = clusters;
    }
  }
  getClusters() {
    return this.clusters;
  }
  // New cluster container management methods
  findClusterById(clusterId) {
    return this.clusters.find((cluster) => cluster.id === clusterId);
  }
  addCluster(cluster) {
    const existingIndex = this.clusters.findIndex((c) => c.id === cluster.id);
    if (existingIndex >= 0) {
      this.clusters[existingIndex] = cluster;
    } else {
      this.clusters.push(cluster);
    }
    if (this.metadata.clusters) {
      this.metadata.clusters = [...this.clusters];
    }
  }
  removeCluster(clusterId) {
    const initialLength = this.clusters.length;
    this.clusters = this.clusters.filter((cluster) => cluster.id !== clusterId);
    if (this.metadata.clusters) {
      this.metadata.clusters = [...this.clusters];
    }
    this.containerBeatPositions = this.containerBeatPositions.filter((pos) => pos.clusterId !== clusterId);
    return this.clusters.length < initialLength;
  }
  // Container beat position management
  setContainerBeatPositions(positions) {
    this.containerBeatPositions = positions;
  }
  getContainerBeatPositions() {
    return this.containerBeatPositions;
  }
  getBeatPositionsInCluster(clusterId) {
    return this.containerBeatPositions.filter((pos) => pos.clusterId === clusterId);
  }
  setBeatContainerPosition(position) {
    this.containerBeatPositions = this.containerBeatPositions.filter((pos) => pos.beatId !== position.beatId);
    this.containerBeatPositions.push(position);
  }
  removeBeatFromCluster(beatId, clusterId) {
    const initialLength = this.containerBeatPositions.length;
    this.containerBeatPositions = this.containerBeatPositions.filter((pos) => {
      if (clusterId) {
        return pos.beatId !== beatId || pos.clusterId !== clusterId;
      }
      return pos.beatId !== beatId;
    });
    return this.containerBeatPositions.length < initialLength;
  }
  isBeatInCluster(beatId, clusterId) {
    return this.containerBeatPositions.some((pos) => pos.beatId === beatId && pos.clusterId === clusterId);
  }
  setAssets(assets) {
    this.assets = assets;
  }
  getAssets() {
    return this.assets;
  }
  validate() {
    const errors = [];
    if (!this.beats.has(this.metadata.firstBeatId)) {
      errors.push(`First beat not found: ${this.metadata.firstBeatId}`);
    }
    for (const beat of this.beats.values()) {
      if (beat.cluster && !this.clusters.some((c) => c.id === beat.cluster)) {
        errors.push(`Beat ${beat.id} references non-existent cluster: ${beat.cluster}`);
      }
    }
    for (const pos of this.containerBeatPositions) {
      if (!this.beats.has(pos.beatId)) {
        errors.push(`Container position references non-existent beat: ${pos.beatId}`);
      }
      if (!this.clusters.some((c) => c.id === pos.clusterId)) {
        errors.push(`Container position references non-existent cluster: ${pos.clusterId}`);
      }
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// src/beats/Beat.ts
var DEFAULT_TARGET_TIMEOUT_TYPES = /* @__PURE__ */ new Set([
  "titleScreen",
  "infoText",
  "dialogTree",
  "movementChoice",
  "pickProp",
  "hyperText",
  "inputText",
  "videoBeat"
]);
var _Beat = class _Beat {
  // Version counter incremented on parameter updates (for React change detection)
  constructor(config) {
    __publicField(this, "id");
    __publicField(this, "name");
    __publicField(this, "type");
    __publicField(this, "cluster");
    __publicField(this, "transition");
    __publicField(this, "sound");
    __publicField(this, "locations", /* @__PURE__ */ new Map());
    __publicField(this, "connections", []);
    __publicField(this, "defaultTarget");
    __publicField(this, "defaultTargetDelay");
    // Timeout in seconds before auto-advancing to defaultTarget
    __publicField(this, "showTimer");
    // Whether to show countdown timer to user
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "node");
    // Background image/node reference
    /**
     * Soft responsive layout intent for slot-mode beats (per-slot
     * preferredLines / anchor / gap). Visual-Editor managed. THE invariant:
     * this is a PARAM, never the legacy baked `locations[]` — a beat carrying
     * slotIntent and no locations[] stays responsive. Subclasses that are
     * slot-mode surface this in get/updateParameters; declared on the base so
     * the field + constructor read live in one place.
     */
    __publicField(this, "slotIntent");
    /**
     * Background fit for the beat's background image: 'cover' (fill, crop
     * edges) or 'contain' (show whole image, letterbox). Lives on the BASE
     * class because every visible beat can carry a background; the spatial
     * beat classes (titleScreen, movementChoice, pickProp, dialogTree)
     * re-declare and re-parse it themselves for their SpatialFlowView path,
     * while slot-mode beats rely on this base field + the base execute()
     * pushing it into renderer state.
     */
    __publicField(this, "spatialFit");
    /**
     * Responsive motion intent (P3-anim). Per-slot enter/exit/emphasis (and
     * later spatial pan/zoom + hotspot reveal). DELIBERATELY a separate
     * field from `animations` (the legacy AnimationPath[] of pixel-keyframe
     * paths): the new model is INTENT against the slot's resolved box, not
     * coordinates over baked x/y. See project_responsive_layout_system
     * memory ("Responsive animation model — DESIGN SPEC").
     */
    __publicField(this, "slotAnimations");
    /**
     * P3-anim-6 — responsive motion intent for the SPATIAL layer (the
     * Phase-3 composite image). Sibling of `slotAnimations` which targets
     * the flow slots; the split mirrors SpatialFlowView's deliberate
     * data-layer separation (image vs. text+buttons) so they animate
     * independently. Only meaningful for spatial-mode beats; the field
     * exists on the base class so the persistence path is uniform.
     */
    __publicField(this, "spatialAnimations");
    __publicField(this, "animations");
    // Path animations for elements (absolute mode)
    __publicField(this, "notes");
    // Author notes (not shown to player)
    __publicField(this, "speaker");
    // Who speaks this beat's text (for TTS voice routing and optional display)
    /**
     * Optional Character.id reference for the speaker (Layer 2 of the rich-character roadmap).
     * When set and resolvable, takes precedence over `speaker` for everything that needs a
     * stable identity (TTS voice routing, dialog history per character, dossier building).
     * The free-text `speaker` remains for legacy / inline cases and as the display fallback
     * when no Character record is found.
     */
    __publicField(this, "characterRef");
    __publicField(this, "showSpeaker");
    // undefined = inherit global, true = force show, false = force hide
    __publicField(this, "timeDisplayMode");
    // Per-beat time display mode
    __publicField(this, "timeDisplayText");
    // Override Timer HUD text for this beat (manual mode)
    __publicField(this, "overrideCountdownMeter");
    // Override default countdown meter visibility on this beat
    /**
     * Annotate the screen HUDs when this beat is entered — the "overlay" form of
     * the explanation system (the standalone `explanation` beat is the other).
     * The host draws callouts over the real, packed HUD positions and makes the
     * beat inert until acknowledged, so the interactor can't click past the
     * explanation. Cross-cutting like timeDisplayMode / overrideCountdownMeter:
     * any beat type can carry it, so it lives on the base class.
     */
    __publicField(this, "explainHuds");
    /**
     * Level-2 analyzer annotation. Optional list of state requirements the path
     * analyzer will check when simulating. Not enforced by the engine.
     */
    __publicField(this, "requires");
    /** How multiple requirements combine. Default 'all' (AND); 'any' means OR. */
    __publicField(this, "requiresMode", "all");
    __publicField(this, "_version", 0);
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.cluster = config.cluster;
    this.transition = config.transition;
    this.sound = config.sound;
    this.defaultTarget = config.defaultTarget;
    this.defaultTargetDelay = config.defaultTargetDelay || config.parameters?.defaultTargetDelay;
    this.showTimer = config.showTimer || config.parameters?.showTimer;
    this.node = config.node || config.parameters?.node;
    this.slotIntent = config.parameters?.slotIntent ?? config.slotIntent;
    {
      const fit = config.spatialFit ?? config.parameters?.spatialFit;
      this.spatialFit = fit === "contain" || fit === "cover" ? fit : void 0;
    }
    this.slotAnimations = config.parameters?.slotAnimations ?? config.slotAnimations;
    this.spatialAnimations = config.parameters?.spatialAnimations ?? config.spatialAnimations;
    this.animations = config.animations || config.parameters?.animations;
    this.notes = config.notes || config.parameters?.notes;
    this.speaker = config.speaker || config.parameters?.speaker || "";
    this.characterRef = config.characterRef || config.parameters?.characterRef || void 0;
    this.showSpeaker = config.showSpeaker ?? config.parameters?.showSpeaker ?? void 0;
    this.timeDisplayMode = config.timeDisplayMode || config.parameters?.timeDisplayMode;
    this.timeDisplayText = config.timeDisplayText || config.parameters?.timeDisplayText;
    this.overrideCountdownMeter = config.overrideCountdownMeter || config.parameters?.overrideCountdownMeter;
    this.explainHuds = config.explainHuds ?? config.parameters?.explainHuds;
    this.requires = config.requires || config.parameters?.requires;
    this.requiresMode = config.requiresMode || config.parameters?.requiresMode || "all";
    this.x = config.x;
    this.y = config.y;
    if (config.connections && Array.isArray(config.connections)) {
      this.connections = config.connections;
    }
    if (this.defaultTarget && !(this.defaultTargetDelay && this.defaultTargetDelay > 0) && this.connections.some((c) => c.targetId === this.defaultTarget && !c.condition)) {
      this.defaultTarget = void 0;
    }
    if (config.locations) {
      config.locations.forEach((loc) => {
        this.locations.set(loc.name, loc);
      });
    }
  }
  async execute(context, renderer) {
    try {
      const gateResult = this.checkRequirementsGate(context);
      if (gateResult.redirect) {
        console.log(
          `[Beat ${this.id}] Requirement unmet \u2014 redirecting to "${gateResult.redirect}" (${gateResult.reason}).`
        );
        return gateResult.redirect;
      }
      if (gateResult.warnings.length > 0) {
        for (const w of gateResult.warnings) {
          console.warn(`[Beat ${this.id}] Requirement unmet (no fallbackTarget declared): ${w}`);
        }
      }
      renderer.setState("currentBeatInfo", {
        id: this.id,
        name: this.name,
        type: this.type
      });
      renderer.setState("beatSpeaker", _Beat.linkedSpeakerName(this.characterRef, this.speaker, context));
      for (const ref of _Beat.featuredCharacterRefs(this)) context.markCharacterAppeared(this.processText(ref, context));
      renderer.setState("showSpeaker", this.showSpeaker);
      renderer.setState("spatialFit", this.spatialFit);
      renderer.setState("fixedFrame", !!this.getParameters()?.fixedFrame);
      if (this.animations && this.animations.length > 0) {
        console.log(`[Beat.execute] Setting animations in renderer state:`, this.animations.length, this.animations);
        renderer.setState("animations", this.animations);
      } else {
        console.log(`[Beat.execute] No animations for beat ${this.id}`);
        renderer.setState("animations", void 0);
      }
      renderer.setState("slotIntent", this.slotIntent);
      renderer.setState("slotAnimations", this.slotAnimations);
      if (this.transition && renderer.prepareTransition) {
        renderer.prepareTransition(this.transition);
      }
      await this.onEnter(context, renderer);
      if (this.transition) {
        await renderer.applyTransition(this.transition);
      }
      if (renderer.playClusterSound) {
        const story = context.getStory();
        if (story && this.cluster) {
          const clusters = story.getClusters();
          const cluster = clusters.find((c) => c.id === this.cluster || c.name === this.cluster);
          if (cluster?.sound) {
            await renderer.playClusterSound(cluster.id, cluster.sound);
          } else {
            await renderer.playClusterSound(cluster?.id ?? null, null);
          }
        } else {
          await renderer.playClusterSound(null, null);
        }
      }
      if (this.sound) {
        await renderer.playSound(this.sound);
      }
      const locations = Array.from(this.locations.values());
      if (locations.length > 0) {
        renderer.setState("currentBeatLocations", locations);
      }
      if (this.node) {
        console.log(`[Beat ${this.id}] Looking up background node: ${this.node}`);
        const story = context.getStory();
        if (story) {
          const environment = story.getEnvironment();
          console.log("[Beat] Environment structure:", environment);
          let backgroundUrl = null;
          if (environment?.nodes && Array.isArray(environment.nodes)) {
            const nodeData = environment.nodes.find((n) => n.id === this.node);
            if (nodeData?.url) {
              backgroundUrl = nodeData.url;
              console.log(`[Beat] Found background in nodes array: ${backgroundUrl}`);
            } else if (nodeData?.src) {
              backgroundUrl = nodeData.src;
              console.log(`[Beat] Found background (src format) in nodes array: ${backgroundUrl}`);
            }
          }
          if (!backgroundUrl && environment?.[this.node]) {
            const nodeData = environment[this.node];
            if (typeof nodeData === "string") {
              backgroundUrl = nodeData;
            } else if (nodeData?.src) {
              backgroundUrl = nodeData.src;
            }
            if (backgroundUrl) {
              console.log(`[Beat] Found background in direct property: ${backgroundUrl}`);
            }
          }
          if (!backgroundUrl && this.node.startsWith("http")) {
            backgroundUrl = this.node;
            console.log(`[Beat] Using node as direct URL: ${backgroundUrl}`);
          }
          if (backgroundUrl) {
            renderer.setState("backgroundAssetUrl", backgroundUrl);
            console.log(`[Beat] Set background URL: ${backgroundUrl}`);
          } else {
            console.warn(`[Beat] Could not find background for node: ${this.node}`);
            console.warn("[Beat] Environment:", JSON.stringify(environment, null, 2));
            renderer.setState("backgroundAssetUrl", null);
          }
        } else {
          console.warn("[Beat] No story available in context");
          renderer.setState("backgroundAssetUrl", null);
        }
      } else {
        renderer.setState("backgroundAssetUrl", null);
        renderer.setState("backgroundAssetId", null);
      }
      renderer.setState("backgroundAssetId", this.node || null);
      renderer.setState("speakerStates", void 0);
      this.prefetchConnectedBeats(context, renderer);
      const nextBeatId = await this.performAction(context, renderer);
      this.applyTakenLinkEffects(nextBeatId, context);
      await this.onExit(context, renderer);
      context.markBeatVisited(this.id);
      return nextBeatId;
    } catch (error) {
      console.error(`Error executing beat ${this.id}:`, error);
      throw error;
    }
  }
  async onEnter(context, renderer) {
    console.log(`Entering beat: ${this.name} (${this.id})`);
    const supportsDefaultTargetTimeout = DEFAULT_TARGET_TIMEOUT_TYPES.has(this.type);
    if (supportsDefaultTargetTimeout && this.defaultTarget && this.defaultTargetDelay && this.defaultTargetDelay > 0) {
      const timerManager = context.getTimerManager();
      const timerName = `defaultTarget_${this.id}`;
      console.log(`[Beat ${this.id}] Starting default target timer: ${timerName} for ${this.defaultTargetDelay}s \u2192 ${this.defaultTarget}`);
      timerManager.startTimer(timerName, this.defaultTargetDelay, this.defaultTarget);
    }
  }
  async onExit(context, renderer) {
    console.log(`Exiting beat: ${this.name} (${this.id})`);
    if (renderer.stopBeatSound) {
      renderer.stopBeatSound();
    }
    if (this.defaultTarget) {
      const timerManager = context.getTimerManager();
      const timerName = `defaultTarget_${this.id}`;
      timerManager.stopTimer(timerName);
      console.log(`[Beat ${this.id}] Stopped default target timer: ${timerName}`);
    }
  }
  /**
   * Evaluate declared `requires[]` against the current context.
   *
   * `requiresMode === 'all'` (default): beat is gated if ANY requirement fails
   * — redirect to the first failing one's fallbackTarget.
   * `requiresMode === 'any'`: beat is gated only if EVERY requirement fails
   * — redirect to the first failing one's fallbackTarget (representative of
   * the unsatisfied set).
   *
   * Requirements without a fallbackTarget behave as annotations: they surface
   * as `warnings` so the engine logs them but don't block progression.
   */
  checkRequirementsGate(context) {
    const warnings = [];
    if (!this.requires || this.requires.length === 0) {
      return { redirect: null, reason: "", warnings };
    }
    const evals = this.requires.map((req) => {
      let satisfied = false;
      try {
        satisfied = context.checkCondition(req.condition);
      } catch (err) {
        console.warn(`[Beat ${this.id}] Failed to evaluate requirement:`, err);
        satisfied = true;
      }
      return { req, satisfied };
    });
    if (this.requiresMode === "any") {
      if (evals.some((e) => e.satisfied)) {
        return { redirect: null, reason: "", warnings };
      }
      for (const { req } of evals) {
        const label = req.explanation || "declared prerequisite";
        if (req.fallbackTarget) {
          return { redirect: req.fallbackTarget, reason: `any-of: ${label}`, warnings };
        }
        warnings.push(label);
      }
      return { redirect: null, reason: "", warnings };
    }
    for (const { req, satisfied } of evals) {
      if (satisfied) continue;
      const label = req.explanation || "declared prerequisite";
      if (req.fallbackTarget) {
        return { redirect: req.fallbackTarget, reason: label, warnings };
      }
      warnings.push(label);
    }
    return { redirect: null, reason: "", warnings };
  }
  /**
   * Fire-and-forget prefetch of AI content for connected beats.
   * Called at the start of execute(), so API calls run while the user
   * reads/interacts with the current beat.
   */
  prefetchConnectedBeats(context, renderer) {
    try {
      const story = context.getStory();
      const targetIds = /* @__PURE__ */ new Set();
      for (const conn of this.connections) {
        if (conn.targetId) targetIds.add(conn.targetId);
      }
      if (this.defaultTarget) targetIds.add(this.defaultTarget);
      for (const targetId of targetIds) {
        const targetBeat = story.getBeat(targetId);
        if (!targetBeat || !_Beat.PREFETCHABLE_TYPES.has(targetBeat.type)) continue;
        const prefetchable = targetBeat;
        if (typeof prefetchable.prefetch !== "function") continue;
        console.log(`[Beat ${this.id}] Prefetching connected AI beat: ${targetId} (${targetBeat.type})`);
        prefetchable.prefetch(context, renderer).catch(() => {
        });
      }
    } catch {
    }
  }
  addConnection(connection) {
    if (!this.hasConnection(connection.targetId, connection.label)) {
      this.connections.push(connection);
    }
  }
  clearConnections() {
    this.connections = [];
  }
  removeConnection(targetId, label) {
    this.connections = this.connections.filter(
      (c) => !(c.targetId === targetId && (!label || c.label === label))
    );
  }
  replaceConnections(newConnections) {
    this.connections = [...newConnections];
  }
  hasConnection(targetId, label) {
    return this.connections.some(
      (c) => c.targetId === targetId && (!label || c.label === label)
    );
  }
  getConnections() {
    if (!this.connections || !Array.isArray(this.connections)) {
      console.warn(`[Beat ${this.id}] connections is not an array, initializing to empty array`);
      this.connections = [];
    }
    return [...this.connections];
  }
  getConnectionsForEdit() {
    return this.connections;
  }
  getNextBeat(context) {
    console.log(`[Beat.getNextBeat] ${this.id} (${this.type}): connections=${this.connections?.length || 0}, defaultTarget=${this.defaultTarget}`);
    if (this.connections && this.connections.length > 0) {
      console.log(`[Beat.getNextBeat] ${this.id} connections:`, this.connections.map((c) => ({ target: c.targetId, label: c.label, hasCondition: !!c.condition })));
    }
    for (const connection of this.connections) {
      if (connection.condition && context.checkCondition(connection.condition)) {
        console.log(`[Beat.getNextBeat] ${this.id}: Using conditional connection \u2192 ${connection.targetId}`);
        return connection.targetId;
      }
    }
    const unconditional = this.connections.find((c) => !c.condition);
    if (unconditional) {
      console.log(`[Beat.getNextBeat] ${this.id}: Using unconditional connection \u2192 ${unconditional.targetId}`);
      return unconditional.targetId;
    }
    if (this.defaultTarget) {
      console.log(`[Beat.getNextBeat] ${this.id}: Falling back to defaultTarget \u2192 ${this.defaultTarget}`);
      return this.defaultTarget;
    }
    console.log(`[Beat.getNextBeat] ${this.id}: No next beat found`);
    return null;
  }
  /**
   * Process text with variable interpolation
   * Supports two syntaxes:
   * - $variableName$ (legacy ASML format)
   * - ${variableName} (modern format)
   *
   * Examples:
   * - "Hello $userName$!" -> "Hello John!"
   * - "You are ${role}!" -> "You are wizard!"
   */
  processText(text, context) {
    if (!text) return text;
    const whole = /^\s*@([A-Za-z0-9_-]+)\s*$/.exec(text);
    if (whole && typeof context.getMergedCharacter === "function") {
      const name = rolePlaceholderText(context.getMergedCharacter("@" + whole[1]), "name");
      if (name) return name;
    }
    const valueOf = (name) => {
      const v = context.getVariable(name);
      if (v !== void 0 && v !== null) return v;
      const c = context;
      if (typeof c.hasCounter === "function" && c.hasCounter(name) && typeof c.getCounter === "function") {
        return c.getCounter(name);
      }
      return void 0;
    };
    const sub = (match, name) => {
      const value = valueOf(name.trim());
      return value !== void 0 && value !== null ? String(value) : match;
    };
    text = text.replace(/\$\{\s*@([A-Za-z0-9_-]+)(?:\.([A-Za-z]+))?\s*\}/g, (match, role, key) => {
      const holder = typeof context.getMergedCharacter === "function" ? context.getMergedCharacter("@" + role) : void 0;
      return rolePlaceholderText(holder, key) ?? match;
    });
    text = text.replace(/\$\{([^}]+)\}/g, sub);
    text = text.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)\$/g, sub);
    text = text.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g, sub);
    return text;
  }
  /**
   * Character references this beat puts in front of the player: its speaker
   * (linked or free text), a linked characterRef, an AI conversation partner
   * (npcName) and characters placed on stage. Dialog-tree node speakers are
   * marked as each node shows (DialogTreeBeat). Unresolvable refs (a
   * narrator, "You") are ignored by the caller.
   */
  static featuredCharacterRefs(beat) {
    const refs = [];
    const params = beat.getParameters?.() ?? {};
    for (const r of [beat.characterRef, beat.speaker, params.characterRef, params.npcName]) {
      if (typeof r === "string" && r.trim()) refs.push(r.trim());
    }
    beat.locations?.forEach((loc) => {
      if (loc?.kind === "character" && typeof loc.characterId === "string" && loc.characterId) refs.push(loc.characterId);
    });
    return refs;
  }
  /**
   * Display name for a speaker site: the linked character's CURRENT name
   * (variant-merged, displayName before name) when `characterRef` resolves
   * to a defined character, else the stored free-text speaker unchanged.
   * Shared by Beat.execute and DialogTreeBeat's per-node speakers.
   */
  static linkedSpeakerName(characterRef, storedSpeaker, context) {
    const ref = characterRef || (isRoleRef(storedSpeaker) ? storedSpeaker : void 0);
    if (ref && context && typeof context.getMergedCharacter === "function") {
      const ch = context.getMergedCharacter(ref);
      const name = ch && (ch.displayName || ch.name);
      if (typeof name === "string" && name) return name;
    }
    return storedSpeaker || "";
  }
  /**
   * Resolve this beat's speaker against a list of defined characters.
   *
   * Priority: `characterRef` (when set and resolvable) → matches a Character by name
   * (case-insensitive) on the free-text `speaker` → free-text fallback. Returns:
   *   - `id`:         canonical Character.id, or null if no match
   *   - `name`:       display name to show (the resolved Character.displayName/name,
   *                   or the free-text speaker if there's no match)
   *   - `character`:  the full Character record when matched, else null
   *
   * Renderers and TTS routing should call this rather than reading `this.speaker`
   * directly, so dialog beats that point at a defined Character get a stable
   * identity even when the free-text speaker drifts.
   */
  getResolvedSpeaker(characters) {
    const resolved = this.characterRef ? resolveCharacter(this.characterRef, characters) : resolveCharacter(this.speaker, characters);
    if (resolved) {
      return {
        id: resolved.id,
        name: resolved.displayName || resolved.name || resolved.id,
        character: resolved
      };
    }
    return {
      id: null,
      name: this.speaker || "",
      character: null
    };
  }
  /**
   * Apply the effects of the stored link the story is leaving by. Several
   * links to the same beat: the first whose condition holds, else the first
   * unconditional one. Only STORED links (this.connections) — links derived
   * from choices/props/dialog carry effects on the option itself, applied
   * by that beat, so nothing fires twice.
   */
  applyTakenLinkEffects(nextBeatId, context) {
    if (!nextBeatId || !Array.isArray(this.connections)) return;
    const candidates = this.connections.filter((c) => c?.targetId === nextBeatId);
    if (candidates.length === 0) return;
    const taken = candidates.find((c) => c.condition && context.checkCondition(c.condition)) ?? candidates.find((c) => !c.condition) ?? candidates[0];
    if (!Array.isArray(taken.effects) || taken.effects.length === 0) return;
    for (const effect of taken.effects) {
      try {
        context.applyEffect(effect);
      } catch (err) {
        console.warn(`[Beat ${this.id}] Link effect failed:`, effect, err);
      }
    }
  }
  toJSON() {
    const storedConnections = [...this.connections];
    const parameters = {
      ...this.getParameters(),
      // Include animations in parameters so they're preserved during serialization
      ...this.animations && this.animations.length > 0 ? { animations: this.animations } : {},
      // Background fit is a base-class field (slot beats' getParameters
      // don't know it) — persist it here so it round-trips for every type.
      ...this.spatialFit === "contain" || this.spatialFit === "cover" ? { spatialFit: this.spatialFit } : {}
    };
    const json = {
      id: this.id,
      name: this.name,
      type: this.type,
      cluster: this.cluster,
      transition: this.transition,
      sound: this.sound,
      locations: Array.from(this.locations.values()),
      connections: storedConnections,
      defaultTarget: this.defaultTarget,
      defaultTargetDelay: this.defaultTargetDelay,
      showTimer: this.showTimer,
      x: this.x,
      y: this.y,
      node: this.node,
      notes: this.notes,
      speaker: this.speaker || void 0,
      characterRef: this.characterRef || void 0,
      showSpeaker: this.showSpeaker != null ? this.showSpeaker : void 0,
      timeDisplayMode: this.timeDisplayMode,
      timeDisplayText: this.timeDisplayText,
      overrideCountdownMeter: this.overrideCountdownMeter,
      explainHuds: this.explainHuds,
      // Persist state requirements as a top-level field (the constructor also
      // accepts them nested under parameters for backwards compatibility).
      ...this.requires && this.requires.length > 0 ? { requires: this.requires } : {},
      // Only persist requiresMode when it's non-default to keep JSON clean.
      ...this.requiresMode && this.requiresMode !== "all" ? { requiresMode: this.requiresMode } : {},
      parameters
    };
    return json;
  }
};
__publicField(_Beat, "PREFETCHABLE_TYPES", /* @__PURE__ */ new Set([
  "aiInfoText",
  "aiDurScreen",
  "aiDialogTree",
  "aiConversation",
  "aiSummary",
  "onlineContent"
]));
var Beat = _Beat;

// src/beats/TitleScreenBeat.ts
var TitleScreenBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "title");
    __publicField(this, "author");
    __publicField(this, "buttonText");
    /** Bug 26 — per-beat override for the spatial layer's fit. Schema
     *  declares 'contain' as the type-level default; authors can pick
     *  'cover' here for an immersive backdrop that fills the stage. */
    __publicField(this, "spatialFit");
    this.title = config.title || config.parameters?.title || "Untitled Story";
    this.author = config.author || config.parameters?.author;
    this.buttonText = config.buttonText || config.parameters?.buttonText;
    const fit = config.parameters?.spatialFit;
    this.spatialFit = fit === "cover" || fit === "contain" ? fit : void 0;
  }
  getParameters() {
    return {
      title: this.title,
      author: this.author,
      buttonText: this.buttonText,
      node: this.node,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations,
      spatialAnimations: this.spatialAnimations,
      spatialFit: this.spatialFit
    };
  }
  updateParameters(params) {
    if (params.title !== void 0) this.title = params.title;
    if (params.author !== void 0) this.author = params.author;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.node !== void 0) this.node = params.node;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
    if (params.spatialAnimations !== void 0) this.spatialAnimations = params.spatialAnimations;
    if (params.spatialFit !== void 0) {
      this.spatialFit = params.spatialFit === "cover" || params.spatialFit === "contain" ? params.spatialFit : void 0;
    }
  }
  async performAction(context, renderer) {
    renderer.setState("slotAnimations", this.slotAnimations);
    renderer.setState("spatialAnimations", this.spatialAnimations);
    renderer.setState("spatialFit", this.spatialFit);
    const locations = Array.from(this.locations.values());
    console.log(`[TitleScreenBeat] Rendering with ${locations.length} locations`);
    console.log(`[TitleScreenBeat] Background node: ${this.node || "none"}`);
    const processedTitle = this.processText(this.title, context);
    const processedAuthor = this.processText(this.author || "", context);
    const processedButtonText = this.processText(this.buttonText || "Start", context);
    await renderer.renderTitleScreen(processedTitle, processedAuthor, processedButtonText, locations);
    return this.getNextBeat(context);
  }
};

// src/beats/InfoTextBeat.ts
var InfoTextBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "text");
    __publicField(this, "textVariations");
    __publicField(this, "buttonText");
    __publicField(this, "locs");
    __publicField(this, "backgroundSound");
    this.text = config.text || config.parameters?.text || "";
    this.textVariations = config.textVariations || config.parameters?.textVariations;
    this.buttonText = config.buttonText || config.parameters?.buttonText;
    this.locs = config.locs || config.parameters?.locs || [];
    this.backgroundSound = config.backgroundSound || config.parameters?.backgroundSound;
  }
  getParameters() {
    const params = {
      text: this.text,
      buttonText: this.buttonText,
      node: this.node,
      backgroundSound: this.backgroundSound,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
    if (this.textVariations && this.textVariations.length > 0) {
      params.textVariations = this.textVariations;
    }
    if (this.locs && this.locs.length > 0) {
      params.locs = this.locs;
    }
    return params;
  }
  updateParameters(params) {
    if (params.text !== void 0) this.text = params.text;
    if (params.textVariations !== void 0) this.textVariations = params.textVariations;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.node !== void 0) this.node = params.node;
    if (params.locs !== void 0) this.locs = params.locs;
    if (params.backgroundSound !== void 0) this.backgroundSound = params.backgroundSound;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  /**
   * Select text from variations (if any) or return main text.
   * Combines main text with variations array for random selection.
   */
  selectText() {
    if (this.textVariations && this.textVariations.length > 0) {
      const allOptions = [this.text, ...this.textVariations];
      const randomIndex = Math.floor(Math.random() * allOptions.length);
      return allOptions[randomIndex];
    }
    return this.text;
  }
  async performAction(context, renderer) {
    const selectedText = this.selectText();
    const processedText = this.processText(selectedText, context);
    const processedButtonText = this.processText(this.buttonText || "Continue", context);
    renderer.setState("currentBeatType", "infoText");
    renderer.setState("slotAnimations", this.slotAnimations);
    const locations = Array.from(this.locations.values());
    await renderer.renderText(processedText, processedButtonText, locations);
    return this.getNextBeat(context);
  }
};

// src/beats/ExplanationBeat.ts
var ExplanationBeat = class extends Beat {
  constructor(config) {
    super(config);
    /** Intro copy shown in the beat's own text box. */
    __publicField(this, "text");
    /** Continue button label. */
    __publicField(this, "buttonText");
    /**
     * Per-HUD-kind caption overrides. Authored as individual `caption*` string
     * params (so they render with the generic schema control AND get picked up
     * by the translation extractors like any other player-facing copy); an
     * explicit `captions` object is still accepted and wins, for AI-generated
     * and programmatically-built stories.
     */
    __publicField(this, "captions");
    __publicField(this, "captionTimer");
    __publicField(this, "captionCountdown");
    __publicField(this, "captionMeter");
    __publicField(this, "captionInventory");
    __publicField(this, "captionMood");
    /** HUD kinds to leave unannotated (author opted out of explaining them). */
    __publicField(this, "skipKinds");
    __publicField(this, "locs");
    const p = config.parameters || {};
    this.text = config.text ?? p.text ?? "";
    this.buttonText = config.buttonText ?? p.buttonText;
    this.captions = config.captions ?? p.captions;
    this.captionTimer = config.captionTimer ?? p.captionTimer;
    this.captionCountdown = config.captionCountdown ?? p.captionCountdown;
    this.captionMeter = config.captionMeter ?? p.captionMeter;
    this.captionInventory = config.captionInventory ?? p.captionInventory;
    this.captionMood = config.captionMood ?? p.captionMood;
    this.skipKinds = config.skipKinds ?? p.skipKinds;
    this.locs = config.locs || p.locs || [];
  }
  /**
   * The caption map the host actually renders: authored per-kind strings,
   * with an explicit `captions` object taking precedence. Blank entries are
   * dropped so the layer falls back to its built-in wording.
   */
  get resolvedCaptions() {
    const out = {};
    const pairs = [
      ["timer", this.captionTimer],
      ["countdown", this.captionCountdown],
      ["meter", this.captionMeter],
      ["inventory", this.captionInventory],
      ["mood", this.captionMood]
    ];
    for (const [kind, text] of pairs) {
      if (text && text.trim()) out[kind] = text;
    }
    return { ...out, ...this.captions || {} };
  }
  getParameters() {
    const params = {
      text: this.text,
      buttonText: this.buttonText,
      node: this.node,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
    if (this.captions && Object.keys(this.captions).length > 0) {
      params.captions = this.captions;
    }
    if (this.captionTimer) params.captionTimer = this.captionTimer;
    if (this.captionCountdown) params.captionCountdown = this.captionCountdown;
    if (this.captionMeter) params.captionMeter = this.captionMeter;
    if (this.captionInventory) params.captionInventory = this.captionInventory;
    if (this.captionMood) params.captionMood = this.captionMood;
    if (this.skipKinds && this.skipKinds.length > 0) {
      params.skipKinds = this.skipKinds;
    }
    if (this.locs && this.locs.length > 0) {
      params.locs = this.locs;
    }
    return params;
  }
  updateParameters(params) {
    if (params.text !== void 0) this.text = params.text;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.captions !== void 0) this.captions = params.captions;
    if (params.captionTimer !== void 0) this.captionTimer = params.captionTimer;
    if (params.captionCountdown !== void 0) this.captionCountdown = params.captionCountdown;
    if (params.captionMeter !== void 0) this.captionMeter = params.captionMeter;
    if (params.captionInventory !== void 0) this.captionInventory = params.captionInventory;
    if (params.captionMood !== void 0) this.captionMood = params.captionMood;
    if (params.skipKinds !== void 0) this.skipKinds = params.skipKinds;
    if (params.node !== void 0) this.node = params.node;
    if (params.locs !== void 0) this.locs = params.locs;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  async performAction(context, renderer) {
    const processedText = this.processText(this.text, context);
    const processedButtonText = this.processText(this.buttonText || "Got it", context);
    renderer.setState("currentBeatType", "explanation");
    renderer.setState("slotAnimations", this.slotAnimations);
    const locations = Array.from(this.locations.values());
    await renderer.renderText(processedText, processedButtonText, locations);
    return this.getNextBeat(context);
  }
};

// src/layout/elementSizing.ts
var FONT_FAMILIES = {
  "System": 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  "Arial": "Arial, sans-serif",
  "Helvetica": "Helvetica, Arial, sans-serif",
  "Times New Roman": "Times New Roman, serif",
  "Courier New": "Courier New, monospace",
  "Georgia": "Georgia, serif",
  "Verdana": "Verdana, sans-serif",
  "Gothic": "Georgia, serif",
  "Handwriting": "Brush Script MT, cursive",
  "Handwriting2": "Lucida Handwriting, cursive",
  "Comic Sans MS": "Comic Sans MS, cursive",
  "Impact": "Impact, sans-serif",
  "Trebuchet MS": "Trebuchet MS, sans-serif",
  "Palatino": "Palatino Linotype, Book Antiqua, Palatino, serif"
};
function getFontFamily(fontName) {
  return FONT_FAMILIES[fontName] || fontName;
}
function measureTextWidth(text, fontSize, fontFamily = "Arial") {
  if (typeof document === "undefined") {
    return text.length * fontSize * 0.55;
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return text.length * fontSize * 0.55;
  }
  context.font = `${fontSize}px ${getFontFamily(fontFamily)}`;
  return context.measureText(text).width;
}
function calculateButtonDimensions(text, fontSize = 16, fontFamily = "Arial", maxWidth = 614) {
  const textWidth = measureTextWidth(text, fontSize, fontFamily);
  const horizontalPadding = 40;
  const verticalPadding = 24;
  const lineHeight = 1.4;
  const charWidth = fontSize * 0.6;
  const minWidth = 120;
  const contentWidth = textWidth + horizontalPadding;
  const width = Math.max(minWidth, Math.min(contentWidth, maxWidth));
  const availableWidth = width - horizontalPadding;
  const charsPerLine = Math.max(1, Math.floor(availableWidth / charWidth));
  const numLines = Math.max(1, Math.ceil(text.length / charsPerLine));
  const height = numLines * fontSize * lineHeight + verticalPadding;
  return {
    width: Math.round(width),
    height: Math.round(height)
  };
}
function calculateButtonHeightInColumn(text, fontSize, fontFamily, columnWidth) {
  const horizontalPadding = 40;
  const verticalPadding = 24;
  const contentWidth = Math.max(1, columnWidth - horizontalPadding);
  const width = (t) => measureTextWidth(t, fontSize, fontFamily) * 1.06;
  const space = width(" ");
  let lines = 0;
  for (const paragraph of (text || "").split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    lines += 1;
    let used = 0;
    for (const word of words) {
      const w = width(word);
      if (used === 0) {
        used = w;
        continue;
      }
      if (used + space + w <= contentWidth) used += space + w;
      else {
        lines += 1;
        used = w;
      }
    }
  }
  return Math.round(Math.max(1, lines) * fontSize * 1.4 + verticalPadding);
}

// src/layout/dialogTreeLayout.ts
var DEFAULT_DIALOG_TREE_THEME = {
  fontSize: 16,
  fontFamily: "Arial",
  padding: 20,
  maxTextWidthRatio: 0.8,
  maxButtonWidthRatio: 0.6,
  textButtonGap: 20,
  buttonGap: 16,
  startY: 50
};
function computeDialogTreeLayout(input) {
  const { phase, stageWidth, stageHeight, theme, overrides, storedLocations } = input;
  const t = { ...DEFAULT_DIALOG_TREE_THEME, ...theme };
  const lineHeight = 1.4;
  const contentPadding = t.padding * 2;
  const text = phase.text || "";
  const textWidth = text.length * t.fontSize * 0.55;
  const maxTextWidth = stageWidth * t.maxTextWidthRatio;
  let textBoxWidth;
  let textBoxHeight;
  if (textWidth + contentPadding <= maxTextWidth) {
    textBoxWidth = Math.max(200, Math.min(textWidth + contentPadding, maxTextWidth));
    textBoxHeight = t.fontSize * lineHeight + contentPadding;
  } else {
    textBoxWidth = maxTextWidth;
    const availableWidth = maxTextWidth - contentPadding;
    const avgCharWidth = t.fontSize * 0.55;
    const charsPerLine = Math.floor(availableWidth / avgCharWidth);
    const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
    textBoxHeight = lines * t.fontSize * lineHeight + contentPadding;
  }
  const textCenterX = (stageWidth - textBoxWidth) / 2;
  let storedDialogPosition;
  if (storedLocations && storedLocations.size > 0) {
    storedLocations.forEach((loc) => {
      const isDialogLike = (loc.kind === "dialog" || loc.kind === "text") && !loc.name?.match(/^(choice|button)/i);
      if (isDialogLike && !storedDialogPosition) {
        storedDialogPosition = { x: loc.x, y: loc.y, width: loc.width, height: loc.height };
      }
    });
  }
  const npcOverride = overrides?.["npc"];
  const dialog = {
    id: "npc",
    kind: "dialog",
    content: text,
    speaker: phase.speaker,
    x: npcOverride?.x ?? storedDialogPosition?.x ?? textCenterX,
    y: npcOverride?.y ?? storedDialogPosition?.y ?? t.startY,
    width: npcOverride?.width ?? storedDialogPosition?.width ?? textBoxWidth,
    height: npcOverride?.height ?? storedDialogPosition?.height ?? textBoxHeight,
    z: npcOverride?.z
    // z-index from override, undefined if not set
  };
  const finalDialogY = dialog.y;
  const finalDialogHeight = dialog.height;
  const buttonStartY = finalDialogY + finalDialogHeight + t.textButtonGap;
  const maxButtonWidth = stageWidth * t.maxButtonWidthRatio;
  const choices = phase.choices || [];
  const initialButtonDimensions = choices.map((choice) => {
    const btnText = choice.text || "";
    return calculateButtonDimensions(btnText, t.fontSize, t.fontFamily, maxButtonWidth);
  });
  const uniformButtonWidth = choices.length > 0 ? Math.min(Math.max(200, ...initialButtonDimensions.map((d) => d.width)), maxButtonWidth) : 200;
  const existingButtons = [];
  if (storedLocations && storedLocations.size > 0) {
    storedLocations.forEach((loc) => {
      if (loc.kind === "button") {
        existingButtons.push({ x: loc.x, y: loc.y, width: loc.width, height: loc.height, stackY: loc.stackY });
      }
    });
  }
  const overrideButtons = Object.keys(overrides ?? {}).map((key) => ({ key, m: /^choice_(\d+)$/.exec(key) })).filter((e) => e.m).sort((a, b) => Number(a.m[1]) - Number(b.m[1])).map((e) => overrides[e.key]);
  const columnSource = [...overrideButtons, ...existingButtons].find(
    (b) => b && typeof b.x === "number" && typeof b.width === "number"
  );
  const columnWidth = columnSource?.width ?? uniformButtonWidth;
  const columnX = columnSource?.x ?? (stageWidth - columnWidth) / 2;
  const stackSource = [...overrideButtons, ...existingButtons].find(
    (b) => b && typeof b.stackY === "number"
  );
  const buttons = [];
  let currentY = stackSource?.stackY ?? buttonStartY;
  choices.forEach((choice, idx) => {
    const buttonHeight = calculateButtonHeightInColumn(choice.text || "", t.fontSize, t.fontFamily, columnWidth);
    buttons.push({
      id: `choice_${idx}`,
      kind: "button",
      content: choice.text || "",
      x: columnX,
      y: currentY,
      width: columnWidth,
      height: buttonHeight,
      z: overrides?.[`choice_${idx}`]?.z
      // z-index from override, undefined if not set
    });
    currentY += buttonHeight + t.buttonGap;
  });
  const output = {
    dialog,
    buttons,
    toLocations() {
      const locations = [];
      locations.push({
        kind: "dialog",
        name: "npc",
        x: dialog.x,
        y: dialog.y,
        width: dialog.width,
        height: dialog.height
      });
      buttons.forEach((btn) => {
        locations.push({
          kind: "button",
          name: btn.content || `Choice`,
          x: btn.x,
          y: btn.y,
          width: btn.width,
          height: btn.height
        });
      });
      return locations;
    },
    toVisualElements() {
      const elements = [];
      elements.push({
        id: dialog.id,
        type: "dialog",
        name: `NPC: ${dialog.speaker || "Character"}`,
        text: dialog.content,
        speaker: dialog.speaker,
        x: dialog.x,
        y: dialog.y,
        width: dialog.width,
        height: dialog.height,
        z: dialog.z ?? 0,
        rotation: 0,
        scale: 1,
        visible: true,
        locked: false,
        font: t.fontFamily,
        fontSize: t.fontSize
      });
      buttons.forEach((btn, idx) => {
        elements.push({
          id: btn.id,
          type: "button",
          name: `Choice ${idx}`,
          text: btn.content,
          x: btn.x,
          y: btn.y,
          width: btn.width,
          height: btn.height,
          z: btn.z ?? idx + 1,
          // Default to incremental z if not set
          rotation: 0,
          scale: 1,
          visible: true,
          locked: false,
          font: t.fontFamily,
          fontSize: t.fontSize
        });
      });
      return elements;
    }
  };
  return output;
}

// src/migration/effectsMigration.ts
function migrateChoiceEffects(choice) {
  if (!choice) return choice;
  const existingEffects = Array.isArray(choice.effects) ? choice.effects.filter((e) => e.type !== "counter") : [];
  if (choice.counter) {
    const counterName = choice.counter;
    const operation = choice.counterOperation || "change";
    const value = choice.counterValue ?? 1;
    const alreadyHasCanonical = existingEffects.some(
      (e) => (e.type === "incrementCounter" || e.type === "setCounter") && e.target === counterName
    );
    if (!alreadyHasCanonical) {
      if (operation === "set") {
        existingEffects.push({
          type: "setCounter",
          target: counterName,
          value
        });
      } else {
        existingEffects.push({
          type: "incrementCounter",
          target: counterName,
          value
        });
      }
    }
    delete choice.counter;
    delete choice.counterOperation;
    delete choice.counterValue;
  }
  if (existingEffects.length > 0) {
    choice.effects = existingEffects;
  }
  return choice;
}
function migrateDialogTreeEffects(node) {
  if (!node) return;
  if (node.choices && Array.isArray(node.choices)) {
    for (const choice of node.choices) {
      migrateChoiceEffects(choice);
      if (choice.dialogNode) {
        migrateDialogTreeEffects(choice.dialogNode);
      }
    }
  }
}

// src/utils/ttsWait.ts
async function waitForTTS(renderer, pollInterval = 200, postPause = 500) {
  const ttsService = renderer.getState("ttsService");
  if (ttsService?.isSpeaking?.()) {
    while (ttsService.isSpeaking()) {
      await new Promise((r) => setTimeout(r, pollInterval));
    }
    await new Promise((r) => setTimeout(r, postPause));
  }
}
async function waitForReadingTime(renderer, text, minDelayMs = 2e3) {
  const ttsService = renderer.getState("ttsService");
  if (ttsService?.isEnabled?.()) {
    return;
  }
  const wordCount = text.split(/\s+/).length;
  const readingDelayMs = Math.max(minDelayMs, wordCount / 200 * 60 * 1e3);
  await new Promise((r) => setTimeout(r, readingDelayMs));
}

// src/i18n/uiStrings.ts
var UI_STRING_DEFAULTS = {
  // Default button labels (renderer fallbacks when a beat param is empty)
  continue: "Continue",
  playAgain: "Play Again",
  credits: "Credits",
  yourJourney: "Your Journey",
  // Conversation input (aiConversation / chat views)
  typeYourResponse: "Type your response...",
  listening: "Listening...",
  // Message history (conversations played so far)
  messagesTitle: "Messages",
  messagesEmpty: "No conversations yet.",
  messagesBack: "Back",
  messagesClose: "Close",
  // Inventory HUD chrome
  inventoryTitle: "Inventory",
  inventoryExpandHint: "{title} ({count} items) - click to expand",
  // Image-input beat picker
  imagePickBoth: "Take or choose a photo",
  imagePickCamera: "Take a photo",
  imagePickUpload: "Choose an image",
  imageProcessing: "Processing\u2026",
  imageReadError: "Could not read that image \u2014 please try another one.",
  imageRetakeHint: "Tap to choose a different image",
  // AI-beat loading messages (emitted hardcoded by core beats; matched
  // by translateLoadingMessage below)
  loadingPreparingConversation: "Preparing conversation with {name}...",
  loadingGettingReady: "{name} is getting ready to speak...",
  loadingSettingUp: "Setting up the conversation...",
  loadingConnecting: "Let me connect you with {name}...",
  loadingThinking: "Thinking...",
  loadingFetching: "Fetching data...",
  loadingSearching: "Let me search for that...",
  loadingSearchingInternet: "Searching the internet for you...",
  loadingFindOutMore: "Let me find out more...",
  loadingLookingUp: "Looking that up for you...",
  loadingReflect: "Let me reflect on your journey...",
  loadingSummarizing: "Summarizing your experience...",
  loadingReviewing: "Reviewing your choices...",
  loadingCreatingSummary: "Creating your personal summary...",
  loadingGeneratingDialog: "Generating personalized dialog",
  loadingGeneratingResponse: "Generating response",
  loadingRetrieving: "Please wait while I retrieve the information",
  loadingMoment: "This may take a moment",
  loadingJustAMoment: "This will just take a moment",
  // Location beats: finding the player, placing points, waiting for a fix
  gpsLocating: "Finding your location\u2026",
  gpsPlacingPoints: "Placing the points on the map\u2026",
  gpsWaiting: "Waiting for GPS\u2026",
  gpsWaitingHint: "Step outside or near a window. The story continues as soon as your position comes in.",
  gpsContinueWithout: "Continue without location",
  // Map beats when the map images can't load (no internet)
  mapOffline: "Map unavailable offline \u2014 the pins and your position still work."
};
var current = { ...UI_STRING_DEFAULTS };
function uiString(key) {
  return current[key];
}

// src/beats/DialogTreeBeat.ts
function normalizeDialogTreeLayoutTemplate(v) {
  if (v === "stacked" || v === "conversation" || v === "chat-scroll" || v === "chat-bubble" || v === "custom") {
    return v;
  }
  return "stacked";
}
function validChatWindow(v) {
  if (!v || typeof v !== "object") return void 0;
  const r = { x: Number(v.x), y: Number(v.y), width: Number(v.width), height: Number(v.height) };
  return [r.x, r.y, r.width, r.height].every(Number.isFinite) && r.width > 0 && r.height > 0 ? r : void 0;
}
function isChatLayoutTemplate(template) {
  return template === "chat-scroll" || template === "chat-bubble";
}
var DIALOG_CHAT_RESPONSE_DELAY = 1.5;
function isLegacyContinueChoice(choice) {
  return !choice.continue && (choice.id === "auto_continue" || choice.text?.trim() === "[Continue]");
}
function continueStepOf(visibleChoices) {
  return visibleChoices.find((c) => c.continue === true);
}
var DialogTreeBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "dialogTree");
    __publicField(this, "speaker");
    __publicField(this, "text");
    __publicField(this, "emotion");
    __publicField(this, "choiceDelay");
    // Delay in seconds before showing choices
    __publicField(this, "responseDelay");
    // Delay in seconds before NPC responds (for natural chat pacing)
    /** Whether a line a character says without the player answering
     *  (continue step, NPC farewell) shows a Continue button. Unset = true. */
    __publicField(this, "allowSkipAhead");
    __publicField(this, "markVisited");
    // Block and dim choices leading to previously visited beats
    // Opt-in: effects (counters/variables/inventory) fire only the FIRST
    // time a given choice is selected; the choice itself stays selectable.
    // The re-viewable-but-once-scored middle ground between markVisited
    // (dim + block) and default repeat-fire (bake-off finding 2026-09-04:
    // re-examining evidence kept re-scoring suspicion counters).
    __publicField(this, "effectsOncePerChoice");
    __publicField(this, "backgroundUrl");
    // Direct URL for background from ASML import
    __publicField(this, "backgroundAssetId");
    // Asset ID for background
    __publicField(this, "phaseOverrides");
    // Per-phase visual element overrides
    /** Authoritative layout field as of v0.9.62. The legacy presentationMode
     *  value lives below for one release cycle so legacy data deserializes
     *  cleanly; the constructor and updateParameters() migrate it forward. */
    __publicField(this, "layoutTemplate");
    /** @deprecated v0.9.62 — read from layoutTemplate instead. Kept on the
     *  instance only to surface the legacy value during getParameters() so
     *  ASML / ZIP exports keep round-tripping on the old field name until
     *  v0.9.63 strips it. New writes should target layoutTemplate. */
    __publicField(this, "presentationMode");
    __publicField(this, "showAvatars");
    // Show character avatars in chat mode
    /** Chat templates: where the conversation sits on the stage (stage px);
     *  unset = the whole stage. A messenger look needs room around it. */
    __publicField(this, "chatWindow");
    /** Chat templates: a picture drawn behind the chat — e.g. a phone or
     *  messenger screen with its buttons — that the chat window sits in. */
    __publicField(this, "chatFrameImage");
    __publicField(this, "spatialFit");
    // Bug 26 — per-beat background fit
    __publicField(this, "currentNode", null);
    const dialogTreeParam = config.dialogTree || config.parameters?.dialogTree;
    this.choiceDelay = config.choiceDelay || config.parameters?.choiceDelay;
    this.responseDelay = config.parameters?.responseDelay;
    this.allowSkipAhead = config.parameters?.allowSkipAhead;
    this.markVisited = config.markVisited ?? config.parameters?.markVisited ?? false;
    this.effectsOncePerChoice = config.effectsOncePerChoice ?? config.parameters?.effectsOncePerChoice ?? false;
    this.phaseOverrides = config.parameters?.phaseOverrides;
    const legacyPM = config.parameters?.presentationMode;
    const legacyMigrated = legacyPM === "positioned" ? "stacked" : legacyPM === "chat-scroll" ? "chat-scroll" : legacyPM === "chat-bubble" ? "chat-bubble" : void 0;
    const rawTemplate = config.layoutTemplate ?? config.parameters?.layoutTemplate ?? legacyMigrated;
    this.layoutTemplate = normalizeDialogTreeLayoutTemplate(rawTemplate);
    this.presentationMode = legacyPM;
    this.showAvatars = config.parameters?.showAvatars ?? true;
    this.chatWindow = validChatWindow(config.parameters?.chatWindow);
    this.chatFrameImage = config.parameters?.chatFrameImage || void 0;
    const fit = config.parameters?.spatialFit ?? config.spatialFit;
    this.spatialFit = fit === "cover" || fit === "contain" ? fit : void 0;
    if (dialogTreeParam) {
      this.dialogTree = this.migrateDialogTree(dialogTreeParam);
      this.speaker = config.parameters?.speaker || this.dialogTree.speaker;
      this.text = config.parameters?.text || this.dialogTree.text;
      this.emotion = config.parameters?.emotion || this.dialogTree.emotion;
    } else {
      this.speaker = config.parameters?.speaker || "Character";
      this.text = config.parameters?.text || "Hello!";
      this.emotion = config.parameters?.emotion || "neutral";
      this.dialogTree = {
        id: "root",
        speaker: this.speaker,
        text: this.text,
        emotion: this.emotion,
        choices: []
      };
    }
  }
  /**
   * Migrate old dialogTree format to new simplified format
   * Old: choice.target could be DialogNode, node.next could exist
   * New: choice.dialogNode for nested nodes, choice.target only for beat IDs
   */
  migrateDialogTree(node) {
    if (!node) return { id: "root", speaker: "", text: "", choices: [] };
    const { next: _legacyNext, choices: _choices, ...nodeRest } = node;
    const migrated = {
      ...nodeRest,
      id: node.id || "root",
      speaker: node.speaker || "",
      // Preserve characterRef across migrations and nested-node deep walks so
      // pre-promoted dialog trees keep their canonical speaker identity.
      ...node.characterRef ? { characterRef: node.characterRef } : {},
      text: node.text || "",
      emotion: node.emotion,
      // The line's character state ("angry") — see performAction.
      ...node.speakerState ? { speakerState: node.speakerState } : {},
      conditions: node.conditions,
      effects: node.effects,
      choices: [],
      target: typeof node.target === "string" ? node.target : void 0
    };
    if (node.choices && Array.isArray(node.choices)) {
      migrated.choices = node.choices.map((choice) => {
        const { target: _target, dialogNode: _dialogNode, ...choiceRest } = choice;
        const migratedChoice = {
          ...choiceRest,
          id: choice.id,
          text: choice.text,
          conditions: choice.conditions,
          effects: choice.effects,
          visible: choice.visible
        };
        if (choice.counter) migratedChoice.counter = choice.counter;
        if (choice.counterOperation) migratedChoice.counterOperation = choice.counterOperation;
        if (choice.counterValue !== void 0) migratedChoice.counterValue = choice.counterValue;
        if (choice.soundEffect) migratedChoice.soundEffect = choice.soundEffect;
        if (choice.hotspot) migratedChoice.hotspot = choice.hotspot;
        if (choice.continue === true) migratedChoice.continue = true;
        if (typeof choice.target === "string") {
          migratedChoice.target = choice.target;
        } else if (typeof choice.target === "object" && choice.target) {
          migratedChoice.dialogNode = this.migrateDialogTree(choice.target);
        }
        if (choice.dialogNode) {
          migratedChoice.dialogNode = this.migrateDialogTree(choice.dialogNode);
        }
        return migratedChoice;
      });
    }
    if (node.next) {
      if (typeof node.next === "string") {
        migrated.choices.push({
          id: "auto_continue",
          text: "[Continue]",
          target: node.next
        });
      } else if (typeof node.next === "object") {
        migrated.choices.push({
          id: "auto_continue",
          text: "[Continue]",
          dialogNode: this.migrateDialogTree(node.next)
        });
      }
    }
    if (migrated.choices.length === 1 && isLegacyContinueChoice(migrated.choices[0])) {
      migrated.choices[0] = { ...migrated.choices[0], text: "", continue: true };
    }
    migrateDialogTreeEffects(migrated);
    return migrated;
  }
  /**
   * Override getConnections to extract all connections from the dialog tree
   * New format: choice.target is beat ID (string), choice.dialogNode is nested node
   */
  getConnections() {
    const connections = [];
    const seenConnections = /* @__PURE__ */ new Set();
    if (!this.dialogTree) {
      console.warn("[DialogTreeBeat] dialogTree is undefined for beat", this.id);
      return super.getConnections();
    }
    const extractFromNode = (node, depth = 0) => {
      if (!node || depth > 20) {
        if (depth > 20) {
          console.warn("[DialogTreeBeat] Max recursion depth reached for beat", this.id);
        }
        return;
      }
      try {
        if (node.target && typeof node.target === "string" && node.target !== "__self__") {
          const connectionKey = `${node.target}-[NPC exit]`;
          if (!seenConnections.has(connectionKey)) {
            seenConnections.add(connectionKey);
            connections.push({
              targetId: node.target,
              label: `[NPC exit] ${node.speaker || "NPC"}`
            });
          }
        }
        if (node.choices && Array.isArray(node.choices)) {
          node.choices.forEach((choice) => {
            if (!choice) return;
            if (choice.target && typeof choice.target === "string" && choice.target !== "__self__") {
              const connectionKey = `${choice.target}-${choice.text || ""}`;
              if (!seenConnections.has(connectionKey)) {
                seenConnections.add(connectionKey);
                connections.push({
                  targetId: choice.target,
                  label: choice.text || "Choice"
                });
              }
            }
            if (choice.dialogNode) {
              extractFromNode(choice.dialogNode, depth + 1);
            }
          });
        }
      } catch (error) {
        console.error("[DialogTreeBeat] Error extracting connections:", error);
      }
    };
    try {
      extractFromNode(this.dialogTree, 0);
    } catch (error) {
      console.error("[DialogTreeBeat] Fatal error in getConnections:", error);
    }
    try {
      const baseConnections = super.getConnections();
      baseConnections.forEach((conn) => {
        const connectionKey = `${conn.targetId}-${conn.label || ""}`;
        if (!seenConnections.has(connectionKey)) {
          seenConnections.add(connectionKey);
          connections.push(conn);
        }
      });
    } catch (error) {
      console.error("[DialogTreeBeat] Error getting base connections:", error);
    }
    return connections;
  }
  /**
   * The wait on a line a character says without the player answering
   * (continue step, NPC farewell): TTS plus reading time, never a frozen
   * screen. With skipping allowed (default) a Continue button renders at
   * once and whichever fires first wins; the un-clicked renderChoices
   * promise is abandoned on timer win and the next render replaces it.
   * With skipping off, the line is drawn without a button (empty choice
   * list: slot layouts only paint the line in renderChoices) and the
   * player waits for their turn.
   */
  async waitOnNpcLine(renderer, text, continueId, locations) {
    const advanceTimer = (async () => {
      await waitForTTS(renderer);
      await waitForReadingTime(renderer, text);
    })();
    const choices = this.allowSkipAhead === false ? [] : [{ id: continueId, text: uiString("continue"), isExit: true, isContinue: true }];
    const continueClick = Promise.resolve().then(() => renderer.renderChoices(choices, locations)).catch(() => new Promise(() => {
    }));
    await (choices.length ? Promise.race([advanceTimer, continueClick]) : advanceTimer);
  }
  getParameters() {
    const dt = this.dialogTree || { id: "root", speaker: "", text: "", choices: [] };
    dt.speaker = this.speaker;
    dt.text = this.text;
    if (this.emotion) dt.emotion = this.emotion;
    return {
      dialogTree: dt,
      // Do NOT include speaker/text/emotion separately - they're in dialogTree
      node: this.node,
      choiceDelay: this.choiceDelay,
      responseDelay: this.responseDelay,
      allowSkipAhead: this.allowSkipAhead,
      markVisited: this.markVisited,
      effectsOncePerChoice: this.effectsOncePerChoice,
      backgroundUrl: this.backgroundUrl,
      backgroundAssetId: this.backgroundAssetId,
      phaseOverrides: this.phaseOverrides,
      layoutTemplate: this.layoutTemplate,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations,
      // Continue to emit the legacy presentationMode for one release so
      // older ASML / ZIP readers don't blow up; v0.9.63 will drop it.
      presentationMode: this.presentationMode,
      showAvatars: this.showAvatars,
      ...this.chatWindow ? { chatWindow: this.chatWindow } : {},
      ...this.chatFrameImage ? { chatFrameImage: this.chatFrameImage } : {},
      spatialFit: this.spatialFit
    };
  }
  updateParameters(params) {
    this._version++;
    if (params.dialogTree !== void 0) {
      this.dialogTree = this.migrateDialogTree(params.dialogTree);
      if (this.dialogTree.speaker !== void 0) this.speaker = this.dialogTree.speaker;
      if (this.dialogTree.text !== void 0) this.text = this.dialogTree.text;
      if (this.dialogTree.emotion !== void 0) this.emotion = this.dialogTree.emotion;
    }
    if (params.speaker !== void 0) this.speaker = params.speaker;
    if (params.text !== void 0) this.text = params.text;
    if (params.emotion !== void 0) this.emotion = params.emotion;
    if (params.node !== void 0) this.node = params.node;
    if (params.choiceDelay !== void 0) this.choiceDelay = params.choiceDelay;
    if (params.responseDelay !== void 0) this.responseDelay = params.responseDelay;
    if (params.allowSkipAhead !== void 0) this.allowSkipAhead = params.allowSkipAhead;
    if (params.markVisited !== void 0) this.markVisited = params.markVisited;
    if (params.effectsOncePerChoice !== void 0) this.effectsOncePerChoice = params.effectsOncePerChoice;
    if (params.backgroundUrl !== void 0) this.backgroundUrl = params.backgroundUrl;
    if (params.backgroundAssetId !== void 0) this.backgroundAssetId = params.backgroundAssetId;
    if (params.phaseOverrides !== void 0) this.phaseOverrides = params.phaseOverrides;
    if (params.layoutTemplate !== void 0) {
      this.layoutTemplate = normalizeDialogTreeLayoutTemplate(params.layoutTemplate);
    } else if (params.presentationMode !== void 0) {
      this.presentationMode = params.presentationMode;
      this.layoutTemplate = params.presentationMode === "chat-scroll" ? "chat-scroll" : params.presentationMode === "chat-bubble" ? "chat-bubble" : "stacked";
    }
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
    if (params.showAvatars !== void 0) this.showAvatars = params.showAvatars;
    if (params.chatWindow !== void 0) this.chatWindow = validChatWindow(params.chatWindow);
    if (params.chatFrameImage !== void 0) this.chatFrameImage = params.chatFrameImage || void 0;
    if (params.spatialFit !== void 0) {
      this.spatialFit = params.spatialFit === "cover" || params.spatialFit === "contain" ? params.spatialFit : void 0;
    }
    if (this.dialogTree && typeof this.dialogTree === "object") {
      this.dialogTree.speaker = this.speaker;
      this.dialogTree.text = this.text;
      if (this.emotion) {
        this.dialogTree.emotion = this.emotion;
      }
    }
  }
  /**
   * Override toJSON to ensure dialogTree is safely serialized
   * NOTE: We rely on getParameters() to include all dialog data in the 'parameters' object.
   * We do NOT add dialogTree/speaker/text/emotion at the top level to avoid duplication.
   * The base toJSON() already includes parameters: this.getParameters().
   */
  toJSON() {
    return super.toJSON();
  }
  async performAction(context, renderer) {
    renderer.setState("currentBeatType", "dialogTree");
    renderer.setState("markVisited", this.markVisited || false);
    if (renderer.setVisitedChoiceIds) {
      renderer.setVisitedChoiceIds(context.getVisitedChoicesForBeat(this.id));
    }
    renderer.setState("layoutTemplate", this.layoutTemplate);
    renderer.setState("presentationMode", isChatLayoutTemplate(this.layoutTemplate) ? this.layoutTemplate : "positioned");
    renderer.setState("spatialFit", this.spatialFit);
    renderer.setState("showAvatars", this.showAvatars ?? true);
    renderer.setState("chatWindow", this.chatWindow ?? null);
    renderer.setState("chatFrameImage", this.chatFrameImage ?? null);
    const isChatMode = isChatLayoutTemplate(this.layoutTemplate);
    const defaultDelay = isChatMode ? DIALOG_CHAT_RESPONSE_DELAY : 0;
    renderer.setState("responseDelay", this.responseDelay ?? defaultDelay);
    const variables = context.getVariables();
    const playerName = variables.playerName || variables.name || variables.player || "You";
    renderer.setState("playerName", playerName);
    if (isChatMode) {
      if (renderer.clearChatHistory) {
        renderer.clearChatHistory();
      }
    }
    this.currentNode = this.dialogTree;
    context.beginConversation(this.id);
    const baseLocations = Array.from(this.locations.values());
    let exitTargetBeatId = null;
    let nodePath = "root";
    while (this.currentNode) {
      const phaseId = this.currentNode.id || "root";
      const phaseOverrides = this.phaseOverrides?.[phaseId];
      const isDialogLoc = (loc) => loc.kind === "dialog" || loc.kind === "text" && !loc.name?.match(/^(choice|button)/i);
      let locations = baseLocations.filter(
        (loc) => loc.kind !== "dialog" && loc.kind !== "button" && !isDialogLoc(loc)
      );
      const rendererLayoutTheme = renderer.getState?.("layoutTheme");
      const layoutTheme = rendererLayoutTheme || {
        fontSize: 16,
        fontFamily: "Arial",
        padding: 20,
        maxTextWidthRatio: 0.8,
        maxButtonWidthRatio: 0.6,
        textButtonGap: 20,
        buttonGap: 16,
        startY: 50
      };
      const rendererStageSize = renderer.getState?.("stageSize");
      const stageWidth = rendererStageSize?.width || 1024;
      const stageHeight = rendererStageSize?.height || 768;
      const layout = computeDialogTreeLayout({
        phase: {
          id: phaseId,
          // Processed like what is shown (${…} placeholders, '@role'
          // speakers): the layout names its buttons after these texts, and
          // the buttons are matched to the choices by them.
          speaker: this.processText(this.currentNode.speaker || "", context),
          text: this.processText(this.currentNode.text || "", context),
          // A continue step is not a reply button.
          choices: (this.currentNode.choices || []).filter((c) => !c.continue).map((c, idx) => ({
            id: c.id || `choice_${idx}`,
            text: this.processText(c.text || "", context)
          }))
        },
        stageWidth,
        stageHeight,
        theme: layoutTheme,
        overrides: phaseOverrides,
        storedLocations: this.locations
        // Pass stored locations from ASML import
      });
      const layoutLocations = layout.toLocations();
      locations = [...locations, ...layoutLocations];
      if (this.currentNode.conditions) {
        const allConditionsMet = this.currentNode.conditions.every(
          (cond) => context.checkCondition(cond)
        );
        if (!allConditionsMet) {
          break;
        }
      }
      if (this.currentNode.effects) {
        this.currentNode.effects.forEach((effect) => context.applyEffect(effect));
      }
      const processedSpeaker = this.processText(
        Beat.linkedSpeakerName(this.currentNode.characterRef, this.currentNode.speaker, context),
        context
      );
      const processedText = this.processText(this.currentNode.text, context);
      context.markCharacterAppeared(this.currentNode.characterRef || processedSpeaker);
      const lineState = this.currentNode.speakerState;
      if (lineState) {
        const states = { ...renderer.getState?.("speakerStates") || {} };
        const characterId = context.resolveCharacterId(this.currentNode.characterRef || this.currentNode.speaker);
        if (characterId) states[characterId] = lineState;
        if (processedSpeaker) states[processedSpeaker.toLowerCase()] = lineState;
        renderer.setState("speakerStates", states);
      }
      const earlyVisibleChoices = this.currentNode.choices ? this.filterVisibleChoices(this.currentNode.choices, context) : [];
      const nodeWillBeSpatial = !isChatLayoutTemplate(this.layoutTemplate) && this.locations.size === 0 && earlyVisibleChoices.length > 0 && !continueStepOf(earlyVisibleChoices);
      renderer.setState("dialogNodeIsSpatial", nodeWillBeSpatial);
      await renderer.renderDialog(
        processedSpeaker,
        processedText,
        this.currentNode.emotion,
        locations
      );
      {
        const lineCharacterId = context.resolveCharacterId(this.currentNode.characterRef || this.currentNode.speaker);
        const shownStates = renderer.getState?.("speakerStates");
        const shownState = shownStates?.[lineCharacterId || ""] ?? shownStates?.[processedSpeaker.toLowerCase()];
        context.recordConversationLine(this.id, {
          speaker: processedSpeaker,
          text: processedText,
          ...lineCharacterId ? { characterId: lineCharacterId } : {},
          ...shownState ? { speakerState: shownState } : {}
        });
      }
      if (this.currentNode.target) {
        await this.waitOnNpcLine(renderer, processedText, `${nodePath}___npc_exit`, locations);
        if (this.currentNode.target === "__self__") {
          this.currentNode = this.dialogTree;
          nodePath = "root";
          continue;
        }
        console.log(`[DialogTreeBeat] NPC exit node \u2192 ${this.currentNode.target}`);
        exitTargetBeatId = this.currentNode.target;
        this.currentNode = null;
        continue;
      }
      const continueStep = continueStepOf(earlyVisibleChoices);
      if (continueStep) {
        await this.waitOnNpcLine(renderer, processedText, `${nodePath}___continue`, locations);
        const alreadyTaken = this.effectsOncePerChoice && context.getVisitedChoicesForBeat(this.id).includes(`${nodePath}_${continueStep.id}`);
        if (continueStep.effects && !alreadyTaken) {
          continueStep.effects.forEach((effect) => context.applyEffect(effect));
        }
        context.markChoiceVisited(this.id, `${nodePath}_${continueStep.id}`);
        if (continueStep.target === "__self__") {
          this.currentNode = this.dialogTree;
          nodePath = "root";
        } else if (continueStep.target) {
          exitTargetBeatId = continueStep.target;
          this.currentNode = null;
        } else if (continueStep.dialogNode) {
          nodePath = `${nodePath}.${continueStep.id}`;
          this.currentNode = continueStep.dialogNode;
        } else {
          break;
        }
        continue;
      }
      if (this.currentNode.choices && this.currentNode.choices.length > 0) {
        const visibleChoices = this.filterVisibleChoices(
          this.currentNode.choices,
          context
        );
        if (visibleChoices.length === 0) {
          if (this.currentNode.target) {
            await this.waitOnNpcLine(renderer, processedText, `${nodePath}___npc_exit_f`, locations);
            if (this.currentNode.target === "__self__") {
              this.currentNode = this.dialogTree;
              nodePath = "root";
              continue;
            }
            console.log(`[DialogTreeBeat] All choices filtered, NPC exit \u2192 ${this.currentNode.target}`);
            exitTargetBeatId = this.currentNode.target;
            this.currentNode = null;
            continue;
          }
          break;
        }
        if (this.choiceDelay && this.choiceDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.choiceDelay * 1e3));
        }
        const visibleLayout = computeDialogTreeLayout({
          phase: {
            id: phaseId,
            speaker: this.currentNode.speaker || "",
            text: this.currentNode.text || "",
            choices: visibleChoices.map((c, idx) => ({ id: c.id || `choice_${idx}`, text: c.text || "" }))
          },
          stageWidth,
          stageHeight,
          theme: layoutTheme,
          overrides: phaseOverrides,
          storedLocations: this.locations
        });
        const choiceLocations = [
          ...locations.filter((loc) => loc.kind !== "button"),
          ...visibleLayout.toLocations().filter((loc) => loc.kind === "button")
        ];
        const choiceId = await renderer.renderChoices(
          visibleChoices.map((c) => ({
            id: `${nodePath}_${c.id}`,
            text: this.processText(c.text, context),
            isExit: !!c.target && !c.dialogNode,
            // Exit if has target but no nested dialog
            // P3-3c-9 — pass through; ReactRenderer.renderChoices routes
            // through SpatialFlowView when dialogNodeIsSpatial is set.
            hotspot: c.hotspot
          })),
          nodeWillBeSpatial ? void 0 : choiceLocations
        );
        renderer.setState("dialogNodeIsSpatial", false);
        const rawChoiceId = choiceId?.startsWith(`${nodePath}_`) ? choiceId.substring(nodePath.length + 1) : choiceId;
        let selectedChoice = visibleChoices.find((c) => c.id === rawChoiceId || `${nodePath}_${c.id}` === choiceId);
        if (!selectedChoice && choiceId) {
          const indexMatch = choiceId.toLowerCase().match(/button\s*(\d+)/);
          if (indexMatch) {
            const index = parseInt(indexMatch[1], 10) - 1;
            if (index >= 0 && index < visibleChoices.length) {
              selectedChoice = visibleChoices[index];
              console.log(`[DialogTreeBeat] Matched choice by index: ${choiceId} \u2192 ${selectedChoice?.id}`);
            }
          }
        }
        if (!selectedChoice && choiceId) {
          selectedChoice = visibleChoices.find((c) => c.text === choiceId);
          if (selectedChoice) {
            console.log(`[DialogTreeBeat] Matched choice by text: ${choiceId} \u2192 ${selectedChoice?.id}`);
          }
        }
        if (selectedChoice) {
          context.recordChoice({
            beatId: this.id,
            beatName: this.name || this.id,
            beatType: "dialogTree",
            choiceText: selectedChoice.text,
            choiceContext: this.currentNode?.text ? `${this.currentNode.speaker || "NPC"}: "${this.currentNode.text.substring(0, 100)}${this.currentNode.text.length > 100 ? "..." : ""}"` : this.name || "Dialog choice"
          });
          context.recordConversationLine(this.id, {
            speaker: playerName,
            text: this.processText(selectedChoice.text, context),
            fromPlayer: true
          });
          const alreadyChosen = this.effectsOncePerChoice && context.getVisitedChoicesForBeat(this.id).includes(`${nodePath}_${selectedChoice.id}`);
          if (selectedChoice.effects && !alreadyChosen) {
            selectedChoice.effects.forEach((effect) => context.applyEffect(effect));
          }
          const choiceWithSound = selectedChoice;
          if (choiceWithSound.soundEffect && renderer.playSound) {
            await renderer.playSound({ file: choiceWithSound.soundEffect });
          }
          context.markChoiceVisited(this.id, `${nodePath}_${selectedChoice.id}`);
          if (renderer.setVisitedChoiceIds) {
            renderer.setVisitedChoiceIds(context.getVisitedChoicesForBeat(this.id));
          }
          if (selectedChoice.target === "__self__") {
            await new Promise((resolve) => setTimeout(resolve, 1e3));
            this.currentNode = this.dialogTree;
            nodePath = "root";
          } else if (selectedChoice.target) {
            await new Promise((resolve) => setTimeout(resolve, 1e3));
            exitTargetBeatId = selectedChoice.target;
            this.currentNode = null;
          } else if (selectedChoice.dialogNode) {
            nodePath = `${nodePath}.${selectedChoice.id}`;
            this.currentNode = selectedChoice.dialogNode;
          } else {
            break;
          }
        } else {
          break;
        }
      } else {
        break;
      }
    }
    if (exitTargetBeatId) {
      return exitTargetBeatId;
    }
    return this.getNextBeat(context);
  }
  filterVisibleChoices(choices, context) {
    return choices.filter((choice) => {
      if (choice.visible === false) return false;
      if (choice.conditions) {
        return choice.conditions.every((cond) => context.checkCondition(cond));
      }
      return true;
    });
  }
};

// src/beats/ConversationChoiceBeat.ts
var ConversationChoiceBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "questioner");
    __publicField(this, "question");
    __publicField(this, "choices");
    this.questioner = config.questioner || config.parameters?.questioner || "Character";
    this.question = config.question || config.parameters?.question || "";
    this.choices = config.choices || config.parameters?.choices || [];
  }
  getParameters() {
    return {
      questioner: this.questioner,
      question: this.question,
      choices: this.choices
    };
  }
  updateParameters(params) {
    if (params.questioner !== void 0) this.questioner = params.questioner;
    if (params.question !== void 0) this.question = params.question;
    if (params.choices !== void 0) this.choices = params.choices;
  }
  async performAction(context, renderer) {
    const processedQuestioner = this.processText(this.questioner, context);
    const processedQuestion = this.processText(this.question, context);
    await renderer.renderDialog(processedQuestioner, processedQuestion);
    const choiceOptions = this.choices.map((c) => ({
      id: c.id,
      text: this.processText(c.text, context)
    }));
    const selectedId = await renderer.renderChoices(choiceOptions);
    const selected = this.choices.find((c) => c.id === selectedId);
    if (selected) {
      return selected.targetBeat;
    }
    return this.getNextBeat(context);
  }
};

// src/beats/MultiChoiceBeat.ts
function normalizeLayoutTemplate(v) {
  if (v === "stacked" || v === "conversation" || v === "chat-bubble" || v === "custom") {
    return v;
  }
  return "stacked";
}
var MultiChoiceBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "question");
    __publicField(this, "choices");
    __publicField(this, "choiceDelay");
    __publicField(this, "markVisited");
    // Opt-in: effects (counters/variables/inventory) fire only the FIRST
    // time a given choice is selected; the choice itself stays selectable.
    // The re-viewable-but-once-scored middle ground between markVisited
    // (dim + block) and default repeat-fire (bake-off finding 2026-09-04:
    // re-examining evidence kept re-scoring suspicion counters).
    __publicField(this, "effectsOncePerChoice");
    __publicField(this, "layoutTemplate");
    this.question = config.question || config.parameters?.question || "What do you say?";
    this.choices = config.choices || config.parameters?.choices || [];
    this.choiceDelay = config.choiceDelay ?? config.parameters?.choiceDelay;
    this.markVisited = config.markVisited ?? config.parameters?.markVisited ?? false;
    this.effectsOncePerChoice = config.effectsOncePerChoice ?? config.parameters?.effectsOncePerChoice ?? false;
    this.layoutTemplate = normalizeLayoutTemplate(
      config.layoutTemplate ?? config.parameters?.layoutTemplate
    );
    this.choices.forEach((c) => migrateChoiceEffects(c));
  }
  getParameters() {
    return {
      question: this.question,
      choices: this.choices,
      node: this.node,
      choiceDelay: this.choiceDelay,
      markVisited: this.markVisited,
      effectsOncePerChoice: this.effectsOncePerChoice,
      layoutTemplate: this.layoutTemplate,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations,
      speaker: this.speaker,
      showSpeaker: this.showSpeaker
    };
  }
  updateParameters(params) {
    if (params.question !== void 0) this.question = params.question;
    if (params.choices !== void 0) {
      this.choices = params.choices;
      this.clearConnections();
      for (const choice of this.choices) {
        if (choice.target && choice.target !== "__self__") {
          this.addConnection({
            targetId: choice.target,
            label: choice.text || choice.id
          });
        }
      }
    }
    if (params.node !== void 0) this.node = params.node;
    if (params.choiceDelay !== void 0) this.choiceDelay = params.choiceDelay;
    if (params.markVisited !== void 0) this.markVisited = params.markVisited;
    if (params.effectsOncePerChoice !== void 0) this.effectsOncePerChoice = params.effectsOncePerChoice;
    if (params.layoutTemplate !== void 0) this.layoutTemplate = normalizeLayoutTemplate(params.layoutTemplate);
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
    if (params.speaker !== void 0) this.speaker = params.speaker;
    if (params.showSpeaker !== void 0) this.showSpeaker = params.showSpeaker;
  }
  /**
   * Dynamic connections from choices (matches MovementChoice / DialogTree).
   * Lets the graph view and analyzers see every reachable target without
   * needing the beat to be re-saved after a choice edit.
   */
  getConnections() {
    const connections = [];
    if (this.choices && Array.isArray(this.choices)) {
      for (const choice of this.choices) {
        if (choice.target && choice.target !== "__self__") {
          connections.push({
            targetId: choice.target,
            label: choice.text || choice.id,
            condition: choice.conditions
          });
        }
      }
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId && c.label === conn.label)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  async performAction(context, renderer) {
    renderer.setState("currentBeatType", this.type || "multiChoice");
    renderer.setState("layoutTemplate", this.layoutTemplate);
    renderer.setState("choiceStyle", this.choiceStyle());
    const isChatMode = this.layoutTemplate === "chat-bubble";
    renderer.setState("presentationMode", isChatMode ? "chat-bubble" : "positioned");
    if (isChatMode) {
      const variables = context.getVariables();
      const playerName = variables.playerName || variables.name || variables.player || "You";
      renderer.setState("playerName", playerName);
      renderer.setState("responseDelay", 0);
      if (renderer.clearChatHistory) renderer.clearChatHistory();
    }
    renderer.setState("markVisited", this.markVisited || false);
    if (renderer.setVisitedChoiceIds) {
      renderer.setVisitedChoiceIds(context.getVisitedChoicesForBeat(this.id));
    }
    while (true) {
      const availableChoices = this.choicesFor(context).filter((choice) => {
        if (!choice.conditions || choice.conditions.length === 0) return true;
        return choice.conditions.every((condition) => context.checkCondition(condition));
      });
      if (availableChoices.length === 0) {
        console.warn(`[MultiChoiceBeat] No available choices for beat ${this.id}`);
        return this.getNextBeat(context);
      }
      const processedSpeaker = this.processText(this.speaker || "", context);
      const processedQuestion = this.processText(this.question, context);
      const locations = Array.from(this.locations.values());
      await renderer.renderDialog(processedSpeaker, processedQuestion, void 0, locations);
      if (this.choiceDelay && this.choiceDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.choiceDelay * 1e3));
      }
      const choiceId = await renderer.renderChoices(
        availableChoices.map((c) => ({
          id: c.id,
          // displayText is the translated label (written by the translation
          // pipelines, movementChoice precedent); `text` stays the authored
          // matching key for baked button locations. Routing is by id, and
          // PositionedBeatView's button-position fallback covers baked
          // locations whose names no longer match the displayed label.
          text: this.processText(c.displayText || c.text, context),
          // A second, smaller line under the label (Choose your character).
          ...c.description ? { description: this.processText(c.description, context) } : {},
          // A picture for the option (asset id or URL), shown as a card.
          ...c.image ? { image: c.image } : {}
        })),
        locations
      );
      const selected = availableChoices.find((c) => c.id === choiceId);
      if (!selected) {
        console.warn(`[MultiChoiceBeat] No matching choice for "${choiceId}" \u2014 available: ${availableChoices.map((c) => c.id).join(", ")}`);
        break;
      }
      const alreadyChosen = this.effectsOncePerChoice && context.getVisitedChoicesForBeat(this.id).includes(selected.id);
      context.markChoiceVisited(this.id, selected.id);
      if (renderer.setVisitedChoiceIds) {
        renderer.setVisitedChoiceIds(context.getVisitedChoicesForBeat(this.id));
      }
      context.recordChoice({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: this.type || "multiChoice",
        choiceText: selected.text,
        choiceContext: this.question
      });
      this.onChoiceTaken(selected, context);
      if (selected.effects && selected.effects.length > 0 && !alreadyChosen) {
        selected.effects.forEach((effect) => context.applyEffect(effect));
      }
      if (selected.soundEffect && renderer.playSound) {
        await renderer.playSound({ file: selected.soundEffect });
      }
      if (selected.target === "__self__") {
        continue;
      }
      return this.targetFor(selected, context);
    }
    return this.getNextBeat(context);
  }
  /** 'buttons', or picture cards: 'pictures' (with names) | 'picturesOnly'. */
  choiceStyle() {
    return "buttons";
  }
  /** The choices to offer this time (before conditions). */
  choicesFor(_context) {
    return this.choices;
  }
  /** Where a taken choice leads. */
  targetFor(selected, _context) {
    return selected.target;
  }
  /** Called when a choice is taken, before its own effects run. */
  onChoiceTaken(_selected, _context) {
  }
};

// src/beats/ChooseCharacterBeat.ts
function normalizeOptionStyle(v) {
  return v === "pictures" || v === "picturesOnly" ? v : "buttons";
}
var ChooseCharacterBeat = class extends MultiChoiceBeat {
  constructor(config) {
    super({
      ...config,
      question: config.question || config.parameters?.question || "Who will you be?"
    });
    __publicField(this, "role");
    __publicField(this, "optionStyle");
    this.role = stripRolePrefix(String(config.role ?? config.parameters?.role ?? "player"));
    this.optionStyle = normalizeOptionStyle(config.optionStyle ?? config.parameters?.optionStyle);
  }
  getParameters() {
    return { ...super.getParameters(), role: this.role, optionStyle: this.optionStyle };
  }
  updateParameters(params) {
    super.updateParameters(params);
    if (params.role !== void 0) this.role = stripRolePrefix(String(params.role));
    if (params.optionStyle !== void 0) this.optionStyle = normalizeOptionStyle(params.optionStyle);
  }
  choiceStyle() {
    return this.optionStyle;
  }
  choicesFor(context) {
    const authored = this.choices || [];
    const options = authored.length > 0 ? authored : (context.getRole(this.role)?.candidates ?? []).map((id) => ({ id: `cast_${id}`, character: id }));
    const pictures = this.optionStyle !== "buttons";
    return options.map((o) => {
      const option = { ...o, text: o.text ?? "", target: o.target ?? "" };
      const ch = o.character ? context.getMergedCharacter(o.character) : void 0;
      if (pictures && !option.image) {
        const portrait = ch?.portrait;
        const image = portrait?.assetId || portrait?.image;
        if (image) option.image = image;
      }
      if (option.text || option.displayText || !o.character) return option;
      return { ...option, text: ch?.displayName || ch?.name || o.character };
    });
  }
  onChoiceTaken(selected, context) {
    const character = selected.character;
    if (character) context.castRole(this.role, character);
  }
  targetFor(selected, context) {
    return selected.target || (this.choices || []).find((c) => c.target && c.target !== "__self__")?.target || this.getNextBeat(context);
  }
};

// src/beats/MovementChoiceBeat.ts
var MovementChoiceBeat = class extends Beat {
  // Bug 26 — per-beat background fit
  constructor(config) {
    super(config);
    __publicField(this, "question");
    __publicField(this, "choices");
    __publicField(this, "choiceDelay");
    // Delay in seconds before showing choices
    __publicField(this, "markVisited");
    // Block and dim choices leading to previously visited beats
    // Opt-in: effects (counters/variables/inventory) fire only the FIRST
    // time a given choice is selected; the choice itself stays selectable.
    // The re-viewable-but-once-scored middle ground between markVisited
    // (dim + block) and default repeat-fire (bake-off finding 2026-09-04:
    // re-examining evidence kept re-scoring suspicion counters).
    __publicField(this, "effectsOncePerChoice");
    __publicField(this, "showTextOnHover");
    // Only show choice text when hovering over the hotspot
    __publicField(this, "spatialFit");
    this.question = config.question || config.parameters?.question || "Where do you want to go?";
    this.choices = config.choices || config.parameters?.choices || [];
    this.choiceDelay = config.choiceDelay || config.parameters?.choiceDelay;
    this.markVisited = config.markVisited ?? config.parameters?.markVisited ?? false;
    this.effectsOncePerChoice = config.effectsOncePerChoice ?? config.parameters?.effectsOncePerChoice ?? false;
    this.showTextOnHover = config.showTextOnHover ?? config.parameters?.showTextOnHover ?? false;
    const fit = config.parameters?.spatialFit ?? config.spatialFit;
    this.spatialFit = fit === "cover" || fit === "contain" ? fit : void 0;
    this.choices.forEach((c) => migrateChoiceEffects(c));
    console.log(`[MovementChoiceBeat constructor] config.node: ${config.node}`);
    console.log(`[MovementChoiceBeat constructor] config.parameters.node: ${config.parameters?.node}`);
    console.log(`[MovementChoiceBeat constructor] this.node AFTER super(): ${this.node}`);
  }
  getParameters() {
    const params = {
      question: this.question,
      choices: this.choices,
      node: this.node,
      choiceDelay: this.choiceDelay,
      markVisited: this.markVisited,
      effectsOncePerChoice: this.effectsOncePerChoice,
      showTextOnHover: this.showTextOnHover,
      spatialFit: this.spatialFit,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
    console.log("[MovementChoiceBeat.getParameters] Returning:", params);
    return params;
  }
  updateParameters(params) {
    console.log("[MovementChoiceBeat.updateParameters] BEFORE:", {
      question: this.question,
      choicesLength: this.choices.length,
      node: this.node,
      choiceDelay: this.choiceDelay
    });
    console.log("[MovementChoiceBeat.updateParameters] params:", {
      question: params.question,
      choicesLength: params.choices?.length,
      node: params.node,
      choiceDelay: params.choiceDelay
    });
    if (params.question !== void 0) this.question = params.question;
    if (params.choices !== void 0) {
      this.choices = params.choices;
      this.clearConnections();
      for (const choice of this.choices) {
        if (choice.target && choice.target !== "__self__") {
          this.addConnection({
            targetId: choice.target,
            label: choice.text || choice.id
          });
        }
      }
    }
    if (params.node !== void 0) this.node = params.node;
    if (params.choiceDelay !== void 0) this.choiceDelay = params.choiceDelay;
    if (params.markVisited !== void 0) this.markVisited = params.markVisited;
    if (params.effectsOncePerChoice !== void 0) this.effectsOncePerChoice = params.effectsOncePerChoice;
    if (params.showTextOnHover !== void 0) this.showTextOnHover = params.showTextOnHover;
    if (params.spatialFit !== void 0) {
      this.spatialFit = params.spatialFit === "cover" || params.spatialFit === "contain" ? params.spatialFit : void 0;
    }
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
    console.log("[MovementChoiceBeat.updateParameters] AFTER:", {
      question: this.question,
      choicesLength: this.choices.length,
      node: this.node,
      choiceDelay: this.choiceDelay,
      markVisited: this.markVisited,
      effectsOncePerChoice: this.effectsOncePerChoice,
      showTextOnHover: this.showTextOnHover
    });
  }
  /**
   * Override getConnections to extract all connections from movement choices
   * This ensures connections are dynamically generated from choices array
   */
  getConnections() {
    const connections = [];
    if (this.choices && Array.isArray(this.choices)) {
      for (const choice of this.choices) {
        if (choice.target && choice.target !== "__self__") {
          connections.push({
            targetId: choice.target,
            label: choice.text || choice.id,
            condition: choice.conditions
          });
        }
      }
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId && c.label === conn.label)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  async performAction(context, renderer) {
    renderer.setState("markVisited", this.markVisited || false);
    if (renderer.setVisitedChoiceIds) {
      renderer.setVisitedChoiceIds(context.getVisitedChoicesForBeat(this.id));
    }
    renderer.setState("showTextOnHover", this.showTextOnHover || false);
    renderer.setState("spatialFit", this.spatialFit);
    while (true) {
      const availableChoices = this.choices.filter((choice) => {
        if (!choice.conditions) return true;
        return choice.conditions.every((condition) => context.checkCondition(condition));
      });
      if (availableChoices.length === 0) {
        console.warn(`No available movement choices for beat ${this.id}`);
        return this.getNextBeat(context);
      }
      const processedQuestion = this.processText(this.question, context);
      const locations = Array.from(this.locations.values());
      if (this.choiceDelay && this.choiceDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.choiceDelay * 1e3));
      }
      const choiceId = await renderer.renderMovement(
        processedQuestion,
        availableChoices.map((c) => ({
          id: c.id,
          text: this.processText(c.text, context),
          displayText: c.displayText ? this.processText(c.displayText, context) : void 0,
          location: c.location || "",
          locationName: c.locationName,
          // Pass locationName for hotspot/prop association
          // P3-3c — normalized spatial hotspot; routes through SpatialFlowView
          // when ALL choices have it AND there are no baked locations.
          hotspot: c.hotspot
        })),
        locations
      );
      let selectedChoice = availableChoices.find((c) => c.id === choiceId);
      if (!selectedChoice) {
        const choiceIdLower = choiceId?.toLowerCase();
        selectedChoice = availableChoices.find(
          (c) => c.text?.toLowerCase() === choiceIdLower
        );
      }
      if (selectedChoice) {
        const alreadyChosen = this.effectsOncePerChoice && context.getVisitedChoicesForBeat(this.id).includes(selectedChoice.id);
        context.markChoiceVisited(this.id, selectedChoice.id);
        if (renderer.setVisitedChoiceIds) {
          renderer.setVisitedChoiceIds(context.getVisitedChoicesForBeat(this.id));
        }
        context.recordChoice({
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "movementChoice",
          choiceText: selectedChoice.text,
          choiceContext: this.question
        });
        if (selectedChoice.location) {
          context.setVariable("currentLocation", selectedChoice.location);
        }
        if (selectedChoice.effects && !alreadyChosen) {
          selectedChoice.effects.forEach((effect) => context.applyEffect(effect));
        }
        if (selectedChoice.soundEffect && renderer.playSound) {
          await renderer.playSound({ file: selectedChoice.soundEffect });
        }
        if (selectedChoice.target === "__self__") {
          continue;
        }
        return selectedChoice.target;
      }
      console.warn(`[MovementChoiceBeat] No matching choice found for "${choiceId}". Available: ${availableChoices.map((c) => c.id || c.text).join(", ")}`);
      break;
    }
    return this.getNextBeat(context);
  }
};

// src/beats/PickPropBeat.ts
var PickPropBeat = class extends Beat {
  // Bug 26 — per-beat background fit
  constructor(config) {
    super(config);
    __publicField(this, "question");
    __publicField(this, "props");
    __publicField(this, "choiceDelay");
    // Delay in seconds before showing choices
    __publicField(this, "markVisited");
    // Block and dim choices leading to previously visited beats
    // Opt-in: effects (counters/variables/inventory) fire only the FIRST
    // time a given choice is selected; the choice itself stays selectable.
    // The re-viewable-but-once-scored middle ground between markVisited
    // (dim + block) and default repeat-fire (bake-off finding 2026-09-04:
    // re-examining evidence kept re-scoring suspicion counters).
    __publicField(this, "effectsOncePerChoice");
    __publicField(this, "spatialFit");
    this.question = config.question || config.parameters?.question || "What do you want to interact with?";
    this.props = config.props || config.parameters?.props || [];
    this.choiceDelay = config.choiceDelay || config.parameters?.choiceDelay;
    this.markVisited = config.markVisited ?? config.parameters?.markVisited ?? false;
    this.effectsOncePerChoice = config.effectsOncePerChoice ?? config.parameters?.effectsOncePerChoice ?? false;
    const fit = config.parameters?.spatialFit ?? config.spatialFit;
    this.spatialFit = fit === "cover" || fit === "contain" ? fit : void 0;
    this.props.forEach((p) => migrateChoiceEffects(p));
  }
  getParameters() {
    return {
      question: this.question,
      props: this.props,
      node: this.node,
      choiceDelay: this.choiceDelay,
      markVisited: this.markVisited,
      effectsOncePerChoice: this.effectsOncePerChoice,
      spatialFit: this.spatialFit,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.question !== void 0) this.question = params.question;
    if (params.props !== void 0) {
      this.props = params.props;
      this.clearConnections();
      for (const prop of this.props) {
        if (prop.target) {
          this.addConnection({
            targetId: prop.target,
            label: prop.name || prop.id
          });
        }
      }
    }
    if (params.node !== void 0) this.node = params.node;
    if (params.choiceDelay !== void 0) this.choiceDelay = params.choiceDelay;
    if (params.markVisited !== void 0) this.markVisited = params.markVisited;
    if (params.effectsOncePerChoice !== void 0) this.effectsOncePerChoice = params.effectsOncePerChoice;
    if (params.spatialFit !== void 0) {
      this.spatialFit = params.spatialFit === "cover" || params.spatialFit === "contain" ? params.spatialFit : void 0;
    }
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  /**
   * Override getConnections to extract all connections from prop options
   * This ensures connections are dynamically generated from props array
   */
  getConnections() {
    const connections = [];
    if (this.props && Array.isArray(this.props)) {
      for (const prop of this.props) {
        if (prop.target) {
          connections.push({
            targetId: prop.target,
            label: prop.name || prop.id,
            condition: prop.conditions
          });
        }
      }
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId && c.label === conn.label)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  async performAction(context, renderer) {
    renderer.setState("markVisited", this.markVisited || false);
    renderer.setState("spatialFit", this.spatialFit);
    if (renderer.setVisitedChoiceIds) {
      renderer.setVisitedChoiceIds(context.getVisitedChoicesForBeat(this.id));
    }
    const availableProps = this.props.filter((prop) => {
      if (!prop.conditions) return true;
      return prop.conditions.every((condition) => context.checkCondition(condition));
    });
    if (availableProps.length === 0) {
      console.warn(`No available props for beat ${this.id}`);
      return this.getNextBeat(context);
    }
    const processedQuestion = this.processText(this.question, context);
    const locations = Array.from(this.locations.values());
    if (this.choiceDelay && this.choiceDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.choiceDelay * 1e3));
    }
    const propId = await renderer.renderPropSelection(
      processedQuestion,
      availableProps.map((p) => ({
        id: p.id,
        name: this.processText(p.name, context),
        displayName: p.displayName ? this.processText(p.displayName, context) : void 0,
        description: this.processText(p.description, context),
        locationName: p.locationName,
        // For visual element association (like movementChoice)
        // P3-3c-8 — normalized spatial hotspot. Routes through SpatialFlowView
        // when any prop has it AND there are no baked locations.
        hotspot: p.hotspot
      })),
      locations
    );
    let selectedProp = availableProps.find((p) => p.id === propId);
    if (!selectedProp) {
      const propIdLower = propId?.toLowerCase();
      selectedProp = availableProps.find(
        (p) => p.name?.toLowerCase() === propIdLower
      );
    }
    if (selectedProp) {
      const choiceKey = selectedProp.id || selectedProp.name;
      const alreadyChosen = this.effectsOncePerChoice && context.getVisitedChoicesForBeat(this.id).includes(choiceKey);
      context.markChoiceVisited(this.id, choiceKey);
      context.recordChoice({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "pickProp",
        choiceText: `Picked up ${selectedProp.displayName || selectedProp.name}`,
        choiceContext: this.question
      });
      if (selectedProp.effects && !alreadyChosen) {
        selectedProp.effects.forEach((effect) => context.applyEffect(effect));
      }
      if (!alreadyChosen) {
        const inventoryItemName = selectedProp.inventoryName || selectedProp.locationName || selectedProp.name;
        context.addToInventory(inventoryItemName);
      }
      if (selectedProp.soundEffect && renderer.playSound) {
        await renderer.playSound({ file: selectedProp.soundEffect });
      }
      return selectedProp.target;
    }
    console.warn(`[PickPropBeat] No matching prop found for "${propId}". Available: ${availableProps.map((p) => p.id || p.name).join(", ")}`);
    return this.getNextBeat(context);
  }
};

// src/beats/VideoBeat.ts
var VideoBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "videoFile");
    __publicField(this, "videoAssetId");
    __publicField(this, "autoplay");
    __publicField(this, "controls");
    __publicField(this, "skipButton");
    /** Caption/subtitle cues (start/end seconds + text; displayText per language). */
    __publicField(this, "captions");
    __publicField(this, "captionsEnabled");
    /** Per-language alternate video, resolved to videoAssetId at the data layer. */
    __publicField(this, "videoTranslations");
    this.videoFile = config.videoFile || config.parameters?.videoFile || "";
    this.videoAssetId = config.videoAssetId || config.parameters?.videoAssetId;
    this.autoplay = config.autoplay ?? config.parameters?.autoplay ?? true;
    this.controls = config.controls ?? config.parameters?.controls ?? true;
    this.skipButton = config.skipButton ?? config.parameters?.skipButton ?? true;
    const rawCaptions = config.captions ?? config.parameters?.captions ?? [];
    this.captions = Array.isArray(rawCaptions) ? rawCaptions : [];
    this.captionsEnabled = config.parameters?.captionsEnabled ?? config.captionsEnabled ?? true;
    this.videoTranslations = config.videoTranslations ?? config.parameters?.videoTranslations;
  }
  getParameters() {
    return {
      videoFile: this.videoFile,
      videoAssetId: this.videoAssetId,
      autoplay: this.autoplay,
      controls: this.controls,
      skipButton: this.skipButton,
      captions: this.captions,
      captionsEnabled: this.captionsEnabled,
      videoTranslations: this.videoTranslations
    };
  }
  updateParameters(params) {
    if (params.videoFile !== void 0) this.videoFile = params.videoFile;
    if (params.videoAssetId !== void 0) this.videoAssetId = params.videoAssetId;
    if (params.autoplay !== void 0) this.autoplay = params.autoplay;
    if (params.controls !== void 0) this.controls = params.controls;
    if (params.skipButton !== void 0) this.skipButton = params.skipButton;
    if (params.captions !== void 0) this.captions = Array.isArray(params.captions) ? params.captions : [];
    if (params.captionsEnabled !== void 0) this.captionsEnabled = params.captionsEnabled;
    if (params.videoTranslations !== void 0) this.videoTranslations = params.videoTranslations;
    if (params.node !== void 0) this.node = params.node;
  }
  /**
   * Resolve caption cues for playback: use the translated `displayText` when
   * present (active non-source language), else the source `text`. Empty/blank
   * cues and non-finite times are dropped so the generated VTT stays valid.
   */
  resolvedCaptions() {
    if (!this.captionsEnabled || !Array.isArray(this.captions)) return [];
    return this.captions.map((c) => ({
      start: Number(c.start) || 0,
      end: Number(c.end) || 0,
      text: (c.displayText || c.text || "").trim()
    })).filter((c) => c.text && Number.isFinite(c.start) && Number.isFinite(c.end) && c.end > c.start);
  }
  async performAction(context, renderer) {
    if (this.videoAssetId) {
      renderer.setState("videoAssetId", this.videoAssetId);
    }
    const videoUrl = this.videoFile || this.node || "";
    if (!videoUrl) {
      console.error(`VideoBeat ${this.id} has no video file specified`);
      return this.getNextBeat(context);
    }
    try {
      const locations = Array.from(this.locations.values());
      await renderer.renderVideo(videoUrl, this.autoplay, this.controls, locations, this.skipButton, this.resolvedCaptions());
    } catch (error) {
      console.error(`Error playing video in beat ${this.id}:`, error);
    }
    return this.getNextBeat(context);
  }
};

// src/beats/EndScreenBeat.ts
var EndScreenBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "message");
    __publicField(this, "showRestart");
    __publicField(this, "showCredits");
    __publicField(this, "reset");
    __publicField(this, "restartText");
    __publicField(this, "creditsText");
    __publicField(this, "buttonText");
    // Credits page properties
    __publicField(this, "creditsPageTitle");
    __publicField(this, "creditsPageBody");
    __publicField(this, "creditsCloseText");
    __publicField(this, "phaseOverrides");
    // Selective reset sub-options (all default true for backward compatibility)
    __publicField(this, "resetVariables");
    __publicField(this, "resetCounters");
    __publicField(this, "resetInventory");
    __publicField(this, "resetTimers");
    __publicField(this, "resetFictionalTime");
    __publicField(this, "resetVisitedTracking");
    __publicField(this, "resetHistory");
    /** Characters' feelings, variants and HUD reveal (see ResetOptions.characters). */
    __publicField(this, "resetCharacters");
    this.message = config.message || config.parameters?.message || "The End";
    this.showRestart = config.showRestart ?? config.parameters?.showRestart ?? true;
    this.showCredits = config.showCredits ?? config.parameters?.showCredits ?? false;
    this.reset = config.reset ?? config.parameters?.reset ?? false;
    this.restartText = config.restartText || config.parameters?.restartText;
    this.creditsText = config.creditsText || config.parameters?.creditsText;
    this.buttonText = config.buttonText || config.parameters?.buttonText;
    this.creditsPageTitle = config.creditsPageTitle || config.parameters?.creditsPageTitle || "Credits";
    this.creditsPageBody = config.creditsPageBody || config.parameters?.creditsPageBody || "";
    this.creditsCloseText = config.creditsCloseText || config.parameters?.creditsCloseText || "Close";
    this.phaseOverrides = config.parameters?.phaseOverrides || config.phaseOverrides;
    this.resetVariables = config.resetVariables ?? config.parameters?.resetVariables ?? true;
    this.resetCounters = config.resetCounters ?? config.parameters?.resetCounters ?? true;
    this.resetInventory = config.resetInventory ?? config.parameters?.resetInventory ?? true;
    this.resetTimers = config.resetTimers ?? config.parameters?.resetTimers ?? true;
    this.resetFictionalTime = config.resetFictionalTime ?? config.parameters?.resetFictionalTime ?? true;
    this.resetVisitedTracking = config.resetVisitedTracking ?? config.parameters?.resetVisitedTracking ?? true;
    this.resetHistory = config.resetHistory ?? config.parameters?.resetHistory ?? true;
    this.resetCharacters = config.resetCharacters ?? config.parameters?.resetCharacters ?? true;
  }
  /** An end screen's exit is where its restart button leads: marked as a
   *  restart link (drawn as such; state does not travel along it). */
  getConnections() {
    const conns = super.getConnections();
    return this.showRestart === false ? conns : conns.map((c) => ({ ...c, role: "restart" }));
  }
  getParameters() {
    return {
      message: this.message,
      showRestart: this.showRestart,
      showCredits: this.showCredits,
      reset: this.reset,
      resetVariables: this.resetVariables,
      resetCounters: this.resetCounters,
      resetInventory: this.resetInventory,
      resetTimers: this.resetTimers,
      resetFictionalTime: this.resetFictionalTime,
      resetVisitedTracking: this.resetVisitedTracking,
      resetHistory: this.resetHistory,
      resetCharacters: this.resetCharacters,
      restartText: this.restartText,
      creditsText: this.creditsText,
      buttonText: this.buttonText,
      creditsPageTitle: this.creditsPageTitle,
      creditsPageBody: this.creditsPageBody,
      creditsCloseText: this.creditsCloseText,
      phaseOverrides: this.phaseOverrides,
      node: this.node,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.message !== void 0) this.message = params.message;
    if (params.showRestart !== void 0) this.showRestart = params.showRestart;
    if (params.showCredits !== void 0) this.showCredits = params.showCredits;
    if (params.reset !== void 0) this.reset = params.reset;
    if (params.resetVariables !== void 0) this.resetVariables = params.resetVariables;
    if (params.resetCounters !== void 0) this.resetCounters = params.resetCounters;
    if (params.resetInventory !== void 0) this.resetInventory = params.resetInventory;
    if (params.resetTimers !== void 0) this.resetTimers = params.resetTimers;
    if (params.resetFictionalTime !== void 0) this.resetFictionalTime = params.resetFictionalTime;
    if (params.resetVisitedTracking !== void 0) this.resetVisitedTracking = params.resetVisitedTracking;
    if (params.resetHistory !== void 0) this.resetHistory = params.resetHistory;
    if (params.resetCharacters !== void 0) this.resetCharacters = params.resetCharacters;
    if (params.restartText !== void 0) this.restartText = params.restartText;
    if (params.creditsText !== void 0) this.creditsText = params.creditsText;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.creditsPageTitle !== void 0) this.creditsPageTitle = params.creditsPageTitle;
    if (params.creditsPageBody !== void 0) this.creditsPageBody = params.creditsPageBody;
    if (params.creditsCloseText !== void 0) this.creditsCloseText = params.creditsCloseText;
    if (params.phaseOverrides !== void 0) this.phaseOverrides = params.phaseOverrides;
    if (params.node !== void 0) this.node = params.node;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
    this._version++;
  }
  async performAction(context, renderer) {
    renderer.setState("slotAnimations", this.slotAnimations);
    const effectiveRestartText = this.restartText || this.buttonText;
    if (effectiveRestartText) {
      renderer.setState("restartText", this.processText(effectiveRestartText, context));
    }
    if (this.creditsText) {
      renderer.setState("creditsText", this.processText(this.creditsText, context));
    }
    if (this.buttonText) {
      renderer.setState("buttonText", this.processText(this.buttonText, context));
    }
    const processedMessage = this.processText(this.message, context);
    const locations = Array.from(this.locations.values());
    const doRestart = () => {
      context.restartPlaythrough(this.resetScope(), this.id);
      const r = renderer;
      r.setTimerHudState?.(void 0);
      r.setTimerHudOverrideText?.(void 0);
      r.setTimerState?.(void 0);
      const target = this.getNextBeat(context) || context.getStory().getFirstBeatId();
      return target;
    };
    const doExit = () => {
      this.applyReset(context);
      return null;
    };
    while (true) {
      const action = await renderer.renderEndScreen(processedMessage, this.showRestart, this.showCredits, locations);
      const actionLower = (action || "").toLowerCase();
      if (actionLower.includes("restart") || actionLower.includes("play") || actionLower.includes("again")) {
        return doRestart();
      }
      if (actionLower.includes("credit")) {
        if (this.showCredits) {
          await this.showCreditsPage(context, renderer);
          continue;
        }
        return doExit();
      }
      if (actionLower === "button1" || actionLower === "button 1") {
        if (this.showRestart) return doRestart();
      }
      if (actionLower === "button2" || actionLower === "button 2") {
        if (this.showCredits) {
          await this.showCreditsPage(context, renderer);
          continue;
        }
        return doExit();
      }
      if (this.showRestart && !this.showCredits && actionLower) {
        return doRestart();
      }
      return doExit();
    }
  }
  /**
   * Apply reset (full or selective) based on beat configuration.
   * Called just before navigating away from the EndScreen on restart.
   */
  /** What this ending resets: 'all', a selective set, or null (reset off). */
  resetScope() {
    if (!this.reset) return null;
    const allTrue = this.resetVariables && this.resetCounters && this.resetInventory && this.resetTimers && this.resetFictionalTime && this.resetVisitedTracking && this.resetHistory && this.resetCharacters;
    if (allTrue) return "all";
    return {
      variables: this.resetVariables,
      counters: this.resetCounters,
      inventory: this.resetInventory,
      timers: this.resetTimers,
      fictionalTime: this.resetFictionalTime,
      visitedTracking: this.resetVisitedTracking,
      history: this.resetHistory,
      characters: this.resetCharacters
    };
  }
  applyReset(context) {
    const scope = this.resetScope();
    if (scope === "all") context.reset();
    else if (scope) context.selectiveReset(scope);
  }
  async showCreditsPage(context, renderer) {
    const story = context.getStory();
    const metadata = story.getMetadata();
    let body = this.creditsPageBody;
    if (!body) {
      body = `${metadata.title || "Untitled Story"}

Created by: ${metadata.author || "Anonymous"}

Thank you for playing!`;
    }
    const creditsContent = {
      creditsTitle: this.processText(this.creditsPageTitle, context),
      creditsBody: this.processText(body, context),
      creditsCloseText: this.processText(this.creditsCloseText, context)
    };
    const creditsLocations = this.getCreditsLocations();
    if (renderer.renderCreditsPage) {
      await renderer.renderCreditsPage(creditsContent, creditsLocations);
    } else {
      await renderer.renderText(
        `${creditsContent.creditsTitle}

${creditsContent.creditsBody}`,
        creditsContent.creditsCloseText,
        []
      );
    }
  }
  /**
   * Get Location[] for credits page elements from beat.locations
   * Filters for credits-phase elements (creditsTitle, creditsBody, creditsCloseButton)
   */
  getCreditsLocations() {
    const creditsLocationNames = ["creditstitle", "creditsbody", "creditsclosebutton"];
    const locations = [];
    this.locations.forEach((loc) => {
      const nameLower = loc.name?.toLowerCase().replace(/\s+/g, "") || "";
      if (creditsLocationNames.some((n) => nameLower.includes(n))) {
        locations.push(loc);
      }
    });
    return locations;
  }
};

// src/utils/expression.ts
var EXPR_PREFIX = /^\s*=/;
function isArithmeticExpression(value) {
  return typeof value === "string" && EXPR_PREFIX.test(value) && value.replace(EXPR_PREFIX, "").trim().length > 0;
}
function coerceNumeric(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
function createContextResolver(scope) {
  return (ref) => {
    const trimmed = ref.trim();
    if (!trimmed) return null;
    const dot = trimmed.lastIndexOf(".");
    if (dot > 0 && dot < trimmed.length - 1) {
      const owner = trimmed.slice(0, dot).trim();
      const counter = trimmed.slice(dot + 1).trim();
      const counters2 = scope.getCharacterState?.(owner)?.counters;
      if (counters2 && Object.prototype.hasOwnProperty.call(counters2, counter)) {
        return coerceNumeric(counters2[counter]);
      }
      return null;
    }
    const variable = scope.getVariable(trimmed);
    if (variable !== void 0 && variable !== null) {
      return coerceNumeric(variable);
    }
    const counters = scope.getCounters();
    if (Object.prototype.hasOwnProperty.call(counters, trimmed)) {
      return coerceNumeric(counters[trimmed]);
    }
    return null;
  };
}
var ID_START = /[A-Za-z_]/;
var ID_CHAR = /[A-Za-z0-9_]/;
var LEGACY_DOLLAR = /^\$([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)?)\$/;
var NUMBER = /^(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)/;
function tokenize(src) {
  const tokens = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === " " || c === "	" || c === "\n" || c === "\r") {
      i++;
      continue;
    }
    if (c === "(") {
      tokens.push({ kind: "lparen" });
      i++;
      continue;
    }
    if (c === ")") {
      tokens.push({ kind: "rparen" });
      i++;
      continue;
    }
    if (c === "+" || c === "-" || c === "*" || c === "/") {
      tokens.push({ kind: "op", op: c });
      i++;
      continue;
    }
    if (c >= "0" && c <= "9") {
      const m = NUMBER.exec(src.slice(i));
      if (!m) return null;
      tokens.push({ kind: "num", value: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (c === ".") {
      const m = NUMBER.exec(src.slice(i));
      if (!m) return null;
      tokens.push({ kind: "num", value: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (c === "$") {
      if (src[i + 1] === "{") {
        const close = src.indexOf("}", i + 2);
        if (close === -1) return null;
        const name = src.slice(i + 2, close).trim();
        if (!name) return null;
        tokens.push({ kind: "ref", name });
        i = close + 1;
        continue;
      }
      const m = LEGACY_DOLLAR.exec(src.slice(i));
      if (!m) return null;
      tokens.push({ kind: "ref", name: m[1] });
      i += m[0].length;
      continue;
    }
    if (c === "{") {
      const close = src.indexOf("}", i + 1);
      if (close === -1) return null;
      const name = src.slice(i + 1, close).trim();
      if (!name) return null;
      tokens.push({ kind: "ref", name });
      i = close + 1;
      continue;
    }
    if (ID_START.test(c)) {
      let j = i + 1;
      while (j < n && ID_CHAR.test(src[j])) j++;
      if (src[j] === "." && j + 1 < n && ID_START.test(src[j + 1])) {
        let k = j + 2;
        while (k < n && ID_CHAR.test(src[k])) k++;
        tokens.push({ kind: "ref", name: src.slice(i, k) });
        i = k;
        continue;
      }
      tokens.push({ kind: "ref", name: src.slice(i, j) });
      i = j;
      continue;
    }
    return null;
  }
  return tokens;
}
var ExpressionError = class extends Error {
};
var Parser = class {
  constructor(tokens, resolve) {
    __publicField(this, "tokens", tokens);
    __publicField(this, "resolve", resolve);
    __publicField(this, "pos", 0);
  }
  parse() {
    const value = this.parseExpr();
    if (this.pos !== this.tokens.length) {
      throw new ExpressionError("Unexpected trailing tokens");
    }
    return value;
  }
  peek() {
    return this.tokens[this.pos];
  }
  parseExpr() {
    let value = this.parseTerm();
    for (; ; ) {
      const t = this.peek();
      if (t?.kind === "op" && (t.op === "+" || t.op === "-")) {
        this.pos++;
        const rhs = this.parseTerm();
        value = t.op === "+" ? value + rhs : value - rhs;
      } else {
        return value;
      }
    }
  }
  parseTerm() {
    let value = this.parseFactor();
    for (; ; ) {
      const t = this.peek();
      if (t?.kind === "op" && (t.op === "*" || t.op === "/")) {
        this.pos++;
        const rhs = this.parseFactor();
        if (t.op === "/") {
          if (rhs === 0) throw new ExpressionError("Division by zero");
          value = value / rhs;
        } else {
          value = value * rhs;
        }
      } else {
        return value;
      }
    }
  }
  parseFactor() {
    const t = this.peek();
    if (!t) throw new ExpressionError("Unexpected end of expression");
    if (t.kind === "op" && (t.op === "-" || t.op === "+")) {
      this.pos++;
      const value = this.parseFactor();
      return t.op === "-" ? -value : value;
    }
    if (t.kind === "num") {
      this.pos++;
      return t.value;
    }
    if (t.kind === "ref") {
      this.pos++;
      const resolved = this.resolve(t.name);
      if (resolved === null || !Number.isFinite(resolved)) {
        throw new ExpressionError(`Unresolvable reference '${t.name}'`);
      }
      return resolved;
    }
    if (t.kind === "lparen") {
      this.pos++;
      const value = this.parseExpr();
      const close = this.peek();
      if (close?.kind !== "rparen") {
        throw new ExpressionError("Missing closing parenthesis");
      }
      this.pos++;
      return value;
    }
    throw new ExpressionError("Unexpected token");
  }
};
function evaluateArithmeticExpression(expression, resolve) {
  if (typeof expression !== "string") return null;
  const src = expression.replace(EXPR_PREFIX, "");
  const tokens = tokenize(src);
  if (!tokens || tokens.length === 0) return null;
  try {
    const result = new Parser(tokens, resolve).parse();
    return Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

// src/beats/SetVariableBeat.ts
var SetVariableBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "variableType");
    // 'variable', 'counter', or 'fictionalTime'
    __publicField(this, "variableName");
    __publicField(this, "value");
    __publicField(this, "operation");
    // Optional counter owner. Omitted/empty ⇒ story-global counter (unchanged
    // behavior). A Character id/name scopes the counter to that character's
    // per-character store. Only meaningful when type='counter'.
    __publicField(this, "character");
    // Fictional time properties
    __publicField(this, "timeUnit");
    __publicField(this, "timeYear");
    __publicField(this, "timeMonth");
    __publicField(this, "timeDay");
    __publicField(this, "timeHour");
    __publicField(this, "timeMinute");
    this.variableType = config.parameters?.type || "variable";
    this.variableName = config.parameters?.name || config.parameters?.variableName || config.variable || config.parameters?.variable || "";
    this.value = config.parameters?.value ?? config.value ?? "";
    this.operation = config.parameters?.operation || config.operation || "set";
    const charRaw = config.parameters?.character ?? config.character;
    const charTrimmed = typeof charRaw === "string" ? charRaw.trim() : "";
    this.character = charTrimmed ? charTrimmed : void 0;
    this.timeUnit = config.parameters?.timeUnit || "hours";
    this.timeYear = config.parameters?.timeYear ?? 2024;
    this.timeMonth = config.parameters?.timeMonth ?? 1;
    this.timeDay = config.parameters?.timeDay ?? 1;
    this.timeHour = config.parameters?.timeHour ?? 0;
    this.timeMinute = config.parameters?.timeMinute ?? 0;
  }
  getParameters() {
    return {
      type: this.variableType,
      name: this.variableName,
      value: this.value,
      operation: this.operation,
      character: this.character,
      timeUnit: this.timeUnit,
      timeYear: this.timeYear,
      timeMonth: this.timeMonth,
      timeDay: this.timeDay,
      timeHour: this.timeHour,
      timeMinute: this.timeMinute
    };
  }
  updateParameters(params) {
    if (params.type !== void 0) this.variableType = params.type;
    if (params.name !== void 0) this.variableName = params.name;
    if (params.variable !== void 0) this.variableName = params.variable;
    if (params.variableName !== void 0) this.variableName = params.variableName;
    if (params.value !== void 0) this.value = params.value;
    if (params.operation !== void 0) this.operation = params.operation;
    if (params.character !== void 0) {
      const t = typeof params.character === "string" ? params.character.trim() : "";
      this.character = t ? t : void 0;
    }
    if (params.timeUnit !== void 0) this.timeUnit = params.timeUnit;
    if (params.timeYear !== void 0) this.timeYear = params.timeYear;
    if (params.timeMonth !== void 0) this.timeMonth = params.timeMonth;
    if (params.timeDay !== void 0) this.timeDay = params.timeDay;
    if (params.timeHour !== void 0) this.timeHour = params.timeHour;
    if (params.timeMinute !== void 0) this.timeMinute = params.timeMinute;
  }
  /**
   * If `value` opts in to arithmetic evaluation (leading '=', spreadsheet
   * convention — e.g. "= (var1 + var2) / 100"), evaluate it against the
   * story's variables/counters. Returns the numeric result, or null when the
   * value is not an expression OR evaluation failed (unknown reference,
   * division by zero, syntax error). Failures warn so authors can spot them;
   * callers fall back to legacy literal handling.
   */
  tryEvaluateExpression(context) {
    if (!isArithmeticExpression(this.value)) return null;
    const result = evaluateArithmeticExpression(
      this.value,
      createContextResolver(context)
    );
    if (result === null) {
      console.warn(
        `SetVariableBeat ${this.id}: could not evaluate expression '${this.value}' (unknown reference, division by zero, or syntax error) \u2014 falling back to literal value`
      );
    }
    return result;
  }
  async performAction(context, renderer) {
    if (!this.variableName && this.variableType !== "fictionalTime") {
      console.error(`SetVariableBeat ${this.id} has no variable/counter name specified`);
      return this.getNextBeat(context);
    }
    try {
      if (this.variableType === "fictionalTime") {
        const unit = this.timeUnit || "hours";
        if (this.operation === "set") {
          context.setFictionalTime({
            year: this.timeYear ?? 2024,
            month: this.timeMonth ?? 1,
            day: this.timeDay ?? 1,
            hour: this.timeHour ?? 0,
            minute: this.timeMinute ?? 0
          });
          console.log(`SetVariableBeat ${this.id}: FictionalTime set to ${this.timeDay}/${this.timeMonth}/${this.timeYear} ${this.timeHour}:${this.timeMinute}`);
        } else if (this.operation === "advance") {
          context.advanceFictionalTime(Number(this.value) || 0, unit);
          console.log(`SetVariableBeat ${this.id}: FictionalTime advance ${this.value} ${unit}`);
        } else if (this.operation === "subtract") {
          context.advanceFictionalTime(-(Number(this.value) || 0), unit);
          console.log(`SetVariableBeat ${this.id}: FictionalTime subtract ${this.value} ${unit}`);
        }
      } else if (this.variableType === "counter") {
        const scoped = !!this.character;
        const currentValue = scoped ? context.getCharacterCounter(this.character, this.variableName) : context.getCounter(this.variableName) || 0;
        const evaluated = this.tryEvaluateExpression(context);
        const numValue = evaluated !== null ? evaluated : Number(this.value) || 0;
        let newValue;
        switch (this.operation) {
          case "change":
          case "add":
            newValue = currentValue + numValue;
            break;
          case "subtract":
            newValue = currentValue - numValue;
            break;
          case "multiply":
            newValue = currentValue * numValue;
            break;
          case "divide":
            newValue = numValue !== 0 ? currentValue / numValue : currentValue;
            break;
          case "set":
          default:
            newValue = numValue;
            break;
        }
        if (scoped) {
          context.setCharacterCounter(this.character, this.variableName, newValue);
        } else {
          context.setCounter(this.variableName, newValue);
        }
        console.log(`SetVariableBeat ${this.id}: Counter '${this.variableName}'${scoped ? ` @${this.character}` : ""} ${this.operation} \u2192 ${newValue} (was ${currentValue})`);
      } else {
        const evaluated = this.tryEvaluateExpression(context);
        const valueToStore = evaluated !== null ? evaluated : this.value;
        context.setVariable(this.variableName, valueToStore);
        console.log(`SetVariableBeat ${this.id}: Variable '${this.variableName}' = ${valueToStore}`);
      }
    } catch (error) {
      console.error(`Error in SetVariableBeat ${this.id}:`, error);
    }
    return this.getNextBeat(context);
  }
};

// src/beats/ConditionBeat.ts
var ConditionBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "condition");
    __publicField(this, "conditionType");
    __publicField(this, "trueTarget");
    __publicField(this, "falseTarget");
    // Store all possible condition parameters
    __publicField(this, "variableName");
    // Canonical name for variable/counter name
    __publicField(this, "operator");
    __publicField(this, "val");
    __publicField(this, "value");
    // Canonical name for comparison value
    __publicField(this, "counter1");
    __publicField(this, "counter2");
    __publicField(this, "timer");
    __publicField(this, "inventory");
    __publicField(this, "variable");
    // Inventory-specific parameters
    __publicField(this, "item");
    __publicField(this, "character");
    __publicField(this, "checkType");
    // Inventory quantity check parameters
    __publicField(this, "quantityCheck");
    __publicField(this, "quantityOperator");
    __publicField(this, "quantityValue");
    __publicField(this, "compareSource");
    // What to compare: inventory quantity or variable value
    __publicField(this, "compareVariable");
    // Variable name when compareSource is 'variable'
    // VisitedBeat-specific parameter
    __publicField(this, "beatId");
    // FictionalTime-specific parameters
    __publicField(this, "timeYear");
    __publicField(this, "timeMonth");
    __publicField(this, "timeDay");
    __publicField(this, "timeHour");
    __publicField(this, "timeMinute");
    // Mood-specific parameter (Step 4)
    __publicField(this, "moodAxis");
    // Sentiment-specific parameters (Step 4)
    __publicField(this, "sentimentTarget");
    __publicField(this, "sentimentEmotion");
    // Emotion-specific parameter (Step 5)
    __publicField(this, "emotionName");
    // Trait-specific parameter (Step 6) — branches on a character's static trait value.
    __publicField(this, "traitName");
    // v0.9.45 — baseline switch on mood / emotion / sentiment conditions.
    // 'literal' (or undefined) compares current value directly; 'initial'
    // compares (current - story-start value); { bookmark: name } compares
    // (current - bookmarked value). See Condition.baseline in types.
    __publicField(this, "baseline");
    // Goal-specific parameters (Step 8). goalId names the authored goal;
    // goalStatus is the compared status ('open' | 'met' | 'failed' |
    // 'abandoned'). The runtime reads either goalStatus directly or
    // value (string) for back-compat.
    __publicField(this, "goalId");
    __publicField(this, "goalStatus");
    // characterVariant-specific parameter — the variant id under test.
    __publicField(this, "variantId");
    // roleHolder: the cast role under test (character = who should hold it).
    __publicField(this, "role");
    // XR-condition fields (v0.9.48 / S3+).
    // gpsProximity: targetLat/Lng + radiusMeters; runtime measures
    //   haversine distance from cached SensorService location.
    // indoorProximity: beaconUuid + beaconRangeMeters; runtime reads
    //   cached beacon distance from SensorService.
    // permissionGranted: permission name (e.g. 'location' | 'beacons').
    // proximityMode discriminates 'within' vs 'outside' for both
    // proximity types.
    __publicField(this, "targetLat");
    __publicField(this, "targetLng");
    __publicField(this, "radiusMeters");
    __publicField(this, "beaconUuid");
    __publicField(this, "beaconRangeMeters");
    __publicField(this, "permission");
    __publicField(this, "proximityMode");
    const params = config.parameters || {};
    const conditionObj = params.condition || {};
    this.conditionType = conditionObj.type || params.conditionType || config.conditionType || "counter";
    const trueConn = params.trueConnection;
    const falseConn = params.falseConnection;
    this.trueTarget = params.trueTarget || config.trueTarget || (trueConn ? typeof trueConn === "string" ? trueConn : trueConn.target : "") || "";
    this.falseTarget = params.falseTarget || config.falseTarget || (falseConn ? typeof falseConn === "string" ? falseConn : falseConn.target : void 0);
    this.variableName = conditionObj.variableName || params.variableName || config.variableName;
    this.operator = conditionObj.operator || params.operator || config.operator || "==";
    this.val = conditionObj.val ?? params.val ?? config.val;
    this.value = conditionObj.value ?? params.value ?? config.value;
    this.counter1 = conditionObj.counter1 || params.counter1 || config.counter1;
    this.counter2 = conditionObj.counter2 || params.counter2 || config.counter2;
    this.timer = conditionObj.timer || params.timer || config.timer;
    this.inventory = conditionObj.inventory || params.inventory || config.inventory;
    this.variable = conditionObj.variable || params.variable || config.variable;
    this.item = conditionObj.item || params.item || config.item;
    this.character = conditionObj.character || params.character || config.character || (this.conditionType === "inventory" ? "player" : void 0);
    this.checkType = conditionObj.checkType || params.checkType || config.checkType || (this.conditionType === "inventory" ? "has" : void 0);
    this.quantityCheck = this.checkType === "quantity";
    this.quantityOperator = conditionObj.quantityOperator || params.quantityOperator || config.quantityOperator;
    this.quantityValue = conditionObj.quantityValue ?? params.quantityValue ?? config.quantityValue;
    this.compareSource = conditionObj.compareSource || params.compareSource || config.compareSource || "inventory";
    this.compareVariable = conditionObj.compareVariable || params.compareVariable || config.compareVariable;
    this.beatId = conditionObj.beatId || params.beatId || config.beatId;
    this.timeYear = conditionObj.timeYear ?? params.timeYear ?? config.timeYear;
    this.timeMonth = conditionObj.timeMonth ?? params.timeMonth ?? config.timeMonth;
    this.timeDay = conditionObj.timeDay ?? params.timeDay ?? config.timeDay;
    this.timeHour = conditionObj.timeHour ?? params.timeHour ?? config.timeHour;
    this.timeMinute = conditionObj.timeMinute ?? params.timeMinute ?? config.timeMinute;
    this.applyCompareTime(conditionObj, params, config);
    this.moodAxis = conditionObj.moodAxis || params.moodAxis || config.moodAxis || "valence";
    this.sentimentTarget = conditionObj.sentimentTarget || params.sentimentTarget || config.sentimentTarget;
    this.sentimentEmotion = conditionObj.sentimentEmotion || params.sentimentEmotion || config.sentimentEmotion;
    this.emotionName = conditionObj.emotionName || params.emotionName || config.emotionName;
    this.traitName = conditionObj.traitName || params.traitName || config.traitName;
    this.baseline = conditionObj.baseline ?? params.baseline ?? config.baseline;
    this.goalId = conditionObj.goalId || params.goalId || config.goalId;
    this.goalStatus = conditionObj.goalStatus || params.goalStatus || config.goalStatus;
    this.variantId = conditionObj.variantId || params.variantId || config.variantId;
    this.role = conditionObj.role || params.role || config.role;
    this.targetLat = conditionObj.targetLat ?? params.targetLat ?? config.targetLat;
    this.targetLng = conditionObj.targetLng ?? params.targetLng ?? config.targetLng;
    this.radiusMeters = conditionObj.radiusMeters ?? params.radiusMeters ?? config.radiusMeters;
    this.beaconUuid = conditionObj.beaconUuid || params.beaconUuid || config.beaconUuid;
    this.beaconRangeMeters = conditionObj.beaconRangeMeters ?? params.beaconRangeMeters ?? config.beaconRangeMeters;
    this.permission = conditionObj.permission || params.permission || config.permission;
    this.proximityMode = conditionObj.proximityMode || params.proximityMode || config.proximityMode;
    this.condition = this.buildCondition();
  }
  buildCondition() {
    const condition = {
      type: this.conditionType,
      operator: this.operator
    };
    switch (this.conditionType) {
      case "counter":
        condition.variableName = this.variableName || this.variable;
        condition.value = this.value ?? this.val ?? 0;
        if (this.character) condition.character = this.character;
        break;
      case "counterCompare":
        condition.counter1 = this.counter1;
        condition.counter2 = this.counter2;
        if (this.character) condition.character = this.character;
        break;
      case "timer":
        condition.timer = this.timer;
        condition.value = this.value ?? this.val ?? 0;
        break;
      case "inventory":
        condition.item = this.item;
        condition.character = this.character || "player";
        condition.checkType = this.checkType || "has";
        if (this.checkType === "quantity") {
          condition.quantityCheck = true;
          condition.quantityOperator = this.quantityOperator || ">=";
          condition.quantityValue = this.quantityValue;
          condition.compareSource = this.compareSource || "inventory";
          condition.compareVariable = this.compareVariable;
        }
        break;
      case "variable":
        condition.variableName = this.variableName || this.variable;
        condition.value = this.value ?? this.val;
        break;
      case "visitedBeat":
        condition.beatId = this.beatId || this.variableName;
        break;
      case "fictionalTime":
        condition.compareTime = {
          year: this.timeYear ?? 2024,
          month: this.timeMonth ?? 1,
          day: this.timeDay ?? 1,
          hour: this.timeHour ?? 0,
          minute: this.timeMinute ?? 0
        };
        break;
      case "mood":
        condition.character = this.character;
        condition.moodAxis = this.moodAxis || "valence";
        condition.value = this.value ?? this.val ?? 0;
        if (this.baseline !== void 0) condition.baseline = this.baseline;
        break;
      case "sentiment":
        condition.character = this.character;
        condition.sentimentTarget = this.sentimentTarget;
        condition.sentimentEmotion = this.sentimentEmotion;
        condition.value = this.value ?? this.val ?? 0;
        if (this.baseline !== void 0) condition.baseline = this.baseline;
        break;
      case "emotion":
        condition.character = this.character;
        condition.emotionName = this.emotionName;
        condition.value = this.value ?? this.val ?? 0;
        if (this.baseline !== void 0) condition.baseline = this.baseline;
        break;
      case "trait":
        condition.character = this.character;
        condition.traitName = this.traitName;
        condition.value = this.value ?? this.val ?? 0;
        break;
      // These used to fall to the default branch, which kept only
      // variableName/value — the runtime then never saw the goal, the
      // variant or the role under test, and the check always failed.
      case "goal":
        condition.character = this.character;
        condition.goalId = this.goalId;
        if (this.goalStatus) condition.goalStatus = this.goalStatus;
        if (this.value !== void 0) condition.value = this.value;
        break;
      case "characterVariant":
        condition.character = this.character;
        condition.variantId = this.variantId;
        if (this.value !== void 0) condition.value = this.value;
        break;
      case "roleHolder":
        condition.role = this.role;
        condition.character = this.character;
        condition.operator = this.operator === "!=" ? "!=" : "==";
        break;
      case "gpsProximity":
        condition.targetLat = this.targetLat;
        condition.targetLng = this.targetLng;
        condition.radiusMeters = this.radiusMeters;
        condition.proximityMode = this.proximityMode;
        break;
      case "indoorProximity":
        condition.beaconUuid = this.beaconUuid;
        condition.beaconRangeMeters = this.beaconRangeMeters;
        condition.proximityMode = this.proximityMode;
        break;
      case "permissionGranted":
        condition.permissions = Array.isArray(this.permission) ? this.permission : this.permission ? [this.permission] : [];
        break;
      default:
        condition.variableName = this.variableName || this.variable;
        condition.value = this.value ?? this.val;
    }
    return condition;
  }
  /**
   * The generation prompt (and the runtime Condition type) express a
   * fictional-time check as `compareTime: {year, month, day, hour, minute}`,
   * nested in `condition` or flat in the parameters, while this beat stores
   * timeYear … timeMinute. compareTime was never read, so every generated
   * time gate fell back to 2024-01-01 00:00. Fill the fields it names that
   * no explicit time* field already set (`override`: an update's compareTime wins).
   */
  applyCompareTime(conditionObj, params, config, override = false) {
    const ct = params?.compareTime ?? conditionObj?.compareTime ?? config?.compareTime;
    if (!ct || typeof ct !== "object") return;
    const explicit = (key) => params?.[key] !== void 0 || conditionObj?.[key] !== void 0;
    const take = (key, v) => {
      if (typeof v !== "number" && !(typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)))) return;
      if (explicit(key)) return;
      if (override || this[key] === void 0) this[key] = Number(v);
    };
    take("timeYear", ct.year);
    take("timeMonth", ct.month);
    take("timeDay", ct.day);
    take("timeHour", ct.hour);
    take("timeMinute", ct.minute);
  }
  getParameters() {
    return {
      conditionType: this.conditionType,
      condition: this.condition,
      trueTarget: this.trueTarget,
      falseTarget: this.falseTarget,
      // Canonical field names
      variableName: this.variableName,
      value: this.value,
      operator: this.operator,
      val: this.val,
      counter1: this.counter1,
      counter2: this.counter2,
      timer: this.timer,
      inventory: this.inventory,
      variable: this.variable,
      item: this.item,
      character: this.character,
      checkType: this.checkType,
      // Quantity check fields
      quantityCheck: this.quantityCheck,
      quantityOperator: this.quantityOperator,
      quantityValue: this.quantityValue,
      compareSource: this.compareSource,
      compareVariable: this.compareVariable,
      beatId: this.beatId,
      timeYear: this.timeYear,
      timeMonth: this.timeMonth,
      timeDay: this.timeDay,
      timeHour: this.timeHour,
      timeMinute: this.timeMinute,
      moodAxis: this.moodAxis,
      sentimentTarget: this.sentimentTarget,
      sentimentEmotion: this.sentimentEmotion,
      emotionName: this.emotionName,
      traitName: this.traitName,
      baseline: this.baseline,
      goalId: this.goalId,
      goalStatus: this.goalStatus,
      variantId: this.variantId,
      role: this.role,
      targetLat: this.targetLat,
      targetLng: this.targetLng,
      radiusMeters: this.radiusMeters,
      beaconUuid: this.beaconUuid,
      beaconRangeMeters: this.beaconRangeMeters,
      permission: this.permission,
      proximityMode: this.proximityMode
    };
  }
  /**
   * Override getConnections to return connections from trueTarget/falseTarget
   * This ensures the graph visualization shows the condition branches
   */
  getConnections() {
    const connections = [];
    if (this.trueTarget) {
      connections.push({
        targetId: this.trueTarget,
        label: "true"
      });
    }
    if (this.falseTarget) {
      connections.push({
        targetId: this.falseTarget,
        label: "false"
      });
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId && c.label === conn.label)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  updateParameters(params) {
    const conditionObj = params.condition || {};
    if (params.conditionType !== void 0) {
      this.conditionType = params.conditionType;
    } else if (conditionObj.type !== void 0) {
      this.conditionType = conditionObj.type;
    }
    if (params.trueTarget !== void 0) this.trueTarget = params.trueTarget;
    if (params.falseTarget !== void 0) this.falseTarget = params.falseTarget;
    const trueConn = params.trueConnection;
    const falseConn = params.falseConnection;
    if (trueConn) {
      this.trueTarget = typeof trueConn === "string" ? trueConn : trueConn.target;
    }
    if (falseConn) {
      this.falseTarget = typeof falseConn === "string" ? falseConn : falseConn.target;
    }
    if (params.variableName !== void 0) {
      this.variableName = params.variableName;
    } else if (conditionObj.variableName !== void 0) {
      this.variableName = conditionObj.variableName;
    }
    if (params.value !== void 0) {
      this.value = params.value;
    } else if (conditionObj.value !== void 0) {
      this.value = conditionObj.value;
    }
    if (params.operator !== void 0) {
      this.operator = params.operator;
    } else if (conditionObj.operator !== void 0) {
      this.operator = conditionObj.operator;
    }
    if (params.val !== void 0) {
      this.val = params.val;
    } else if (conditionObj.val !== void 0) {
      this.val = conditionObj.val;
    }
    if (params.counter1 !== void 0) {
      this.counter1 = params.counter1;
    } else if (conditionObj.counter1 !== void 0) {
      this.counter1 = conditionObj.counter1;
    }
    if (params.counter2 !== void 0) {
      this.counter2 = params.counter2;
    } else if (conditionObj.counter2 !== void 0) {
      this.counter2 = conditionObj.counter2;
    }
    if (params.timer !== void 0) {
      this.timer = params.timer;
    } else if (conditionObj.timer !== void 0) {
      this.timer = conditionObj.timer;
    }
    if (params.inventory !== void 0) {
      this.inventory = params.inventory;
    } else if (conditionObj.inventory !== void 0) {
      this.inventory = conditionObj.inventory;
    }
    if (params.variable !== void 0) {
      this.variable = params.variable;
    } else if (conditionObj.variable !== void 0) {
      this.variable = conditionObj.variable;
    }
    if (params.item !== void 0) {
      this.item = params.item;
    } else if (conditionObj.item !== void 0) {
      this.item = conditionObj.item;
    }
    if (params.character !== void 0) {
      this.character = params.character;
    } else if (conditionObj.character !== void 0) {
      this.character = conditionObj.character;
    }
    if (params.checkType !== void 0) {
      this.checkType = params.checkType;
      this.quantityCheck = params.checkType === "quantity";
    } else if (conditionObj.checkType !== void 0) {
      this.checkType = conditionObj.checkType;
      this.quantityCheck = conditionObj.checkType === "quantity";
    }
    if (params.quantityOperator !== void 0) {
      this.quantityOperator = params.quantityOperator;
    } else if (conditionObj.quantityOperator !== void 0) {
      this.quantityOperator = conditionObj.quantityOperator;
    }
    if (params.quantityValue !== void 0) {
      this.quantityValue = params.quantityValue;
    } else if (conditionObj.quantityValue !== void 0) {
      this.quantityValue = conditionObj.quantityValue;
    }
    if (params.compareSource !== void 0) {
      this.compareSource = params.compareSource;
    } else if (conditionObj.compareSource !== void 0) {
      this.compareSource = conditionObj.compareSource;
    }
    if (params.compareVariable !== void 0) {
      this.compareVariable = params.compareVariable;
    } else if (conditionObj.compareVariable !== void 0) {
      this.compareVariable = conditionObj.compareVariable;
    }
    if (params.beatId !== void 0) {
      this.beatId = params.beatId;
    } else if (conditionObj.beatId !== void 0) {
      this.beatId = conditionObj.beatId;
    }
    if (params.timeYear !== void 0) {
      this.timeYear = params.timeYear;
    } else if (conditionObj.timeYear !== void 0) {
      this.timeYear = conditionObj.timeYear;
    }
    if (params.timeMonth !== void 0) {
      this.timeMonth = params.timeMonth;
    } else if (conditionObj.timeMonth !== void 0) {
      this.timeMonth = conditionObj.timeMonth;
    }
    if (params.timeDay !== void 0) {
      this.timeDay = params.timeDay;
    } else if (conditionObj.timeDay !== void 0) {
      this.timeDay = conditionObj.timeDay;
    }
    if (params.timeHour !== void 0) {
      this.timeHour = params.timeHour;
    } else if (conditionObj.timeHour !== void 0) {
      this.timeHour = conditionObj.timeHour;
    }
    if (params.timeMinute !== void 0) {
      this.timeMinute = params.timeMinute;
    } else if (conditionObj.timeMinute !== void 0) {
      this.timeMinute = conditionObj.timeMinute;
    }
    this.applyCompareTime(conditionObj, params, null, true);
    if (params.traitName !== void 0) {
      this.traitName = params.traitName;
    } else if (conditionObj.traitName !== void 0) {
      this.traitName = conditionObj.traitName;
    }
    if (params.baseline !== void 0) {
      this.baseline = params.baseline;
    } else if (conditionObj.baseline !== void 0) {
      this.baseline = conditionObj.baseline;
    }
    if (params.moodAxis !== void 0) {
      this.moodAxis = params.moodAxis;
    } else if (conditionObj.moodAxis !== void 0) {
      this.moodAxis = conditionObj.moodAxis;
    }
    if (params.sentimentTarget !== void 0) {
      this.sentimentTarget = params.sentimentTarget;
    } else if (conditionObj.sentimentTarget !== void 0) {
      this.sentimentTarget = conditionObj.sentimentTarget;
    }
    if (params.sentimentEmotion !== void 0) {
      this.sentimentEmotion = params.sentimentEmotion;
    } else if (conditionObj.sentimentEmotion !== void 0) {
      this.sentimentEmotion = conditionObj.sentimentEmotion;
    }
    if (params.emotionName !== void 0) {
      this.emotionName = params.emotionName;
    } else if (conditionObj.emotionName !== void 0) {
      this.emotionName = conditionObj.emotionName;
    }
    if (params.goalId !== void 0) {
      this.goalId = params.goalId;
    } else if (conditionObj.goalId !== void 0) {
      this.goalId = conditionObj.goalId;
    }
    if (params.goalStatus !== void 0) {
      this.goalStatus = params.goalStatus;
    } else if (conditionObj.goalStatus !== void 0) {
      this.goalStatus = conditionObj.goalStatus;
    }
    if (params.variantId !== void 0) {
      this.variantId = params.variantId;
    } else if (conditionObj.variantId !== void 0) {
      this.variantId = conditionObj.variantId;
    }
    if (params.role !== void 0) {
      this.role = params.role;
    } else if (conditionObj.role !== void 0) {
      this.role = conditionObj.role;
    }
    if (params.targetLat !== void 0) {
      this.targetLat = params.targetLat;
    } else if (conditionObj.targetLat !== void 0) {
      this.targetLat = conditionObj.targetLat;
    }
    if (params.targetLng !== void 0) {
      this.targetLng = params.targetLng;
    } else if (conditionObj.targetLng !== void 0) {
      this.targetLng = conditionObj.targetLng;
    }
    if (params.radiusMeters !== void 0) {
      this.radiusMeters = params.radiusMeters;
    } else if (conditionObj.radiusMeters !== void 0) {
      this.radiusMeters = conditionObj.radiusMeters;
    }
    if (params.beaconUuid !== void 0) {
      this.beaconUuid = params.beaconUuid;
    } else if (conditionObj.beaconUuid !== void 0) {
      this.beaconUuid = conditionObj.beaconUuid;
    }
    if (params.beaconRangeMeters !== void 0) {
      this.beaconRangeMeters = params.beaconRangeMeters;
    } else if (conditionObj.beaconRangeMeters !== void 0) {
      this.beaconRangeMeters = conditionObj.beaconRangeMeters;
    }
    if (params.permission !== void 0) {
      this.permission = params.permission;
    } else if (conditionObj.permission !== void 0) {
      this.permission = conditionObj.permission;
    }
    if (params.proximityMode !== void 0) {
      this.proximityMode = params.proximityMode;
    } else if (conditionObj.proximityMode !== void 0) {
      this.proximityMode = conditionObj.proximityMode;
    }
    this.condition = this.buildCondition();
  }
  async performAction(context, renderer) {
    let isValidCondition = false;
    switch (this.conditionType) {
      case "counterCompare":
        isValidCondition = !!(this.counter1 && this.counter2);
        break;
      case "timer":
        isValidCondition = !!this.timer;
        break;
      case "inventory":
        isValidCondition = !!this.item;
        break;
      case "variable":
        isValidCondition = !!(this.variable || this.variableName);
        break;
      case "visitedBeat":
        isValidCondition = !!(this.beatId || this.variableName);
        break;
      case "fictionalTime":
        isValidCondition = true;
        break;
      case "mood":
        isValidCondition = !!this.character;
        break;
      case "sentiment":
        isValidCondition = !!(this.character && this.sentimentTarget);
        break;
      case "emotion":
        isValidCondition = !!(this.character && this.emotionName);
        break;
      case "trait":
        isValidCondition = !!(this.character && this.traitName);
        break;
      case "goal":
        isValidCondition = !!(this.character && this.goalId);
        break;
      case "characterVariant":
        isValidCondition = !!this.character;
        break;
      case "roleHolder":
        isValidCondition = !!(this.role && this.character);
        break;
      case "gpsProximity":
      case "indoorProximity":
      case "permissionGranted":
        isValidCondition = true;
        break;
      case "counter":
      default:
        isValidCondition = !!(this.variableName || this.variable);
    }
    if (!isValidCondition || this.trueTarget === "") {
      console.error(`ConditionBeat ${this.id} has invalid condition or target`);
      return this.getNextBeat(context);
    }
    try {
      const conditionResult = context.checkCondition(this.condition);
      const varName = this.variableName || this.variable;
      const compareValue = this.value ?? this.val;
      let reason;
      if (this.conditionType === "counterCompare") {
        reason = `${this.counter1} ${this.operator} ${this.counter2} = ${conditionResult}`;
      } else if (this.conditionType === "timer") {
        reason = `timer ${this.timer} ${this.operator} ${compareValue} = ${conditionResult}`;
      } else if (this.conditionType === "visitedBeat") {
        reason = `visitedBeat ${this.beatId || varName} = ${conditionResult}`;
      } else if (this.conditionType === "fictionalTime") {
        reason = `fictionalTime ${this.operator} ${this.timeDay}/${this.timeMonth}/${this.timeYear} ${this.timeHour}:${this.timeMinute} = ${conditionResult}`;
      } else if (this.conditionType === "mood") {
        const m = context.getCharacterMood(this.character || "");
        const v = (this.moodAxis || "valence") === "arousal" ? m.arousal : m.valence;
        reason = `${this.character}.mood.${this.moodAxis || "valence"} (${v.toFixed(2)}) ${this.operator} ${compareValue} = ${conditionResult}`;
      } else if (this.conditionType === "sentiment") {
        const s = context.getSentimentTo(this.character || "", this.sentimentTarget || "", this.sentimentEmotion);
        const emotionLabel = this.sentimentEmotion ? `.${this.sentimentEmotion}` : "";
        reason = `${this.character}.sentiment[\u2192${this.sentimentTarget}${emotionLabel}] (${s.toFixed(2)}) ${this.operator} ${compareValue} = ${conditionResult}`;
      } else if (this.conditionType === "emotion") {
        const v = context.getCharacterEmotion(this.character || "", this.emotionName || "");
        reason = `${this.character}.emotion.${this.emotionName} (${v.toFixed(2)}) ${this.operator} ${compareValue} = ${conditionResult}`;
      } else if (this.conditionType === "trait") {
        const characters = context.getStory()?.getCharacters?.();
        const charRecord = characters?.find((c) => c?.id === this.character);
        const v = Number(charRecord?.traits?.[this.traitName || ""] ?? 0);
        reason = `${this.character}.trait.${this.traitName} (${v.toFixed(2)}) ${this.operator} ${compareValue} = ${conditionResult}`;
      } else {
        const currentValue = this.conditionType === "counter" ? this.character ? context.getCharacterCounter(this.character, varName || "") : context.getCounter(varName || "") : context.getVariable(varName || "");
        const ownerTag = this.conditionType === "counter" && this.character ? `@${this.character}` : "";
        reason = `${varName}${ownerTag} (${JSON.stringify(currentValue)}) ${this.operator} ${JSON.stringify(compareValue)} = ${conditionResult}`;
      }
      console.log(`ConditionBeat ${this.id}: ${reason}`);
      const targetId = conditionResult ? this.trueTarget : this.falseTarget || this.getNextBeat(context);
      try {
        let targetBeat;
        try {
          targetBeat = targetId ? context.getStory().getBeat(targetId) : void 0;
        } catch {
        }
        context.recordTimelineEvent({
          type: "branch",
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "condition",
          targetBeatId: targetId || void 0,
          targetBeatName: targetBeat?.name,
          reason
        });
      } catch (timelineErr) {
        console.warn(`ConditionBeat ${this.id}: timeline event failed (non-fatal):`, timelineErr);
      }
      if (conditionResult) {
        return this.trueTarget;
      } else if (this.falseTarget) {
        return this.falseTarget;
      } else {
        return this.getNextBeat(context);
      }
    } catch (error) {
      console.error(`Error evaluating condition in beat ${this.id}:`, error);
      return this.getNextBeat(context);
    }
  }
};

// src/utils/duration.ts
function normalizeDurationToSeconds(value) {
  if (value === void 0 || value === null || !isFinite(value) || value <= 0) {
    return 0;
  }
  return value > 60 ? value / 1e3 : value;
}
function durationSecondsToMs(seconds) {
  return Math.round(Math.max(0, seconds) * 1e3);
}
function suggestDurationSeconds(text, opts = {}) {
  const wpm = opts.wpm && opts.wpm > 0 ? opts.wpm : 200;
  const safety = opts.safety && opts.safety > 0 ? opts.safety : 1.5;
  const floor = opts.floor !== void 0 ? opts.floor : 3;
  const words = (text || "").trim().split(/\s+/).filter((w) => w.length > 0).length;
  const raw = words / wpm * 60 * safety;
  return Math.max(floor, Math.ceil(raw));
}

// src/beats/DurScreenBeat.ts
var DurScreenBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "text");
    __publicField(this, "textVariations");
    __publicField(this, "duration");
    this.text = config.text || config.parameters?.text || "";
    this.textVariations = config.textVariations || config.parameters?.textVariations;
    const rawDuration = config.duration ?? config.parameters?.duration;
    this.duration = rawDuration != null ? normalizeDurationToSeconds(rawDuration) : suggestDurationSeconds(this.text);
    if (!this.duration || this.duration <= 0) {
      this.duration = suggestDurationSeconds(this.text);
    }
  }
  getParameters() {
    const params = {
      text: this.text,
      duration: this.duration,
      node: this.node
    };
    if (this.textVariations && this.textVariations.length > 0) {
      params.textVariations = this.textVariations;
    }
    params.slotIntent = this.slotIntent;
    params.slotAnimations = this.slotAnimations;
    return params;
  }
  updateParameters(params) {
    if (params.text !== void 0) this.text = params.text;
    if (params.textVariations !== void 0) this.textVariations = params.textVariations;
    if (params.duration !== void 0) {
      this.duration = normalizeDurationToSeconds(params.duration);
    }
    if (params.node !== void 0) this.node = params.node;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  /**
   * Select text from variations (if any) or return main text.
   * Combines main text with variations array for random selection.
   */
  selectText() {
    if (this.textVariations && this.textVariations.length > 0) {
      const allOptions = [this.text, ...this.textVariations];
      const randomIndex = Math.floor(Math.random() * allOptions.length);
      return allOptions[randomIndex];
    }
    return this.text;
  }
  async performAction(context, renderer) {
    renderer.setState("slotAnimations", this.slotAnimations);
    const selectedText = this.selectText();
    const processedText = this.processText(selectedText, context);
    const locations = Array.from(this.locations.values());
    await renderer.renderDurScreen(processedText, durationSecondsToMs(this.duration), locations);
    return this.getNextBeat(context);
  }
};

// src/beats/RandomTargetBeat.ts
function toBranch(raw) {
  if (typeof raw === "string") return { target: raw };
  if (!raw || typeof raw !== "object") return null;
  const target = raw.target || raw.targetId || raw.id || "";
  if (typeof target !== "string") return null;
  const b = { target };
  if (typeof raw.weight === "number" && Number.isFinite(raw.weight) && raw.weight >= 0) b.weight = raw.weight;
  if (Array.isArray(raw.effects) && raw.effects.length > 0) b.effects = raw.effects;
  if (typeof raw.label === "string" && raw.label) b.label = raw.label;
  return b;
}
var RandomTargetBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "branches");
    const params = config.parameters || {};
    const raw = params.choices || config.choices || params.targets || config.targets || [];
    this.branches = (Array.isArray(raw) ? raw : []).map(toBranch).filter(Boolean);
    this.updateConnections();
  }
  updateConnections() {
    this.connections = [];
    this.branches.forEach((b, index) => {
      if (!b.target) return;
      const weight = b.weight !== void 0 && b.weight !== 1 ? ` (\xD7${b.weight})` : "";
      this.addConnection({ targetId: b.target, label: b.label || `Random ${index + 1}${weight}` });
    });
  }
  getParameters() {
    const plain = this.branches.every((b) => b.weight === void 0 && !b.effects && !b.label);
    return {
      choices: plain ? this.branches.map((b) => b.target) : this.branches.map((b) => ({ ...b }))
    };
  }
  updateParameters(params) {
    const incoming = params.choices !== void 0 ? params.choices : params.targets;
    if (incoming !== void 0) {
      this.branches = (Array.isArray(incoming) ? incoming : []).map(toBranch).filter(Boolean);
      this.updateConnections();
    }
  }
  /** Weighted draw; weights default to 1, and all-zero falls back to an even draw. */
  draw() {
    const branches = this.branches.filter((b) => b.target);
    if (branches.length === 0) return null;
    const weights = branches.map((b) => b.weight === void 0 ? 1 : b.weight);
    const total = weights.reduce((a, w) => a + w, 0);
    if (total <= 0) return branches[Math.floor(Math.random() * branches.length)];
    let r = Math.random() * total;
    for (let i = 0; i < branches.length; i++) {
      r -= weights[i];
      if (r < 0 && weights[i] > 0) return branches[i];
    }
    for (let i = branches.length - 1; i >= 0; i--) if (weights[i] > 0) return branches[i];
    return branches[branches.length - 1];
  }
  async performAction(context, _renderer) {
    const branch = this.draw();
    if (!branch) {
      console.warn(`RandomTargetBeat ${this.id} has no valid choices`);
      return this.getNextBeat(context);
    }
    for (const effect of branch.effects ?? []) {
      try {
        context.applyEffect(effect);
      } catch (err) {
        console.warn(`RandomTargetBeat ${this.id}: effect failed`, effect, err);
      }
    }
    console.log(`RandomTargetBeat ${this.id}: drew -> ${branch.target}${branch.effects?.length ? ` (${branch.effects.length} effect(s))` : ""}`);
    return branch.target;
  }
};

// src/utils/geo.ts
var METERS_PER_DEG_LAT = 111320;
function offsetMeters(lat, lng, north, east) {
  const dLat = north / METERS_PER_DEG_LAT;
  const cos = Math.cos(lat * Math.PI / 180);
  const dLng = east / (METERS_PER_DEG_LAT * (Math.abs(cos) < 1e-9 ? 1e-9 : cos));
  return { lat: lat + dLat, lng: lng + dLng };
}
function scatterPointsAround(center, radiusMeters, count, opts = {}) {
  const rng = opts.rng ?? Math.random;
  const n = Math.max(0, Math.floor(count));
  const R = Math.max(0, radiusMeters);
  const m = Math.min(Math.max(0, opts.minDistanceMeters ?? 0), R);
  const out = [];
  for (let i = 0; i < n; i++) {
    const bearing = rng() * 2 * Math.PI;
    const dist = Math.sqrt(m * m + rng() * (R * R - m * m));
    const north = dist * Math.cos(bearing);
    const east = dist * Math.sin(bearing);
    const { lat, lng } = offsetMeters(center.lat, center.lng, north, east);
    out.push(opts.perPointRadius != null ? { lat, lng, radiusMeters: opts.perPointRadius } : { lat, lng });
  }
  return out;
}

// src/utils/overpass.ts
var DEFAULT_ENDPOINT = "https://overpass-api.de/api/interpreter";
var M_PER_DEG_LAT = 111320;
function distMeters(a, b) {
  const dN = (b.lat - a.lat) * M_PER_DEG_LAT;
  const dE = (b.lng - a.lng) * M_PER_DEG_LAT * Math.cos(a.lat * Math.PI / 180);
  return Math.sqrt(dN * dN + dE * dE);
}
function polygonAreaM2(ring) {
  if (ring.length < 3) return 0;
  const lat0 = ring[0].lat;
  const kx = M_PER_DEG_LAT * Math.cos(lat0 * Math.PI / 180);
  const ky = M_PER_DEG_LAT;
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].lng * kx, yi = ring[i].lat * ky;
    const xj = ring[j].lng * kx, yj = ring[j].lat * ky;
    a += xj * yi - xi * yj;
  }
  return Math.abs(a) / 2;
}
function pointInPolygon(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i].lat, xi = ring[i].lng;
    const yj = ring[j].lat, xj = ring[j].lng;
    const intersect = yi > pt.lat !== yj > pt.lat && pt.lng < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function buildWalkableQuery(lat, lng, radiusMeters, timeoutSec = 25) {
  const r = Math.max(1, Math.round(radiusMeters));
  const a = `(around:${r},${lat},${lng})`;
  return `[out:json][timeout:${timeoutSec}];(way["highway"~"^(footway|path|pedestrian|living_street|residential|track|steps|cycleway|service|unclassified|tertiary)$"]${a};way["leisure"~"^(park|garden|common|playground|pitch|recreation_ground|dog_park)$"]${a};way["landuse"~"^(recreation_ground|grass|village_green)$"]${a};);out geom;`;
}
function toFeatures(ways) {
  const features = [];
  for (const w of ways) {
    const geom = w.geometry;
    if (!Array.isArray(geom) || geom.length < 2) continue;
    const ring = geom.map((g) => ({ lat: g.lat, lng: g.lon }));
    const closed = ring.length >= 4 && Math.abs(ring[0].lat - ring[ring.length - 1].lat) < 1e-9 && Math.abs(ring[0].lng - ring[ring.length - 1].lng) < 1e-9;
    const isAreaTag = !!(w.tags && (w.tags.leisure || w.tags.landuse));
    if (closed && isAreaTag) {
      const weight = polygonAreaM2(ring);
      if (weight > 0) features.push({ kind: "area", ring, weight });
    } else {
      let len = 0;
      for (let i = 1; i < ring.length; i++) len += distMeters(ring[i - 1], ring[i]);
      if (len > 0) features.push({ kind: "line", ring, weight: len });
    }
  }
  return features;
}
function pickWeighted(features, total, rng) {
  if (features.length === 0 || total <= 0) return null;
  let u = rng() * total;
  for (const f of features) {
    u -= f.weight;
    if (u <= 0) return f;
  }
  return features[features.length - 1];
}
function samplePointIn(f, rng) {
  if (f.kind === "line") {
    const total = f.weight;
    let target = rng() * total;
    for (let i = 1; i < f.ring.length; i++) {
      const segLen = distMeters(f.ring[i - 1], f.ring[i]);
      if (target <= segLen || i === f.ring.length - 1) {
        const t = segLen > 0 ? target / segLen : 0;
        return {
          lat: f.ring[i - 1].lat + (f.ring[i].lat - f.ring[i - 1].lat) * t,
          lng: f.ring[i - 1].lng + (f.ring[i].lng - f.ring[i - 1].lng) * t
        };
      }
      target -= segLen;
    }
    return f.ring[0];
  }
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const p of f.ring) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }
  for (let tries = 0; tries < 24; tries++) {
    const cand = { lat: minLat + rng() * (maxLat - minLat), lng: minLng + rng() * (maxLng - minLng) };
    if (pointInPolygon(cand, f.ring)) return cand;
  }
  return null;
}
async function fetchWalkableWays(center, radiusMeters, opts = {}) {
  const fetchImpl = opts.fetchImpl ?? globalThis.__asapsOverpassFetch ?? globalThis.fetch?.bind(globalThis);
  if (!fetchImpl) return [];
  const endpoint = opts.endpoint ?? DEFAULT_ENDPOINT;
  const query = buildWalkableQuery(center.lat, center.lng, radiusMeters);
  const controller = typeof globalThis.AbortController !== "undefined" ? new globalThis.AbortController() : null;
  const timeoutMs = opts.timeoutMs ?? 12e3;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  if (opts.signal && controller) {
    if (opts.signal.aborted) controller.abort();
    else opts.signal.addEventListener?.("abort", () => controller.abort());
  }
  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller?.signal
    });
    if (!res.ok) {
      console.warn(`[overpass] walkable query failed: HTTP ${res.status}`);
      return [];
    }
    const json = await res.json();
    const els = Array.isArray(json?.elements) ? json.elements : [];
    return els.filter((e) => e?.type === "way" && Array.isArray(e.geometry));
  } catch (err) {
    console.warn("[overpass] walkable query failed:", err instanceof Error ? err.message : err);
    return [];
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function sampleWalkablePoints(center, radiusMeters, count, opts = {}) {
  const rng = opts.rng ?? Math.random;
  const n = Math.max(0, Math.floor(count));
  if (n === 0) return [];
  const ways = await fetchWalkableWays(center, radiusMeters, opts);
  const features = toFeatures(ways);
  const total = features.reduce((s, f) => s + f.weight, 0);
  if (features.length === 0 || total <= 0) return [];
  const out = [];
  let attempts = 0;
  const maxAttempts = n * 12;
  while (out.length < n && attempts < maxAttempts) {
    attempts++;
    const f = pickWeighted(features, total, rng);
    if (!f) break;
    const pt = samplePointIn(f, rng);
    if (!pt) continue;
    const d = distMeters(center, pt);
    if (d > radiusMeters) continue;
    if (d < (opts.minDistanceMeters ?? 0)) continue;
    out.push(opts.perPointRadius != null ? { ...pt, radiusMeters: opts.perPointRadius } : pt);
  }
  return out;
}

// src/beats/SetGpsLocationBeat.ts
var SetGpsLocationBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "gpsMode");
    __publicField(this, "pointName");
    __publicField(this, "lat");
    __publicField(this, "lng");
    __publicField(this, "pointRadiusMeters");
    __publicField(this, "fallbackLat");
    __publicField(this, "fallbackLng");
    __publicField(this, "count");
    __publicField(this, "scatterRadiusMeters");
    __publicField(this, "centerSource");
    __publicField(this, "centerPointName");
    __publicField(this, "placement");
    __publicField(this, "presetPoints");
    const p = config.parameters || {};
    const pick = (k) => config[k] ?? p[k];
    this.gpsMode = pick("mode") ?? "capture";
    this.pointName = (pick("pointName") ?? "").toString().trim();
    this.lat = pick("lat");
    this.lng = pick("lng");
    this.pointRadiusMeters = pick("pointRadiusMeters");
    this.fallbackLat = pick("fallbackLat");
    this.fallbackLng = pick("fallbackLng");
    this.count = Number(pick("count") ?? 3);
    this.scatterRadiusMeters = Number(pick("scatterRadiusMeters") ?? 100);
    this.centerSource = pick("centerSource") ?? "current";
    this.centerPointName = pick("centerPointName");
    this.placement = pick("placement") ?? "uniform";
    const rawPreset = pick("presetPoints");
    this.presetPoints = Array.isArray(rawPreset) ? rawPreset : [];
  }
  getParameters() {
    return {
      mode: this.gpsMode,
      pointName: this.pointName,
      lat: this.lat,
      lng: this.lng,
      pointRadiusMeters: this.pointRadiusMeters,
      fallbackLat: this.fallbackLat,
      fallbackLng: this.fallbackLng,
      count: this.count,
      scatterRadiusMeters: this.scatterRadiusMeters,
      centerSource: this.centerSource,
      centerPointName: this.centerPointName,
      placement: this.placement,
      presetPoints: this.presetPoints
    };
  }
  updateParameters(params) {
    if (params.mode !== void 0) this.gpsMode = params.mode;
    if (params.pointName !== void 0) this.pointName = String(params.pointName).trim();
    if (params.lat !== void 0) this.lat = params.lat;
    if (params.lng !== void 0) this.lng = params.lng;
    if (params.pointRadiusMeters !== void 0) this.pointRadiusMeters = params.pointRadiusMeters;
    if (params.fallbackLat !== void 0) this.fallbackLat = params.fallbackLat;
    if (params.fallbackLng !== void 0) this.fallbackLng = params.fallbackLng;
    if (params.count !== void 0) this.count = Number(params.count);
    if (params.scatterRadiusMeters !== void 0) this.scatterRadiusMeters = Number(params.scatterRadiusMeters);
    if (params.centerSource !== void 0) this.centerSource = params.centerSource;
    if (params.centerPointName !== void 0) this.centerPointName = params.centerPointName;
    if (params.placement !== void 0) this.placement = params.placement;
    if (params.presetPoints !== void 0) this.presetPoints = Array.isArray(params.presetPoints) ? params.presetPoints : [];
  }
  /** Read the current sensor position, or null if unavailable. Never throws. */
  async readCurrentPosition(context) {
    try {
      const svc = context.getSensorService?.();
      const reading = svc ? await svc.getCurrentLocation() : null;
      if (reading && typeof reading.lat === "number" && typeof reading.lng === "number") {
        return { lat: reading.lat, lng: reading.lng };
      }
    } catch (err) {
      console.warn(`[SetGpsLocationBeat ${this.id}] getCurrentLocation failed:`, err);
    }
    return null;
  }
  /**
   * The player's position for capture / scatter-around-here. The quick read
   * covers the usual case. When it finds nothing and the author set no
   * fallback, the player sees "Waiting for GPS…" until a position arrives
   * or they choose to continue without one — instead of the story silently
   * storing no points (its map scenes then skip themselves). A first fix
   * outdoors, on a phone just unlocked, can take well over 10 s.
   */
  async waitForPosition(context, renderer) {
    renderer.renderLoading?.(uiString("gpsLocating"), { spinnerType: "pulse" });
    const quick = await this.readCurrentPosition(context);
    if (quick) return quick;
    const authored = this.fallback();
    if (authored) return authored;
    const svc = context.getSensorService?.();
    if (!svc || !renderer.renderLoading) return null;
    try {
      const permission = await svc.getPermissionState("gps");
      if (permission === "denied" || permission === "unavailable") return null;
    } catch {
    }
    console.warn(`[SetGpsLocationBeat ${this.id}] no position yet \u2014 waiting for GPS`);
    return new Promise((resolve) => {
      let done = false;
      let unsubscribe = () => {
      };
      const finish = (pos) => {
        if (done) return;
        done = true;
        unsubscribe();
        if (!pos) console.warn(`[SetGpsLocationBeat ${this.id}] player continued without a position`);
        resolve(pos);
      };
      renderer.renderLoading(uiString("gpsWaiting"), {
        subMessage: uiString("gpsWaitingHint"),
        spinnerType: "pulse",
        cancelLabel: uiString("gpsContinueWithout"),
        onCancel: () => finish(null)
      });
      unsubscribe = svc.watchLocation((reading) => {
        if (typeof reading?.lat === "number" && typeof reading?.lng === "number") {
          finish({ lat: reading.lat, lng: reading.lng });
        }
      });
    });
  }
  /** Fallback coords from authored fallbackLat/Lng, or null. */
  fallback() {
    return typeof this.fallbackLat === "number" && typeof this.fallbackLng === "number" ? { lat: this.fallbackLat, lng: this.fallbackLng } : null;
  }
  async performAction(context, renderer) {
    if (!this.pointName) {
      console.error(`[SetGpsLocationBeat ${this.id}] no pointName specified \u2014 skipping`);
      return this.getNextBeat(context);
    }
    try {
      let points = [];
      if (this.gpsMode === "preset") {
        points = this.presetPoints.filter((p) => typeof p?.lat === "number" && typeof p?.lng === "number").map((p) => ({ lat: p.lat, lng: p.lng, ...p.radiusMeters != null ? { radiusMeters: p.radiusMeters } : this.pointRadiusMeters != null ? { radiusMeters: this.pointRadiusMeters } : {} }));
      } else if (this.gpsMode === "explicit") {
        if (typeof this.lat === "number" && typeof this.lng === "number") {
          points = [{ lat: this.lat, lng: this.lng, ...this.pointRadiusMeters != null ? { radiusMeters: this.pointRadiusMeters } : {} }];
        } else {
          console.warn(`[SetGpsLocationBeat ${this.id}] explicit mode without lat/lng \u2014 storing empty`);
        }
      } else if (this.gpsMode === "capture") {
        const pos = await this.waitForPosition(context, renderer);
        if (pos) {
          points = [{ lat: pos.lat, lng: pos.lng, ...this.pointRadiusMeters != null ? { radiusMeters: this.pointRadiusMeters } : {} }];
        } else {
          console.warn(`[SetGpsLocationBeat ${this.id}] capture mode: no sensor position and no fallback \u2014 storing empty`);
        }
      } else {
        let center = null;
        if (this.centerSource === "explicit") {
          center = typeof this.lat === "number" && typeof this.lng === "number" ? { lat: this.lat, lng: this.lng } : null;
        } else if (this.centerSource === "point") {
          const stored = this.centerPointName ? context.getGeoPoints(this.centerPointName) : [];
          center = stored.length > 0 ? { lat: stored[0].lat, lng: stored[0].lng } : null;
        } else {
          center = await this.waitForPosition(context, renderer);
        }
        center = center ?? this.fallback();
        if (center) {
          const minDistanceMeters = Math.min((this.pointRadiusMeters ?? 0) * 2, this.scatterRadiusMeters / 2);
          if (this.placement === "walkable") {
            renderer.renderLoading?.(uiString("gpsPlacingPoints"), { spinnerType: "pulse" });
            let walk = [];
            try {
              walk = await sampleWalkablePoints(center, this.scatterRadiusMeters, this.count, {
                perPointRadius: this.pointRadiusMeters,
                minDistanceMeters
              });
            } catch (err) {
              console.warn(`[SetGpsLocationBeat ${this.id}] walkable sampling failed:`, err);
            }
            if (walk.length >= this.count) {
              points = walk.slice(0, this.count);
            } else {
              const fill = scatterPointsAround(center, this.scatterRadiusMeters, this.count - walk.length, {
                perPointRadius: this.pointRadiusMeters,
                minDistanceMeters
              });
              points = [...walk, ...fill];
              console.warn(`[SetGpsLocationBeat ${this.id}] walkable: ${walk.length}/${this.count} on-network, ${fill.length} filled uniformly`);
            }
          } else {
            points = scatterPointsAround(center, this.scatterRadiusMeters, this.count, {
              perPointRadius: this.pointRadiusMeters,
              minDistanceMeters
            });
          }
        } else {
          console.warn(`[SetGpsLocationBeat ${this.id}] scatter mode: no resolvable center \u2014 storing empty`);
        }
      }
      context.setGeoPoints(this.pointName, points);
      console.log(
        `[SetGpsLocationBeat ${this.id}] ${this.gpsMode} \u2192 '${this.pointName}' = ${points.length} point(s)` + // Coordinates in the log: a field test (or a simulator) can then
        // walk or set its position to a placed point.
        (points.length ? `: ${points.map((p) => `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`).join(" ")}` : "")
      );
    } catch (err) {
      console.error(`[SetGpsLocationBeat ${this.id}] error:`, err);
    }
    return this.getNextBeat(context);
  }
};

// src/beats/SetTimerBeat.ts
var SetTimerBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "timerName");
    __publicField(this, "timerValue");
    __publicField(this, "timerTarget");
    __publicField(this, "continueTarget", "");
    const params = config.parameters || {};
    this.timerName = params.name || params.timerName || config.timerName || "";
    this.timerValue = params.value ?? config.value ?? 0;
    this.timerTarget = params.timerTarget || config.target || config.timerTarget || "";
    this.continueTarget = params.continueTarget || config.continueTarget || "";
    if (!this.continueTarget && config.connections) {
      const continueConn = config.connections.find((c) => !c.label || c.label === "");
      if (continueConn) {
        this.continueTarget = continueConn.targetId;
      }
    }
  }
  getParameters() {
    return {
      timerName: this.timerName || "",
      value: this.timerValue ?? 60,
      timerTarget: this.timerTarget || "",
      continueTarget: this.continueTarget || ""
    };
  }
  updateParameters(params) {
    if (params.timerName !== void 0) this.timerName = params.timerName;
    if (params.name !== void 0) this.timerName = params.name;
    if (params.value !== void 0) this.timerValue = params.value;
    if (params.timerTarget !== void 0) this.timerTarget = params.timerTarget;
    if (params.continueTarget !== void 0) this.continueTarget = params.continueTarget;
    if (params.target !== void 0) this.continueTarget = params.target;
    this.clearConnections();
    if (this.timerTarget) {
      this.addConnection({ targetId: this.timerTarget, label: "Timer Target" });
    }
    if (this.continueTarget) {
      this.addConnection({ targetId: this.continueTarget });
    }
  }
  async performAction(context, renderer) {
    if (!this.timerName) {
      console.error(`SetTimerBeat ${this.id} has no timer name specified`);
      return this.getNextBeat(context);
    }
    if (this.timerValue === 0) {
      context.clearTimer(this.timerName);
      console.log(`SetTimerBeat ${this.id}: Cleared timer '${this.timerName}'`);
      return this.getNextBeat(context);
    }
    if (!this.timerTarget) {
      console.error(`SetTimerBeat ${this.id} has no timer target specified`);
      return this.getNextBeat(context);
    }
    context.setTimer(this.timerName, this.timerValue, this.timerTarget);
    console.log(`SetTimerBeat ${this.id}: Set timer '${this.timerName}' to ${this.timerValue} seconds -> ${this.timerTarget}`);
    return this.getNextBeat(context);
  }
  /**
   * Override getNextBeat to return the continue connection (empty label)
   * instead of the timer target connection (labeled "Timer Target")
   */
  getNextBeat(context) {
    const continueConnection = this.connections.find(
      (conn) => !conn.label || conn.label === ""
    );
    if (continueConnection) {
      return continueConnection.targetId;
    }
    if (this.defaultTarget) {
      return this.defaultTarget;
    }
    return null;
  }
};

// src/beats/AddRemoveInventoryBeat.ts
var AddRemoveInventoryBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "action");
    __publicField(this, "item");
    __publicField(this, "quantity");
    // Can be a number or variable name (with $ prefix)
    __publicField(this, "character");
    __publicField(this, "fromChar");
    __publicField(this, "toChar");
    /** Picture (image asset id) the inventory HUD shows for this item. */
    __publicField(this, "itemImage");
    this.action = config.action || config.parameters?.action || "add";
    this.item = config.item || config.parameters?.item || "";
    this.quantity = config.quantity ?? config.parameters?.quantity ?? 1;
    this.character = config.character || config.parameters?.character || "player";
    this.fromChar = config.fromChar || config.parameters?.fromChar || "";
    this.toChar = config.toChar || config.parameters?.toChar || "";
    this.itemImage = config.itemImage || config.parameters?.itemImage || "";
  }
  getParameters() {
    return {
      action: this.action,
      item: this.item,
      quantity: this.quantity,
      character: this.character,
      fromChar: this.fromChar,
      toChar: this.toChar,
      ...this.itemImage ? { itemImage: this.itemImage } : {}
    };
  }
  updateParameters(params) {
    if (params.action !== void 0) this.action = params.action;
    if (params.item !== void 0) this.item = params.item;
    if (params.quantity !== void 0) this.quantity = params.quantity;
    if (params.character !== void 0) this.character = params.character;
    if (params.fromChar !== void 0) this.fromChar = params.fromChar;
    if (params.toChar !== void 0) this.toChar = params.toChar;
    if ("itemImage" in params) this.itemImage = params.itemImage || "";
  }
  /**
   * Resolve quantity - can be a number or a variable/counter reference
   * Variable references are prefixed with $ (e.g., $goldAmount)
   */
  resolveQuantity(context) {
    if (typeof this.quantity === "number") {
      return Math.max(1, this.quantity);
    }
    if (typeof this.quantity === "string") {
      if (this.quantity.startsWith("$")) {
        const varName = this.quantity.substring(1);
        const resolved2 = context.getVariable(varName) ?? context.getCounter(varName) ?? 1;
        const numValue2 = typeof resolved2 === "number" ? resolved2 : parseInt(resolved2) || 1;
        return Math.max(1, numValue2);
      }
      const parsed = parseInt(this.quantity);
      if (!isNaN(parsed)) {
        return Math.max(1, parsed);
      }
      const resolved = context.getVariable(this.quantity) ?? context.getCounter(this.quantity) ?? 1;
      const numValue = typeof resolved === "number" ? resolved : parseInt(resolved) || 1;
      return Math.max(1, numValue);
    }
    return 1;
  }
  async performAction(context, renderer) {
    if (!this.item) {
      console.error(`AddRemoveInventoryBeat ${this.id} has no item specified`);
      return this.getNextBeat(context);
    }
    const qty = this.resolveQuantity(context);
    try {
      switch (this.action) {
        case "add":
          context.addInventoryItem(this.character || "player", this.item, qty);
          console.log(`AddRemoveInventoryBeat ${this.id}: Added ${qty}x '${this.item}' to ${this.character}'s inventory`);
          break;
        case "remove":
          context.removeInventoryItem(this.character || "player", this.item, qty);
          console.log(`AddRemoveInventoryBeat ${this.id}: Removed ${qty}x '${this.item}' from ${this.character}'s inventory`);
          break;
        case "transfer":
          if (!this.fromChar || !this.toChar) {
            console.error(`AddRemoveInventoryBeat ${this.id}: Transfer requires fromChar and toChar`);
            break;
          }
          context.removeInventoryItem(this.fromChar, this.item, qty);
          context.addInventoryItem(this.toChar, this.item, qty);
          console.log(`AddRemoveInventoryBeat ${this.id}: Transferred ${qty}x '${this.item}' from ${this.fromChar} to ${this.toChar}`);
          break;
        default:
          console.warn(`AddRemoveInventoryBeat ${this.id}: Unknown action '${this.action}'`);
      }
    } catch (error) {
      console.error(`Error in AddRemoveInventoryBeat ${this.id}:`, error);
    }
    return this.getNextBeat(context);
  }
};

// src/beats/UpdateAffectBeat.ts
var UpdateAffectBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "effects");
    __publicField(this, "character");
    __publicField(this, "moodValenceDelta");
    __publicField(this, "moodArousalDelta");
    __publicField(this, "sentimentTarget");
    __publicField(this, "sentimentEmotion");
    __publicField(this, "sentimentDelta");
    __publicField(this, "emotion");
    __publicField(this, "emotionDelta");
    const p = config.parameters || {};
    this.effects = config.effects ?? p.effects;
    this.character = config.character ?? p.character ?? "player";
    this.moodValenceDelta = config.moodValenceDelta ?? p.moodValenceDelta;
    this.moodArousalDelta = config.moodArousalDelta ?? p.moodArousalDelta;
    this.sentimentTarget = config.sentimentTarget ?? p.sentimentTarget;
    this.sentimentEmotion = config.sentimentEmotion ?? p.sentimentEmotion;
    this.sentimentDelta = config.sentimentDelta ?? p.sentimentDelta;
    this.emotion = config.emotion ?? p.emotion;
    this.emotionDelta = config.emotionDelta ?? p.emotionDelta;
  }
  getParameters() {
    return {
      character: this.character,
      ...this.effects !== void 0 ? { effects: this.effects } : {},
      ...this.moodValenceDelta !== void 0 ? { moodValenceDelta: this.moodValenceDelta } : {},
      ...this.moodArousalDelta !== void 0 ? { moodArousalDelta: this.moodArousalDelta } : {},
      ...this.sentimentTarget !== void 0 ? { sentimentTarget: this.sentimentTarget } : {},
      ...this.sentimentEmotion !== void 0 ? { sentimentEmotion: this.sentimentEmotion } : {},
      ...this.sentimentDelta !== void 0 ? { sentimentDelta: this.sentimentDelta } : {},
      ...this.emotion !== void 0 ? { emotion: this.emotion } : {},
      ...this.emotionDelta !== void 0 ? { emotionDelta: this.emotionDelta } : {}
    };
  }
  updateParameters(params) {
    if (params.effects !== void 0) this.effects = params.effects;
    if (params.character !== void 0) this.character = params.character;
    if (params.moodValenceDelta !== void 0) this.moodValenceDelta = params.moodValenceDelta;
    if (params.moodArousalDelta !== void 0) this.moodArousalDelta = params.moodArousalDelta;
    if (params.sentimentTarget !== void 0) this.sentimentTarget = params.sentimentTarget;
    if (params.sentimentEmotion !== void 0) this.sentimentEmotion = params.sentimentEmotion;
    if (params.sentimentDelta !== void 0) this.sentimentDelta = params.sentimentDelta;
    if (params.emotion !== void 0) this.emotion = params.emotion;
    if (params.emotionDelta !== void 0) this.emotionDelta = params.emotionDelta;
  }
  /** What this beat does to the characters' feelings, as effects: the
   *  authored list, or the legacy single-row fields converted. Path analysis
   *  replays exactly this. */
  affectEffects() {
    if (this.effects && this.effects.length > 0) return this.effects;
    if (!this.character) return [];
    return synthesizeEffectsFromLegacyParams({
      character: this.character,
      moodValenceDelta: this.moodValenceDelta,
      moodArousalDelta: this.moodArousalDelta,
      sentimentTarget: this.sentimentTarget,
      sentimentEmotion: this.sentimentEmotion,
      sentimentDelta: this.sentimentDelta,
      emotion: this.emotion,
      emotionDelta: this.emotionDelta
    });
  }
  async performAction(context, _renderer) {
    if (this.effects && this.effects.length > 0) {
      for (const effect of this.effects) {
        try {
          context.applyEffect(effect);
        } catch (err) {
          console.warn(
            `UpdateAffectBeat ${this.id}: applyEffect threw for ${effect.type}`,
            err
          );
        }
      }
      return this.getNextBeat(context);
    }
    if (!this.character) {
      console.warn(`UpdateAffectBeat ${this.id}: no character set, skipping`);
      return this.getNextBeat(context);
    }
    const dV = this.moodValenceDelta ?? 0;
    const dA = this.moodArousalDelta ?? 0;
    if (dV !== 0 || dA !== 0) {
      const next = context.nudgeCharacterMood(this.character, dV, dA);
      console.log(
        `UpdateAffectBeat ${this.id}: nudged ${this.character} mood by (${dV}, ${dA}); now (${next.valence.toFixed(2)}, ${next.arousal.toFixed(2)})`
      );
    }
    if (this.sentimentTarget && this.sentimentEmotion && this.sentimentDelta !== void 0) {
      const result = context.addCharacterSentiment(
        this.character,
        this.sentimentTarget,
        this.sentimentEmotion,
        this.sentimentDelta
      );
      if (result) {
        console.log(
          `UpdateAffectBeat ${this.id}: ${this.character}.sentiment[${this.sentimentEmotion} \u2192 ${this.sentimentTarget}] now ${result.strength.toFixed(2)}`
        );
      }
    } else if (this.sentimentTarget || this.sentimentEmotion || this.sentimentDelta !== void 0) {
      console.warn(
        `UpdateAffectBeat ${this.id}: partial sentiment fields \u2014 need all of target+emotion+delta to record a sentiment`
      );
    }
    if (this.emotion && this.emotionDelta !== void 0 && this.emotionDelta !== 0) {
      const next = context.fireCharacterEmotion(this.character, this.emotion, this.emotionDelta);
      console.log(
        `UpdateAffectBeat ${this.id}: ${this.character}.emotion[${this.emotion}] now ${next.toFixed(2)}`
      );
    } else if (this.emotion || this.emotionDelta !== void 0) {
      console.warn(
        `UpdateAffectBeat ${this.id}: partial emotion fields \u2014 need both emotion + emotionDelta to fire`
      );
    }
    return this.getNextBeat(context);
  }
};
function synthesizeEffectsFromLegacyParams(params) {
  const out = [];
  const char = params.character || "player";
  const dV = Number(params.moodValenceDelta ?? 0);
  const dA = Number(params.moodArousalDelta ?? 0);
  if (dV !== 0 || dA !== 0) {
    out.push({
      type: "nudgeMood",
      target: char,
      valenceDelta: dV,
      arousalDelta: dA
    });
  }
  const sd = Number(params.sentimentDelta ?? 0);
  if (params.sentimentTarget && params.sentimentEmotion && sd !== 0) {
    out.push({
      type: "addSentiment",
      target: char,
      sentimentTarget: params.sentimentTarget,
      sentimentEmotion: params.sentimentEmotion,
      strengthDelta: sd
    });
  }
  const ed = Number(params.emotionDelta ?? 0);
  if (params.emotion && ed !== 0) {
    out.push({
      type: "fireEmotion",
      target: char,
      emotion: params.emotion,
      emotionDelta: ed
    });
  }
  return out;
}

// src/beats/InputTextBeat.ts
var InputTextBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "saveToType");
    __publicField(this, "variable");
    __publicField(this, "characterId");
    __publicField(this, "counter");
    __publicField(this, "counterOperation");
    __publicField(this, "placeholder");
    __publicField(this, "validation");
    __publicField(this, "minLength");
    __publicField(this, "maxLength");
    __publicField(this, "required");
    __publicField(this, "buttonText");
    // Visual data (node is inherited from Beat)
    __publicField(this, "locs", []);
    // Visual elements
    __publicField(this, "backgroundSound");
    this.prompt = config.prompt || config.parameters?.prompt || "Please enter your response:";
    this.saveToType = config.saveToType || config.parameters?.saveToType || "variable";
    this.variable = config.variable || config.parameters?.variable || config.parameters?.variableName || "userInput";
    this.characterId = config.characterId || config.parameters?.characterId;
    this.counter = config.counter || config.parameters?.counter;
    this.counterOperation = config.counterOperation || config.parameters?.counterOperation || "set";
    this.placeholder = config.placeholder || config.parameters?.placeholder;
    this.validation = config.validation || config.parameters?.validation || "none";
    this.minLength = config.minLength || config.parameters?.minLength;
    this.maxLength = config.maxLength || config.parameters?.maxLength;
    this.required = config.required ?? config.parameters?.required ?? true;
    this.buttonText = config.buttonText || config.parameters?.buttonText || "Continue";
    this.node = config.node || config.parameters?.node;
    this.locs = config.locs || config.parameters?.locs || [];
    this.backgroundSound = config.backgroundSound || config.parameters?.backgroundSound;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      saveToType: this.saveToType,
      variable: this.variable,
      characterId: this.characterId,
      counter: this.counter,
      counterOperation: this.counterOperation,
      placeholder: this.placeholder,
      validation: this.validation,
      minLength: this.minLength,
      maxLength: this.maxLength,
      required: this.required,
      buttonText: this.buttonText,
      // Include visual data
      node: this.node,
      locs: this.locs,
      backgroundSound: this.backgroundSound,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.saveToType !== void 0) this.saveToType = params.saveToType;
    if (params.variable !== void 0) this.variable = params.variable;
    if (params.variableName !== void 0) {
      console.log(`[InputTextBeat] Setting variable from variableName: "${params.variableName}"`);
      this.variable = params.variableName;
    }
    if (params.characterId !== void 0) this.characterId = params.characterId;
    if (params.counter !== void 0) this.counter = params.counter;
    if (params.counterOperation !== void 0) this.counterOperation = params.counterOperation;
    if (params.placeholder !== void 0) this.placeholder = params.placeholder;
    if (params.validation !== void 0) this.validation = params.validation;
    if (params.minLength !== void 0) this.minLength = params.minLength;
    if (params.maxLength !== void 0) this.maxLength = params.maxLength;
    if (params.required !== void 0) this.required = params.required;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.node !== void 0) this.node = params.node;
    if (params.locs !== void 0) this.locs = params.locs;
    if (params.backgroundSound !== void 0) this.backgroundSound = params.backgroundSound;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  /**
   * Validates user input based on configured rules
   */
  validateInput(input) {
    if (this.required && (!input || input.trim() === "")) {
      return { valid: false, error: "This field is required" };
    }
    if (!this.required && (!input || input.trim() === "")) {
      return { valid: true };
    }
    if (this.minLength !== void 0 && input.length < this.minLength) {
      return { valid: false, error: `Minimum ${this.minLength} characters required` };
    }
    if (this.maxLength !== void 0 && input.length > this.maxLength) {
      return { valid: false, error: `Maximum ${this.maxLength} characters allowed` };
    }
    switch (this.validation) {
      case "numeric":
        if (!/^\d+$/.test(input)) {
          return { valid: false, error: "Please enter numbers only" };
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
          return { valid: false, error: "Please enter a valid email address" };
        }
        break;
      case "alphanumeric":
        if (!/^[a-zA-Z0-9]+$/.test(input)) {
          return { valid: false, error: "Please enter letters and numbers only" };
        }
        break;
    }
    return { valid: true };
  }
  async performAction(context, renderer) {
    const locations = Array.from(this.locations.values());
    const processedPrompt = this.processText(this.prompt, context);
    const processedPlaceholder = this.placeholder ? this.processText(this.placeholder, context) : void 0;
    const processedButtonText = this.processText(this.buttonText || "Continue", context);
    const userInput = await renderer.renderInputText(
      processedPrompt,
      processedPlaceholder,
      processedButtonText,
      {
        validation: this.validation,
        minLength: this.minLength,
        maxLength: this.maxLength,
        required: this.required
      },
      locations
      // Pass locations for positioned rendering
    );
    const validation = this.validateInput(userInput);
    if (!validation.valid) {
      console.error("Input validation failed:", validation.error);
    }
    if (this.saveToType === "characterName" && this.characterId) {
      context.updateCharacterDisplayName(this.characterId, userInput);
    } else if (this.saveToType === "counter" && this.counter) {
      const numValue = parseFloat(userInput);
      if (!isNaN(numValue)) {
        console.log(`[InputTextBeat] Saving ${numValue} to counter "${this.counter}" (${this.counterOperation || "set"})`);
        if (this.counterOperation === "change") {
          const currentValue = context.getCounter(this.counter) || 0;
          context.setCounter(this.counter, currentValue + numValue);
        } else {
          context.setCounter(this.counter, numValue);
        }
      } else {
        console.warn(`[InputTextBeat] Could not parse "${userInput}" as number for counter "${this.counter}"`);
      }
    } else if (this.saveToType === "variable" && this.variable) {
      console.log(`[InputTextBeat] Saving "${userInput}" to variable "${this.variable}"`);
      if (this.validation === "numeric") {
        const numValue = parseFloat(userInput);
        if (!isNaN(numValue)) {
          context.setVariable(this.variable, numValue);
        } else {
          context.setVariable(this.variable, userInput);
        }
      } else {
        context.setVariable(this.variable, userInput);
      }
    }
    return this.getNextBeat(context);
  }
};

// src/beats/InputImageBeat.ts
var InputImageBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "analysisPrompt");
    __publicField(this, "saveTo");
    __publicField(this, "imageSource");
    __publicField(this, "buttonText");
    __publicField(this, "cancelButtonText");
    __publicField(this, "fallbackValue");
    __publicField(this, "timeout");
    __publicField(this, "backgroundSound");
    const p = config.parameters ?? {};
    this.prompt = config.prompt || p.prompt || "Take or choose a photo:";
    this.analysisPrompt = config.analysisPrompt || p.analysisPrompt || "Describe what is shown in this image in one or two sentences.";
    this.saveTo = config.saveTo || p.saveTo || "imageAnalysis";
    const source = config.imageSource ?? p.imageSource;
    this.imageSource = source === "upload" || source === "camera" ? source : "both";
    this.buttonText = config.buttonText || p.buttonText || "Analyze";
    this.cancelButtonText = config.cancelButtonText || p.cancelButtonText || "Skip";
    this.fallbackValue = config.fallbackValue ?? p.fallbackValue ?? "";
    this.timeout = config.timeout ?? p.timeout ?? 3e4;
    this.node = config.node || p.node;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      analysisPrompt: this.analysisPrompt,
      saveTo: this.saveTo,
      imageSource: this.imageSource,
      buttonText: this.buttonText,
      cancelButtonText: this.cancelButtonText,
      fallbackValue: this.fallbackValue,
      timeout: this.timeout,
      node: this.node,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.analysisPrompt !== void 0) this.analysisPrompt = params.analysisPrompt;
    if (params.saveTo !== void 0) this.saveTo = params.saveTo;
    if (params.imageSource !== void 0) {
      this.imageSource = params.imageSource === "upload" || params.imageSource === "camera" ? params.imageSource : "both";
    }
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.cancelButtonText !== void 0) this.cancelButtonText = params.cancelButtonText;
    if (params.fallbackValue !== void 0) this.fallbackValue = params.fallbackValue;
    if (params.timeout !== void 0) this.timeout = params.timeout;
    if (params.node !== void 0) this.node = params.node;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  async performAction(context, renderer) {
    if (!renderer.renderInputImage) {
      console.warn(`[InputImageBeat ${this.id}] renderer.renderInputImage unavailable; skipping`);
      this.storeResult(context, this.fallbackValue);
      return this.getNextBeat(context);
    }
    const processedPrompt = this.processText(this.prompt, context);
    const locations = Array.from(this.locations.values());
    const result = await renderer.renderInputImage(
      processedPrompt,
      {
        imageSource: this.imageSource,
        buttonText: this.buttonText,
        cancelButtonText: this.cancelButtonText
      },
      locations
    );
    if (result === "cancelled") {
      console.log(`[InputImageBeat ${this.id}] player skipped image input`);
      this.storeResult(context, this.fallbackValue);
      context.recordTimelineEvent({
        type: "choice",
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "inputImage",
        text: "Skipped image input"
      });
      return this.getNextBeat(context);
    }
    const parsed = this.parseDataUrl(result);
    if (!parsed) {
      console.warn(`[InputImageBeat ${this.id}] unexpected renderer result; using fallback`);
      this.storeResult(context, this.fallbackValue);
      return this.getNextBeat(context);
    }
    const aiService = renderer.getState("aiService");
    if (!aiService || typeof aiService.analyzeImage !== "function") {
      console.warn(`[InputImageBeat ${this.id}] AI service has no image analysis; using fallback`);
      this.storeResult(context, this.fallbackValue);
      return this.getNextBeat(context);
    }
    try {
      renderer.renderLoading?.("Analyzing image...", { subMessage: "This may take a moment" });
      const analysis = await Promise.race([
        aiService.analyzeImage(
          { base64: parsed.base64, mediaType: parsed.mediaType },
          this.processText(this.analysisPrompt, context)
        ),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Timeout")), this.timeout)
        )
      ]);
      renderer.hideLoading?.();
      const text = typeof analysis === "string" ? analysis.trim() : "";
      console.log(`[InputImageBeat ${this.id}] saving analysis to variable "${this.saveTo}"`);
      this.storeResult(context, text || this.fallbackValue);
      context.recordChoice({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "inputImage",
        choiceText: `Submitted an image; AI analysis: ${text.slice(0, 200)}`,
        choiceContext: this.prompt
      });
    } catch (error) {
      renderer.hideLoading?.();
      console.error(`[InputImageBeat ${this.id}] image analysis failed:`, error);
      this.storeResult(context, this.fallbackValue);
    }
    return this.getNextBeat(context);
  }
  storeResult(context, value) {
    if (this.saveTo) {
      context.setVariable(this.saveTo, value);
    }
  }
  parseDataUrl(value) {
    const match = /^data:([a-z]+\/[a-z0-9.+-]+);base64,(.+)$/i.exec(value);
    if (!match) return null;
    return { mediaType: match[1], base64: match[2] };
  }
};

// src/beats/HyperTextBeat.ts
var HyperTextBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "text");
    __publicField(this, "hyperlinks");
    __publicField(this, "allowMultipleClicks");
    __publicField(this, "highlightColor");
    __publicField(this, "hoverColor");
    // Visual data (node is inherited from Beat)
    __publicField(this, "locs", []);
    // Visual elements (will include hypertext markers)
    __publicField(this, "backgroundSound");
    this.text = config.text || config.parameters?.text || "Click on any word to explore.";
    this.hyperlinks = config.hyperlinks || config.parameters?.hyperlinks || [];
    this.allowMultipleClicks = config.allowMultipleClicks ?? config.parameters?.allowMultipleClicks ?? false;
    this.highlightColor = config.highlightColor || config.parameters?.highlightColor || "#0066cc";
    this.hoverColor = config.hoverColor || config.parameters?.hoverColor || "#003366";
    this.node = config.node || config.parameters?.node;
    this.locs = config.locs || config.parameters?.locs || [];
    this.backgroundSound = config.backgroundSound || config.parameters?.backgroundSound;
  }
  getParameters() {
    const params = {
      text: this.text,
      hyperlinks: this.hyperlinks,
      allowMultipleClicks: this.allowMultipleClicks,
      highlightColor: this.highlightColor,
      hoverColor: this.hoverColor,
      node: this.node,
      backgroundSound: this.backgroundSound
    };
    if (this.locs && this.locs.length > 0) {
      params.locs = this.locs;
    }
    return params;
  }
  updateParameters(params) {
    if (params.text !== void 0) this.text = params.text;
    if (params.hyperlinks !== void 0) this.hyperlinks = params.hyperlinks;
    if (params.allowMultipleClicks !== void 0) this.allowMultipleClicks = params.allowMultipleClicks;
    if (params.highlightColor !== void 0) this.highlightColor = params.highlightColor;
    if (params.hoverColor !== void 0) this.hoverColor = params.hoverColor;
    if (params.node !== void 0) this.node = params.node;
    if (params.locs !== void 0) this.locs = params.locs;
    if (params.backgroundSound !== void 0) this.backgroundSound = params.backgroundSound;
  }
  /**
   * Override getConnections to extract all connections from hyperlinks
   * This ensures connections are dynamically generated from hyperlinks array
   */
  getConnections() {
    const connections = [];
    if (this.hyperlinks && Array.isArray(this.hyperlinks)) {
      for (const link of this.hyperlinks) {
        if (link.targetBeatId) {
          connections.push({
            targetId: link.targetBeatId,
            label: link.word
          });
        }
      }
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId && c.label === conn.label)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  /**
   * Renders text with clickable hyperlinks and waits for user selection
   */
  async performAction(context, renderer) {
    const processedText = this.processText(this.text, context);
    const locations = Array.from(this.locations.values());
    const hypertextData = {
      text: processedText,
      links: this.hyperlinks.map((link) => ({
        word: this.processText(link.word, context),
        targetBeatId: link.targetBeatId,
        style: {
          color: link.style?.color || this.highlightColor,
          hoverColor: this.hoverColor,
          underline: link.style?.underline ?? true,
          bold: link.style?.bold ?? false
        }
      })),
      allowMultiple: this.allowMultipleClicks
    };
    const selectedTargetId = await renderer.renderHyperText(hypertextData, locations);
    const selectedLink = this.hyperlinks.find((link) => link.targetBeatId === selectedTargetId);
    if (selectedLink) {
      context.recordChoice({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "hyperText",
        choiceText: `Clicked "${selectedLink.word}"`,
        choiceContext: this.text.length > 100 ? this.text.substring(0, 100) + "..." : this.text
      });
      if (!this.hasConnection(selectedTargetId)) {
        this.addConnection({
          targetId: selectedTargetId,
          label: selectedLink.word
        });
      }
      return selectedTargetId;
    }
    return this.getNextBeat(context);
  }
  // toJSON() is inherited from Beat base class
  // It correctly uses getConnections() which now includes hyperlink-derived connections
};

// src/beats/KeypadBeat.ts
var KeypadBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "layout");
    __publicField(this, "maxDigits");
    __publicField(this, "minDigits");
    __publicField(this, "correctCode");
    __publicField(this, "failTarget");
    __publicField(this, "maxAttempts");
    __publicField(this, "maskInput");
    __publicField(this, "saveToType");
    __publicField(this, "variable");
    __publicField(this, "counter");
    __publicField(this, "counterOperation");
    __publicField(this, "buttonText");
    __publicField(this, "clearButtonText");
    __publicField(this, "showDisplay");
    __publicField(this, "skinId");
    // Visual data
    __publicField(this, "locs", []);
    __publicField(this, "backgroundSound");
    const p = config.parameters || {};
    this.prompt = p.prompt || "Enter the code:";
    this.layout = p.layout || "numeric";
    this.maxDigits = p.maxDigits || 4;
    this.minDigits = p.minDigits || 1;
    this.correctCode = p.correctCode || "";
    this.failTarget = p.failTarget || "";
    this.maxAttempts = p.maxAttempts || 0;
    this.maskInput = p.maskInput ?? true;
    this.saveToType = p.saveToType || "variable";
    this.variable = p.variable || "keypadInput";
    this.counter = p.counter;
    this.counterOperation = p.counterOperation || "set";
    this.buttonText = p.buttonText || "Enter";
    this.clearButtonText = p.clearButtonText || "Clear";
    this.showDisplay = p.showDisplay ?? true;
    this.skinId = p.skinId;
    this.node = config.node || p.node;
    this.locs = config.locs || p.locs || [];
    this.backgroundSound = config.backgroundSound || p.backgroundSound;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      layout: this.layout,
      maxDigits: this.maxDigits,
      minDigits: this.minDigits,
      correctCode: this.correctCode,
      failTarget: this.failTarget,
      maxAttempts: this.maxAttempts,
      maskInput: this.maskInput,
      saveToType: this.saveToType,
      variable: this.variable,
      counter: this.counter,
      counterOperation: this.counterOperation,
      buttonText: this.buttonText,
      clearButtonText: this.clearButtonText,
      showDisplay: this.showDisplay,
      skinId: this.skinId,
      node: this.node,
      locs: this.locs,
      backgroundSound: this.backgroundSound
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.layout !== void 0) this.layout = params.layout;
    if (params.maxDigits !== void 0) this.maxDigits = params.maxDigits;
    if (params.minDigits !== void 0) this.minDigits = params.minDigits;
    if (params.correctCode !== void 0) this.correctCode = params.correctCode;
    if (params.failTarget !== void 0) this.failTarget = params.failTarget;
    if (params.maxAttempts !== void 0) this.maxAttempts = params.maxAttempts;
    if (params.maskInput !== void 0) this.maskInput = params.maskInput;
    if (params.saveToType !== void 0) this.saveToType = params.saveToType;
    if (params.variable !== void 0) this.variable = params.variable;
    if (params.counter !== void 0) this.counter = params.counter;
    if (params.counterOperation !== void 0) this.counterOperation = params.counterOperation;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.clearButtonText !== void 0) this.clearButtonText = params.clearButtonText;
    if (params.showDisplay !== void 0) this.showDisplay = params.showDisplay;
    if (params.skinId !== void 0) this.skinId = params.skinId;
    if (params.node !== void 0) this.node = params.node;
    if (params.locs !== void 0) this.locs = params.locs;
    if (params.backgroundSound !== void 0) this.backgroundSound = params.backgroundSound;
  }
  /**
   * Override getConnections to expose failTarget to the graph and reachability analyzer
   */
  getConnections() {
    const connections = super.getConnections().filter((c) => !(this.failTarget && c.targetId === this.failTarget && c.label === "fail"));
    if (this.failTarget) {
      connections.push({
        targetId: this.failTarget,
        label: "Wrong code",
        derivedFrom: "failTarget"
      });
    }
    return connections;
  }
  async performAction(context, renderer) {
    const locations = Array.from(this.locations.values());
    const processedPrompt = this.processText(this.prompt, context);
    const result = await renderer.renderKeypad(
      processedPrompt,
      {
        layout: this.layout,
        maxDigits: this.maxDigits,
        minDigits: this.minDigits,
        correctCode: this.correctCode || void 0,
        failTarget: this.failTarget || void 0,
        maxAttempts: this.maxAttempts,
        maskInput: this.maskInput,
        buttonText: this.buttonText,
        clearButtonText: this.clearButtonText,
        showDisplay: this.showDisplay,
        skinId: this.skinId
      },
      locations
    );
    if (result === "__keypad_fail__" && this.failTarget) {
      return this.failTarget;
    }
    if (this.saveToType === "counter" && this.counter) {
      const numValue = parseFloat(result);
      if (!isNaN(numValue)) {
        if (this.counterOperation === "change") {
          const currentValue = context.getCounter(this.counter) || 0;
          context.setCounter(this.counter, currentValue + numValue);
        } else {
          context.setCounter(this.counter, numValue);
        }
      }
    } else if (this.variable) {
      context.setVariable(this.variable, result);
    }
    return this.getNextBeat(context);
  }
};

// src/utils/asapsUri.ts
var SCHEME = "asaps://";
function parseAsapsUri(raw) {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith(SCHEME)) return null;
  const body = raw.slice(SCHEME.length);
  const segments = body.split("/").map(safeDecode);
  const verb = segments[0];
  switch (verb) {
    case "beat": {
      const target = segments[1];
      if (!target) return null;
      return { kind: "beat", target };
    }
    case "variable": {
      const name = segments[1];
      const value = segments.slice(2).join("/");
      if (!name) return null;
      return { kind: "variable", name, value: value ?? "" };
    }
    case "inventory": {
      const op = segments[1];
      const item = segments[2];
      if (op !== "add" && op !== "remove" || !item) return null;
      return { kind: "inventory", op, item };
    }
    case "event": {
      const name = segments[1];
      if (!name) return null;
      return { kind: "event", name };
    }
    default:
      return null;
  }
}
function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// src/beats/QRScanBeat.ts
var QRScanBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "saveTo");
    __publicField(this, "interpretAsapsUri");
    __publicField(this, "facing");
    __publicField(this, "matchPatterns");
    __publicField(this, "helperText");
    __publicField(this, "cancelButtonText");
    __publicField(this, "backgroundSound");
    /** Authoring metadata only (not used at runtime): beat IDs that printed
     *  asaps://beat/<id> QR codes jump to. Persisted so the flowchart can draw
     *  these otherwise-invisible jumps as dashed edges. */
    __publicField(this, "qrJumpTargets");
    const p = config.parameters ?? {};
    this.prompt = config.prompt || p.prompt || "Point your camera at the QR code";
    this.saveTo = config.saveTo || p.saveTo || "scannedCode";
    const iau = config.interpretAsapsUri ?? p.interpretAsapsUri;
    this.interpretAsapsUri = iau !== false;
    const facing = config.facing ?? p.facing;
    this.facing = facing === "front" ? "front" : "rear";
    this.matchPatterns = Array.isArray(config.matchPatterns) ? config.matchPatterns : Array.isArray(p.matchPatterns) ? p.matchPatterns : [];
    this.helperText = config.helperText ?? p.helperText;
    this.cancelButtonText = config.cancelButtonText || p.cancelButtonText || "Skip";
    this.qrJumpTargets = Array.isArray(config.qrJumpTargets) ? config.qrJumpTargets : Array.isArray(p.qrJumpTargets) ? p.qrJumpTargets : [];
    this.node = config.node || p.node;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      saveTo: this.saveTo,
      interpretAsapsUri: this.interpretAsapsUri,
      facing: this.facing,
      matchPatterns: this.matchPatterns,
      helperText: this.helperText,
      cancelButtonText: this.cancelButtonText,
      qrJumpTargets: this.qrJumpTargets,
      node: this.node,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.saveTo !== void 0) this.saveTo = params.saveTo;
    if (params.interpretAsapsUri !== void 0) this.interpretAsapsUri = params.interpretAsapsUri !== false;
    if (params.facing !== void 0) {
      this.facing = params.facing === "front" ? "front" : "rear";
    }
    if (params.matchPatterns !== void 0) {
      this.matchPatterns = Array.isArray(params.matchPatterns) ? params.matchPatterns : [];
    }
    if (params.helperText !== void 0) this.helperText = params.helperText;
    if (params.cancelButtonText !== void 0) this.cancelButtonText = params.cancelButtonText;
    if (params.qrJumpTargets !== void 0) {
      this.qrJumpTargets = Array.isArray(params.qrJumpTargets) ? params.qrJumpTargets : [];
    }
    if (params.node !== void 0) this.node = params.node;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  async performAction(context, renderer) {
    if (!renderer.renderQRScan) {
      console.warn(`[QRScanBeat ${this.id}] renderer.renderQRScan unavailable; skipping scan`);
      return this.getNextBeat(context);
    }
    const processedPrompt = this.processText(this.prompt, context);
    const processedHelper = this.helperText ? this.processText(this.helperText, context) : void 0;
    const locations = Array.from(this.locations.values());
    const result = await renderer.renderQRScan(
      processedPrompt,
      {
        facing: this.facing,
        matchPatterns: this.matchPatterns.length > 0 ? this.matchPatterns : void 0,
        cancelButtonText: this.cancelButtonText,
        helperText: processedHelper
      },
      locations
    );
    if (result === "cancelled" || result === "permission_denied") {
      console.log(`[QRScanBeat ${this.id}] scan ended without a code: ${result}`);
      context.recordTimelineEvent({
        type: "choice",
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "qrScan",
        text: result === "cancelled" ? "Cancelled QR scan" : "Camera permission denied"
      });
      return this.getNextBeat(context);
    }
    if (this.interpretAsapsUri) {
      const parsed = parseAsapsUri(result);
      if (parsed) {
        context.recordChoice({
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "qrScan",
          choiceText: `Scanned ASAPS URI: ${result}`,
          choiceContext: this.prompt
        });
        switch (parsed.kind) {
          case "beat":
            return parsed.target;
          case "variable":
            context.setVariable(parsed.name, parsed.value);
            return this.getNextBeat(context);
          case "inventory":
            if (parsed.op === "add") context.addToInventory(parsed.item);
            else context.removeFromInventory(parsed.item);
            return this.getNextBeat(context);
          case "event":
            return this.getNextBeat(context);
        }
      }
    }
    if (this.saveTo) {
      context.setVariable(this.saveTo, result);
    }
    context.recordChoice({
      beatId: this.id,
      beatName: this.name || this.id,
      beatType: "qrScan",
      choiceText: `Scanned: ${result}`,
      choiceContext: this.prompt
    });
    return this.getNextBeat(context);
  }
};

// src/beats/WebViewBeat.ts
var WebViewBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "url");
    __publicField(this, "prompt");
    __publicField(this, "exitUrlPattern");
    __publicField(this, "passContext");
    __publicField(this, "saveTo");
    __publicField(this, "doneButtonText");
    const p = config.parameters ?? {};
    this.url = config.url || p.url || "https://example.com";
    this.prompt = config.prompt ?? p.prompt;
    this.exitUrlPattern = config.exitUrlPattern ?? p.exitUrlPattern;
    this.passContext = Array.isArray(config.passContext) ? config.passContext : Array.isArray(p.passContext) ? p.passContext : [];
    this.saveTo = config.saveTo ?? p.saveTo;
    this.doneButtonText = config.doneButtonText || p.doneButtonText || "Done";
    this.node = config.node || p.node;
  }
  getParameters() {
    return {
      url: this.url,
      prompt: this.prompt,
      exitUrlPattern: this.exitUrlPattern,
      passContext: this.passContext,
      saveTo: this.saveTo,
      doneButtonText: this.doneButtonText,
      node: this.node,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.url !== void 0) this.url = params.url;
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.exitUrlPattern !== void 0) this.exitUrlPattern = params.exitUrlPattern;
    if (params.passContext !== void 0) {
      this.passContext = Array.isArray(params.passContext) ? params.passContext : [];
    }
    if (params.saveTo !== void 0) this.saveTo = params.saveTo;
    if (params.doneButtonText !== void 0) this.doneButtonText = params.doneButtonText;
    if (params.node !== void 0) this.node = params.node;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  async performAction(context, renderer) {
    if (!renderer.renderWebView) {
      console.warn(`[WebViewBeat ${this.id}] renderer.renderWebView unavailable; skipping`);
      return this.getNextBeat(context);
    }
    let contextHash;
    if (this.passContext.length > 0) {
      const parts = [];
      for (const name of this.passContext) {
        const value = context.getVariable(name);
        if (value === void 0 || value === null) continue;
        parts.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
      }
      if (parts.length > 0) contextHash = parts.join("&");
    }
    const processedPrompt = this.prompt ? this.processText(this.prompt, context) : void 0;
    const processedUrl = this.processText(this.url, context);
    const locations = Array.from(this.locations.values());
    const result = await renderer.renderWebView(
      {
        url: processedUrl,
        prompt: processedPrompt,
        exitUrlPattern: this.exitUrlPattern,
        contextHash,
        doneButtonText: this.doneButtonText
      },
      locations
    );
    if (result !== "done" && this.saveTo) {
      context.setVariable(this.saveTo, result);
    }
    context.recordChoice({
      beatId: this.id,
      beatName: this.name || this.id,
      beatType: "webView",
      choiceText: result === "done" ? "Closed the web view" : `Returned: ${result}`,
      choiceContext: this.url
    });
    return this.getNextBeat(context);
  }
};

// src/beats/ARBeat.ts
var ARBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "trackingMode");
    __publicField(this, "markerAssetId");
    __publicField(this, "anchors");
    __publicField(this, "cancelButtonText");
    __publicField(this, "fallbackTarget");
    __publicField(this, "backgroundSound");
    const p = config.parameters ?? {};
    this.prompt = config.prompt || p.prompt || "Aim your camera at the marker";
    const tm = config.trackingMode ?? p.trackingMode;
    this.trackingMode = tm === "world" || tm === "face" ? tm : "marker";
    this.markerAssetId = config.markerAssetId ?? p.markerAssetId;
    this.anchors = Array.isArray(config.anchors) ? config.anchors : Array.isArray(p.anchors) ? p.anchors : [];
    this.cancelButtonText = config.cancelButtonText || p.cancelButtonText || "Skip";
    this.fallbackTarget = config.fallbackTarget ?? p.fallbackTarget;
    this.node = config.node || p.node;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      trackingMode: this.trackingMode,
      markerAssetId: this.markerAssetId,
      anchors: this.anchors,
      cancelButtonText: this.cancelButtonText,
      fallbackTarget: this.fallbackTarget,
      node: this.node,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.trackingMode !== void 0) {
      const tm = params.trackingMode;
      this.trackingMode = tm === "world" || tm === "face" ? tm : "marker";
    }
    if (params.markerAssetId !== void 0) this.markerAssetId = params.markerAssetId;
    if (params.anchors !== void 0) {
      const isBare = (t) => !!t && !t.startsWith("asaps://");
      const oldAnchorTargets = new Set(
        this.anchors.filter((a) => isBare(a.onTap)).map((a) => a.onTap)
      );
      this.anchors = Array.isArray(params.anchors) ? params.anchors : [];
      this.connections = this.connections.filter((c) => !oldAnchorTargets.has(c.targetId));
      for (const a of this.anchors) {
        if (isBare(a.onTap) && !this.connections.some((c) => c.targetId === a.onTap)) {
          this.addConnection({ targetId: a.onTap, label: a.label || a.id });
        }
      }
    }
    if (params.cancelButtonText !== void 0) this.cancelButtonText = params.cancelButtonText;
    if (params.fallbackTarget !== void 0) this.fallbackTarget = params.fallbackTarget;
    if (params.node !== void 0) this.node = params.node;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  /**
   * Override getConnections to expose anchor.onTap targets — the
   * routing logic mirrors movementChoice but understands the bare-id
   * vs asaps:// URI split (URIs don't create graph edges).
   */
  getConnections() {
    const connections = [];
    for (const a of this.anchors) {
      if (a.onTap && !a.onTap.startsWith("asaps://")) {
        connections.push({ targetId: a.onTap, label: a.label || a.id });
      }
    }
    if (this.fallbackTarget) {
      connections.push({ targetId: this.fallbackTarget, label: "Skip / no anchor", derivedFrom: "fallbackTarget" });
    }
    const base = super.getConnections();
    for (const conn of base) {
      if (!connections.some((c) => c.targetId === conn.targetId && c.label === conn.label)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  async performAction(context, renderer) {
    if (!renderer.renderAR) {
      console.warn(`[ARBeat ${this.id}] renderer.renderAR unavailable; skipping`);
      return this.fallbackTarget || this.getNextBeat(context);
    }
    const processedPrompt = this.processText(this.prompt, context);
    const locations = Array.from(this.locations.values());
    const anchorsForRenderer = this.anchors.map((a) => ({
      id: a.id,
      label: a.label ? this.processText(a.label, context) : void 0,
      assetId: a.assetId,
      anchoredTo: a.anchoredTo,
      offsetX: a.offsetX,
      offsetY: a.offsetY,
      scale: a.scale,
      onTap: a.onTap
    }));
    const result = await renderer.renderAR(
      {
        prompt: processedPrompt,
        trackingMode: this.trackingMode,
        markerAssetId: this.markerAssetId,
        anchors: anchorsForRenderer,
        cancelButtonText: this.cancelButtonText
      },
      locations
    );
    if (result === "cancelled" || result === "permission_denied") {
      context.recordTimelineEvent({
        type: "choice",
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "arBeat",
        text: result === "cancelled" ? "Skipped AR scene" : "Camera permission denied"
      });
      return this.fallbackTarget || this.getNextBeat(context);
    }
    const parsed = parseAsapsUri(result);
    if (parsed) {
      context.recordChoice({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "arBeat",
        choiceText: `Tapped anchor (ASAPS): ${result}`,
        choiceContext: this.prompt
      });
      switch (parsed.kind) {
        case "beat":
          return parsed.target;
        case "variable":
          context.setVariable(parsed.name, parsed.value);
          return this.getNextBeat(context);
        case "inventory":
          if (parsed.op === "add") context.addToInventory(parsed.item);
          else context.removeFromInventory(parsed.item);
          return this.getNextBeat(context);
        case "event":
          return this.getNextBeat(context);
      }
    }
    context.recordChoice({
      beatId: this.id,
      beatName: this.name || this.id,
      beatType: "arBeat",
      choiceText: `Tapped anchor: ${result}`,
      choiceContext: this.prompt
    });
    return result;
  }
};

// src/beats/PanoramaBeat.ts
var RAD_TO_DEG = 180 / Math.PI;
var PanoramaBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "panoramaAssetId");
    __publicField(this, "projectionType");
    __publicField(this, "hotspots");
    __publicField(this, "initialPitch");
    __publicField(this, "initialYaw");
    __publicField(this, "hfov");
    __publicField(this, "autoRotate");
    __publicField(this, "prompt");
    __publicField(this, "promptDisplay");
    __publicField(this, "minHfov");
    __publicField(this, "maxHfov");
    __publicField(this, "zoomSpeed");
    this.panoramaAssetId = config.parameters?.panoramaAssetId || "";
    this.projectionType = config.parameters?.projectionType || "equirectangular";
    this.hotspots = config.parameters?.hotspots || [];
    this.initialPitch = config.parameters?.initialPitch ?? 0;
    this.initialYaw = config.parameters?.initialYaw ?? 0;
    this.hfov = config.parameters?.hfov ?? 75;
    this.autoRotate = config.parameters?.autoRotate ?? 0;
    this.prompt = config.parameters?.prompt || "";
    this.promptDisplay = config.parameters?.promptDisplay || "static";
    this.minHfov = config.parameters?.minHfov ?? 30;
    this.maxHfov = config.parameters?.maxHfov ?? 120;
    this.zoomSpeed = config.parameters?.zoomSpeed ?? 1;
  }
  getParameters() {
    return {
      panoramaAssetId: this.panoramaAssetId,
      projectionType: this.projectionType,
      hotspots: this.hotspots,
      initialPitch: this.initialPitch,
      initialYaw: this.initialYaw,
      hfov: this.hfov,
      autoRotate: this.autoRotate,
      prompt: this.prompt,
      promptDisplay: this.promptDisplay,
      minHfov: this.minHfov,
      maxHfov: this.maxHfov,
      zoomSpeed: this.zoomSpeed,
      node: this.node
    };
  }
  updateParameters(params) {
    this._version++;
    if (params.panoramaAssetId !== void 0) this.panoramaAssetId = params.panoramaAssetId;
    if (params.projectionType !== void 0) this.projectionType = params.projectionType;
    if (params.hotspots !== void 0) {
      this.hotspots = params.hotspots;
      this.clearConnections();
      for (const hotspot of this.hotspots) {
        if (hotspot.target) {
          this.addConnection({
            targetId: hotspot.target,
            label: hotspot.text || hotspot.id
          });
        }
      }
    }
    if (params.initialPitch !== void 0) this.initialPitch = params.initialPitch;
    if (params.initialYaw !== void 0) this.initialYaw = params.initialYaw;
    if (params.hfov !== void 0) this.hfov = params.hfov;
    if (params.autoRotate !== void 0) this.autoRotate = params.autoRotate;
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.promptDisplay !== void 0) this.promptDisplay = params.promptDisplay;
    if (params.minHfov !== void 0) this.minHfov = params.minHfov;
    if (params.maxHfov !== void 0) this.maxHfov = params.maxHfov;
    if (params.zoomSpeed !== void 0) this.zoomSpeed = params.zoomSpeed;
    if (params.node !== void 0) this.node = params.node;
  }
  /**
   * Override getConnections to extract connections from hotspots dynamically
   */
  getConnections() {
    const connections = [];
    if (this.hotspots && Array.isArray(this.hotspots)) {
      for (const hotspot of this.hotspots) {
        if (hotspot.target) {
          connections.push({
            targetId: hotspot.target,
            label: hotspot.text || hotspot.id,
            condition: hotspot.conditions
          });
        }
      }
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId && c.label === conn.label)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  async performAction(context, renderer) {
    renderer.setState("panoramaAssetId", this.panoramaAssetId);
    let panoramaUrl = "";
    if (this.panoramaAssetId) {
      const story = context.getStory();
      if (story) {
        const environment = story.getEnvironment();
        if (environment?.nodes && Array.isArray(environment.nodes)) {
          const node = environment.nodes.find((n) => n.id === this.panoramaAssetId);
          if (node) {
            panoramaUrl = node.url || node.src || "";
          }
        }
      }
      if (!panoramaUrl) {
        panoramaUrl = renderer.getState("panoramaAssetUrl") || "";
      }
    }
    const availableHotspots = this.hotspots.filter((hotspot) => {
      if (!hotspot.conditions) return true;
      return hotspot.conditions.every((condition) => context.checkCondition(condition));
    });
    if (availableHotspots.length === 0) {
      console.warn(`[PanoramaBeat] No available hotspots for beat ${this.id} (total hotspots: ${this.hotspots.length})`);
    }
    const processedPrompt = this.prompt ? this.processText(this.prompt, context) : "";
    if (renderer.renderPanorama) {
      const stageW = 1024;
      const stageH = 768;
      console.log(`[PanoramaBeat] Beat "${this.name || this.id}" \u2014 ${this.locations.size} locations: [${Array.from(this.locations.keys()).join(", ")}]`);
      for (const [name, loc] of this.locations) {
        console.log(`  loc "${name}": kind=${loc.kind} x=${loc.x} y=${loc.y} w=${loc.width} h=${loc.height} assetId=${loc.assetId || "none"} imageUrl=${loc.imageUrl ? "yes" : "none"}`);
      }
      const enrichedHotspots = availableHotspots.map((h) => {
        let loc;
        if (h.locationName) {
          loc = this.locations.get(h.locationName);
          if (!loc) {
            for (const l of this.locations.values()) {
              if (l.name === h.locationName || l.id === h.locationName) {
                loc = l;
                break;
              }
            }
          }
        } else {
          loc = this.locations.get(h.text) || this.locations.get(h.id);
        }
        console.log(`  [PanoramaBeat] Hotspot "${h.id}" locationName="${h.locationName || ""}" \u2192 loc found: ${!!loc} kind=${loc?.kind || "none"} (lookup keys: "${h.locationName}", "${h.text}", "${h.id}")`);
        let pitch = h.pitch;
        let yaw = h.yaw;
        if (loc && h.locationName && loc.x !== void 0 && loc.y !== void 0) {
          const centerX = loc.x + loc.width / 2;
          const centerY = loc.y + loc.height / 2;
          if (this.projectionType === "cylindrical") {
            const imgAspect = 4;
            const halfYawDeg = 0.5 * imgAspect * RAD_TO_DEG;
            const maxPitchDeg = Math.atan(0.5) * RAD_TO_DEG;
            yaw = halfYawDeg * (1 - 2 * centerX / stageW);
            pitch = maxPitchDeg * (1 - 2 * centerY / stageH);
          } else {
            yaw = 180 - centerX / stageW * 360;
            pitch = 90 - centerY / stageH * 180;
          }
        }
        return {
          id: h.id,
          pitch,
          yaw,
          text: this.processText(h.displayText || h.text, context),
          ...loc ? {
            width: loc.width,
            height: loc.height,
            scale: loc.scale,
            rotation: loc.rotation,
            sound: h.soundEffect || loc.sound,
            assetId: loc.assetId,
            imageUrl: loc.imageUrl,
            kind: loc.kind,
            ...loc.hotspotOverride?.enabled ? { hotspotOverride: loc.hotspotOverride } : {}
          } : {
            ...h.soundEffect ? { sound: h.soundEffect } : {}
          }
        };
      });
      console.log(`[PanoramaBeat] Beat "${this.name || this.id}" \u2014 ${enrichedHotspots.length} enriched hotspots:`);
      for (const eh of enrichedHotspots) {
        const a = eh;
        console.log(`  [${eh.id}] yaw=${eh.yaw?.toFixed(1)} pitch=${eh.pitch?.toFixed(1)} text="${eh.text}" kind=${a.kind || "hotspot"} assetId=${a.assetId || "none"} imageUrl=${a.imageUrl ? "yes" : "none"} w=${a.width || "default"} h=${a.height || "default"}`);
      }
      const assignedLocationNames = new Set(
        availableHotspots.map((h) => h.locationName).filter(Boolean)
      );
      const overlayLocations = Array.from(this.locations.values()).filter((loc) => {
        if (loc.kind === "hotspot") return false;
        if (assignedLocationNames.has(loc.name)) return false;
        if (loc.kind === "text" || loc.kind === "dialog") return this.promptDisplay === "pinned";
        return true;
      }).map((loc) => {
        const centerX = loc.x + loc.width / 2;
        const centerY = loc.y + loc.height / 2;
        let yaw, pitch;
        if (this.projectionType === "cylindrical") {
          const imgAspect = 4;
          const halfYawDeg = 0.5 * imgAspect * RAD_TO_DEG;
          const maxPitchDeg = Math.atan(0.5) * RAD_TO_DEG;
          yaw = halfYawDeg * (1 - 2 * centerX / stageW);
          pitch = maxPitchDeg * (1 - 2 * centerY / stageH);
        } else {
          yaw = 180 - centerX / stageW * 360;
          pitch = 90 - centerY / stageH * 180;
        }
        return { ...loc, yaw, pitch };
      });
      const selectedHotspotId = await renderer.renderPanorama(panoramaUrl, {
        hotspots: enrichedHotspots,
        initialPitch: this.initialPitch,
        initialYaw: this.initialYaw,
        hfov: this.hfov,
        minHfov: this.minHfov,
        maxHfov: this.maxHfov,
        zoomSpeed: this.zoomSpeed,
        projectionType: this.projectionType,
        prompt: processedPrompt,
        promptDisplay: this.promptDisplay,
        locations: overlayLocations.length > 0 ? overlayLocations : void 0
      });
      const selectedHotspot = availableHotspots.find((h) => h.id === selectedHotspotId);
      if (selectedHotspot) {
        context.recordChoice({
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "panorama",
          choiceText: selectedHotspot.text,
          choiceContext: this.prompt || "360\xB0 panorama exploration"
        });
        if (selectedHotspot.effects) {
          selectedHotspot.effects.forEach((effect) => context.applyEffect(effect));
        }
        return selectedHotspot.target;
      }
    } else {
      console.warn(`[PanoramaBeat] Renderer does not support renderPanorama`);
    }
    return this.getNextBeat(context);
  }
};

// src/utils/xrPermissions.ts
async function ensureXRPermission(context, permissions, policy = {}) {
  if (!permissions || permissions.length === 0) return "granted";
  const sensor = context.getSensorService();
  const shouldPrompt = policy.prompt !== false;
  let allGranted = true;
  for (const name of permissions) {
    let state = await sensor.getPermissionState(name);
    if (state === "prompt" && shouldPrompt) {
      state = await sensor.requestPermission(name);
    }
    context.recordPermissionState(name, state);
    if (state !== "granted") allGranted = false;
  }
  if (allGranted) return "granted";
  return policy.onDenied === "skip" ? "skip" : "fallback";
}

// src/beats/GpsLocationBeat.ts
var GpsLocationBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "mode");
    // Renamed from `locations` to avoid clashing with Beat.locations
    // (the legacy Map<string, Location> on the base class). The serialized
    // parameter key is still `locations`, so existing data + editor flows
    // are unchanged.
    __publicField(this, "xrLocations");
    __publicField(this, "defaultTarget");
    __publicField(this, "radiusMeters");
    __publicField(this, "text");
    __publicField(this, "buttonText");
    __publicField(this, "cancelButtonText");
    __publicField(this, "timeoutMs");
    __publicField(this, "mapStyle");
    __publicField(this, "showPlayerMarker");
    // Legacy fields for backward compat with v0.9.48 single-location beats.
    __publicField(this, "targetLat");
    __publicField(this, "targetLng");
    const p = config.parameters || {};
    this.mode = config.mode ?? p.mode ?? "display";
    this.xrLocations = config.xrLocations ?? p.xrLocations;
    this.defaultTarget = config.defaultTarget ?? p.defaultTarget;
    this.radiusMeters = config.radiusMeters ?? p.radiusMeters;
    this.text = config.text ?? p.text;
    this.buttonText = config.buttonText ?? p.buttonText;
    this.cancelButtonText = config.cancelButtonText ?? p.cancelButtonText;
    this.timeoutMs = config.timeoutMs ?? p.timeoutMs;
    this.mapStyle = config.mapStyle ?? p.mapStyle;
    this.showPlayerMarker = config.showPlayerMarker ?? p.showPlayerMarker;
    this.targetLat = config.targetLat ?? p.targetLat;
    this.targetLng = config.targetLng ?? p.targetLng;
  }
  getParameters() {
    return {
      mode: this.mode,
      ...this.xrLocations !== void 0 ? { xrLocations: this.xrLocations } : {},
      ...this.defaultTarget !== void 0 ? { defaultTarget: this.defaultTarget } : {},
      ...this.radiusMeters !== void 0 ? { radiusMeters: this.radiusMeters } : {},
      ...this.text !== void 0 ? { text: this.text } : {},
      ...this.buttonText !== void 0 ? { buttonText: this.buttonText } : {},
      ...this.cancelButtonText !== void 0 ? { cancelButtonText: this.cancelButtonText } : {},
      ...this.timeoutMs !== void 0 ? { timeoutMs: this.timeoutMs } : {},
      ...this.mapStyle !== void 0 ? { mapStyle: this.mapStyle } : {},
      ...this.showPlayerMarker !== void 0 ? { showPlayerMarker: this.showPlayerMarker } : {},
      // Legacy fields preserved on roundtrip so old saves don't lose info.
      ...this.targetLat !== void 0 ? { targetLat: this.targetLat } : {},
      ...this.targetLng !== void 0 ? { targetLng: this.targetLng } : {}
    };
  }
  updateParameters(params) {
    if (params.mode !== void 0) this.mode = params.mode;
    if (params.xrLocations !== void 0) this.xrLocations = params.xrLocations;
    if (params.defaultTarget !== void 0) this.defaultTarget = params.defaultTarget;
    if (params.radiusMeters !== void 0) this.radiusMeters = params.radiusMeters;
    if (params.text !== void 0) this.text = params.text;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.cancelButtonText !== void 0) this.cancelButtonText = params.cancelButtonText;
    if (params.timeoutMs !== void 0) this.timeoutMs = params.timeoutMs;
    if (params.mapStyle !== void 0) this.mapStyle = params.mapStyle;
    if (params.showPlayerMarker !== void 0) this.showPlayerMarker = params.showPlayerMarker;
    if (params.targetLat !== void 0) this.targetLat = params.targetLat;
    if (params.targetLng !== void 0) this.targetLng = params.targetLng;
  }
  /**
   * Effective locations array for runtime + renderer. Prefers the
   * authored `locations` array; falls back to a synthesized
   * single-element array from legacy targetLat/targetLng for
   * backward compat with v0.9.48 stories.
   */
  getEffectiveLocations(context) {
    const base = this.xrLocations && this.xrLocations.length > 0 ? this.xrLocations : this.targetLat !== void 0 && this.targetLng !== void 0 ? [{
      id: "legacy",
      lat: this.targetLat,
      lng: this.targetLng,
      radiusMeters: this.radiusMeters,
      target: ""
      // legacy beats use the regular connection — set below
    }] : [];
    if (!context || !base.some((e) => e.pointName)) return base;
    const expanded = [];
    for (const entry of base) {
      if (!entry.pointName) {
        expanded.push(entry);
        continue;
      }
      const points = context.getGeoPoints(entry.pointName);
      points.forEach((pt, i) => {
        expanded.push({
          ...entry,
          id: `${entry.id}#${i}`,
          lat: pt.lat,
          lng: pt.lng,
          radiusMeters: pt.radiusMeters ?? entry.radiusMeters
        });
      });
    }
    return expanded;
  }
  /**
   * Override getConnections so each location's `target` shows up as
   * a separate outgoing edge in the graph. Same pattern as
   * MovementChoiceBeat.
   */
  getConnections() {
    const connections = [];
    const seen = /* @__PURE__ */ new Set();
    if (this.xrLocations) {
      for (const loc of this.xrLocations) {
        if (loc.target && !seen.has(loc.target)) {
          connections.push({ targetId: loc.target, label: loc.name || loc.id });
          seen.add(loc.target);
        }
      }
    }
    if (this.defaultTarget && !seen.has(this.defaultTarget)) {
      connections.push({ targetId: this.defaultTarget, label: "Default" });
      seen.add(this.defaultTarget);
    }
    for (const conn of super.getConnections()) {
      if (!seen.has(conn.targetId)) {
        connections.push(conn);
        seen.add(conn.targetId);
      }
    }
    return connections;
  }
  /**
   * Exit path for every "couldn't run the geofence" case (permission denied
   * with no project fallback, empty/invalid location set, renderer without a
   * map). MUST prefer `defaultTarget`: `getNextBeat()` returns the beat's
   * FIRST connection, which for trigger-mode beats is typically an ARRIVAL
   * target — falling through to it made a silent skip look like a successful
   * arrival (the iOS field-test false-PASS bug: geolocation already denied →
   * no prompt → empty geofence → "arrived").
   */
  skipExit(context) {
    if (this.defaultTarget) return this.defaultTarget;
    return this.getNextBeat(context);
  }
  async performAction(context, renderer) {
    const story = context.getStory?.();
    const locationSettings = story?.getSettings?.()?.location;
    if (this.mode !== "display") {
      renderer.renderLoading?.(uiString("gpsLocating"), { spinnerType: "pulse" });
      const verdict = await ensureXRPermission(context, ["gps"], {
        onDenied: locationSettings?.onPermissionDenied
      });
      if (verdict === "fallback") {
        const fallback = locationSettings?.fallbackBeatId;
        if (fallback) return fallback;
        return this.skipExit(context);
      }
      if (verdict === "skip") {
        return this.skipExit(context);
      }
    }
    const effective = this.getEffectiveLocations(context);
    if (effective.length === 0) {
      console.warn(`[GpsLocationBeat ${this.id}] no locations configured \u2014 skipping`);
      return this.skipExit(context);
    }
    const valid = effective.filter((loc) => loc.lat !== void 0 && loc.lng !== void 0);
    if (valid.length === 0) {
      console.warn(`[GpsLocationBeat ${this.id}] no valid lat/lng on any location \u2014 skipping`);
      return this.skipExit(context);
    }
    const projectDefault = locationSettings?.defaultProximityRadiusM ?? 25;
    const renderLocations = valid.map((loc) => ({
      id: loc.id,
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      radiusMeters: loc.radiusMeters ?? this.radiusMeters ?? projectDefault
    }));
    const unsubscribe = context.getSensorService().ensureLocationCacheActive();
    renderer.setState?.("sensorService", context.getSensorService());
    let result;
    try {
      if (!renderer.renderMap) {
        console.warn(`[GpsLocationBeat ${this.id}] renderer doesn't implement renderMap \u2014 advancing`);
        return this.skipExit(context);
      }
      result = await renderer.renderMap({
        mode: this.mode,
        locations: renderLocations,
        text: this.text,
        buttonText: this.buttonText,
        cancelButtonText: this.cancelButtonText,
        timeoutMs: this.timeoutMs,
        mapStyle: this.mapStyle,
        showPlayerMarker: this.showPlayerMarker
      });
    } finally {
      unsubscribe();
    }
    if (result.locationId) {
      const matched = valid.find((l) => l.id === result.locationId);
      if (matched) {
        if (matched.effects && matched.effects.length > 0) {
          for (const eff of matched.effects) {
            try {
              context.applyEffect(eff);
            } catch (err) {
              console.warn(`[GpsLocationBeat ${this.id}] applyEffect failed:`, err);
            }
          }
        }
        if (matched.target) return matched.target;
      }
    }
    if (this.defaultTarget) return this.defaultTarget;
    return this.getNextBeat(context);
  }
};

// src/beats/IndoorLocationBeat.ts
var IndoorLocationBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "mode");
    // Renamed from `locations` to avoid clashing with Beat.locations
    // (the legacy Map<string, Location> on the base class).
    __publicField(this, "xrLocations");
    __publicField(this, "floorPlanAssetId");
    __publicField(this, "floorWidthM");
    __publicField(this, "floorHeightM");
    __publicField(this, "defaultTarget");
    __publicField(this, "radiusMeters");
    __publicField(this, "text");
    __publicField(this, "buttonText");
    __publicField(this, "cancelButtonText");
    __publicField(this, "timeoutMs");
    __publicField(this, "targetBeaconUuid");
    const p = config.parameters || {};
    this.mode = config.mode ?? p.mode ?? "display";
    this.xrLocations = config.xrLocations ?? p.xrLocations;
    this.floorPlanAssetId = config.floorPlanAssetId ?? p.floorPlanAssetId;
    this.floorWidthM = config.floorWidthM ?? p.floorWidthM;
    this.floorHeightM = config.floorHeightM ?? p.floorHeightM;
    this.defaultTarget = config.defaultTarget ?? p.defaultTarget;
    this.radiusMeters = config.radiusMeters ?? p.radiusMeters;
    this.text = config.text ?? p.text;
    this.buttonText = config.buttonText ?? p.buttonText;
    this.cancelButtonText = config.cancelButtonText ?? p.cancelButtonText;
    this.timeoutMs = config.timeoutMs ?? p.timeoutMs;
    this.targetBeaconUuid = config.targetBeaconUuid ?? p.targetBeaconUuid;
  }
  getParameters() {
    return {
      mode: this.mode,
      ...this.xrLocations !== void 0 ? { xrLocations: this.xrLocations } : {},
      ...this.floorPlanAssetId !== void 0 ? { floorPlanAssetId: this.floorPlanAssetId } : {},
      ...this.floorWidthM !== void 0 ? { floorWidthM: this.floorWidthM } : {},
      ...this.floorHeightM !== void 0 ? { floorHeightM: this.floorHeightM } : {},
      ...this.defaultTarget !== void 0 ? { defaultTarget: this.defaultTarget } : {},
      ...this.radiusMeters !== void 0 ? { radiusMeters: this.radiusMeters } : {},
      ...this.text !== void 0 ? { text: this.text } : {},
      ...this.buttonText !== void 0 ? { buttonText: this.buttonText } : {},
      ...this.cancelButtonText !== void 0 ? { cancelButtonText: this.cancelButtonText } : {},
      ...this.timeoutMs !== void 0 ? { timeoutMs: this.timeoutMs } : {},
      ...this.targetBeaconUuid !== void 0 ? { targetBeaconUuid: this.targetBeaconUuid } : {}
    };
  }
  updateParameters(params) {
    if (params.mode !== void 0) this.mode = params.mode;
    if (params.xrLocations !== void 0) this.xrLocations = params.xrLocations;
    if (params.floorPlanAssetId !== void 0) this.floorPlanAssetId = params.floorPlanAssetId;
    if (params.floorWidthM !== void 0) this.floorWidthM = params.floorWidthM;
    if (params.floorHeightM !== void 0) this.floorHeightM = params.floorHeightM;
    if (params.defaultTarget !== void 0) this.defaultTarget = params.defaultTarget;
    if (params.radiusMeters !== void 0) this.radiusMeters = params.radiusMeters;
    if (params.text !== void 0) this.text = params.text;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.cancelButtonText !== void 0) this.cancelButtonText = params.cancelButtonText;
    if (params.timeoutMs !== void 0) this.timeoutMs = params.timeoutMs;
    if (params.targetBeaconUuid !== void 0) this.targetBeaconUuid = params.targetBeaconUuid;
  }
  getEffectiveLocations() {
    if (this.xrLocations && this.xrLocations.length > 0) return this.xrLocations;
    if (this.targetBeaconUuid) {
      return [{
        id: "legacy",
        beaconUuid: this.targetBeaconUuid,
        radiusMeters: this.radiusMeters,
        target: ""
      }];
    }
    return [];
  }
  getConnections() {
    const connections = [];
    const seen = /* @__PURE__ */ new Set();
    if (this.xrLocations) {
      for (const loc of this.xrLocations) {
        if (loc.target && !seen.has(loc.target)) {
          connections.push({ targetId: loc.target, label: loc.name || loc.id });
          seen.add(loc.target);
        }
      }
    }
    if (this.defaultTarget && !seen.has(this.defaultTarget)) {
      connections.push({ targetId: this.defaultTarget, label: "Default" });
      seen.add(this.defaultTarget);
    }
    for (const conn of super.getConnections()) {
      if (!seen.has(conn.targetId)) {
        connections.push(conn);
        seen.add(conn.targetId);
      }
    }
    return connections;
  }
  /**
   * Exit path for every "couldn't run the geofence" case. Prefers
   * `defaultTarget` over `getNextBeat()` — the latter returns the FIRST
   * connection, which for trigger-mode beats is typically an arrival target,
   * so a silent skip would masquerade as a successful arrival. Mirrors the
   * same fix in GpsLocationBeat (the iOS field-test false-PASS bug).
   */
  skipExit(context) {
    if (this.defaultTarget) return this.defaultTarget;
    return this.getNextBeat(context);
  }
  async performAction(context, renderer) {
    const story = context.getStory?.();
    const locationSettings = story?.getSettings?.()?.location;
    if (this.mode !== "display") {
      const verdict = await ensureXRPermission(context, ["beacons"], {
        onDenied: locationSettings?.onPermissionDenied
      });
      if (verdict === "fallback") {
        const fallback = locationSettings?.fallbackBeatId;
        if (fallback) return fallback;
        return this.skipExit(context);
      }
      if (verdict === "skip") return this.skipExit(context);
    }
    const effective = this.getEffectiveLocations();
    if (effective.length === 0) {
      console.warn(`[IndoorLocationBeat ${this.id}] no locations configured \u2014 skipping`);
      return this.skipExit(context);
    }
    const valid = effective.filter((l) => !!l.beaconUuid);
    if (valid.length === 0) {
      console.warn(`[IndoorLocationBeat ${this.id}] no valid beaconUuid on any location \u2014 skipping`);
      return this.skipExit(context);
    }
    const projectDefault = locationSettings?.defaultProximityRadiusM ?? 5;
    const projectBeacons = locationSettings?.venue?.beacons || [];
    const renderLocations = valid.map((loc) => {
      const fallback = projectBeacons.find((b) => b.uuid === loc.beaconUuid);
      return {
        id: loc.id,
        name: loc.name,
        beaconUuid: loc.beaconUuid,
        x: loc.x ?? fallback?.x ?? 0,
        y: loc.y ?? fallback?.y ?? 0,
        radiusMeters: loc.radiusMeters ?? this.radiusMeters ?? projectDefault
      };
    });
    const unsubscribe = context.getSensorService().ensureBeaconCacheActive();
    renderer.setState?.("sensorService", context.getSensorService());
    let result;
    try {
      if (!renderer.renderIndoorMap) {
        console.warn(`[IndoorLocationBeat ${this.id}] renderer doesn't implement renderIndoorMap \u2014 advancing`);
        return this.skipExit(context);
      }
      const beatHasVenue = !!this.floorPlanAssetId || this.floorWidthM !== void 0 || this.floorHeightM !== void 0;
      const venue = beatHasVenue ? {
        name: void 0,
        floorPlanAssetId: this.floorPlanAssetId,
        floorWidth: this.floorWidthM ?? locationSettings?.venue?.floorWidth ?? 20,
        floorHeight: this.floorHeightM ?? locationSettings?.venue?.floorHeight ?? 20
      } : locationSettings?.venue ? {
        name: locationSettings.venue.name,
        floorPlanAssetId: locationSettings.venue.floorPlan,
        floorWidth: locationSettings.venue.floorWidth,
        floorHeight: locationSettings.venue.floorHeight
      } : void 0;
      result = await renderer.renderIndoorMap({
        mode: this.mode,
        locations: renderLocations,
        text: this.text,
        buttonText: this.buttonText,
        cancelButtonText: this.cancelButtonText,
        timeoutMs: this.timeoutMs,
        venue
      });
    } finally {
      unsubscribe();
    }
    if (result.locationId) {
      const matched = valid.find((l) => l.id === result.locationId);
      if (matched) {
        if (matched.effects && matched.effects.length > 0) {
          for (const eff of matched.effects) {
            try {
              context.applyEffect(eff);
            } catch (err) {
              console.warn(`[IndoorLocationBeat ${this.id}] applyEffect failed:`, err);
            }
          }
        }
        if (matched.target) return matched.target;
      }
    }
    if (this.defaultTarget) return this.defaultTarget;
    return this.getNextBeat(context);
  }
};

// src/beats/OnlineContentBeat.ts
var OnlineContentBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "sourceType");
    __publicField(this, "apiUrl");
    __publicField(this, "apiParams");
    __publicField(this, "jsonPath");
    __publicField(this, "headers");
    __publicField(this, "query");
    __publicField(this, "title");
    __publicField(this, "displayTemplate");
    __publicField(this, "buttonText");
    __publicField(this, "maxWords");
    __publicField(this, "errorMessage");
    __publicField(this, "errorTarget");
    // Cache for prefetched AI content, and the query (variables filled in) it
    // answers. A prefetch runs while the player is still on the previous beat;
    // if a variable in the query changes before this beat runs (an answer, a
    // Preview debug edit, a restart with other values), the cached answer is
    // about something else and is thrown away.
    __publicField(this, "prefetchedContent", null);
    __publicField(this, "prefetchedFor", null);
    /**
     * Fetch content using AI query
     */
    __publicField(this, "aiGeneratedTitle", null);
    const params = config.parameters || {};
    this.sourceType = params.sourceType || config.sourceType || "api";
    this.apiUrl = params.apiUrl || config.apiUrl;
    this.apiParams = params.apiParams || config.apiParams;
    this.jsonPath = params.jsonPath || config.jsonPath;
    this.headers = params.headers || config.headers;
    this.query = params.query || config.query;
    this.title = params.title || config.title;
    this.displayTemplate = params.displayTemplate || config.displayTemplate || "{{data}}";
    this.buttonText = params.buttonText || config.buttonText || "Continue";
    this.maxWords = params.maxWords || config.maxWords || 150;
    this.errorMessage = params.errorMessage || config.errorMessage || "Unable to fetch content. Please try again.";
    this.errorTarget = params.errorTarget || config.errorTarget;
  }
  getParameters() {
    return {
      sourceType: this.sourceType,
      apiUrl: this.apiUrl,
      apiParams: this.apiParams,
      jsonPath: this.jsonPath,
      headers: this.headers,
      query: this.query,
      title: this.title,
      displayTemplate: this.displayTemplate,
      buttonText: this.buttonText,
      maxWords: this.maxWords,
      errorMessage: this.errorMessage,
      errorTarget: this.errorTarget,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.sourceType !== void 0) this.sourceType = params.sourceType;
    if (params.apiUrl !== void 0) this.apiUrl = params.apiUrl;
    if (params.apiParams !== void 0) this.apiParams = params.apiParams;
    if (params.jsonPath !== void 0) this.jsonPath = params.jsonPath;
    if (params.headers !== void 0) this.headers = params.headers;
    if (params.query !== void 0) this.query = params.query;
    if (params.title !== void 0) this.title = params.title;
    if (params.displayTemplate !== void 0) this.displayTemplate = params.displayTemplate;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.maxWords !== void 0) this.maxWords = params.maxWords;
    if (params.errorMessage !== void 0) this.errorMessage = params.errorMessage;
    if (params.errorTarget !== void 0) this.errorTarget = params.errorTarget;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  /**
   * Prefetch AI content in the background so it's cached when the beat executes.
   * Only works for 'ai-query' source type. API fetches are not prefetched
   * since they may have side effects or require fresh data.
   */
  async prefetch(context, renderer) {
    if (this.sourceType !== "ai-query") return;
    try {
      const aiService = renderer.getState("aiService");
      if (!aiService || typeof aiService.generateContent !== "function") return;
      const query = this.processText(this.query || "", context);
      if (this.prefetchedContent && this.prefetchedFor === query) return;
      console.log(`[OnlineContentBeat ${this.id}] Prefetching AI content...`);
      this.prefetchedContent = await this.fetchAIContent(context, renderer);
      this.prefetchedFor = query;
      console.log(`[OnlineContentBeat ${this.id}] Prefetch complete`);
    } catch (err) {
      console.log(`[OnlineContentBeat ${this.id}] Prefetch failed (will retry on execute):`, err);
    }
  }
  async performAction(context, renderer) {
    renderer.setState("currentBeatType", "onlineContent");
    renderer.setState("slotAnimations", this.slotAnimations);
    try {
      let content;
      if (renderer.renderLoading) {
        if (this.sourceType === "api") {
          renderer.renderLoading("Fetching data...", {
            subMessage: "Please wait while I retrieve the information",
            spinnerType: "spinner"
          });
        } else {
          const loadingMessages = [
            "Let me search for that...",
            "Searching the internet for you...",
            "Let me find out more...",
            "Looking that up for you..."
          ];
          const message = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
          renderer.renderLoading(message, {
            subMessage: "This may take a moment",
            spinnerType: "dots"
          });
        }
      }
      const prefetchMatches = this.prefetchedContent !== null && this.prefetchedFor === this.processText(this.query || "", context);
      if (this.prefetchedContent !== null && !prefetchMatches) {
        console.log(`[OnlineContentBeat ${this.id}] Prefetched content is for an older query \u2014 fetching again`);
      }
      const prefetched = prefetchMatches ? this.prefetchedContent : null;
      this.prefetchedContent = null;
      this.prefetchedFor = null;
      if (prefetched !== null) {
        console.log(`[OnlineContentBeat ${this.id}] Using prefetched content`);
        content = prefetched;
      } else if (this.sourceType === "api") {
        content = await this.fetchApiContent(context, renderer);
      } else {
        content = await this.fetchAIContent(context, renderer);
      }
      let title = this.title;
      if (!title && this.aiGeneratedTitle) {
        title = this.aiGeneratedTitle;
      } else if (!title && this.query) {
        const processedQuery = this.processText(this.query, context);
        title = this.deriveTitle(processedQuery);
      }
      context.recordAIOutput({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "onlineContent",
        text: content
      });
      const displayText = this.displayTemplate?.replace("{{data}}", content) || content;
      const processedText = this.processText(displayText, context);
      const processedButtonText = this.processText(this.buttonText || "Continue", context);
      const processedTitle = title ? this.processText(title, context) : "";
      const filledLocations = this.locationsWithContent(processedTitle, processedText, processedButtonText);
      const locations = filledLocations;
      console.log(`[OnlineContentBeat ${this.id}] Calling renderText with ${locations.length} locations, title="${processedTitle}"`);
      for (const loc of locations) {
        console.log(`[OnlineContentBeat ${this.id}] Location "${loc.name}" content="${(loc.content || "").substring(0, 50)}..."`);
      }
      await renderer.renderText(processedText, processedButtonText, locations);
      return this.getNextBeat(context);
    } catch (error) {
      console.error(`[OnlineContentBeat ${this.id}] Error:`, error);
      if (this.errorTarget) {
        return this.errorTarget;
      }
      const processedError = this.processText(this.errorMessage || "Content unavailable.", context);
      const processedButtonText = this.processText(this.buttonText || "Continue", context);
      const locations = this.locationsWithContent(this.title ? this.processText(this.title, context) : "", processedError, processedButtonText);
      await renderer.renderText(processedError, processedButtonText, locations);
      return this.getNextBeat(context);
    }
  }
  /** The beat's text boxes with this run's title / text / button, as copies. */
  locationsWithContent(title, text, button) {
    return Array.from(this.locations.values()).map((loc) => {
      const nameLower = (loc.name || "").toLowerCase();
      if (nameLower.includes("title")) return { ...loc, content: title };
      if (nameLower.includes("text")) return { ...loc, content: text };
      if (nameLower.includes("button") || nameLower.includes("continue")) return { ...loc, content: button };
      return { ...loc };
    });
  }
  /**
   * Derive a title from the query text
   * Creates a descriptive title like "Transportation and Environment in Marsaskala, Malta"
   */
  deriveTitle(query) {
    const properLocationMatch = query.match(/\s+(?:in|for)\s+([\p{Lu}][\p{L}]+(?:,\s*[\p{Lu}][\p{L}]+)?)/u);
    let location = "";
    if (properLocationMatch) {
      location = properLocationMatch[1].trim();
    }
    const topicPatterns = [
      /car\s*ownership/gi,
      /transportation/gi,
      /transport/gi,
      /environment(?:al)?/gi,
      /public\s*transit/gi,
      /traffic/gi,
      /pollution/gi,
      /climate/gi,
      /weather/gi,
      /news/gi,
      /statistics?/gi,
      /economy/gi,
      /population/gi,
      /culture/gi,
      /history/gi,
      /food/gi,
      /tourism/gi
    ];
    const foundTopics = [];
    for (const pattern of topicPatterns) {
      const match = query.match(pattern);
      if (match) {
        let topic = match[0].toLowerCase().replace(/\s+/g, " ").replace(/^car ownership$/i, "Car Ownership").replace(/^transportation$/i, "Transportation").replace(/^transport$/i, "Transportation").replace(/^environment$/i, "Environment").replace(/^environmental$/i, "Environment").replace(/^public transit$/i, "Public Transit").replace(/^traffic$/i, "Traffic").replace(/^pollution$/i, "Pollution").replace(/^climate$/i, "Climate").replace(/^weather$/i, "Weather").replace(/^news$/i, "News").replace(/^statistics?$/i, "Statistics").replace(/^economy$/i, "Economy").replace(/^population$/i, "Population").replace(/^culture$/i, "Culture").replace(/^history$/i, "History").replace(/^food$/i, "Food").replace(/^tourism$/i, "Tourism");
        topic = topic.charAt(0).toUpperCase() + topic.slice(1);
        if (!foundTopics.includes(topic)) {
          foundTopics.push(topic);
        }
      }
    }
    let title = "";
    if (foundTopics.length > 0) {
      const topics = foundTopics.slice(0, 3);
      if (topics.length === 1) {
        title = topics[0];
      } else if (topics.length === 2) {
        title = `${topics[0]} and ${topics[1]}`;
      } else {
        title = `${topics[0]}, ${topics[1]} and ${topics[2]}`;
      }
    } else {
      title = query.replace(/^(what is|what are|how many|how much|tell me about|find|search for|look up|give me|provide|explain|the)\s*/i, "").replace(/[?.].*$/, "").trim().split(/\s+/).slice(0, 5).join(" ");
      title = title.split(" ").map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(" ");
    }
    if (location) {
      title += ` in ${location}`;
    }
    return title;
  }
  /**
   * Fetch content from a direct API endpoint
   */
  async fetchApiContent(context, renderer) {
    if (!this.apiUrl) {
      throw new Error("API URL is required for api source type");
    }
    let url = this.processText(this.apiUrl, context);
    if (this.apiParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(this.apiParams)) {
        params.append(key, this.processText(value, context));
      }
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}${params.toString()}`;
    }
    console.log(`[OnlineContentBeat ${this.id}] Fetching: ${url}`);
    const response = await fetch(url, {
      headers: this.headers
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    if (this.jsonPath) {
      return this.extractByPath(data, this.jsonPath);
    }
    return typeof data === "string" ? data : JSON.stringify(data);
  }
  async fetchAIContent(context, renderer) {
    if (!this.query) {
      throw new Error("Query is required for ai-query source type");
    }
    const aiService = renderer.getState("aiService");
    if (!aiService || typeof aiService.generateContent !== "function") {
      throw new Error("AI service not configured. Please configure AI settings.");
    }
    const processedQuery = this.processText(this.query, context);
    console.log(`[OnlineContentBeat ${this.id}] AI Query: ${processedQuery}`);
    this.aiGeneratedTitle = null;
    const result = await aiService.generateContent(
      `You are providing information for an interactive story. The user is exploring a topic.

TOPIC TO RESEARCH: ${processedQuery}

Write a brief, engaging response that:
- Is conversational and friendly in tone
- Presents the key facts naturally, as if explaining to a curious friend
- Uses clear paragraph breaks for readability
- Starts directly with the facts (the player already sees the topic)
- Is flowing prose paragraphs \u2014 the story screen renders plain paragraphs, not lists
- Has no citations, URLs or "According to..." attributions
- Is about ${this.maxWords} words at most (the author's length setting; longer text is cut)

Start your response with a short, descriptive title on its own line (no formatting prefix, no colon, no quotes), followed by an empty line, then the content. The title should summarize the topic.

Example format:
Transportation and Urban Life in Example City

The city's transportation network features...`,
      { enableWebSearch: true, maxTokens: Math.max(1e3, this.maxWords * 4) }
    );
    let cleaned = result;
    const thinkingPatterns = [
      /^.*?(?:The user is asking|Let me search|I need to find|Let me think|I'll search|I should|Let me structure|Word count target|I'll write)[^]*?(?:---+|Let me write:?|Here's my response:?|Final response:?)\s*/i,
      /^.*?(?:For \w+ (?:rates?|data|info|statistics):)[^]*?(?:---+|Let me write|Here's my response)\s*/i
    ];
    for (const pattern of thinkingPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        cleaned = cleaned.slice(match[0].length).trim();
        console.log(`[OnlineContentBeat] Removed thinking process (${match[0].length} chars)`);
      }
    }
    const separatorMatch = cleaned.match(/^[^]*?---+\s*/);
    if (separatorMatch && separatorMatch[0].length < cleaned.length * 0.8) {
      cleaned = cleaned.slice(separatorMatch[0].length).trim();
      console.log(`[OnlineContentBeat] Removed content before separator`);
    }
    const titleSplit = cleaned.match(/^([^\n]{5,100})\n\s*\n([\s\S]+)$/);
    if (titleSplit) {
      const potentialTitle = titleSplit[1].trim();
      if (!potentialTitle.includes(".") && !potentialTitle.startsWith("#") && !potentialTitle.startsWith("*")) {
        this.aiGeneratedTitle = potentialTitle;
        cleaned = titleSplit[2].trim();
        console.log(`[OnlineContentBeat ${this.id}] Extracted AI title: "${this.aiGeneratedTitle}"`);
      }
    }
    const queryWords = processedQuery.toLowerCase().split(/\s+/).slice(0, 8);
    const firstWords = cleaned.toLowerCase().split(/\s+/).slice(0, 10);
    const matchCount = queryWords.filter((w) => firstWords.includes(w)).length;
    if (matchCount > queryWords.length / 2) {
      const contentStart = cleaned.match(/(?:Based on[^:]*:|According to[^:]*:|:\s*)/i);
      if (contentStart && contentStart.index !== void 0) {
        cleaned = cleaned.slice(contentStart.index + contentStart[0].length).trim();
      } else {
        const sentences = cleaned.split(/(?<=[.!?])\s+/);
        let startIndex = 0;
        for (let i = 0; i < sentences.length; i++) {
          const sentenceWords = sentences[i].toLowerCase().split(/\s+/);
          const sentenceMatch = queryWords.filter((w) => sentenceWords.includes(w)).length;
          if (sentenceMatch < queryWords.length / 3) {
            startIndex = i;
            break;
          }
        }
        if (startIndex > 0) {
          cleaned = sentences.slice(startIndex).join(" ");
        }
      }
    }
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/_([^_]+)_/g, "$1").replace(/^(Based on|According to|From|My research|I found|Looking at|When examining)[^.:]*[.:]\s*/i, "").replace(/^(Here's|Here is|Here are)[^:]*:\s*/i, "").trim();
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    const words = cleaned.split(/\s+/);
    if (words.length > this.maxWords) {
      const truncated = words.slice(0, this.maxWords).join(" ");
      const lastSentenceEnd = truncated.search(/[.!?][^.!?]*$/);
      if (lastSentenceEnd > truncated.length * 0.5) {
        cleaned = truncated.slice(0, lastSentenceEnd + 1).trim();
      } else {
        cleaned = truncated.trim() + "\u2026";
      }
    }
    return cleaned;
  }
  /**
   * Simple JSONPath-like extraction (supports basic paths like "$.current.temp_c")
   */
  extractByPath(data, path) {
    const cleanPath = path.startsWith("$.") ? path.slice(2) : path;
    const parts = cleanPath.split(/\.|\[|\]/).filter((p) => p);
    let current2 = data;
    for (const part of parts) {
      if (current2 === null || current2 === void 0) {
        return "";
      }
      const index = parseInt(part, 10);
      if (!isNaN(index) && Array.isArray(current2)) {
        current2 = current2[index];
      } else {
        current2 = current2[part];
      }
    }
    return typeof current2 === "string" ? current2 : JSON.stringify(current2);
  }
};

// src/utils/PlayerContextBuilder.ts
var PlayerContextBuilder = class {
  constructor(context, story) {
    __publicField(this, "context", context);
    __publicField(this, "story", story);
  }
  /**
   * Build a structured context object from player state
   */
  buildContext(options = {}) {
    const {
      variables = [],
      includeVariables = true,
      includeInventory = true,
      includeHistory = false,
      includeChoiceHistory = false,
      includeCounters = true,
      counters = [],
      includeCharacterInventories = false,
      maxHistoryItems = 50,
      maxChoiceItems = 20
    } = options;
    const allVariables = this.context.getVariables();
    const selectedVariables = {};
    if (includeVariables) {
      if (variables.length === 0) {
        Object.assign(selectedVariables, allVariables);
      } else {
        for (const varName of variables) {
          if (varName in allVariables) {
            selectedVariables[varName] = allVariables[varName];
          }
        }
      }
    }
    const allCounters = this.context.getCounters();
    const selectedCounters = {};
    if (includeCounters) {
      if (counters.length === 0) {
        Object.assign(selectedCounters, allCounters);
      } else {
        for (const counterName of counters) {
          if (counterName in allCounters) {
            selectedCounters[counterName] = allCounters[counterName];
          }
        }
      }
    }
    const inventory = includeInventory ? this.context.getInventory() : [];
    const inventoryWithQuantities = includeInventory ? this.context.getInventoryEntries() : void 0;
    const visitedBeats = this.context.getVisitedBeats();
    const fullHistory = this.context.getHistory();
    const history = includeHistory ? fullHistory.slice(-maxHistoryItems) : [];
    const state = this.context.getState();
    const characterInventories = includeCharacterInventories ? Object.fromEntries(
      Object.entries(state.characterInventories).map(([char, entries]) => [
        char,
        entries.map((e) => e.name)
      ])
    ) : void 0;
    const characterInventoriesWithQuantities = includeCharacterInventories ? Object.fromEntries(
      Object.entries(state.characterInventories).map(([char, entries]) => [
        char,
        entries.map((e) => ({ ...e }))
      ])
    ) : void 0;
    const fullChoiceHistory = this.context.getChoiceHistory();
    const choiceHistory = includeChoiceHistory ? fullChoiceHistory.slice(-maxChoiceItems) : void 0;
    return {
      variables: selectedVariables,
      counters: selectedCounters,
      inventory,
      inventoryWithQuantities,
      characterInventories,
      characterInventoriesWithQuantities,
      visitedBeats,
      history,
      choiceHistory
    };
  }
  /**
   * Build a formatted string for AI prompts describing the player's current state
   */
  buildPromptContext(options = {}) {
    const data = this.buildContext(options);
    const sections = [];
    const varEntries = Object.entries(data.variables);
    if (varEntries.length > 0) {
      const varLines = varEntries.map(([k, v]) => `  - ${k}: ${JSON.stringify(v)}`);
      sections.push(`Player Variables:
${varLines.join("\n")}`);
    }
    const counterEntries = Object.entries(data.counters);
    if (counterEntries.length > 0) {
      const counterLines = counterEntries.map(([k, v]) => `  - ${k}: ${v}`);
      sections.push(`Counters:
${counterLines.join("\n")}`);
    }
    if (data.inventoryWithQuantities && data.inventoryWithQuantities.length > 0) {
      const inventoryFormatted = data.inventoryWithQuantities.map(
        (item) => item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name
      );
      sections.push(`Player Inventory: ${inventoryFormatted.join(", ")}`);
    } else if (data.inventory.length > 0) {
      sections.push(`Player Inventory: ${data.inventory.join(", ")}`);
    }
    if (data.characterInventoriesWithQuantities) {
      const charInvLines = [];
      for (const [char, items] of Object.entries(data.characterInventoriesWithQuantities)) {
        if (items.length > 0) {
          const itemsFormatted = items.map(
            (item) => item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name
          );
          charInvLines.push(`  - ${char}: ${itemsFormatted.join(", ")}`);
        }
      }
      if (charInvLines.length > 0) {
        sections.push(`Character Inventories:
${charInvLines.join("\n")}`);
      }
    } else if (data.characterInventories) {
      const charInvLines = [];
      for (const [char, items] of Object.entries(data.characterInventories)) {
        if (items.length > 0) {
          charInvLines.push(`  - ${char}: ${items.join(", ")}`);
        }
      }
      if (charInvLines.length > 0) {
        sections.push(`Character Inventories:
${charInvLines.join("\n")}`);
      }
    }
    if (data.visitedBeats.length > 0) {
      const beatDescriptions = this.getBeatDescriptions(data.visitedBeats);
      if (beatDescriptions.length > 0) {
        sections.push(`Visited Scenes: ${beatDescriptions.join(", ")}`);
      }
    }
    if (data.history.length > 0 && options.includeHistory) {
      const historyDescriptions = this.getBeatDescriptions(data.history);
      sections.push(`Journey Path (${data.history.length} beats):
${historyDescriptions.join(" \u2192 ")}`);
    }
    if (data.choiceHistory && data.choiceHistory.length > 0) {
      const choiceLines = data.choiceHistory.map((choice) => {
        const context = choice.choiceContext ? `"${choice.choiceContext}"` : choice.beatName || choice.beatId;
        return `  - ${context} \u2192 chose "${choice.choiceText}"`;
      });
      sections.push(`Player Choices:
${choiceLines.join("\n")}`);
    }
    return sections.join("\n\n");
  }
  /**
   * Build a summary of the player's journey for AI summary generation
   */
  buildJourneySummary(options = {}) {
    const {
      includeVariables = true,
      includeCounters = true,
      includeInventory = true,
      includeVisitedBeats = true,
      includeChoiceHistory = true
    } = options;
    const history = this.context.getHistory();
    const variables = this.context.getVariables();
    const counters = this.context.getCounters();
    const inventoryEntries = this.context.getInventoryEntries();
    const visitedBeats = this.context.getVisitedBeats();
    const choiceHistory = this.context.getChoiceHistory();
    const sections = [];
    sections.push(`## Journey Statistics
- Total beats visited: ${history.length}
- Unique beats visited: ${visitedBeats.length}
- Choices made: ${choiceHistory.length}`);
    if (includeVariables) {
      const profileVars = ["name", "playerName", "gender", "profession", "role"];
      const profile = [];
      for (const varName of profileVars) {
        if (varName in variables && variables[varName]) {
          profile.push(`${varName}: ${variables[varName]}`);
        }
      }
      if (profile.length > 0) {
        sections.push(`## Player Profile
${profile.join("\n")}`);
      }
      const otherVars = Object.entries(variables).filter(([k]) => !profileVars.includes(k)).map(([k, v]) => `- ${k}: ${JSON.stringify(v)}`);
      if (otherVars.length > 0) {
        sections.push(`## Story Variables
${otherVars.join("\n")}`);
      }
    }
    if (includeCounters) {
      const counterLines = Object.entries(counters).map(([k, v]) => `- ${k}: ${v}`);
      if (counterLines.length > 0) {
        sections.push(`## Final Counters
${counterLines.join("\n")}`);
      }
    }
    if (includeInventory && inventoryEntries.length > 0) {
      const inventoryFormatted = inventoryEntries.map(
        (item) => item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name
      );
      sections.push(`## Final Inventory
${inventoryFormatted.join(", ")}`);
    }
    if (includeChoiceHistory && choiceHistory.length > 0) {
      const choiceLines = choiceHistory.map((choice) => {
        const context = choice.choiceContext || choice.beatName || "Choice";
        return `- At "${context}": chose "${choice.choiceText}"`;
      });
      sections.push(`## Player Choices (in order)
${choiceLines.join("\n")}`);
    }
    if (includeVisitedBeats) {
      const journeyPath = this.getBeatDescriptions(history);
      sections.push(`## Journey Path (scene titles, in order)
${journeyPath.join(" \u2192 ")}`);
      sections.push(`Scene titles name screens the player passed through; they are not a record of what was said there. Describe events only from the choices, variables and counters above.`);
    }
    return sections.join("\n\n");
  }
  /**
   * Get human-readable descriptions for beat IDs
   * Includes beat type to help AI understand what kind of content it was
   */
  getBeatDescriptions(beatIds) {
    if (!this.story) {
      return beatIds;
    }
    return beatIds.map((id) => {
      const beat = this.story.getBeat(id);
      if (beat) {
        const name = beat.name || id;
        const typeNote = {
          "onlineContent": "(info)",
          "aiSummary": "(summary)",
          "infoText": "(intro)",
          "durScreen": "(info)",
          "titleScreen": "(start)",
          "endScreen": "(end)"
        }[beat.type] || "";
        return typeNote ? `${name} ${typeNote}` : name;
      }
      return id;
    });
  }
};

// src/beats/AIConditionBeat.ts
var AIConditionBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "categories");
    __publicField(this, "evaluateVariables");
    __publicField(this, "evaluateInventory");
    __publicField(this, "evaluateHistory");
    __publicField(this, "evaluateCounters");
    __publicField(this, "evaluateChoiceHistory");
    __publicField(this, "aiDefaultTarget");
    __publicField(this, "timeout");
    const params = config.parameters || {};
    this.prompt = params.prompt || config.prompt || "";
    this.categories = params.categories || config.categories || [];
    this.evaluateVariables = params.evaluateVariables ?? config.evaluateVariables ?? true;
    this.evaluateInventory = params.evaluateInventory ?? config.evaluateInventory ?? true;
    this.evaluateHistory = params.evaluateHistory ?? config.evaluateHistory ?? true;
    this.evaluateCounters = params.evaluateCounters ?? config.evaluateCounters ?? true;
    this.evaluateChoiceHistory = params.evaluateChoiceHistory ?? config.evaluateChoiceHistory ?? true;
    this.aiDefaultTarget = params.fallbackTarget || config.fallbackTarget || params.defaultTarget || config.defaultTarget;
    this.timeout = params.timeout || config.timeout || 3e4;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      categories: this.categories,
      evaluateVariables: this.evaluateVariables,
      evaluateInventory: this.evaluateInventory,
      evaluateHistory: this.evaluateHistory,
      evaluateCounters: this.evaluateCounters,
      evaluateChoiceHistory: this.evaluateChoiceHistory,
      fallbackTarget: this.aiDefaultTarget,
      timeout: this.timeout
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.categories !== void 0) {
      this.categories = params.categories;
      this.clearConnections();
    }
    if (params.evaluateVariables !== void 0) this.evaluateVariables = params.evaluateVariables;
    if (params.evaluateInventory !== void 0) this.evaluateInventory = params.evaluateInventory;
    if (params.evaluateHistory !== void 0) this.evaluateHistory = params.evaluateHistory;
    if (params.evaluateCounters !== void 0) this.evaluateCounters = params.evaluateCounters;
    if (params.evaluateChoiceHistory !== void 0) this.evaluateChoiceHistory = params.evaluateChoiceHistory;
    if (params.fallbackTarget !== void 0) {
      this.aiDefaultTarget = params.fallbackTarget;
      this.clearConnections();
    }
    if (params.timeout !== void 0) this.timeout = params.timeout;
  }
  /**
   * Override getConnections to return connections from categories
   */
  getConnections() {
    const connections = [];
    for (const category of this.categories) {
      if (category.targetId) {
        connections.push({
          targetId: category.targetId,
          label: category.name
        });
      }
    }
    if (this.aiDefaultTarget) {
      connections.push({
        targetId: this.aiDefaultTarget,
        label: "Fallback",
        derivedFrom: "fallbackTarget"
      });
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  /**
   * Last-resort routing when classification can't run or errors. After
   * aiDefaultTarget and the graph fallback, fall back to the FIRST
   * category's target — mirroring classifyContent's first-category
   * fallback. Rationale (field bug 2026-08-02): aiCondition is
   * parameter-derived, so exports carry connections: [] — a failed relay
   * call returned null here, the engine declared the story ended, and the
   * exported player restarted from the title. An arbitrary-but-sane branch
   * beats a dead story.
   */
  fallbackTargetId(context) {
    return this.aiDefaultTarget || this.getNextBeat(context) || this.categories.find((c) => c.targetId)?.targetId || null;
  }
  async performAction(context, renderer) {
    if (!this.prompt || this.categories.length === 0) {
      console.error(`[AIConditionBeat ${this.id}] Missing prompt or categories`);
      return this.fallbackTargetId(context);
    }
    const aiService = renderer.getState("aiService");
    if (!aiService || typeof aiService.classifyContent !== "function") {
      console.warn(`[AIConditionBeat ${this.id}] AI service not configured, using default target`);
      return this.fallbackTargetId(context);
    }
    try {
      const story = context.getStory();
      const contextBuilder = new PlayerContextBuilder(context, story);
      const playerContext = contextBuilder.buildPromptContext({
        includeVariables: this.evaluateVariables,
        includeInventory: this.evaluateInventory,
        includeHistory: this.evaluateHistory,
        includeCounters: this.evaluateCounters,
        includeChoiceHistory: this.evaluateChoiceHistory
      });
      const categoryDescriptions = this.categories.map((c) => `- "${c.name}": ${c.description}`).join("\n");
      const fullPrompt = `${this.prompt}

Player Context:
${playerContext}

Categories to choose from:
${categoryDescriptions}

Based on the player's state and the criteria above, which category best applies?
Respond with ONLY the category name, nothing else.`;
      console.log(`[AIConditionBeat ${this.id}] Evaluating with AI...`);
      const categoryNames = this.categories.map((c) => c.name);
      const chosenCategory = await Promise.race([
        aiService.classifyContent(fullPrompt, categoryNames),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Timeout")), this.timeout)
        )
      ]);
      const matchedCategory = this.categories.find(
        (c) => c.name.toLowerCase() === chosenCategory.toLowerCase()
      );
      if (matchedCategory) {
        console.log(`[AIConditionBeat ${this.id}] AI chose: "${matchedCategory.name}" \u2192 ${matchedCategory.targetId}`);
        const targetBeat = context.getStory().getBeat(matchedCategory.targetId);
        context.recordTimelineEvent({
          type: "branch",
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiCondition",
          targetBeatId: matchedCategory.targetId,
          targetBeatName: targetBeat?.name,
          reason: `AI chose "${matchedCategory.name}": ${matchedCategory.description}`
        });
        return matchedCategory.targetId;
      } else {
        console.warn(`[AIConditionBeat ${this.id}] AI returned unknown category: "${chosenCategory}"`);
        const fallback = this.fallbackTargetId(context);
        context.recordTimelineEvent({
          type: "branch",
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiCondition",
          targetBeatId: fallback || void 0,
          reason: `AI returned unknown category "${chosenCategory}", using fallback`
        });
        return fallback;
      }
    } catch (error) {
      console.error(`[AIConditionBeat ${this.id}] Error:`, error);
      return this.fallbackTargetId(context);
    }
  }
};

// src/utils/narrativeMemory.ts
function refMatches(ref, refIsId, target, allCharacters) {
  if (!ref) return false;
  if (refIsId) return ref === target.id;
  const resolved = resolveCharacter(ref, allCharacters);
  return !!resolved && resolved.id === target.id;
}
function rolesInBeat(beat, target, allCharacters) {
  const roles = [];
  const params = beat.parameters || {};
  if (beat.characterRef && refMatches(beat.characterRef, true, target, allCharacters)) {
    roles.push("speaker");
  } else if (beat.speaker && refMatches(beat.speaker, false, target, allCharacters)) {
    roles.push("speaker");
  }
  if (beat.type === "dialogTree" && params.dialogTree) {
    const visit = (node) => {
      if (!node || typeof node !== "object") return false;
      let found = false;
      if (node.characterRef && refMatches(node.characterRef, true, target, allCharacters)) {
        found = true;
      } else if (node.speaker && refMatches(node.speaker, false, target, allCharacters)) {
        found = true;
      }
      if (Array.isArray(node.choices)) {
        for (const c of node.choices) {
          if (c && c.dialogNode) {
            if (visit(c.dialogNode)) found = true;
          }
        }
      }
      return found;
    };
    if (visit(params.dialogTree)) roles.push("dialog-speaker");
  }
  if (beat.type === "addRemoveInventory") {
    if (params.character && refMatches(params.character, looksLikeId(params.character, allCharacters), target, allCharacters)) {
      roles.push("inventory-holder");
    }
    if (params.fromChar && refMatches(params.fromChar, looksLikeId(params.fromChar, allCharacters), target, allCharacters)) {
      roles.push("inventory-source");
    }
    if (params.toChar && refMatches(params.toChar, looksLikeId(params.toChar, allCharacters), target, allCharacters)) {
      roles.push("inventory-target");
    }
  }
  if ((beat.type === "aiDialogTree" || beat.type === "aiConversation") && params.npcName) {
    if (refMatches(params.npcName, looksLikeId(params.npcName, allCharacters), target, allCharacters)) {
      roles.push("npc");
    }
  }
  return roles;
}
function looksLikeId(ref, allCharacters) {
  return allCharacters.some((c) => c.id === ref);
}
function beatsForCharacter(history, beats, target, allCharacters) {
  if (!history.length || !beats.length) return [];
  const beatById = /* @__PURE__ */ new Map();
  for (const b of beats) beatById.set(b.id, b);
  const result = [];
  for (let i = 0; i < history.length; i++) {
    const beatId = history[i];
    const beat = beatById.get(beatId);
    if (!beat) continue;
    const roles = rolesInBeat(beat, target, allCharacters);
    if (roles.length === 0) continue;
    const role = roles.includes("speaker") ? "speaker" : roles[0];
    result.push({
      beatId,
      beatName: beat.name,
      beatType: beat.type,
      index: i,
      role
    });
  }
  return result;
}
function choicesForCharacter(choiceHistory, beats, target, allCharacters) {
  if (!choiceHistory.length || !beats.length) return [];
  const beatById = /* @__PURE__ */ new Map();
  for (const b of beats) beatById.set(b.id, b);
  const result = [];
  for (const choice of choiceHistory) {
    const beat = beatById.get(choice.beatId);
    if (!beat) continue;
    if (rolesInBeat(beat, target, allCharacters).length === 0) continue;
    result.push({
      beatId: choice.beatId,
      beatName: choice.beatName ?? beat.name,
      beatType: choice.beatType ?? beat.type,
      choiceText: choice.choiceText,
      choiceContext: choice.choiceContext,
      timestamp: choice.timestamp
    });
  }
  return result;
}
function interactionsForCharacter(history, choiceHistory, beats, target, allCharacters) {
  const beatEntries = beatsForCharacter(history, beats, target, allCharacters).map((b) => ({
    order: b.index,
    kind: "beat",
    beatId: b.beatId,
    beatName: b.beatName,
    beatType: b.beatType,
    role: b.role
  }));
  const choiceEntries = choicesForCharacter(choiceHistory, beats, target, allCharacters).map((c) => ({
    order: c.timestamp,
    kind: "choice",
    beatId: c.beatId,
    beatName: c.beatName,
    beatType: c.beatType,
    role: "present",
    choiceText: c.choiceText,
    choiceContext: c.choiceContext
  }));
  return [...beatEntries, ...choiceEntries].sort((a, b) => a.order - b.order);
}

// src/utils/dossier.ts
function buildDossier(character, options = {}) {
  if (!character) return "";
  const lines = [];
  const heading = options.heading || "CHARACTER DOSSIER";
  const displayName = character.displayName || character.name || character.id;
  const roleSuffix = character.role && character.role !== "npc" ? ` (${character.role})` : "";
  lines.push(`Name: ${displayName}${roleSuffix}`);
  if (character.description && character.description.trim()) {
    lines.push(`Description: ${character.description.trim()}`);
  }
  if (character.tags && character.tags.length > 0) {
    lines.push(`Tags: ${character.tags.join(", ")}`);
  }
  if (character.traits) {
    const phrase = describePersonality(character.traits);
    if (phrase) lines.push(`Personality: ${phrase}`);
  }
  if (options.state) {
    const stateLines = formatStateBlock(options.state);
    if (stateLines.length > 0) {
      lines.push("Current state:");
      for (const line of stateLines) {
        lines.push(`  ${line}`);
      }
    }
  }
  if (options.mood && (Math.abs(options.mood.valence) > 0.05 || Math.abs(options.mood.arousal) > 0.05)) {
    lines.push(`Mood: ${describeMood(options.mood)}`);
  }
  if (options.emotions) {
    const cap = options.maxEmotions ?? 4;
    const top = Object.entries(options.emotions).filter(([, v]) => v > 0.05).sort(([, a], [, b]) => b - a).slice(0, cap);
    if (top.length > 0) {
      lines.push("Currently feeling:");
      for (const [name, value] of top) {
        const intensity = describeEmotionIntensity(value);
        lines.push(`  - ${intensity} ${name}`);
      }
    }
  }
  if (character.goals && character.goals.length > 0) {
    const cap = options.maxGoals ?? 5;
    const statuses = options.goalStatuses || {};
    const annotated = character.goals.map((g) => ({
      goal: g,
      status: statuses[g.id] || "open",
      priority: typeof g.priority === "number" ? g.priority : 0.5
    }));
    const open = annotated.filter((a) => a.status === "open").sort((a, b) => b.priority - a.priority).slice(0, cap);
    const closed = annotated.filter((a) => a.status === "met" || a.status === "failed").slice(0, cap);
    if (open.length > 0) {
      lines.push("Pursuing:");
      for (const a of open) {
        const desc = a.goal.description ? ` \u2014 ${a.goal.description}` : "";
        lines.push(`  - ${a.goal.name}${desc}`);
      }
    }
    if (closed.length > 0) {
      lines.push("Recent outcomes:");
      for (const a of closed) {
        const verb = a.status === "met" ? "achieved" : "failed";
        lines.push(`  - ${verb} ${a.goal.name}`);
      }
    }
  }
  if (options.sentiments && options.sentiments.length > 0) {
    const cap = options.maxSentiments ?? 5;
    const top = [...options.sentiments].filter((s) => Math.abs(s.strength) > 0.05).sort((a, b) => Math.abs(b.strength) - Math.abs(a.strength)).slice(0, cap);
    if (top.length > 0) {
      const selfRef = character.id;
      const selfRows = top.filter((s) => s.toEntityRef === selfRef);
      const otherRows = top.filter((s) => s.toEntityRef !== selfRef);
      if (selfRows.length > 0) {
        lines.push("Feels toward themselves:");
        for (const s of selfRows) {
          const intensity = describeSentimentIntensity(s.strength);
          lines.push(`  - ${intensity} ${selfFeelingLabel(s.emotion)}`);
        }
      }
      if (otherRows.length > 0) {
        lines.push("Feels toward others:");
        for (const s of otherRows) {
          const intensity = describeSentimentIntensity(s.strength);
          lines.push(`  - ${intensity} ${s.emotion} toward ${s.toEntityRef}`);
        }
      }
    }
  }
  if (options.interactions && options.interactions.length > 0) {
    const cap = options.maxInteractions ?? 8;
    const tail = options.interactions.slice(-cap);
    lines.push("Recent interactions:");
    for (const i of tail) {
      const summary = i.summary ? ` \u2014 ${i.summary}` : "";
      lines.push(`  - ${i.beatName}${summary}`);
    }
  }
  const policy = character.dossierPolicy || "reAnchor";
  if (policy === "reflection" && options.reflections && options.reflections.length > 0) {
    const cap = options.maxReflections ?? 6;
    const tail = options.reflections.slice(-cap);
    lines.push("Recent reflections:");
    for (const r of tail) {
      lines.push(`  - ${r.text}`);
    }
  }
  if (lines.length === 1) return "";
  const out = [];
  if (options.includeAnchorReminder !== false) {
    out.push(`${heading} \u2014 stay in character; the facts below are canonical:`);
  } else {
    out.push(`${heading}:`);
  }
  out.push(...lines);
  return out.join("\n");
}
function selfFeelingLabel(emotion) {
  return /^self[-\s]/i.test(emotion) ? emotion : `self-${emotion}`;
}
function describeMoodAxis(value, axis) {
  if (axis === "valence") {
    if (value >= 0.6) return "happy";
    if (value >= 0.2) return "pleased";
    if (value <= -0.6) return "sad";
    if (value <= -0.2) return "displeased";
    return "even-keeled";
  }
  if (value >= 0.6) return "energetic";
  if (value >= 0.2) return "alert";
  if (value <= -0.6) return "lethargic";
  if (value <= -0.2) return "subdued";
  return "steady";
}
function describeMood(mood) {
  return `${describeMoodAxis(mood.valence, "valence")}, ${describeMoodAxis(mood.arousal, "arousal")} (valence ${mood.valence.toFixed(2)}, arousal ${mood.arousal.toFixed(2)})`;
}
function describeSentimentIntensity(strength) {
  const abs = Math.abs(strength);
  const polarity = strength < 0 ? "anti-" : "";
  if (abs >= 0.75) return `intense ${polarity}`.trim();
  if (abs >= 0.4) return `strong ${polarity}`.trim();
  if (abs >= 0.15) return `mild ${polarity}`.trim();
  return `slight ${polarity}`.trim();
}
function describeEmotionIntensity(value) {
  if (value >= 0.75) return "overwhelming";
  if (value >= 0.5) return "strong";
  if (value >= 0.25) return "moderate";
  return "mild";
}
function describePersonality(traits) {
  const phrases = [];
  for (const [name, raw] of Object.entries(traits)) {
    const v = Number(raw);
    if (!Number.isFinite(v)) continue;
    const delta = v - 0.5;
    const abs = Math.abs(delta);
    if (abs < 0.15) continue;
    const qualifier = abs >= 0.35 ? delta > 0 ? "very high" : "very low" : delta > 0 ? "high" : "low";
    phrases.push(`${qualifier} ${name}`);
  }
  return phrases.join(", ");
}
function formatStateBlock(state) {
  const lines = [];
  const counterKeys = Object.keys(state.counters || {}).sort();
  for (const key of counterKeys) {
    lines.push(`${key}: ${state.counters[key]}`);
  }
  const flagKeys = Object.keys(state.flags || {}).sort();
  for (const key of flagKeys) {
    if (state.flags[key]) lines.push(`${key}: yes`);
  }
  const varKeys = Object.keys(state.variables || {}).sort();
  for (const key of varKeys) {
    const v = state.variables[key];
    if (v === void 0 || v === null || v === "") continue;
    lines.push(`${key}: ${typeof v === "string" ? v : JSON.stringify(v)}`);
  }
  return lines;
}
function resolveCharacterDisplayName(ref, characters) {
  if (!ref) return ref || "";
  const match = characters?.find((c) => c.id === ref);
  return match ? match.displayName || match.name || ref : ref;
}
function isCopiedCharacterDescription(text, ref, characters) {
  const norm = (v) => typeof v === "string" ? v.replace(/\s+/g, " ").trim().toLowerCase() : "";
  const t = norm(text);
  if (!t || !ref) return false;
  const match = resolveCharacter(ref, characters);
  if (!match) return false;
  const candidates = [match.description, ...(match.variants ?? []).flatMap((v) => [v.description, v.characterDescription])];
  return candidates.some((c) => norm(c) === t);
}
function sceneNotesFor(text, ref, characters) {
  if (!text || !text.trim()) return "";
  return isCopiedCharacterDescription(text, ref, characters) ? "" : text.trim();
}
function buildDossierForRef(characterRef, characters, contextLike, options = {}) {
  if (!characterRef || !characters) return "";
  const character = contextLike?.getMergedCharacter?.(characterRef) || characters.find((c) => c.id === characterRef) || null;
  if (!character) return "";
  const state = contextLike?.getCharacterState?.(characterRef);
  const mood = contextLike?.getCharacterMood?.(characterRef);
  const sentiments = contextLike?.getCharacterSentiments?.(characterRef);
  const emotions = contextLike?.getCharacterEmotions?.(characterRef);
  const policy = character.dossierPolicy || "reAnchor";
  const reflections = policy === "reflection" ? contextLike?.getCharacterReflections?.(characterRef) : void 0;
  let interactions = contextLike?.getCharacterInteractions?.(characterRef);
  if (!interactions && contextLike?.getStory && contextLike?.getHistory) {
    const story = contextLike.getStory();
    const beats = story?.getBeats?.() || story?.beats || [];
    const history = contextLike.getHistory() || [];
    const choiceHistory = contextLike.getChoiceHistory?.() || [];
    if (beats.length && history.length) {
      const trail = interactionsForCharacter(history, choiceHistory, beats, character, characters);
      interactions = trail.map((entry) => ({
        beatName: entry.beatName || entry.beatId,
        summary: entry.kind === "choice" && entry.choiceText ? `chose "${entry.choiceText}"` : void 0
      }));
    }
  }
  const goalStatuses = character.goals && character.goals.length > 0 ? contextLike?.getCharacterGoalStatuses?.(characterRef) : void 0;
  return buildDossier(character, { ...options, state, interactions, mood, sentiments, emotions, reflections, goalStatuses });
}

// src/utils/ConversationPromptBuilder.ts
function npcIdentityBlock(characterDossier, sceneNotes) {
  const dossier = characterDossier?.trim() || "";
  const notes = sceneNotes?.trim() || "";
  const lines = [];
  if (dossier) lines.push(dossier);
  if (notes) lines.push(dossier ? `IN THIS SCENE: ${notes}` : `PERSONALITY: ${notes}`);
  return lines.join("\n\n");
}
function buildConversationSystemPrompt(ctx) {
  const parts = [];
  parts.push(`You are ${ctx.npcName}, a character in an interactive narrative.`);
  const identity = npcIdentityBlock(ctx.characterDossier, ctx.npcPersonality);
  if (identity) parts.push(`
${identity}`);
  parts.push(`
SCENARIO: ${ctx.scenario}`);
  if (ctx.playerContext) {
    parts.push(`
PLAYER CONTEXT:
${ctx.playerContext}`);
  }
  if (ctx.directions.length > 0) {
    const goals = [];
    for (const dir of ctx.directions) {
      if (dir.action.type === "steer" && dir.action.instruction) {
        goals.push(`- ${formatTriggerDescription(dir)}: ${dir.action.instruction}`);
      } else if (dir.action.type === "multi" && dir.action.actions) {
        const steer = dir.action.actions.find((a) => a.type === "steer");
        if (steer?.instruction) {
          goals.push(`- ${formatTriggerDescription(dir)}: ${steer.instruction}`);
        }
      }
    }
    if (goals.length > 0) {
      parts.push("\nCONVERSATION GOALS (guide the conversation toward these):");
      goals.forEach((g) => parts.push(g));
    }
  }
  if (ctx.activeSteeringInstructions && ctx.activeSteeringInstructions.length > 0) {
    parts.push("\nACTIVE INSTRUCTIONS (follow these NOW in your next response):");
    for (const instruction of ctx.activeSteeringInstructions) {
      parts.push(`- ${instruction}`);
    }
  }
  if (ctx.systemInstructions) {
    parts.push(`
ADDITIONAL INSTRUCTIONS: ${ctx.systemInstructions}`);
  }
  parts.push(`
Turn ${ctx.turnNumber} of ${ctx.maxTurns}. Respond in character as ${ctx.npcName}.`);
  parts.push("Respond with ONLY the NPC dialog text \u2014 no stage directions, no JSON, no metadata.");
  parts.push("PERSONALIZATION: Use the player's actual name and details from context. Never use placeholder syntax like {playerName}.");
  return parts.join("\n");
}
function buildDirectionEvaluationPrompt(playerInput, directions, history, turnNumber) {
  const directionDescriptions = directions.map((d, i) => {
    const triggerDesc = formatTriggerDescription(d);
    return `  ${i}: ${triggerDesc}${d.once ? " (once only)" : ""}`;
  });
  return `Evaluate which conversation directions are triggered based on the player's latest input and the full conversation history.

PLAYER INPUT: "${playerInput}"

CONVERSATION HISTORY (${history.length} turns so far):
${history.map((t) => `  ${t.role === "npc" ? "NPC" : "Player"}: ${t.text}`).join("\n")}

CURRENT TURN: ${turnNumber}

DIRECTIONS TO EVALUATE:
${directionDescriptions.join("\n")}

MATCHING RULES:
- Keyword matching is CASE-INSENSITIVE: "goddess" counts as a mention of "Goddess" and vice versa.
- Singular/plural and inflected forms count ("spirit" matches "Spirits").
- A clear paraphrase of a keyword's topic counts as mentioning it; an unrelated word that merely shares letters does not.
- For NOT conditions, apply the same rules first, then invert.

Return a JSON array of triggered direction indices. Example: [0, 2]
If none are triggered, return: []
Only return the JSON array, nothing else.`;
}
function formatTriggerDescription(dir) {
  const t = dir.trigger;
  const neg = t.negate ? " does NOT" : "";
  let desc;
  switch (t.type) {
    case "topic-mention":
      desc = t.negate ? `If the player does NOT mention ${t.keywords?.join(", ")}` : `If the player mentions ${t.keywords?.join(", ")}`;
      break;
    case "sentiment":
      desc = `If the player${neg} seem${neg ? "" : "s"} ${t.sentiment}`;
      break;
    case "turn-count":
      desc = `After ${t.turnCount} turns`;
      break;
    case "variable":
      desc = t.negate ? `If variable "${t.variableName}" does NOT equal ${JSON.stringify(t.variableValue)}` : `If variable "${t.variableName}" equals ${JSON.stringify(t.variableValue)}`;
      break;
    case "silence":
      desc = `If the player doesn't respond`;
      break;
    case "custom":
      desc = t.negate ? `If NOT: ${t.description}` : `If: ${t.description}`;
      break;
    default:
      desc = `Unknown trigger: ${t.type}`;
  }
  if (dir.requiresVariable) {
    const guardVal = dir.requiresVariableValue;
    desc += guardVal ? ` AND variable "${dir.requiresVariable}" equals ${JSON.stringify(guardVal)}` : ` AND variable "${dir.requiresVariable}" is set`;
  }
  return desc;
}
var DIRECTION_EVALUATION_SCHEMA = {
  type: "object",
  properties: { triggered: { type: "array", items: { type: "integer" } } },
  required: ["triggered"],
  additionalProperties: false
};
function extractionSchema(names) {
  const value = { anyOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }, { type: "null" }] };
  return {
    type: "object",
    properties: Object.fromEntries(names.map((n) => [n, value])),
    required: names,
    additionalProperties: false
  };
}
function parseDirectionEvaluationResponse(response) {
  try {
    const trimmed = response.trim();
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed?.triggered)) return parsed.triggered.filter((i) => typeof i === "number");
      } catch {
      }
    }
    const match = response.match(/\[[\s\S]*?\]/);
    if (!match) return [];
    const indices = JSON.parse(match[0]);
    if (!Array.isArray(indices)) return [];
    return indices.filter((i) => typeof i === "number");
  } catch {
    return [];
  }
}
function collectActions(directions, triggeredIndices) {
  const result = {
    steeringInstructions: [],
    exitTarget: null,
    exitMessage: null,
    variableSets: [],
    extractions: []
  };
  for (const idx of triggeredIndices) {
    if (idx < 0 || idx >= directions.length) continue;
    processAction(directions[idx].action, result);
  }
  return result;
}
function processAction(action, result) {
  switch (action.type) {
    case "steer":
      if (action.instruction) result.steeringInstructions.push(action.instruction);
      break;
    case "exit":
      if (action.exitTarget) result.exitTarget = action.exitTarget;
      if (action.exitMessage) result.exitMessage = action.exitMessage;
      break;
    case "set-variable":
      if (action.variableName !== void 0) {
        if (action.extractionPrompt) {
          result.extractions.push({ name: action.variableName, prompt: action.extractionPrompt });
        } else {
          result.variableSets.push({ name: action.variableName, value: action.variableValue });
        }
      }
      break;
    case "multi":
      if (action.actions) {
        for (const sub of action.actions) {
          processAction(sub, result);
        }
      }
      break;
  }
}
function buildExtractionPrompt(extractions, history) {
  const extractionDescs = extractions.map(
    (e, i) => `  ${i}. Variable "${e.name}": ${e.prompt}`
  ).join("\n");
  return `Extract values from this conversation and return them as a JSON object.

CONVERSATION:
${history.map((t) => `  ${t.role === "npc" ? "NPC" : "Player"}: ${t.text}`).join("\n")}

EXTRACT:
${extractionDescs}

Return a JSON object mapping variable names to extracted values. Be concise but complete.
Use null for a value the conversation does not give.
Example: {"order_content": "2 dozen fried boneless chicken wings with hot sauce"}
Only return the JSON object, nothing else.`;
}

// src/beats/AIDialogTreeBeat.ts
var AIDialogTreeBeat = class extends Beat {
  // AI's exit routing reasoning
  constructor(config) {
    super(config);
    __publicField(this, "scenario");
    __publicField(this, "npcName");
    __publicField(this, "npcPersonality");
    /** Transient: the NPC's resolved human display name for the current run.
     *  Set at the top of performAction (npcName may be a Character.id) and read
     *  by generateDialogTree / validateDialogTree / exit handling, which run in
     *  separate methods where the performAction local is out of scope. */
    __publicField(this, "_npcDisplay", "");
    /** Who the NPC is for this run (dossier + scene notes), reused by exit lines. */
    __publicField(this, "_npcIdentity", "");
    __publicField(this, "includeVariables");
    __publicField(this, "includeInventory");
    __publicField(this, "includeVisitedBeats");
    __publicField(this, "includeChoiceHistory");
    __publicField(this, "maxTurns");
    __publicField(this, "maxChoicesPerTurn");
    /** Authoritative layout field, matching DialogTreeBeat (v0.9.62). The legacy
     *  presentationMode is migrated forward in the constructor / updateParameters
     *  and surfaced in getParameters for one release for round-trip compat. */
    __publicField(this, "layoutTemplate");
    /** @deprecated read from layoutTemplate. Kept for legacy round-trip. */
    __publicField(this, "presentationMode");
    __publicField(this, "showAvatars");
    __publicField(this, "exitTargets");
    __publicField(this, "systemInstructions");
    __publicField(this, "choiceDelay");
    __publicField(this, "generatedTree", null);
    __publicField(this, "currentNode", null);
    __publicField(this, "lastContextHash", null);
    // Track context to detect changes
    // In-flight generation, keyed by context hash. Prefetch and execute JOIN
    // this instead of racing: without it, arriving at the beat mid-prefetch
    // started a SECOND full generation in parallel (two routing plans in the
    // field log, 25- and 45-node trees) — double cost, and the player waited
    // for the slower one.
    __publicField(this, "inflightTree", null);
    __publicField(this, "inflightHash", null);
    __publicField(this, "lastRoutingPlan", null);
    const params = config.parameters || {};
    this.scenario = params.scenario || config.scenario || "";
    this.npcName = params.npcName || config.npcName || "Character";
    this.npcPersonality = params.npcPersonality || config.npcPersonality;
    this.includeVariables = params.includeVariables ?? config.includeVariables ?? true;
    this.includeInventory = params.includeInventory ?? config.includeInventory ?? true;
    this.includeVisitedBeats = params.includeVisitedBeats ?? config.includeVisitedBeats ?? true;
    this.includeChoiceHistory = params.includeChoiceHistory ?? config.includeChoiceHistory ?? true;
    this.maxTurns = params.maxTurns || config.maxTurns || 3;
    this.maxChoicesPerTurn = params.maxChoicesPerTurn ?? config.maxChoicesPerTurn;
    const legacyPM = params.presentationMode ?? config.presentationMode;
    const legacyMigrated = legacyPM === "positioned" ? "stacked" : legacyPM === "chat-scroll" ? "chat-scroll" : legacyPM === "chat-bubble" ? "chat-bubble" : void 0;
    const rawTemplate = config.layoutTemplate ?? params.layoutTemplate ?? legacyMigrated;
    this.layoutTemplate = normalizeDialogTreeLayoutTemplate(rawTemplate);
    this.presentationMode = legacyPM ?? "positioned";
    this.showAvatars = params.showAvatars ?? config.showAvatars ?? true;
    this.exitTargets = params.exitTargets || config.exitTargets || [];
    this.systemInstructions = params.systemInstructions || config.systemInstructions;
    this.choiceDelay = params.choiceDelay || config.choiceDelay;
  }
  getParameters() {
    return {
      scenario: this.scenario,
      npcName: this.npcName,
      npcPersonality: this.npcPersonality,
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeVisitedBeats: this.includeVisitedBeats,
      includeChoiceHistory: this.includeChoiceHistory,
      maxTurns: this.maxTurns,
      maxChoicesPerTurn: this.maxChoicesPerTurn,
      layoutTemplate: this.layoutTemplate,
      presentationMode: this.presentationMode,
      showAvatars: this.showAvatars,
      exitTargets: this.exitTargets,
      systemInstructions: this.systemInstructions,
      choiceDelay: this.choiceDelay
    };
  }
  updateParameters(params) {
    if (params.scenario !== void 0) this.scenario = params.scenario;
    if (params.npcName !== void 0) this.npcName = params.npcName;
    if (params.npcPersonality !== void 0) this.npcPersonality = params.npcPersonality;
    if (params.includeVariables !== void 0) this.includeVariables = params.includeVariables;
    if (params.includeInventory !== void 0) this.includeInventory = params.includeInventory;
    if (params.includeVisitedBeats !== void 0) this.includeVisitedBeats = params.includeVisitedBeats;
    if (params.includeChoiceHistory !== void 0) this.includeChoiceHistory = params.includeChoiceHistory;
    if (params.maxTurns !== void 0) this.maxTurns = params.maxTurns;
    if (params.maxChoicesPerTurn !== void 0) this.maxChoicesPerTurn = params.maxChoicesPerTurn;
    if (params.layoutTemplate !== void 0) {
      this.layoutTemplate = normalizeDialogTreeLayoutTemplate(params.layoutTemplate);
      if (params.presentationMode !== void 0) this.presentationMode = params.presentationMode;
    } else if (params.presentationMode !== void 0) {
      this.presentationMode = params.presentationMode;
      this.layoutTemplate = params.presentationMode === "chat-scroll" ? "chat-scroll" : params.presentationMode === "chat-bubble" ? "chat-bubble" : "stacked";
    }
    if (params.showAvatars !== void 0) this.showAvatars = params.showAvatars;
    if (params.exitTargets !== void 0) {
      this.exitTargets = params.exitTargets;
      this.clearConnections();
    }
    if (params.systemInstructions !== void 0) this.systemInstructions = params.systemInstructions;
    if (params.choiceDelay !== void 0) this.choiceDelay = params.choiceDelay;
  }
  /**
   * Override getConnections to return connections from exit targets
   */
  getConnections() {
    const connections = [];
    for (const target of this.exitTargets) {
      connections.push({
        targetId: target.id,
        label: target.description.slice(0, 20) + (target.description.length > 20 ? "..." : "")
      });
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!connections.some((c) => c.targetId === conn.targetId)) {
        connections.push(conn);
      }
    }
    return connections;
  }
  /**
   * Prefetch AI content in the background so it's cached when the beat executes.
   * Called by StoryEngine when this beat is the next beat to be executed.
   * Does NOT render anything - only generates and caches the dialog tree.
   */
  async prefetch(context, renderer) {
    try {
      const aiService = renderer.getState("aiService");
      if (!aiService || typeof aiService.generateDialog !== "function") return;
      console.log(`[AIDialogTreeBeat ${this.id}] Prefetching dialog tree...`);
      await this.ensureTree(context, aiService);
      console.log(`[AIDialogTreeBeat ${this.id}] Prefetch complete`);
    } catch (err) {
      console.log(`[AIDialogTreeBeat ${this.id}] Prefetch failed (will retry on execute):`, err);
    }
  }
  /**
   * The ONE path to a generated tree. Returns the cached tree when the
   * context hash matches; JOINS an in-flight generation for the same hash
   * (the prefetch/execute race); otherwise starts a generation with one
   * parse-failure retry and timing logs.
   */
  async ensureTree(context, aiService) {
    const contextHash = this.createContextHash(context);
    if (this.generatedTree && this.lastContextHash === contextHash) return this.generatedTree;
    if (this.inflightTree && this.inflightHash === contextHash) {
      console.log(`[AIDialogTreeBeat ${this.id}] Joining in-flight generation...`);
      return this.inflightTree;
    }
    const startedAt = Date.now();
    const run = (async () => {
      let tree;
      try {
        tree = await this.generateDialogTree(context, aiService);
      } catch (firstErr) {
        console.log(`[AIDialogTreeBeat ${this.id}] Generation attempt 1 failed after ${((Date.now() - startedAt) / 1e3).toFixed(1)}s (${firstErr.message}), retrying...`);
        tree = await this.generateDialogTree(context, aiService);
      }
      this.generatedTree = tree;
      this.lastContextHash = contextHash;
      const secs = (Date.now() - startedAt) / 1e3;
      console.log(`[AIDialogTreeBeat ${this.id}] Dialog tree generated in ${secs >= 90 ? (secs / 60).toFixed(1) + "min" : secs.toFixed(1) + "s"}`);
      return tree;
    })();
    this.inflightTree = run;
    this.inflightHash = contextHash;
    try {
      return await run;
    } finally {
      if (this.inflightTree === run) {
        this.inflightTree = null;
        this.inflightHash = null;
      }
    }
  }
  /** The NPC field with '@role' resolved to the role's current holder. */
  npcRef(context) {
    const resolve = context.resolveRoleRef;
    return typeof resolve === "function" ? resolve.call(context, this.npcName) : this.npcName;
  }
  async performAction(context, renderer) {
    const aiService = renderer.getState("aiService");
    if (!aiService || typeof aiService.generateDialog !== "function") {
      console.warn(`[AIDialogTreeBeat ${this.id}] AI service not configured`);
      await renderer.renderText(
        "AI features require configuration. Please set up AI in settings.",
        "Continue",
        Array.from(this.locations.values())
      );
      return this.exitTargets[0]?.id || this.getNextBeat(context);
    }
    const isChatMode = isChatLayoutTemplate(this.layoutTemplate);
    renderer.setState("layoutTemplate", this.layoutTemplate);
    renderer.setState("presentationMode", isChatMode ? this.layoutTemplate : "positioned");
    renderer.setState("showAvatars", this.showAvatars ?? true);
    renderer.setState("currentBeatType", "aiDialogTree");
    const defaultDelay = isChatMode ? 1.5 : 0;
    renderer.setState("responseDelay", defaultDelay);
    const variables = context.getVariables();
    const playerName = variables.playerName || variables.name || variables.player || "You";
    renderer.setState("playerName", playerName);
    this._npcDisplay = resolveCharacterDisplayName(this.npcRef(context), context.getStory()?.getCharacters?.() || []) || "the character";
    if (isChatMode) {
      if (renderer.clearChatHistory) {
        renderer.clearChatHistory();
      }
    }
    try {
      const contextHash = this.createContextHash(context);
      const needsRegeneration = !this.generatedTree || this.lastContextHash !== contextHash;
      if (needsRegeneration) {
        this.currentNode = null;
        if (renderer.renderLoading) {
          const npcName = this._npcDisplay;
          const loadingMessages = [
            `Preparing conversation with ${npcName}...`,
            `${npcName} is getting ready to speak...`,
            `Setting up the conversation...`,
            `Let me connect you with ${npcName}...`
          ];
          const message = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
          renderer.renderLoading(message, {
            subMessage: "Generating personalized dialog",
            spinnerType: "dots"
          });
        }
        this.generatedTree = await this.ensureTree(context, aiService);
      }
      if (this.lastRoutingPlan) {
        context.recordTimelineEvent({
          type: "ai-output",
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiDialogTree",
          text: `[Routing Plan] ${this.lastRoutingPlan}`
        });
      }
      context.recordTimelineEvent({
        type: "ai-output",
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "aiDialogTree",
        text: JSON.stringify(this.generatedTree)
      });
      const result = await this.executeDialogTree(context, renderer);
      return result;
    } catch (error) {
      console.error(`[AIDialogTreeBeat ${this.id}] Error:`, error);
      await renderer.renderText(
        "An error occurred during the conversation.",
        "Continue",
        Array.from(this.locations.values())
      );
      return this.exitTargets[0]?.id || this.getNextBeat(context);
    }
  }
  /**
   * Create a hash of key context values to detect if we need to regenerate
   * This ensures we regenerate when player name, location, or key variables change
   */
  createContextHash(context) {
    const variables = context.getVariables();
    const counters = context.getCounters();
    const keyValues = [
      variables.playerName || variables.name || "",
      variables.location || variables.city || "",
      variables.gender || "",
      variables.profession || variables.role || "",
      // Include all variable values when includeVariables is true
      ...this.includeVariables ? Object.entries(variables).map(([k, v]) => `${k}:${String(v)}`) : [],
      // Include counter values as they may affect dialog
      ...Object.entries(counters).map(([k, v]) => `${k}:${v}`)
    ];
    if (this.includeChoiceHistory) {
      const choiceHistory = context.getChoiceHistory();
      if (choiceHistory.length > 0) {
        const choiceKeys = choiceHistory.map((c) => `${c.beatId}:${c.choiceText}`);
        keyValues.push(`choices:${choiceKeys.join(",")}`);
      }
    }
    return keyValues.join("|");
  }
  /**
   * Generate a dialog tree using AI
   */
  async generateDialogTree(context, aiService) {
    const story = context.getStory();
    const contextBuilder = new PlayerContextBuilder(context, story);
    const playerContext = contextBuilder.buildPromptContext({
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeHistory: this.includeVisitedBeats,
      includeChoiceHistory: this.includeChoiceHistory
    });
    const exitDescriptions = this.exitTargets.map((t) => {
      let desc = `- "${t.id}": ${t.description}`;
      if (t.npcExitMessage) desc += ` [NPC will deliver a personalized farewell/response upon exit \u2014 the exit choice text should set up a natural lead-in for this]`;
      return desc;
    }).join("\n");
    const characters = story?.getCharacters?.() || [];
    const characterDossier = buildDossierForRef(this.npcRef(context), characters, context);
    this._npcIdentity = npcIdentityBlock(characterDossier, sceneNotesFor(this.npcPersonality, this.npcRef(context), characters));
    const prompt = `Generate a dialog tree for the following scenario:
SCENARIO: ${this.scenario}

NPC: ${this._npcDisplay}
${this._npcIdentity}

PLAYER CONTEXT:
${playerContext}

EXIT CONDITIONS (treat these as rules \u2014 route to an exit when the condition is clearly met):
${exitDescriptions}

${this.systemInstructions ? `ADDITIONAL INSTRUCTIONS: ${this.systemInstructions}` : ""}

REQUIREMENTS:
1. Build a genuinely MULTI-LEVEL branching tree that runs the FULL ${this.maxTurns} conversation turns deep. Turn 1 is the root node; EACH of its choices must lead into a nested "dialogNode" (the NPC's turn-2 reply); EACH turn-2 choice must lead into a further nested "dialogNode" (turn 3); continue nesting until turn ${this.maxTurns}. A flat, single-level tree is WRONG.
2. The NPC should respond based on the player's known state (name, choices, inventory)
3. EVERY dialog node MUST offer 2-3 player choices that are genuinely different in attitude or content. A node with a single choice is WRONG \u2014 one option is not a choice. Do NOT sacrifice branching to reach the required depth: use 2 choices per node (3 at the root if it helps) and keep each NPC text to 2-4 sentences, so the full-depth tree with branching fits the response. A 2-per-node tree ${this.maxTurns} turns deep is the expected size${this.maxChoicesPerTurn ? `
3b. BRANCHING CAP: after the opening turn, offer AT MOST ${this.maxChoicesPerTurn} choice${this.maxChoicesPerTurn === 1 ? "" : "s"} per node. The root may offer up to ${Math.max(this.maxChoicesPerTurn, 2)}. This cap is deliberate \u2014 the author traded breadth for pace \u2014 so meeting it is part of a correct answer.` : ""}
4. A choice either CONTINUES the conversation with a nested "dialogNode", or EXITS with a "target". Use "target" ONLY when a specific exit condition is genuinely satisfied by that choice. For a turn-limit exit (e.g. "after ${this.maxTurns} turns"), ONLY the choices at the DEEPEST turn (turn ${this.maxTurns}) may use "target" \u2014 every earlier-turn choice MUST use "dialogNode". NEVER put a "target" on a turn-1 or turn-2 choice for a turn-limit exit; that collapses the whole tree to a single level.
5. Personalize: use the player's actual name, location, profession, and other details from the PLAYER CONTEXT above. Write them directly into the NPC's dialog text (e.g., "Welcome to Stockholm, Mirjam!" not "Welcome to your city!"). Never use placeholder syntax like {playerName}. If you don't know a value, omit it gracefully
6. For every choice that has a "target" (exits the conversation), include an "exitReason" field \u2014 a concrete explanation of what the player said or expressed that satisfies the exit condition. Be specific, not vague.
7. Include a top-level "routingPlan" field for the author: which branches lead to which exit condition, which player signals each branch listens for, and which context (variables, history) shaped the tree. This helps authors debug and refine the conversation design.

STRUCTURE:
- The "text" field contains EVERYTHING the NPC says, including greetings AND follow-up questions
- The "choices" array contains ONLY what the PLAYER would say in response
- If the NPC asks a question, put the question IN THE TEXT FIELD, then put possible player ANSWERS in choices

Return a JSON object with this structure. The example below is a 3-turn tree \u2014 NEST TO ${this.maxTurns} TURNS. Notice that ONLY the deepest (final-turn) choices carry a "target"; every earlier choice nests a "dialogNode":
{
  "routingPlan": "Explain how you designed the routing and depth. E.g.: 'The only exit is a turn-limit (after 3 turns). So turns 1 and 2 always nest a dialogNode; only the turn-3 choices carry target=beat_69. Branches diverge by the player's attitude (skeptical / curious / dismissive).'",
  "id": "root",
  "speaker": "NPC Name",
  "text": "NPC's complete TURN-1 speech, including the question they ask",
  "choices": [
    {
      "id": "c1",
      "text": "Player's turn-1 response",
      "dialogNode": {
        "id": "n2a",
        "speaker": "NPC Name",
        "text": "NPC's TURN-2 reply that reacts to this choice",
        "choices": [
          {
            "id": "c1a",
            "text": "Player's turn-2 response",
            "dialogNode": {
              "id": "n3a",
              "speaker": "NPC Name",
              "text": "NPC's TURN-3 reply (final turn)",
              "choices": [
                { "id": "c1a1", "text": "Player's final response", "target": "exit_target_id", "exitReason": "Concrete reason the exit condition is now satisfied" }
              ]
            }
          }
        ]
      }
    }
  ]
}
(The example shows one branch for brevity \u2014 expand every choice the same way.)`;
    console.log(`[AIDialogTreeBeat ${this.id}] Generating dialog tree...`);
    const response = await aiService.generateDialog({
      prompt,
      format: "dialogTree",
      maxTurns: this.maxTurns
    });
    let dialogTree;
    if (typeof response === "string") {
      const jsonStr = this.repairJSON(response);
      try {
        dialogTree = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error(`[AIDialogTreeBeat] JSON parse failed after repair:`, parseError);
        console.error(`[AIDialogTreeBeat] Attempted to parse: ${jsonStr.substring(0, 500)}...`);
        throw new Error(`Could not parse AI response as JSON: ${parseError.message}`);
      }
    } else {
      dialogTree = response;
    }
    const rawTree = dialogTree;
    if (rawTree.routingPlan) {
      this.lastRoutingPlan = rawTree.routingPlan;
      console.log(`[AIDialogTreeBeat ${this.id}] Routing plan: ${this.lastRoutingPlan}`);
    }
    const validated = this.validateDialogTree(dialogTree);
    const measure = (node, depth = 1) => {
      let maxDepth = depth, nested = 0, targets = 0;
      for (const c of node.choices || []) {
        if (c.dialogNode) {
          nested++;
          const s = measure(c.dialogNode, depth + 1);
          maxDepth = Math.max(maxDepth, s.maxDepth);
          nested += s.nested;
          targets += s.targets;
        }
        if (c.target) targets++;
      }
      return { maxDepth, nested, targets };
    };
    const shape = measure(validated);
    console.log(`[AIDialogTreeBeat ${this.id}] Tree shape: maxDepth=${shape.maxDepth} (maxTurns=${this.maxTurns}), nested dialogNodes=${shape.nested}, choices-with-target=${shape.targets}`);
    if (this.maxTurns > 1 && shape.nested === 0) {
      console.warn(`[AIDialogTreeBeat ${this.id}] \u26A0 Model produced a FLAT tree (no nested dialogNodes) despite maxTurns=${this.maxTurns}. The conversation will end after one turn.`);
    }
    return validated;
  }
  /**
   * Attempt to repair common JSON issues from AI-generated content
   */
  repairJSON(jsonStr) {
    let repaired = jsonStr;
    const jsonStart = repaired.indexOf("{");
    if (jsonStart === -1) {
      console.error(`[AIDialogTreeBeat] No JSON object found in response`);
      throw new Error("No JSON object found in AI response");
    }
    if (jsonStart > 0) {
      console.log(`[AIDialogTreeBeat] Removing ${jsonStart} chars before JSON`);
      repaired = repaired.slice(jsonStart);
    }
    let braceCount = 0;
    let inString = false;
    let escaped = false;
    let jsonEnd = repaired.length;
    let foundEnd = false;
    for (let i = 0; i < repaired.length; i++) {
      const char = repaired[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === "{") braceCount++;
        if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            foundEnd = true;
            break;
          }
        }
      }
    }
    if (foundEnd && jsonEnd < repaired.length) {
      console.log(`[AIDialogTreeBeat] Removing ${repaired.length - jsonEnd} chars after JSON`);
    }
    repaired = repaired.slice(0, jsonEnd);
    repaired = repaired.replace(/,(\s*[}\]])/g, "$1");
    repaired = repaired.replace(/}(\s*){/g, "},$1{");
    repaired = repaired.replace(/}(\s*)"/g, '},$1"');
    repaired = repaired.replace(/"(\s*){/g, '",$1{');
    repaired = repaired.replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
      return match.replace(/[\n\r]/g, " ");
    });
    repaired = repaired.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === "\n" || char === "\r" || char === "	") {
        return char;
      }
      return " ";
    });
    return repaired;
  }
  /**
   * Validate and fix the dialog tree structure
   */
  validateDialogTree(node) {
    const validNode = {
      id: node.id || `node_${Date.now()}`,
      speaker: node.speaker || this._npcDisplay,
      text: node.text || "",
      emotion: node.emotion,
      choices: []
    };
    if (node.choices && Array.isArray(node.choices)) {
      validNode.choices = node.choices.map((choice, index) => {
        const validChoice = {
          id: choice.id || `choice_${index}`,
          text: choice.text || "Continue"
        };
        if (typeof choice.target === "string") {
          const isValidExit = this.exitTargets.some((t) => t.id === choice.target);
          if (isValidExit) {
            validChoice.target = choice.target;
          } else {
            validChoice.target = this.exitTargets[0]?.id;
          }
          if (choice.exitReason) {
            validChoice.exitReason = choice.exitReason;
          }
        }
        if (choice.dialogNode && typeof choice.dialogNode === "object") {
          validChoice.dialogNode = this.validateDialogTree(choice.dialogNode);
        }
        if (!validChoice.target && !validChoice.dialogNode) {
          validChoice.target = this.exitTargets[0]?.id;
        }
        return validChoice;
      });
    }
    if (validNode.choices.length === 0) {
      validNode.choices = [{
        id: "default_exit",
        text: "Continue",
        target: this.exitTargets[0]?.id
      }];
    }
    if (validNode.choices.length === 1 && validNode.choices[0].dialogNode) {
      console.warn(`[AIDialogTreeBeat ${this.id}] Generated node "${validNode.id}" has only ONE choice \u2014 the model under-branched (prompt asks for 2-3).`);
    }
    return validNode;
  }
  /**
   * Execute the dialog tree interactively
   * Uses the same rendering approach as DialogTreeBeat for consistent styling
   */
  async executeDialogTree(context, renderer) {
    if (!this.generatedTree) {
      return this.getNextBeat(context);
    }
    this.currentNode = this.generatedTree;
    const locations = Array.from(this.locations.values());
    const aiService = renderer.getState("aiService");
    while (this.currentNode) {
      const node = this.currentNode;
      const processedSpeaker = this.processText(node.speaker, context);
      const processedText = this.processText(node.text, context);
      await renderer.renderDialog(
        processedSpeaker,
        processedText,
        node.emotion,
        locations
      );
      const visibleChoices = node.choices.filter((choice) => {
        if (choice.visible === false) return false;
        if (choice.conditions) {
          return choice.conditions.every((cond) => context.checkCondition(cond));
        }
        return true;
      });
      if (visibleChoices.length === 0) {
        return this.exitTargets[0]?.id || this.getNextBeat(context);
      }
      if (this.choiceDelay && this.choiceDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.choiceDelay * 1e3));
      }
      const choiceOptions = visibleChoices.map((c) => ({
        id: c.id,
        text: this.processText(c.text, context),
        isExit: !!c.target && !c.dialogNode
        // Exit if has target but no nested dialog
      }));
      const chosenId = await renderer.renderChoices(choiceOptions, locations);
      const chosen = visibleChoices.find((c) => c.id === chosenId) || visibleChoices.find((c) => c.text === chosenId || this.processText(c.text, context) === chosenId);
      if (!chosen) {
        return this.exitTargets[0]?.id || this.getNextBeat(context);
      }
      context.recordChoice({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "aiDialogTree",
        choiceText: chosen.text,
        choiceContext: `${processedSpeaker}: ${processedText}`
      });
      context.recordAIOutput({
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "aiDialogTree",
        text: `${processedSpeaker}: ${processedText}`
      });
      if (chosen.effects) {
        for (const effect of chosen.effects) {
          context.applyEffect(effect);
        }
      }
      if (chosen.dialogNode) {
        this.currentNode = chosen.dialogNode;
        continue;
      }
      if (chosen.target) {
        const exitConfig = this.exitTargets.find((t) => t.id === chosen.target);
        if (exitConfig?.npcExitMessage && aiService) {
          try {
            const exitPrompt = `You are ${this._npcDisplay}.

${this._npcIdentity}

SCENARIO: ${this.scenario}

The NPC just said: "${processedText}"
The player responded: "${chosen.text}"

Generate a brief farewell/response that DIRECTLY acknowledges what the player just said. Instruction: ${exitConfig.npcExitMessage}
Keep it to 1-2 sentences. Respond in the SAME LANGUAGE as the scenario above.
Respond with ONLY the dialog text \u2014 no JSON, no metadata, no stage directions.`;
            const exitResponse = await aiService.generateDialog({
              prompt: exitPrompt,
              format: "text"
            });
            const exitText = typeof exitResponse === "string" ? exitResponse : exitResponse?.text || "";
            if (exitText.trim()) {
              await renderer.renderDialog(this._npcDisplay, exitText.trim(), void 0, locations);
              console.log(`[AIDialogTreeBeat ${this.id}] NPC exit message: "${exitText.trim().substring(0, 80)}..."`);
              const advanceTimer = (async () => {
                await waitForTTS(renderer);
                await waitForReadingTime(renderer, exitText.trim());
                return "__timer__";
              })();
              const continueClick = Promise.resolve().then(() => renderer.renderChoices([{ id: "__ai_npc_exit", text: uiString("continue"), isExit: true, isContinue: true }], locations)).catch(() => new Promise(() => {
              }));
              await Promise.race([advanceTimer, continueClick]);
            }
          } catch (err) {
            console.warn(`[AIDialogTreeBeat ${this.id}] NPC exit message generation failed:`, err);
          }
        }
        const exitReason = chosen.exitReason;
        const targetBeat = context.getStory().getBeat(chosen.target);
        context.recordTimelineEvent({
          type: "branch",
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiDialogTree",
          targetBeatId: chosen.target,
          targetBeatName: targetBeat?.name || chosen.target,
          reason: exitReason || `Player chose: "${chosen.text}"`
        });
        return chosen.target;
      }
      return this.exitTargets[0]?.id || this.getNextBeat(context);
    }
    return this.getNextBeat(context);
  }
};

// src/beats/AIConversationBeat.ts
var AIConversationBeat = class _AIConversationBeat extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "scenario");
    __publicField(this, "npcName");
    __publicField(this, "npcPersonality");
    __publicField(this, "includeVariables");
    __publicField(this, "includeInventory");
    __publicField(this, "includeVisitedBeats");
    __publicField(this, "includeChoiceHistory");
    __publicField(this, "maxTurns");
    __publicField(this, "directions");
    __publicField(this, "fallbackExitTarget");
    __publicField(this, "fallbackExitMessage");
    __publicField(this, "systemInstructions");
    __publicField(this, "openingLine");
    __publicField(this, "enableVoiceInput");
    __publicField(this, "language");
    /** 'chat' = scrolling messaging panel (responsive); 'dialog' = positioned
     *  back-and-forth NPC dialog box + text input, one exchange at a time
     *  (fixed-canvas capable). Defaults to 'chat' for backward compatibility. */
    __publicField(this, "presentation");
    const params = config.parameters || {};
    this.scenario = params.scenario || config.scenario || "";
    this.npcName = params.npcName || config.npcName || "Character";
    this.npcPersonality = params.npcPersonality || config.npcPersonality;
    this.includeVariables = params.includeVariables ?? config.includeVariables ?? true;
    this.includeInventory = params.includeInventory ?? config.includeInventory ?? true;
    this.includeVisitedBeats = params.includeVisitedBeats ?? config.includeVisitedBeats ?? true;
    this.includeChoiceHistory = params.includeChoiceHistory ?? config.includeChoiceHistory ?? true;
    this.maxTurns = params.maxTurns || config.maxTurns || 10;
    const rawDirections = params.directions || config.directions || [];
    this.directions = rawDirections.map(
      (d) => d.trigger ? d : _AIConversationBeat.unflattenDirection(d)
    );
    this.fallbackExitTarget = params.fallbackExitTarget || config.fallbackExitTarget;
    this.fallbackExitMessage = params.fallbackExitMessage || config.fallbackExitMessage;
    this.systemInstructions = params.systemInstructions || config.systemInstructions;
    this.openingLine = params.openingLine || config.openingLine;
    this.enableVoiceInput = params.enableVoiceInput ?? config.enableVoiceInput ?? false;
    this.language = params.language || config.language;
    this.presentation = params.presentation ?? config.presentation ?? "chat";
  }
  getParameters() {
    return {
      scenario: this.scenario,
      npcName: this.npcName,
      npcPersonality: this.npcPersonality,
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeVisitedBeats: this.includeVisitedBeats,
      includeChoiceHistory: this.includeChoiceHistory,
      maxTurns: this.maxTurns,
      // Output directions in flattened format for the schema-driven inspector
      directions: this.directions.map((d) => _AIConversationBeat.flattenDirection(d)),
      fallbackExitTarget: this.fallbackExitTarget,
      ...this.fallbackExitMessage ? { fallbackExitMessage: this.fallbackExitMessage } : {},
      systemInstructions: this.systemInstructions,
      openingLine: this.openingLine,
      enableVoiceInput: this.enableVoiceInput,
      language: this.language,
      presentation: this.presentation
    };
  }
  updateParameters(params) {
    if (params.scenario !== void 0) this.scenario = params.scenario;
    if (params.npcName !== void 0) this.npcName = params.npcName;
    if (params.npcPersonality !== void 0) this.npcPersonality = params.npcPersonality;
    if (params.includeVariables !== void 0) this.includeVariables = params.includeVariables;
    if (params.includeInventory !== void 0) this.includeInventory = params.includeInventory;
    if (params.includeVisitedBeats !== void 0) this.includeVisitedBeats = params.includeVisitedBeats;
    if (params.includeChoiceHistory !== void 0) this.includeChoiceHistory = params.includeChoiceHistory;
    if (params.maxTurns !== void 0) this.maxTurns = params.maxTurns;
    if (params.directions !== void 0) {
      this.directions = params.directions.map(
        (d) => d.trigger ? d : _AIConversationBeat.unflattenDirection(d)
      );
      this.clearConnections();
    }
    if (params.fallbackExitTarget !== void 0) this.fallbackExitTarget = params.fallbackExitTarget;
    if (params.fallbackExitMessage !== void 0) this.fallbackExitMessage = params.fallbackExitMessage;
    if (params.systemInstructions !== void 0) this.systemInstructions = params.systemInstructions;
    if (params.openingLine !== void 0) this.openingLine = params.openingLine;
    if (params.enableVoiceInput !== void 0) this.enableVoiceInput = params.enableVoiceInput;
    if (params.language !== void 0) this.language = params.language;
    if (params.presentation !== void 0) this.presentation = params.presentation;
  }
  /**
   * Convert nested ConversationDirection to flat inspector format
   */
  static flattenDirection(d) {
    let varName = d.action.variableName || "";
    let varValue = d.action.variableValue != null ? String(d.action.variableValue) : "";
    let extractionPrompt = d.action.extractionPrompt || "";
    if (d.action.type === "multi" && d.action.actions) {
      const setVar = d.action.actions.find((a) => a.type === "set-variable");
      if (setVar) {
        varName = setVar.variableName || "";
        varValue = setVar.variableValue != null ? String(setVar.variableValue) : "";
        extractionPrompt = setVar.extractionPrompt || "";
      }
    }
    let primaryType = d.action.type;
    if (primaryType === "multi" && d.action.actions) {
      const primary = d.action.actions.find((a) => a.type === "steer" || a.type === "exit");
      primaryType = primary?.type || "steer";
    }
    const flat = {
      id: d.id,
      triggerType: d.trigger.type,
      triggerNegate: d.trigger.negate ?? false,
      // Prefer the verbatim authored string so a mid-edit trailing "," / space
      // isn't normalized away on every keystroke; fall back to joining the
      // cleaned array for directions created programmatically (e.g. AI-gen).
      triggerKeywords: d.trigger.keywordsRaw ?? (d.trigger.keywords?.join(", ") || ""),
      triggerSentiment: d.trigger.sentiment || "",
      triggerTurnCount: d.trigger.turnCount,
      triggerVariableName: d.trigger.variableName || "",
      triggerVariableValue: d.trigger.variableValue != null ? String(d.trigger.variableValue) : "",
      triggerDescription: d.trigger.description || "",
      requiresVariable: d.requiresVariable || "",
      requiresVariableValue: d.requiresVariableValue != null ? String(d.requiresVariableValue) : "",
      actionType: primaryType === "set-variable" ? "steer" : primaryType,
      actionInstruction: d.action.instruction || (d.action.type === "multi" ? d.action.actions?.find((a) => a.type === "steer")?.instruction || "" : ""),
      actionExitTarget: d.action.exitTarget || (d.action.type === "multi" ? d.action.actions?.find((a) => a.type === "exit")?.exitTarget || "" : ""),
      actionExitMessage: d.action.exitMessage || (d.action.type === "multi" ? d.action.actions?.find((a) => a.type === "exit")?.exitMessage || "" : ""),
      actionVariableName: varName,
      actionVariableValue: varValue,
      actionExtractionPrompt: extractionPrompt,
      once: d.once ?? false
    };
    return flat;
  }
  /**
   * Deterministically evaluate a variable-check or turn-count trigger against
   * real story state. These conditions are exact, so they must NOT be delegated
   * to the LLM: the direction-evaluation prompt never includes variable values,
   * so a variable-check exit could only fire by luck. Fuzzy triggers
   * (topic-mention, sentiment, custom) are still judged by the LLM.
   */
  static evaluateDeterministicTrigger(d, context, turnNumber) {
    const t = d.trigger;
    let met;
    switch (t.type) {
      case "variable": {
        const actual = context.getVariable(t.variableName || "");
        met = t.variableValue !== void 0 && t.variableValue !== "" ? String(actual) === String(t.variableValue) : !!actual;
        break;
      }
      case "turn-count":
        met = turnNumber >= (t.turnCount ?? 0);
        break;
      default:
        met = false;
    }
    return t.negate ? !met : met;
  }
  /**
   * Convert flat inspector format back to nested ConversationDirection
   */
  static unflattenDirection(flat) {
    const trigger = { type: flat.triggerType || "topic-mention" };
    if (flat.triggerNegate) trigger.negate = true;
    switch (trigger.type) {
      case "topic-mention":
        trigger.keywords = (flat.triggerKeywords || "").split(",").map((k) => k.trim()).filter(Boolean);
        trigger.keywordsRaw = flat.triggerKeywords || "";
        break;
      case "sentiment":
        trigger.sentiment = flat.triggerSentiment || "negative";
        break;
      case "turn-count":
        trigger.turnCount = flat.triggerTurnCount || 3;
        break;
      case "variable":
        trigger.variableName = flat.triggerVariableName || "";
        trigger.variableValue = flat.triggerVariableValue || "";
        break;
      case "custom":
        trigger.description = flat.triggerDescription || "";
        break;
    }
    const hasVariable = flat.actionVariableName && flat.actionVariableName.trim();
    const primaryType = flat.actionType || "steer";
    let action;
    const primaryAction = { type: primaryType };
    if (primaryType === "steer") {
      primaryAction.instruction = flat.actionInstruction || "";
    } else if (primaryType === "exit") {
      primaryAction.exitTarget = flat.actionExitTarget || "";
      if (flat.actionExitMessage?.trim()) {
        primaryAction.exitMessage = flat.actionExitMessage;
      }
    }
    if (hasVariable) {
      const setVarAction = {
        type: "set-variable",
        variableName: flat.actionVariableName,
        variableValue: flat.actionVariableValue || ""
      };
      if (flat.actionExtractionPrompt?.trim()) {
        setVarAction.extractionPrompt = flat.actionExtractionPrompt;
        delete setVarAction.variableValue;
      }
      action = {
        type: "multi",
        actions: [primaryAction, setVarAction]
      };
    } else {
      action = primaryAction;
    }
    const dir = {
      id: flat.id || `dir_${Date.now()}`,
      trigger,
      action,
      once: flat.once ?? false
    };
    if (flat.requiresVariable) dir.requiresVariable = flat.requiresVariable;
    if (flat.requiresVariableValue) dir.requiresVariableValue = flat.requiresVariableValue;
    return dir;
  }
  /**
   * Override getConnections to derive from direction exit targets + fallback
   */
  getConnections() {
    const connections = [];
    const seenTargets = /* @__PURE__ */ new Set();
    for (const dir of this.directions) {
      this.collectExitTargets(dir.action, connections, seenTargets, dir);
    }
    if (this.fallbackExitTarget && !seenTargets.has(this.fallbackExitTarget)) {
      connections.push({
        targetId: this.fallbackExitTarget,
        label: "fallback (max turns)"
      });
    }
    const baseConnections = super.getConnections();
    for (const conn of baseConnections) {
      if (!seenTargets.has(conn.targetId)) {
        connections.push(conn);
        seenTargets.add(conn.targetId);
      }
    }
    return connections;
  }
  collectExitTargets(action, connections, seen, dir) {
    if (action.type === "exit" && action.exitTarget && !seen.has(action.exitTarget)) {
      seen.add(action.exitTarget);
      const label = dir.trigger.type === "custom" ? dir.trigger.description?.slice(0, 25) : dir.trigger.keywords?.join(", ") || dir.trigger.type;
      connections.push({
        targetId: action.exitTarget,
        label: label ? label + (label.length >= 25 ? "..." : "") : void 0
      });
    }
    if (action.type === "multi" && action.actions) {
      for (const sub of action.actions) {
        this.collectExitTargets(sub, connections, seen, dir);
      }
    }
  }
  async performAction(context, renderer) {
    const aiService = renderer.getState("aiService");
    if (!aiService || typeof aiService.generateConversationTurn !== "function") {
      if (!aiService || typeof aiService.generateDialog !== "function") {
        console.warn(`[AIConversationBeat ${this.id}] AI service not configured`);
        await renderer.renderText(
          "AI features require configuration. Please set up AI in settings.",
          "Continue",
          Array.from(this.locations.values())
        );
        return this.fallbackExitTarget || this.getNextBeat(context);
      }
    }
    const positioned = this.presentation === "dialog";
    renderer.setState("presentationMode", positioned ? "positioned" : "chat-scroll");
    renderer.setState("showAvatars", true);
    renderer.setState("currentBeatType", "aiConversation");
    renderer.setState("responseDelay", 1);
    const variables = context.getVariables();
    const playerName = variables.playerName || variables.name || variables.player || "You";
    renderer.setState("playerName", playerName);
    if (renderer.clearChatHistory) {
      renderer.clearChatHistory();
    }
    const sttService = renderer.getState("sttService");
    if (sttService) {
      const provider = sttService.getActiveProvider?.();
      if (provider && typeof provider.setContextPrompt === "function") {
        provider.setContextPrompt("");
      }
    }
    const story = context.getStory();
    const contextBuilder = new PlayerContextBuilder(context, story);
    const playerContext = contextBuilder.buildPromptContext({
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeHistory: this.includeVisitedBeats,
      includeChoiceHistory: this.includeChoiceHistory
    });
    const characters = story?.getCharacters?.() || [];
    const npcRef = typeof context.resolveRoleRef === "function" ? context.resolveRoleRef(this.npcName) : this.npcName;
    const npcDisplayName = resolveCharacterDisplayName(npcRef, characters);
    const characterDossier = buildDossierForRef(npcRef, characters, context);
    const sceneNotes = sceneNotesFor(this.npcPersonality, npcRef, characters);
    const conversationHistory = [];
    const firedOnceDirections = /* @__PURE__ */ new Set();
    let turnNumber = 0;
    try {
      let openingText;
      if (this.openingLine) {
        openingText = this.processText(this.openingLine, context);
      } else {
        if (renderer.renderLoading) {
          renderer.renderLoading(`${npcDisplayName} is getting ready...`, {
            spinnerType: "dots"
          });
        }
        const systemPrompt = buildConversationSystemPrompt({
          npcName: npcDisplayName,
          npcPersonality: sceneNotes,
          characterDossier,
          scenario: this.scenario,
          playerContext,
          directions: this.directions,
          history: [],
          turnNumber: 0,
          maxTurns: this.maxTurns,
          systemInstructions: this.systemInstructions
        });
        openingText = await this.generateNPCResponse(aiService, systemPrompt, []);
        if (renderer.hideLoading) {
          renderer.hideLoading();
        }
      }
      conversationHistory.push({ role: "npc", text: openingText, turnNumber: 0 });
      await renderer.renderDialog(npcDisplayName, openingText, void 0, Array.from(this.locations.values()));
      context.recordTimelineEvent({
        type: "ai-output",
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "aiConversation",
        text: `${npcDisplayName}: ${openingText}`
      });
      while (turnNumber < this.maxTurns) {
        turnNumber++;
        const playerInput = await this.getPlayerInput(renderer);
        if (!playerInput.trim()) continue;
        conversationHistory.push({ role: "player", text: playerInput, turnNumber });
        context.recordChoice({
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiConversation",
          choiceText: playerInput,
          choiceContext: `Turn ${turnNumber} of conversation with ${npcDisplayName}`
        });
        const activeDirections = this.directions.filter((d) => {
          if (d.once && firedOnceDirections.has(d.id)) {
            console.log(`[AIConversationBeat ${this.id}] Direction ${d.id} skipped (already fired once)`);
            return false;
          }
          if (d.requiresVariable) {
            const actualVal = context.getVariable(d.requiresVariable);
            if (d.requiresVariableValue !== void 0 && d.requiresVariableValue !== "") {
              if (String(actualVal) !== String(d.requiresVariableValue)) {
                console.log(`[AIConversationBeat ${this.id}] Direction ${d.id} skipped (${d.requiresVariable}="${actualVal}" \u2260 "${d.requiresVariableValue}")`);
                return false;
              }
            } else {
              if (!actualVal) {
                console.log(`[AIConversationBeat ${this.id}] Direction ${d.id} skipped (${d.requiresVariable} not set)`);
                return false;
              }
            }
          }
          return true;
        });
        console.log(`[AIConversationBeat ${this.id}] Active directions: ${activeDirections.length}/${this.directions.length} (${activeDirections.map((d) => d.id).join(", ")})`);
        let steeringInstructions = [];
        let exitTarget = null;
        let exitMessagePrompt = null;
        const variableSets = [];
        if (activeDirections.length > 0) {
          const triggeredIndices = [];
          const fuzzyDirections = [];
          const fuzzyToActiveIdx = [];
          activeDirections.forEach((d, i) => {
            if (d.trigger.type === "variable" || d.trigger.type === "turn-count") {
              if (_AIConversationBeat.evaluateDeterministicTrigger(d, context, turnNumber)) {
                triggeredIndices.push(i);
              }
            } else {
              fuzzyToActiveIdx.push(i);
              fuzzyDirections.push(d);
            }
          });
          try {
            if (fuzzyDirections.length > 0) {
              const evalPrompt = buildDirectionEvaluationPrompt(
                playerInput,
                fuzzyDirections,
                conversationHistory,
                turnNumber
              );
              const evalResponse = await this.callAI(aiService, evalPrompt, "Evaluate which directions triggered", DIRECTION_EVALUATION_SCHEMA);
              for (const fi of parseDirectionEvaluationResponse(evalResponse)) {
                const activeIdx = fuzzyToActiveIdx[fi];
                if (activeIdx !== void 0) triggeredIndices.push(activeIdx);
              }
            }
            if (triggeredIndices.length > 0) {
              const actions = collectActions(activeDirections, triggeredIndices);
              steeringInstructions = actions.steeringInstructions;
              exitTarget = actions.exitTarget;
              exitMessagePrompt = actions.exitMessage;
              variableSets.push(...actions.variableSets);
              if (actions.extractions.length > 0) {
                try {
                  const extractPrompt = buildExtractionPrompt(actions.extractions, conversationHistory);
                  const extractResponse = await this.callAI(aiService, extractPrompt, "Extract variable values", extractionSchema(actions.extractions.map((e) => e.name)));
                  const match = extractResponse.match(/\{[\s\S]*\}/);
                  if (match) {
                    const extracted = JSON.parse(match[0]);
                    for (const ext of actions.extractions) {
                      if (extracted[ext.name] != null) {
                        variableSets.push({ name: ext.name, value: extracted[ext.name] });
                        console.log(`[AIConversationBeat ${this.id}] Extracted ${ext.name} = "${extracted[ext.name]}"`);
                      }
                    }
                  }
                } catch (extractErr) {
                  console.warn(`[AIConversationBeat ${this.id}] Variable extraction failed:`, extractErr);
                }
              }
              for (const idx of triggeredIndices) {
                const dir = activeDirections[idx];
                if (dir?.once) firedOnceDirections.add(dir.id);
              }
              console.log(`[AIConversationBeat ${this.id}] Triggered directions: ${triggeredIndices.join(", ")}`);
            }
          } catch (err) {
            console.warn(`[AIConversationBeat ${this.id}] Direction evaluation failed:`, err);
          }
        }
        for (const { name, value } of variableSets) {
          context.setVariable(name, value);
          console.log(`[AIConversationBeat ${this.id}] Set variable: ${name} = "${value}"`);
        }
        if (variableSets.length > 0 && !exitTarget) {
          const newlyActive = this.directions.filter((d) => {
            if (activeDirections.includes(d)) return false;
            if (d.once && firedOnceDirections.has(d.id)) return false;
            if (d.requiresVariable) {
              const actualVal = context.getVariable(d.requiresVariable);
              if (d.requiresVariableValue !== void 0 && d.requiresVariableValue !== "") {
                if (String(actualVal) !== String(d.requiresVariableValue)) return false;
              } else {
                if (!actualVal) return false;
              }
            }
            return true;
          });
          if (newlyActive.length > 0) {
            console.log(`[AIConversationBeat ${this.id}] Re-evaluating ${newlyActive.length} newly-active directions`);
            try {
              const reEvalPrompt = buildDirectionEvaluationPrompt(
                playerInput,
                newlyActive,
                conversationHistory,
                turnNumber
              );
              const reEvalResponse = await this.callAI(aiService, reEvalPrompt, "Re-evaluate directions", DIRECTION_EVALUATION_SCHEMA);
              const reTriggered = parseDirectionEvaluationResponse(reEvalResponse);
              if (reTriggered.length > 0) {
                const reActions = collectActions(newlyActive, reTriggered);
                steeringInstructions.push(...reActions.steeringInstructions);
                if (reActions.exitTarget) {
                  exitTarget = reActions.exitTarget;
                  exitMessagePrompt = reActions.exitMessage;
                }
                if (reActions.extractions.length > 0) {
                  try {
                    const extractPrompt = buildExtractionPrompt(reActions.extractions, conversationHistory);
                    const extractResponse = await this.callAI(aiService, extractPrompt, "Extract variable values", extractionSchema(reActions.extractions.map((e) => e.name)));
                    const match = extractResponse.match(/\{[\s\S]*\}/);
                    if (match) {
                      const extracted = JSON.parse(match[0]);
                      for (const ext of reActions.extractions) {
                        if (extracted[ext.name] != null) {
                          context.setVariable(ext.name, extracted[ext.name]);
                          console.log(`[AIConversationBeat ${this.id}] Extracted ${ext.name} = "${extracted[ext.name]}"`);
                        }
                      }
                    }
                  } catch (extractErr) {
                    console.warn(`[AIConversationBeat ${this.id}] Re-eval extraction failed:`, extractErr);
                  }
                }
                for (const { name, value } of reActions.variableSets) {
                  context.setVariable(name, value);
                }
                for (const idx of reTriggered) {
                  const dir = newlyActive[idx];
                  if (dir?.once) firedOnceDirections.add(dir.id);
                }
                console.log(`[AIConversationBeat ${this.id}] Re-eval triggered: ${reTriggered.join(", ")}`);
              }
            } catch (err) {
              console.warn(`[AIConversationBeat ${this.id}] Re-evaluation failed:`, err);
            }
          }
        }
        if (exitTarget) {
          if (exitMessagePrompt) {
            try {
              const exitSystemPrompt = `You are ${npcDisplayName}.

${npcIdentityBlock(buildDossierForRef(npcRef, characters, context), sceneNotes)}

SCENARIO: ${this.scenario}

Generate a brief farewell/response that DIRECTLY acknowledges what the player just said. Instruction: ${exitMessagePrompt}
Keep it to 1-2 sentences. Respond in the SAME LANGUAGE as the conversation.
Respond with ONLY the dialog text \u2014 no JSON, no metadata, no stage directions.`;
              const exitMsg = await this.generateNPCResponse(aiService, exitSystemPrompt, conversationHistory);
              if (exitMsg.trim()) {
                conversationHistory.push({ role: "npc", text: exitMsg, turnNumber });
                await renderer.renderDialog(npcDisplayName, exitMsg, void 0, Array.from(this.locations.values()));
                console.log(`[AIConversationBeat ${this.id}] NPC exit message: "${exitMsg.substring(0, 80)}..."`);
                await waitForTTS(renderer);
                await waitForReadingTime(renderer, exitMsg);
              }
            } catch (err) {
              console.warn(`[AIConversationBeat ${this.id}] Exit message generation failed:`, err);
            }
          }
          context.recordTimelineEvent({
            type: "branch",
            beatId: this.id,
            beatName: this.name || this.id,
            beatType: "aiConversation",
            targetBeatId: exitTarget,
            reason: `Direction exit triggered by player input: "${playerInput.slice(0, 50)}"`
          });
          return exitTarget;
        }
        const turnDossier = buildDossierForRef(npcRef, characters, context);
        const systemPrompt = buildConversationSystemPrompt({
          npcName: npcDisplayName,
          npcPersonality: sceneNotes,
          characterDossier: turnDossier,
          scenario: this.scenario,
          playerContext,
          directions: this.directions,
          history: conversationHistory,
          turnNumber,
          maxTurns: this.maxTurns,
          systemInstructions: this.systemInstructions,
          activeSteeringInstructions: steeringInstructions
        });
        const npcResponse = await this.generateNPCResponse(
          aiService,
          systemPrompt,
          conversationHistory
        );
        conversationHistory.push({ role: "npc", text: npcResponse, turnNumber });
        await renderer.renderDialog(
          npcDisplayName,
          npcResponse,
          void 0,
          Array.from(this.locations.values())
        );
        context.recordTimelineEvent({
          type: "ai-output",
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiConversation",
          text: `${npcDisplayName}: ${npcResponse}`
        });
        context.recordAIOutput({
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiConversation",
          text: `${npcDisplayName}: ${npcResponse}`
        });
      }
      console.log(`[AIConversationBeat ${this.id}] Max turns (${this.maxTurns}) reached`);
      if (this.fallbackExitMessage?.trim()) {
        try {
          const closingPrompt = `You are ${npcDisplayName}.

${npcIdentityBlock(buildDossierForRef(npcRef, characters, context), sceneNotes)}

SCENARIO: ${this.scenario}

The conversation has to end now. Say a brief closing line that wraps it up naturally, consistent with everything said so far. Instruction: ${this.fallbackExitMessage}
Keep it to 1-2 sentences. Respond in the SAME LANGUAGE as the conversation.
Respond with ONLY the dialog text \u2014 no JSON, no metadata, no stage directions.`;
          const closing = await this.generateNPCResponse(aiService, closingPrompt, conversationHistory);
          if (closing.trim()) {
            conversationHistory.push({ role: "npc", text: closing, turnNumber });
            await renderer.renderDialog(npcDisplayName, closing, void 0, Array.from(this.locations.values()));
            await waitForTTS(renderer);
            await waitForReadingTime(renderer, closing);
          }
        } catch (err) {
          console.warn(`[AIConversationBeat ${this.id}] Closing line generation failed:`, err);
        }
      }
      context.recordTimelineEvent({
        type: "branch",
        beatId: this.id,
        beatName: this.name || this.id,
        beatType: "aiConversation",
        targetBeatId: this.fallbackExitTarget || "",
        reason: `Max turns (${this.maxTurns}) reached`
      });
      return this.fallbackExitTarget || this.getNextBeat(context);
    } catch (error) {
      console.error(`[AIConversationBeat ${this.id}] Error:`, error);
      await renderer.renderText(
        "An error occurred during the conversation.",
        "Continue",
        Array.from(this.locations.values())
      );
      return this.fallbackExitTarget || this.getNextBeat(context);
    }
  }
  /**
   * Get player input via renderConversationInput or fallback to renderInputText
   */
  async getPlayerInput(renderer) {
    if (renderer.renderConversationInput) {
      const positioned = this.presentation === "dialog";
      const dialogContext = positioned ? renderer.getState("dialogContext") : void 0;
      return renderer.renderConversationInput({
        placeholder: "Type your response...",
        showMic: this.enableVoiceInput,
        language: this.language,
        positioned,
        speaker: dialogContext?.speaker,
        npcText: dialogContext?.text,
        locations: positioned ? Array.from(this.locations.values()) : void 0
      });
    }
    return renderer.renderInputText(
      "",
      "Type your response...",
      "Send",
      { required: true },
      Array.from(this.locations.values())
    );
  }
  /**
   * Generate an NPC response using the AI service
   */
  async generateNPCResponse(aiService, systemPrompt, history) {
    if (typeof aiService.generateConversationTurn === "function") {
      const response2 = await aiService.generateConversationTurn({
        systemPrompt,
        messages: history.map((t) => ({
          role: t.role === "npc" ? "assistant" : "user",
          content: t.text
        }))
      });
      return typeof response2 === "string" ? response2 : response2.text || response2.content || "";
    }
    const prompt = `${systemPrompt}

Conversation so far:
${history.map(
      (t) => `${t.role === "npc" ? "NPC" : "Player"}: ${t.text}`
    ).join("\n")}

Generate the NPC's next response. Return ONLY the dialog text.`;
    const response = await aiService.generateDialog({ prompt, format: "text" });
    return typeof response === "string" ? response : response.text || "";
  }
  /**
   * Generic AI call for direction evaluation etc.
   */
  async callAI(aiService, prompt, _purpose, schema) {
    if (typeof aiService.generateConversationTurn === "function") {
      const response2 = await aiService.generateConversationTurn({
        systemPrompt: "You are a conversation analyzer. Follow the instructions exactly.",
        messages: [{ role: "user", content: prompt }],
        ...schema ? { schema } : {}
      });
      return typeof response2 === "string" ? response2 : response2.text || response2.content || "";
    }
    const response = await aiService.generateDialog({ prompt, format: "text" });
    return typeof response === "string" ? response : response.text || "";
  }
};

// src/beats/AISummaryBeat.ts
var AISummaryBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "includeVariables");
    __publicField(this, "includeInventory");
    __publicField(this, "includeVisitedBeats");
    __publicField(this, "includeChoiceHistory");
    __publicField(this, "includeCounters");
    __publicField(this, "summaryStyle");
    __publicField(this, "maxLength");
    __publicField(this, "title");
    __publicField(this, "showRestart");
    __publicField(this, "showCredits");
    __publicField(this, "restartText");
    __publicField(this, "creditsText");
    __publicField(this, "restartTarget");
    __publicField(this, "resetOnRestart");
    // Granular reset sub-options (all default true for backward compatibility)
    __publicField(this, "resetVariables");
    __publicField(this, "resetCounters");
    __publicField(this, "resetInventory");
    __publicField(this, "resetTimers");
    __publicField(this, "resetFictionalTime");
    __publicField(this, "resetVisitedTracking");
    __publicField(this, "resetHistory");
    /** Characters' feelings, variants and HUD reveal (see ResetOptions.characters). */
    __publicField(this, "resetCharacters");
    // Credits page properties
    __publicField(this, "creditsPageTitle");
    __publicField(this, "creditsPageBody");
    __publicField(this, "creditsCloseText");
    __publicField(this, "generatedSummary", null);
    const params = config.parameters || {};
    this.prompt = params.prompt || config.prompt;
    this.includeVariables = params.includeVariables ?? config.includeVariables ?? true;
    this.includeInventory = params.includeInventory ?? config.includeInventory ?? false;
    this.includeVisitedBeats = params.includeVisitedBeats ?? config.includeVisitedBeats ?? true;
    this.includeChoiceHistory = params.includeChoiceHistory ?? config.includeChoiceHistory ?? true;
    this.includeCounters = params.includeCounters ?? config.includeCounters ?? false;
    this.summaryStyle = params.summaryStyle || config.summaryStyle || "narrative";
    this.maxLength = params.maxLength || config.maxLength || "medium";
    this.title = params.title || config.title || "Your Journey";
    this.showRestart = params.showRestart ?? config.showRestart ?? true;
    this.showCredits = params.showCredits ?? config.showCredits ?? false;
    this.restartText = params.restartText || config.restartText || "Play Again";
    this.creditsText = params.creditsText || config.creditsText || "Credits";
    this.restartTarget = params.restartTarget || config.restartTarget;
    if (!this.restartTarget && this.showRestart) {
      const legacy = this.connections?.find((c) => c?.targetId)?.targetId;
      if (legacy) this.restartTarget = legacy;
    }
    this.resetOnRestart = params.resetOnRestart ?? config.resetOnRestart ?? true;
    this.resetVariables = params.resetVariables ?? config.resetVariables ?? true;
    this.resetCounters = params.resetCounters ?? config.resetCounters ?? true;
    this.resetInventory = params.resetInventory ?? config.resetInventory ?? true;
    this.resetTimers = params.resetTimers ?? config.resetTimers ?? true;
    this.resetFictionalTime = params.resetFictionalTime ?? config.resetFictionalTime ?? true;
    this.resetVisitedTracking = params.resetVisitedTracking ?? config.resetVisitedTracking ?? true;
    this.resetHistory = params.resetHistory ?? config.resetHistory ?? true;
    this.resetCharacters = params.resetCharacters ?? config.resetCharacters ?? true;
    this.creditsPageTitle = params.creditsPageTitle || config.creditsPageTitle || "Credits";
    this.creditsPageBody = params.creditsPageBody || config.creditsPageBody || "";
    this.creditsCloseText = params.creditsCloseText || config.creditsCloseText || "Close";
  }
  /**
   * The restart button's destination as a link — shown in the flowchart and
   * the story digest, and reachability sees it. Derived (never stored): the
   * beat's own exits stay what they are, so "no restart" still ends here.
   * Without an explicit restartTarget the restart goes to the story's first
   * beat, which a beat cannot name here.
   */
  getConnections() {
    const base = super.getConnections().filter((c) => !c.derivedFrom);
    if (!this.showRestart || !this.restartTarget) return base;
    if (base.some((c) => c.targetId === this.restartTarget)) {
      return base.map((c) => c.targetId === this.restartTarget ? { ...c, label: "Restart", role: "restart" } : c);
    }
    return [...base, { targetId: this.restartTarget, label: "Restart", derivedFrom: "restartTarget", role: "restart" }];
  }
  getParameters() {
    return {
      prompt: this.prompt,
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeVisitedBeats: this.includeVisitedBeats,
      includeChoiceHistory: this.includeChoiceHistory,
      includeCounters: this.includeCounters,
      summaryStyle: this.summaryStyle,
      maxLength: this.maxLength,
      title: this.title,
      showRestart: this.showRestart,
      showCredits: this.showCredits,
      restartText: this.restartText,
      creditsText: this.creditsText,
      restartTarget: this.restartTarget,
      resetOnRestart: this.resetOnRestart,
      resetVariables: this.resetVariables,
      resetCounters: this.resetCounters,
      resetInventory: this.resetInventory,
      resetTimers: this.resetTimers,
      resetFictionalTime: this.resetFictionalTime,
      resetVisitedTracking: this.resetVisitedTracking,
      resetHistory: this.resetHistory,
      resetCharacters: this.resetCharacters,
      creditsPageTitle: this.creditsPageTitle,
      creditsPageBody: this.creditsPageBody,
      creditsCloseText: this.creditsCloseText,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.includeVariables !== void 0) this.includeVariables = params.includeVariables;
    if (params.includeInventory !== void 0) this.includeInventory = params.includeInventory;
    if (params.includeVisitedBeats !== void 0) this.includeVisitedBeats = params.includeVisitedBeats;
    if (params.includeChoiceHistory !== void 0) this.includeChoiceHistory = params.includeChoiceHistory;
    if (params.includeCounters !== void 0) this.includeCounters = params.includeCounters;
    if (params.summaryStyle !== void 0) this.summaryStyle = params.summaryStyle;
    if (params.maxLength !== void 0) this.maxLength = params.maxLength;
    if (params.title !== void 0) this.title = params.title;
    if (params.showRestart !== void 0) this.showRestart = params.showRestart;
    if (params.showCredits !== void 0) this.showCredits = params.showCredits;
    if (params.restartText !== void 0) this.restartText = params.restartText;
    if (params.creditsText !== void 0) this.creditsText = params.creditsText;
    if (params.restartTarget !== void 0) this.restartTarget = params.restartTarget;
    if (params.resetOnRestart !== void 0) this.resetOnRestart = params.resetOnRestart;
    if (params.resetVariables !== void 0) this.resetVariables = params.resetVariables;
    if (params.resetCounters !== void 0) this.resetCounters = params.resetCounters;
    if (params.resetInventory !== void 0) this.resetInventory = params.resetInventory;
    if (params.resetTimers !== void 0) this.resetTimers = params.resetTimers;
    if (params.resetFictionalTime !== void 0) this.resetFictionalTime = params.resetFictionalTime;
    if (params.resetVisitedTracking !== void 0) this.resetVisitedTracking = params.resetVisitedTracking;
    if (params.resetHistory !== void 0) this.resetHistory = params.resetHistory;
    if (params.resetCharacters !== void 0) this.resetCharacters = params.resetCharacters;
    if (params.creditsPageTitle !== void 0) this.creditsPageTitle = params.creditsPageTitle;
    if (params.creditsPageBody !== void 0) this.creditsPageBody = params.creditsPageBody;
    if (params.creditsCloseText !== void 0) this.creditsCloseText = params.creditsCloseText;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  /**
   * Prefetch AI content in the background so it's cached when the beat executes.
   * Called by StoryEngine when this beat is the next beat to be executed.
   * Does NOT render anything - only generates and caches the summary.
   */
  async prefetch(context, renderer) {
    try {
      const aiService = renderer.getState("aiService");
      if (!aiService || typeof aiService.generateContent !== "function") return;
      if (this.generatedSummary) return;
      console.log(`[AISummaryBeat ${this.id}] Prefetching summary...`);
      this.generatedSummary = await this.generateAISummary(context, aiService);
      console.log(`[AISummaryBeat ${this.id}] Prefetch complete`);
    } catch (err) {
      console.log(`[AISummaryBeat ${this.id}] Prefetch failed (will retry on execute):`, err);
    }
  }
  async performAction(context, renderer) {
    renderer.setState("slotAnimations", this.slotAnimations);
    let summaryText;
    const aiService = renderer.getState("aiService");
    if (aiService && typeof aiService.generateContent === "function") {
      if (this.generatedSummary) {
        console.log(`[AISummaryBeat ${this.id}] Using prefetched summary`);
        summaryText = this.generatedSummary;
      } else {
        if (renderer.renderLoading) {
          const loadingMessages = [
            "Let me reflect on your journey...",
            "Summarizing your experience...",
            "Reviewing your choices...",
            "Creating your personal summary..."
          ];
          const message = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
          renderer.renderLoading(message, {
            subMessage: "This will just take a moment",
            spinnerType: "pulse"
          });
        }
        try {
          summaryText = await this.generateAISummary(context, aiService);
        } catch (error) {
          console.error(`[AISummaryBeat ${this.id}] AI generation failed:`, error);
          summaryText = this.generateStaticSummary(context);
        }
      }
    } else {
      console.warn(`[AISummaryBeat ${this.id}] AI service not configured, using static summary`);
      summaryText = this.generateStaticSummary(context);
    }
    context.recordAIOutput({
      beatId: this.id,
      beatName: this.name || this.id,
      beatType: "aiSummary",
      text: summaryText
    });
    const processedTitle = this.processText(this.title || "Your Journey", context);
    const processedSummary = this.processText(summaryText, context);
    const processedRestartText = this.processText(this.restartText, context);
    const processedCreditsText = this.processText(this.creditsText, context);
    const locs = Array.from(this.locations.values());
    const doRestart = () => {
      const r = renderer;
      r.setTimerHudState?.(void 0);
      r.setTimerHudOverrideText?.(void 0);
      r.setTimerState?.(void 0);
      const allTrue = this.resetVariables && this.resetCounters && this.resetInventory && this.resetTimers && this.resetFictionalTime && this.resetVisitedTracking && this.resetHistory && this.resetCharacters;
      context.restartPlaythrough(!this.resetOnRestart ? null : allTrue ? "all" : {
        variables: this.resetVariables,
        counters: this.resetCounters,
        inventory: this.resetInventory,
        timers: this.resetTimers,
        fictionalTime: this.resetFictionalTime,
        visitedTracking: this.resetVisitedTracking,
        history: this.resetHistory,
        characters: this.resetCharacters
      }, this.id);
      return this.restartTarget || context.getStory().getFirstBeatId();
    };
    while (true) {
      let result;
      if (renderer.renderAISummary) {
        result = await renderer.renderAISummary({
          title: processedTitle,
          summary: processedSummary,
          showRestart: this.showRestart,
          showCredits: this.showCredits,
          restartText: processedRestartText,
          creditsText: processedCreditsText
        }, locs);
      } else {
        const fullMessage = `${processedTitle}

${processedSummary}`;
        result = await renderer.renderEndScreen(fullMessage, this.showRestart, this.showCredits, locs);
      }
      const resultLower = (result || "").toLowerCase();
      if (resultLower.includes("restart") || resultLower.includes("play") || resultLower.includes("again")) {
        return doRestart();
      }
      if (resultLower.includes("credit")) {
        if (this.showCredits) {
          await this.showCreditsPage(context, renderer);
          continue;
        }
        return null;
      }
      if (resultLower === "button1" || resultLower === "button 1") {
        if (this.showRestart) return doRestart();
      }
      if (resultLower === "button2" || resultLower === "button 2") {
        if (this.showCredits) {
          await this.showCreditsPage(context, renderer);
          continue;
        }
        return null;
      }
      if (this.showRestart && !this.showCredits && resultLower) {
        return doRestart();
      }
      return this.getNextBeat(context);
    }
  }
  async showCreditsPage(context, renderer) {
    const story = context.getStory();
    const metadata = story.getMetadata();
    let body = this.creditsPageBody;
    if (!body) {
      body = `${metadata.title || "Untitled Story"}

Created by: ${metadata.author || "Anonymous"}

Thank you for playing!`;
    }
    const creditsContent = {
      creditsTitle: this.processText(this.creditsPageTitle, context),
      creditsBody: this.processText(body, context),
      creditsCloseText: this.processText(this.creditsCloseText, context)
    };
    const creditsLocations = this.getCreditsLocations();
    if (renderer.renderCreditsPage) {
      await renderer.renderCreditsPage(creditsContent, creditsLocations);
    } else {
      await renderer.renderText(
        `${creditsContent.creditsTitle}

${creditsContent.creditsBody}`,
        creditsContent.creditsCloseText,
        []
      );
    }
  }
  /**
   * Get Location[] for credits page elements from beat.locations
   * Filters for credits-phase elements (creditsTitle, creditsBody, creditsCloseButton)
   */
  getCreditsLocations() {
    const creditsLocationNames = ["creditstitle", "creditsbody", "creditsclosebutton"];
    const locations = [];
    this.locations.forEach((loc) => {
      const nameLower = loc.name?.toLowerCase().replace(/\s+/g, "") || "";
      if (creditsLocationNames.some((n) => nameLower.includes(n))) {
        locations.push(loc);
      }
    });
    return locations;
  }
  /**
   * Generate a summary using AI
   */
  async generateAISummary(context, aiService) {
    const story = context.getStory();
    const contextBuilder = new PlayerContextBuilder(context, story);
    const journeySummary = contextBuilder.buildJourneySummary({
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeVisitedBeats: this.includeVisitedBeats,
      includeChoiceHistory: this.includeChoiceHistory,
      includeCounters: this.includeCounters
    });
    const wordLimits = {
      short: 75,
      medium: 150,
      long: 300
    };
    const maxWords = wordLimits[this.maxLength];
    const styleGuide = {
      narrative: "Write in third person narrative style, like a story epilogue.",
      "bullet-points": "Use bullet points to highlight key moments and outcomes.",
      reflection: 'Write as if the player is reflecting on their journey, using "you" form.'
    }[this.summaryStyle];
    const prompt = `Write the end-of-story summary for this player, shown on the final screen.

PLAYER JOURNEY DATA:
${journeySummary}

${this.prompt ? `ADDITIONAL CONTEXT: ${this.prompt}` : ""}

STYLE: ${styleGuide}

Length: about ${maxWords} words at most (the author's length setting, sized for the end screen).
Use the player's name if the data has one. Describe only what the journey data records \u2014 choices, variables, counters, scenes; if a scene title suggests a topic, you can say the player explored it, but do not invent conversations that aren't documented. End on a positive note. Output only the summary text.`;
    console.log(`[AISummaryBeat ${this.id}] Generating summary (max ${maxWords} words)...`);
    const response = await aiService.generateContent(prompt, {
      maxTokens: Math.max(500, maxWords * 3)
      // Extra headroom for complete responses
    });
    let cleanedResponse = response;
    const reasoningPatterns = [
      /^(I need to|Let me|I'll|I will|Here's|Here is|Based on|Looking at|Analyzing)[^.]*\.\s*/gi,
      /^(First,|To start,|Starting with)[^.]*\.\s*/gi,
      /^\*\*[^*]+\*\*\s*/g,
      // Remove bold headers like **Summary:**
      /^Summary:?\s*/i
    ];
    for (const pattern of reasoningPatterns) {
      cleanedResponse = cleanedResponse.replace(pattern, "");
    }
    cleanedResponse = cleanedResponse.replace(/,\s*,/g, ",").replace(/\.\s*,/g, ".").replace(/,\s*\./g, ".").replace(/\s+,/g, ",").replace(/,\s+\./g, ".");
    const lines = cleanedResponse.split("\n").filter((line) => line.trim());
    if (lines.length > 1) {
      const seen = /* @__PURE__ */ new Set();
      const uniqueLines = [];
      for (const line of lines) {
        const normalized = line.trim().toLowerCase().substring(0, 50);
        if (!seen.has(normalized)) {
          seen.add(normalized);
          uniqueLines.push(line);
        }
      }
      cleanedResponse = uniqueLines.join("\n\n");
    }
    return cleanedResponse.trim();
  }
  /**
   * Generate a basic static summary when AI is not available
   */
  generateStaticSummary(context) {
    const variables = context.getVariables();
    const counters = context.getCounters();
    const inventory = context.getInventory();
    const history = context.getHistory();
    const visitedBeats = context.getVisitedBeats();
    const sections = [];
    const playerName = variables.name || variables.playerName;
    if (playerName) {
      sections.push(`Congratulations, ${playerName}!`);
    }
    sections.push(`You visited ${visitedBeats.length} unique scenes on your journey.`);
    if (inventory.length > 0) {
      sections.push(`You collected: ${inventory.join(", ")}.`);
    }
    const counterEntries = Object.entries(counters);
    if (counterEntries.length > 0) {
      const counterSummary = counterEntries.map(([name, value]) => `${name}: ${value}`).join(", ");
      sections.push(`Final scores: ${counterSummary}`);
    }
    return sections.join("\n\n");
  }
};

// src/utils/aiReplySchemas.ts
var TEXT_WITH_SUGGESTIONS_SCHEMA = {
  type: "object",
  properties: {
    text: { type: "string" },
    suggestions: { type: "array", items: { type: "string" } }
  },
  required: ["text", "suggestions"],
  additionalProperties: false
};

// src/beats/AIInfoTextBeat.ts
var AIInfoTextBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "contextVariables");
    __publicField(this, "includeVariables");
    __publicField(this, "includeInventory");
    __publicField(this, "includeHistory");
    __publicField(this, "includeCounters");
    __publicField(this, "includeChoiceHistory");
    __publicField(this, "maxSentences");
    __publicField(this, "fallbackText");
    __publicField(this, "buttonText");
    __publicField(this, "generatedText", null);
    __publicField(this, "lastContextHash", null);
    __publicField(this, "_aiSuggestions", []);
    const params = config.parameters || {};
    this.prompt = params.prompt || config.prompt || "";
    this.contextVariables = params.contextVariables || config.contextVariables;
    this.includeVariables = params.includeVariables ?? config.includeVariables ?? true;
    this.includeInventory = params.includeInventory ?? config.includeInventory ?? false;
    this.includeHistory = params.includeHistory ?? config.includeHistory ?? false;
    this.includeCounters = params.includeCounters ?? config.includeCounters ?? true;
    this.includeChoiceHistory = params.includeChoiceHistory ?? config.includeChoiceHistory ?? true;
    this.maxSentences = params.maxSentences || config.maxSentences || 2;
    this.fallbackText = params.fallbackText || config.fallbackText || "Continue...";
    this.buttonText = params.buttonText || config.buttonText || "Continue";
  }
  /** Get AI suggestions for improving the beat (e.g., missing variables) */
  get aiSuggestions() {
    return this._aiSuggestions;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      contextVariables: this.contextVariables,
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeHistory: this.includeHistory,
      includeCounters: this.includeCounters,
      includeChoiceHistory: this.includeChoiceHistory,
      maxSentences: this.maxSentences,
      fallbackText: this.fallbackText,
      buttonText: this.buttonText,
      slotIntent: this.slotIntent,
      slotAnimations: this.slotAnimations
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.contextVariables !== void 0) this.contextVariables = params.contextVariables;
    if (params.includeVariables !== void 0) this.includeVariables = params.includeVariables;
    if (params.includeInventory !== void 0) this.includeInventory = params.includeInventory;
    if (params.includeHistory !== void 0) this.includeHistory = params.includeHistory;
    if (params.includeCounters !== void 0) this.includeCounters = params.includeCounters;
    if (params.includeChoiceHistory !== void 0) this.includeChoiceHistory = params.includeChoiceHistory;
    if (params.maxSentences !== void 0) this.maxSentences = params.maxSentences;
    if (params.fallbackText !== void 0) this.fallbackText = params.fallbackText;
    if (params.buttonText !== void 0) this.buttonText = params.buttonText;
    if (params.slotIntent !== void 0) this.slotIntent = params.slotIntent;
    if (params.slotAnimations !== void 0) this.slotAnimations = params.slotAnimations;
  }
  async performAction(context, renderer) {
    const locations = Array.from(this.locations.values());
    renderer.setState("currentBeatType", "aiInfoText");
    renderer.setState("slotAnimations", this.slotAnimations);
    const aiService = renderer.getState("aiService");
    if (!aiService || typeof aiService.generateContent !== "function") {
      console.warn(`[AIInfoTextBeat ${this.id}] AI service not configured, using fallback`);
      const processedFallback = this.processText(this.fallbackText, context);
      await renderer.renderText(processedFallback, this.buttonText, locations);
      return this.getNextBeat(context);
    }
    try {
      const contextHash = this.createContextHash(context);
      const needsRegeneration = !this.generatedText || this.lastContextHash !== contextHash;
      if (needsRegeneration) {
        this.generatedText = null;
        if (renderer.renderLoading) {
          renderer.renderLoading("Thinking...", {
            subMessage: "Generating response",
            spinnerType: "dots"
          });
        }
        this.generatedText = await this.generateText(context, aiService, renderer);
        this.lastContextHash = contextHash;
        if (this._aiSuggestions.length > 0) {
          renderer.setState("aiSuggestions", {
            beatId: this.id,
            beatName: this.name || this.id,
            suggestions: this._aiSuggestions
          });
        }
      }
      if (this.generatedText) {
        context.recordAIOutput({
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiInfoText",
          text: this.generatedText
        });
      }
      const displayText = this.generatedText || this.fallbackText;
      const processedText = this.processText(displayText, context);
      await renderer.renderText(processedText, this.buttonText, locations);
      return this.getNextBeat(context);
    } catch (error) {
      console.error(`[AIInfoTextBeat ${this.id}] Error:`, error);
      const processedFallback = this.processText(this.fallbackText, context);
      await renderer.renderText(processedFallback, this.buttonText, locations);
      return this.getNextBeat(context);
    }
  }
  /**
   * Prefetch AI content in the background so it's cached when the beat executes.
   * Called by StoryEngine when this beat is the next beat to be executed.
   * Does NOT render anything - only generates and caches text.
   */
  async prefetch(context, renderer) {
    try {
      const aiService = renderer.getState("aiService");
      if (!aiService || typeof aiService.generateContent !== "function") return;
      const contextHash = this.createContextHash(context);
      if (this.generatedText && this.lastContextHash === contextHash) return;
      console.log(`[AIInfoTextBeat ${this.id}] Prefetching content...`);
      this.generatedText = await this.generateText(context, aiService, renderer);
      this.lastContextHash = contextHash;
      console.log(`[AIInfoTextBeat ${this.id}] Prefetch complete`);
    } catch (err) {
      console.log(`[AIInfoTextBeat ${this.id}] Prefetch failed (will retry on execute):`, err);
    }
  }
  /**
   * Create a hash of key context values to detect if we need to regenerate
   */
  createContextHash(context) {
    const variables = context.getVariables();
    const counters = context.getCounters();
    const inventory = context.getInventory();
    const visitedBeats = context.getVisitedBeats();
    const keyValues = [];
    keyValues.push(this.prompt);
    if (this.contextVariables && this.contextVariables.length > 0) {
      for (const varName of this.contextVariables) {
        if (variables[varName] !== void 0) {
          keyValues.push(`${varName}:${String(variables[varName])}`);
        }
      }
    } else if (this.includeVariables) {
      for (const [key, value] of Object.entries(variables)) {
        keyValues.push(`${key}:${String(value)}`);
      }
    }
    if (this.includeCounters) {
      for (const [key, value] of Object.entries(counters)) {
        keyValues.push(`counter:${key}:${value}`);
      }
    }
    if (this.includeInventory && inventory.length > 0) {
      keyValues.push(`inventory:${inventory.sort().join(",")}`);
    }
    if (this.includeHistory && visitedBeats.length > 0) {
      keyValues.push(`history:${visitedBeats.join(",")}`);
    }
    if (this.includeChoiceHistory) {
      const choiceHistory = context.getChoiceHistory();
      if (choiceHistory.length > 0) {
        const choiceKeys = choiceHistory.map((c) => `${c.beatId}:${c.choiceText}`);
        keyValues.push(`choices:${choiceKeys.join(",")}`);
      }
    }
    return keyValues.join("|");
  }
  /**
   * Generate text using AI
   */
  async generateText(context, aiService, renderer) {
    const story = context.getStory();
    const contextBuilder = new PlayerContextBuilder(context, story);
    const storyContext = renderer?.getState?.("storyContext") || {};
    const storyTitle = storyContext.title || story?.getMetadata?.()?.title || "Interactive Story";
    const storyAuthor = storyContext.author || story?.getMetadata?.()?.author || "";
    const characters = storyContext.characters || [];
    let storyContextSection = `STORY: "${storyTitle}"`;
    if (storyAuthor) {
      storyContextSection += ` by ${storyAuthor}`;
    }
    if (characters.length > 0) {
      const charDescriptions = characters.filter((c) => c.name && c.name !== "player").map((c) => {
        let desc = c.name;
        if (c.role) desc += ` (${c.role})`;
        if (c.description) desc += `: ${c.description}`;
        return desc;
      }).join("; ");
      if (charDescriptions) {
        storyContextSection += `
CHARACTERS: ${charDescriptions}`;
      }
    }
    let filteredContext;
    if (this.contextVariables && this.contextVariables.length > 0) {
      const variables2 = context.getVariables();
      const filtered = {};
      for (const varName of this.contextVariables) {
        if (variables2[varName] !== void 0) {
          filtered[varName] = variables2[varName];
        }
      }
      filteredContext = `Variables: ${JSON.stringify(filtered)}`;
      if (this.includeInventory || this.includeCounters || this.includeChoiceHistory) {
        filteredContext += "\n" + contextBuilder.buildPromptContext({
          includeVariables: false,
          includeInventory: this.includeInventory,
          includeHistory: this.includeHistory,
          includeCounters: this.includeCounters,
          includeChoiceHistory: this.includeChoiceHistory
        });
      }
    } else {
      filteredContext = contextBuilder.buildPromptContext({
        includeVariables: this.includeVariables,
        includeInventory: this.includeInventory,
        includeHistory: this.includeHistory,
        includeCounters: this.includeCounters,
        includeChoiceHistory: this.includeChoiceHistory
      });
    }
    const variables = context.getVariables();
    const counters = context.getCounters();
    const inventory = context.getInventory();
    const availableData = [];
    if (this.includeVariables && Object.keys(variables).length > 0) {
      availableData.push(`Variables: ${Object.keys(variables).join(", ")}`);
    }
    if (this.includeCounters && Object.keys(counters).length > 0) {
      availableData.push(`Counters: ${Object.keys(counters).join(", ")}`);
    }
    if (this.includeInventory && inventory.length > 0) {
      availableData.push(`Inventory items: ${inventory.join(", ")}`);
    }
    const dataAvailability = availableData.length > 0 ? `AVAILABLE DATA (you may reference these):
${availableData.join("\n")}` : "AVAILABLE DATA: None - no player variables, counters, or inventory items exist yet.";
    const prompt = `Generate a short text response (${this.maxSentences} sentence${this.maxSentences > 1 ? "s" : ""} maximum) for the following situation:

${storyContextSection}

SCENE CONTEXT: ${this.prompt}

PLAYER STATE:
${filteredContext}

${dataAvailability}

REQUIREMENTS:
1. ONLY reference data that exists in PLAYER STATE above
2. Do NOT use placeholders like [Player Name], [Location], etc.
3. Do NOT reference variables, names, or data that are not explicitly listed above
4. Do NOT reference internal beat names, story structure, or technical terms (e.g., "Title Screen", "beat_3", "DialogTree")
5. Use player-friendly language: say "beginning" not "title screen", "conversation" not "dialog tree", "choice" not "movement beat"
6. Write as if speaking directly to the player immersed in the story, not describing the game system
7. If no personalization data is available, write engaging generic text

Return a JSON object with this exact format:
{
  "text": "Your generated text here",
  "suggestions": ["suggestion 1", "suggestion 2"]
}

The "suggestions" array should contain ideas for story variables that would improve personalization (e.g., "Add a 'playerName' variable for personalized greetings"). Leave empty if no suggestions.`;
    console.log(`[AIInfoTextBeat ${this.id}] Generating text...`);
    const response = await aiService.generateContent(prompt, {
      maxTokens: 250,
      // Increased for JSON response
      schema: TEXT_WITH_SUGGESTIONS_SCHEMA
    });
    const rawResponse = typeof response === "string" ? response : "";
    let text = "";
    this._aiSuggestions = [];
    const looksLikeJson = /^\s*\{/.test(rawResponse);
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*"text"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        text = parsed.text || "";
        if (Array.isArray(parsed.suggestions)) {
          this._aiSuggestions = parsed.suggestions.filter((s) => typeof s === "string" && s.trim());
        }
        console.log(`[AIInfoTextBeat ${this.id}] Parsed JSON response, suggestions:`, this._aiSuggestions);
      } else if (!looksLikeJson) {
        text = rawResponse;
      } else {
        text = "";
      }
    } catch {
      console.warn(`[AIInfoTextBeat ${this.id}] Failed to parse JSON, attempting salvage`);
      text = "";
    }
    if (!text && looksLikeJson) {
      const textFieldMatch = rawResponse.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (textFieldMatch) {
        text = textFieldMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
        console.log(`[AIInfoTextBeat ${this.id}] Salvaged text from truncated JSON (${text.length} chars)`);
      }
    }
    text = text.replace(/^["']|["']$/g, "").trim();
    text = text.replace(/^#+\s*/gm, "").trim();
    return text || this.fallbackText;
  }
};

// src/beats/AIDurScreenBeat.ts
var AIDurScreenBeat = class extends Beat {
  constructor(config) {
    super(config);
    __publicField(this, "prompt");
    __publicField(this, "contextVariables");
    __publicField(this, "includeVariables");
    __publicField(this, "includeInventory");
    __publicField(this, "includeHistory");
    __publicField(this, "includeCounters");
    __publicField(this, "includeChoiceHistory");
    __publicField(this, "maxSentences");
    __publicField(this, "fallbackText");
    __publicField(this, "wordsPerMinute");
    __publicField(this, "minDuration");
    __publicField(this, "maxDuration");
    __publicField(this, "generatedText", null);
    __publicField(this, "lastContextHash", null);
    __publicField(this, "_aiSuggestions", []);
    const params = config.parameters || {};
    this.prompt = params.prompt || config.prompt || "";
    this.contextVariables = params.contextVariables || config.contextVariables;
    this.includeVariables = params.includeVariables ?? config.includeVariables ?? true;
    this.includeInventory = params.includeInventory ?? config.includeInventory ?? false;
    this.includeHistory = params.includeHistory ?? config.includeHistory ?? false;
    this.includeCounters = params.includeCounters ?? config.includeCounters ?? true;
    this.includeChoiceHistory = params.includeChoiceHistory ?? config.includeChoiceHistory ?? true;
    this.maxSentences = params.maxSentences || config.maxSentences || 2;
    this.fallbackText = params.fallbackText || config.fallbackText || "Continue...";
    this.wordsPerMinute = params.wordsPerMinute || config.wordsPerMinute || 200;
    const rawMin = params.minDuration ?? config.minDuration;
    const rawMax = params.maxDuration ?? config.maxDuration;
    this.minDuration = rawMin != null ? normalizeDurationToSeconds(rawMin) : 3;
    this.maxDuration = rawMax != null ? normalizeDurationToSeconds(rawMax) : 45;
  }
  /** Get AI suggestions for improving the beat (e.g., missing variables) */
  get aiSuggestions() {
    return this._aiSuggestions;
  }
  getParameters() {
    return {
      prompt: this.prompt,
      contextVariables: this.contextVariables,
      includeVariables: this.includeVariables,
      includeInventory: this.includeInventory,
      includeHistory: this.includeHistory,
      includeCounters: this.includeCounters,
      includeChoiceHistory: this.includeChoiceHistory,
      maxSentences: this.maxSentences,
      fallbackText: this.fallbackText,
      wordsPerMinute: this.wordsPerMinute,
      minDuration: this.minDuration,
      maxDuration: this.maxDuration
    };
  }
  updateParameters(params) {
    if (params.prompt !== void 0) this.prompt = params.prompt;
    if (params.contextVariables !== void 0) this.contextVariables = params.contextVariables;
    if (params.includeVariables !== void 0) this.includeVariables = params.includeVariables;
    if (params.includeInventory !== void 0) this.includeInventory = params.includeInventory;
    if (params.includeHistory !== void 0) this.includeHistory = params.includeHistory;
    if (params.includeCounters !== void 0) this.includeCounters = params.includeCounters;
    if (params.includeChoiceHistory !== void 0) this.includeChoiceHistory = params.includeChoiceHistory;
    if (params.maxSentences !== void 0) this.maxSentences = params.maxSentences;
    if (params.fallbackText !== void 0) this.fallbackText = params.fallbackText;
    if (params.wordsPerMinute !== void 0) this.wordsPerMinute = params.wordsPerMinute;
    if (params.minDuration !== void 0) this.minDuration = normalizeDurationToSeconds(params.minDuration);
    if (params.maxDuration !== void 0) this.maxDuration = normalizeDurationToSeconds(params.maxDuration);
  }
  /**
   * Calculate reading duration in SECONDS from word count + reading speed,
   * using the shared suggestDurationSeconds model (includes the slow-reader
   * safety factor), clamped to the beat's [minDuration, maxDuration] seconds.
   */
  calculateDuration(text) {
    const suggested = suggestDurationSeconds(text, {
      wpm: this.wordsPerMinute,
      floor: this.minDuration
    });
    return Math.max(this.minDuration, Math.min(this.maxDuration, suggested));
  }
  async performAction(context, renderer) {
    const locations = Array.from(this.locations.values());
    const aiService = renderer.getState("aiService");
    if (!aiService || typeof aiService.generateContent !== "function") {
      console.warn(`[AIDurScreenBeat ${this.id}] AI service not configured, using fallback`);
      const processedFallback = this.processText(this.fallbackText, context);
      const duration = this.calculateDuration(processedFallback);
      await renderer.renderDurScreen(processedFallback, durationSecondsToMs(duration), locations);
      return this.getNextBeat(context);
    }
    try {
      const contextHash = this.createContextHash(context);
      const needsRegeneration = !this.generatedText || this.lastContextHash !== contextHash;
      if (needsRegeneration) {
        this.generatedText = null;
        if (renderer.renderLoading) {
          renderer.renderLoading("Thinking...", {
            subMessage: "Generating response",
            spinnerType: "dots"
          });
        }
        this.generatedText = await this.generateText(context, aiService, renderer);
        this.lastContextHash = contextHash;
        if (this._aiSuggestions.length > 0) {
          renderer.setState("aiSuggestions", {
            beatId: this.id,
            beatName: this.name || this.id,
            suggestions: this._aiSuggestions
          });
        }
      }
      if (this.generatedText) {
        context.recordAIOutput({
          beatId: this.id,
          beatName: this.name || this.id,
          beatType: "aiDurScreen",
          text: this.generatedText
        });
      }
      const displayText = this.generatedText || this.fallbackText;
      const processedText = this.processText(displayText, context);
      const duration = this.calculateDuration(processedText);
      console.log(`[AIDurScreenBeat ${this.id}] Displaying for ${duration}ms (${processedText.split(/\s+/).length} words at ${this.wordsPerMinute} WPM)`);
      await renderer.renderDurScreen(processedText, durationSecondsToMs(duration), locations);
      return this.getNextBeat(context);
    } catch (error) {
      console.error(`[AIDurScreenBeat ${this.id}] Error:`, error);
      const processedFallback = this.processText(this.fallbackText, context);
      const duration = this.calculateDuration(processedFallback);
      await renderer.renderDurScreen(processedFallback, durationSecondsToMs(duration), locations);
      return this.getNextBeat(context);
    }
  }
  /**
   * Prefetch AI content in the background so it's cached when the beat executes.
   * Called by StoryEngine when this beat is the next beat to be executed.
   * Does NOT render anything - only generates and caches text.
   */
  async prefetch(context, renderer) {
    try {
      const aiService = renderer.getState("aiService");
      if (!aiService || typeof aiService.generateContent !== "function") return;
      const contextHash = this.createContextHash(context);
      if (this.generatedText && this.lastContextHash === contextHash) return;
      console.log(`[AIDurScreenBeat ${this.id}] Prefetching content...`);
      this.generatedText = await this.generateText(context, aiService, renderer);
      this.lastContextHash = contextHash;
      console.log(`[AIDurScreenBeat ${this.id}] Prefetch complete`);
    } catch (err) {
      console.log(`[AIDurScreenBeat ${this.id}] Prefetch failed (will retry on execute):`, err);
    }
  }
  /**
   * Create a hash of key context values to detect if we need to regenerate
   */
  createContextHash(context) {
    const variables = context.getVariables();
    const counters = context.getCounters();
    const inventory = context.getInventory();
    const visitedBeats = context.getVisitedBeats();
    const keyValues = [];
    keyValues.push(this.prompt);
    if (this.contextVariables && this.contextVariables.length > 0) {
      for (const varName of this.contextVariables) {
        if (variables[varName] !== void 0) {
          keyValues.push(`${varName}:${String(variables[varName])}`);
        }
      }
    } else if (this.includeVariables) {
      for (const [key, value] of Object.entries(variables)) {
        keyValues.push(`${key}:${String(value)}`);
      }
    }
    if (this.includeCounters) {
      for (const [key, value] of Object.entries(counters)) {
        keyValues.push(`counter:${key}:${value}`);
      }
    }
    if (this.includeInventory && inventory.length > 0) {
      keyValues.push(`inventory:${inventory.sort().join(",")}`);
    }
    if (this.includeHistory && visitedBeats.length > 0) {
      keyValues.push(`history:${visitedBeats.join(",")}`);
    }
    if (this.includeChoiceHistory) {
      const choiceHistory = context.getChoiceHistory();
      if (choiceHistory.length > 0) {
        const choiceKeys = choiceHistory.map((c) => `${c.beatId}:${c.choiceText}`);
        keyValues.push(`choices:${choiceKeys.join(",")}`);
      }
    }
    return keyValues.join("|");
  }
  /**
   * Generate text using AI
   */
  async generateText(context, aiService, renderer) {
    const story = context.getStory();
    const contextBuilder = new PlayerContextBuilder(context, story);
    const storyContext = renderer?.getState?.("storyContext") || {};
    const storyTitle = storyContext.title || story?.getMetadata?.()?.title || "Interactive Story";
    const storyAuthor = storyContext.author || story?.getMetadata?.()?.author || "";
    const characters = storyContext.characters || [];
    let storyContextSection = `STORY: "${storyTitle}"`;
    if (storyAuthor) {
      storyContextSection += ` by ${storyAuthor}`;
    }
    if (characters.length > 0) {
      const charDescriptions = characters.filter((c) => c.name && c.name !== "player").map((c) => {
        let desc = c.name;
        if (c.role) desc += ` (${c.role})`;
        if (c.description) desc += `: ${c.description}`;
        return desc;
      }).join("; ");
      if (charDescriptions) {
        storyContextSection += `
CHARACTERS: ${charDescriptions}`;
      }
    }
    let filteredContext;
    if (this.contextVariables && this.contextVariables.length > 0) {
      const variables2 = context.getVariables();
      const filtered = {};
      for (const varName of this.contextVariables) {
        if (variables2[varName] !== void 0) {
          filtered[varName] = variables2[varName];
        }
      }
      filteredContext = `Variables: ${JSON.stringify(filtered)}`;
      if (this.includeInventory || this.includeCounters || this.includeChoiceHistory) {
        filteredContext += "\n" + contextBuilder.buildPromptContext({
          includeVariables: false,
          includeInventory: this.includeInventory,
          includeHistory: this.includeHistory,
          includeCounters: this.includeCounters,
          includeChoiceHistory: this.includeChoiceHistory
        });
      }
    } else {
      filteredContext = contextBuilder.buildPromptContext({
        includeVariables: this.includeVariables,
        includeInventory: this.includeInventory,
        includeHistory: this.includeHistory,
        includeCounters: this.includeCounters,
        includeChoiceHistory: this.includeChoiceHistory
      });
    }
    const variables = context.getVariables();
    const counters = context.getCounters();
    const inventory = context.getInventory();
    const availableData = [];
    if (this.includeVariables && Object.keys(variables).length > 0) {
      availableData.push(`Variables: ${Object.keys(variables).join(", ")}`);
    }
    if (this.includeCounters && Object.keys(counters).length > 0) {
      availableData.push(`Counters: ${Object.keys(counters).join(", ")}`);
    }
    if (this.includeInventory && inventory.length > 0) {
      availableData.push(`Inventory items: ${inventory.join(", ")}`);
    }
    const dataAvailability = availableData.length > 0 ? `AVAILABLE DATA (you may reference these):
${availableData.join("\n")}` : "AVAILABLE DATA: None - no player variables, counters, or inventory items exist yet.";
    const prompt = `Generate a short text response (${this.maxSentences} sentence${this.maxSentences > 1 ? "s" : ""} maximum) for the following situation:

${storyContextSection}

SCENE CONTEXT: ${this.prompt}

PLAYER STATE:
${filteredContext}

${dataAvailability}

REQUIREMENTS:
1. ONLY reference data that exists in PLAYER STATE above
2. Do NOT use placeholders like [Player Name], [Location], etc.
3. Do NOT reference variables, names, or data that are not explicitly listed above
4. Do NOT reference internal beat names, story structure, or technical terms (e.g., "Title Screen", "beat_3", "DialogTree")
5. Use player-friendly language: say "beginning" not "title screen", "conversation" not "dialog tree", "choice" not "movement beat"
6. Write as if speaking directly to the player immersed in the story, not describing the game system
7. If no personalization data is available, write engaging generic text

Return a JSON object with this exact format:
{
  "text": "Your generated text here",
  "suggestions": ["suggestion 1", "suggestion 2"]
}

The "suggestions" array should contain ideas for story variables that would improve personalization (e.g., "Add a 'playerName' variable for personalized greetings"). Leave empty if no suggestions.`;
    console.log(`[AIDurScreenBeat ${this.id}] Generating text...`);
    const response = await aiService.generateContent(prompt, {
      maxTokens: 250,
      // Increased for JSON response
      schema: TEXT_WITH_SUGGESTIONS_SCHEMA
    });
    const rawResponse = typeof response === "string" ? response : "";
    let text = "";
    this._aiSuggestions = [];
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*"text"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        text = parsed.text || "";
        if (Array.isArray(parsed.suggestions)) {
          this._aiSuggestions = parsed.suggestions.filter((s) => typeof s === "string" && s.trim());
        }
        console.log(`[AIDurScreenBeat ${this.id}] Parsed JSON response, suggestions:`, this._aiSuggestions);
      } else {
        text = rawResponse;
      }
    } catch {
      console.warn(`[AIDurScreenBeat ${this.id}] Failed to parse JSON, using raw response`);
      text = rawResponse;
    }
    text = text.replace(/^["']|["']$/g, "").trim();
    text = text.replace(/^#+\s*/gm, "").trim();
    return text || this.fallbackText;
  }
};

// src/beats/BeatRegistry.ts
var _BeatTypeRegistry = class _BeatTypeRegistry {
  constructor() {
    __publicField(this, "beatTypes", /* @__PURE__ */ new Map());
    // Case-insensitive lookup map (lowercase -> canonical type)
    __publicField(this, "typeNormalization", /* @__PURE__ */ new Map());
    // Set of invisible beat type patterns for better fallback behavior
    __publicField(this, "invisibleBeatPatterns", [
      /^set/i,
      // setVariable, setTimer, setGlobal, SetVariable, etc.
      /^condition/i,
      // conditionBeat, conditionCheck, Condition, etc.
      /^random/i,
      // randomTarget, randomChoice, etc.
      /inventory/i,
      // addRemoveInventory, inventory, etc.
      /^add/i,
      // addRemoveInventory, add*, etc.
      /^remove/i,
      // removeInventory, etc.
      /^aiCondition/i
      // aiCondition (AI-powered invisible beat)
    ]);
    this.registerDefaultBeats();
  }
  static getInstance() {
    if (!_BeatTypeRegistry.instance) {
      _BeatTypeRegistry.instance = new _BeatTypeRegistry();
    }
    return _BeatTypeRegistry.instance;
  }
  registerDefaultBeats() {
    this.registerBeatType("titleScreen", TitleScreenBeat);
    this.registerBeatType("infoText", InfoTextBeat);
    this.registerBeatType("explanation", ExplanationBeat);
    this.registerBeatType("introText", InfoTextBeat);
    this.registerBeatType("dialogTree", DialogTreeBeat);
    this.registerBeatType("conversationChoice", ConversationChoiceBeat);
    this.registerBeatType("multiChoice", MultiChoiceBeat);
    this.registerBeatType("chooseCharacter", ChooseCharacterBeat);
    this.registerBeatType("movementChoice", MovementChoiceBeat);
    this.registerBeatType("pickProp", PickPropBeat);
    this.registerBeatType("videoBeat", VideoBeat);
    this.registerBeatType("endScreen", EndScreenBeat);
    this.registerBeatType("durScreen", DurScreenBeat);
    this.registerBeatType("inputText", InputTextBeat);
    this.registerBeatType("inputImage", InputImageBeat);
    this.registerBeatType("hyperText", HyperTextBeat);
    this.registerBeatType("keypad", KeypadBeat);
    this.registerBeatType("qrScan", QRScanBeat);
    this.registerBeatType("webView", WebViewBeat);
    this.registerBeatType("arBeat", ARBeat);
    this.registerBeatType("panorama", PanoramaBeat);
    this.registerBeatType("setVariable", SetVariableBeat);
    this.registerBeatType("setGlobal", SetVariableBeat);
    this.registerBeatType("setCounter", SetVariableBeat);
    this.registerBeatType("counter", SetVariableBeat);
    this.registerBeatType("variable", SetVariableBeat);
    this.registerBeatType("conditionBeat", ConditionBeat);
    this.registerBeatType("conditionCheck", ConditionBeat);
    this.registerBeatType("condition", ConditionBeat);
    this.registerBeatType("randomTarget", RandomTargetBeat);
    this.registerBeatType("setGpsLocation", SetGpsLocationBeat);
    this.registerBeatType("setTimer", SetTimerBeat);
    this.registerBeatType("addRemoveInventory", AddRemoveInventoryBeat);
    this.registerBeatType("updateAffect", UpdateAffectBeat);
    this.registerBeatType("gpsLocation", GpsLocationBeat);
    this.registerBeatType("indoorLocation", IndoorLocationBeat);
    this.registerBeatType("addInventory", AddRemoveInventoryBeat);
    this.registerBeatType("removeInventory", AddRemoveInventoryBeat);
    this.registerBeatType("onlineContent", OnlineContentBeat);
    this.registerBeatType("aiCondition", AIConditionBeat);
    this.registerBeatType("aiDialogTree", AIDialogTreeBeat);
    this.registerBeatType("aiSummary", AISummaryBeat);
    this.registerBeatType("aiInfoText", AIInfoTextBeat);
    this.registerBeatType("aiDurScreen", AIDurScreenBeat);
    this.registerBeatType("aiConversation", AIConversationBeat);
  }
  registerBeatType(type, constructor) {
    this.beatTypes.set(type, constructor);
    this.typeNormalization.set(type.toLowerCase(), type);
  }
  /**
   * Check if a type looks like an invisible beat based on naming patterns
   */
  looksLikeInvisibleBeat(type) {
    return this.invisibleBeatPatterns.some((pattern) => pattern.test(type));
  }
  createBeat(type, config) {
    let BeatClass = this.beatTypes.get(type);
    if (!BeatClass) {
      const normalizedType = this.typeNormalization.get(type.toLowerCase());
      if (normalizedType) {
        BeatClass = this.beatTypes.get(normalizedType);
        console.log(`[BeatRegistry] Normalized beat type "${type}" -> "${normalizedType}"`);
      }
    }
    if (!BeatClass) {
      if (this.looksLikeInvisibleBeat(type)) {
        console.warn(`[BeatRegistry] Unknown invisible beat type: "${type}", falling back to SetVariableBeat (no-op)`);
        return new SetVariableBeat({
          ...config,
          type: "setVariable",
          parameters: {
            ...config.parameters,
            variable: "_unknownBeat_" + type,
            value: true,
            type: "variable"
          }
        });
      }
      console.warn(`[BeatRegistry] Unknown visible beat type: "${type}", falling back to InfoTextBeat`);
      return new InfoTextBeat(config);
    }
    return new BeatClass(config);
  }
  getBeatTypes() {
    return Array.from(this.beatTypes.keys());
  }
  hasBeatType(type) {
    return this.beatTypes.has(type);
  }
};
__publicField(_BeatTypeRegistry, "instance");
var BeatTypeRegistry = _BeatTypeRegistry;

// slopling-entry.ts
var ASAPS_CORE_VERSION = "2.0.0 (ASAPS Modern v0.9.133)";
function settingsVariables(vars) {
  const t = (v) => typeof v === "boolean" ? "boolean" : typeof v === "number" ? "number" : "string";
  return (vars || []).filter((v) => v && typeof v.name === "string" && v.name.trim()).map((v) => ({
    name: v.name.trim(),
    type: t(v.initialValue),
    defaultValue: v.initialValue ?? (t(v.initialValue) === "boolean" ? false : t(v.initialValue) === "number" ? 0 : ""),
    description: typeof v.description === "string" ? v.description : void 0
  }));
}
function storyFromGeneratedJson(data) {
  const storyData = data.project?.story || data.story || data.content || data;
  const story = new Story({ title: storyData.metadata?.title || "Untitled Story", author: storyData.metadata?.author, firstBeatId: storyData.metadata?.firstBeatId });
  const registry = BeatTypeRegistry.getInstance();
  for (const b of storyData.beats || []) {
    const beat = registry.createBeat(b.type, {
      id: b.id,
      name: b.name || b.id,
      type: b.type,
      cluster: b.cluster,
      transition: b.transition,
      sound: b.sound,
      locations: b.locations || [],
      connections: b.connections || [],
      defaultTarget: b.defaultTarget,
      x: b.x,
      y: b.y,
      parameters: b.parameters || {}
    });
    if (b.notes) beat.notes = b.notes;
    if (b.speaker) beat.speaker = b.speaker;
    if (b.showSpeaker != null) beat.showSpeaker = b.showSpeaker;
    story.addBeat(beat);
  }
  const all = story.getAllBeats();
  if (!all.some((b) => b.id === storyData.metadata?.firstBeatId)) {
    const t = all.find((b) => b.type === "titleScreen");
    story.setFirstBeatId(t ? t.id : all[0].id);
  }
  story.setSettings({ ...storyData.settings || {}, variables: settingsVariables(storyData.variables), roles: storyData.roles || [] });
  if (storyData.environment) story.setEnvironment(storyData.environment);
  if (storyData.characters) story.setCharacters(storyData.characters);
  return story;
}
export {
  ASAPS_CORE_VERSION,
  BeatTypeRegistry,
  Story,
  StoryEngine,
  storyFromGeneratedJson
};
