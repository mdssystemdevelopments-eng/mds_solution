/** Aguarda recursos críticos antes de esconder o loader. */

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function waitMs(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function doubleFrame() {
  return new Promise<void>((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );
}

function waitForWindowLoad() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

async function waitForFonts(maxMs: number) {
  try {
    const fonts = document.fonts;
    if (!fonts?.ready) return;
    await Promise.race([fonts.ready, waitMs(maxMs)]);
  } catch {
    /* ignore */
  }
}

function waitForVideo(video: HTMLVideoElement | null, timeoutMs: number) {
  if (!video) return Promise.resolve();
  if (video.readyState >= 3 && !video.error) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const finish = () => {
      cleanup();
      resolve();
    };
    const cleanup = () => {
      video.removeEventListener("canplaythrough", finish);
      video.removeEventListener("loadeddata", finish);
      clearTimeout(timer);
    };
    video.addEventListener("canplaythrough", finish, { once: true });
    video.addEventListener("loadeddata", finish, { once: true });
    const timer = setTimeout(finish, timeoutMs);
    if (video.error) finish();
  });
}

async function waitForImages(root: ParentNode, timeoutMs: number) {
  const imgs = Array.from(root.querySelectorAll("img")).filter(
    (img) => img.getBoundingClientRect().width > 0 || img.hasAttribute("src"),
  );
  if (!imgs.length) return;

  await Promise.race([
    Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalHeight > 0) {
              resolve();
              return;
            }
            const done = () => {
              img.removeEventListener("load", done);
              img.removeEventListener("error", done);
              resolve();
            };
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          }),
      ),
    ).then(() => undefined),
    waitMs(timeoutMs),
  ]);
}

/** Vídeos de fundo + logo (quando já estiverem no DOM). */
export function getCriticalVideos() {
  return {
    wallpaper: document.querySelector<HTMLVideoElement>(".video-bg__el"),
    logo: document.querySelector<HTMLVideoElement>(".hero__logo-video"),
  };
}

export type WaitForPageReadyOptions = {
  minMs?: number;
  maxMs?: number;
  /** Primeira carga: espera window.load */
  includeWindowLoad?: boolean;
  /** Espera wallpaper + logo (se existirem) */
  waitVideos?: boolean;
  /** Espera imagens dentro de main */
  waitImages?: boolean;
};

export async function waitForPageReady(opts: WaitForPageReadyOptions = {}) {
  const {
    minMs = 500,
    maxMs = 20000,
    includeWindowLoad = true,
    waitVideos = true,
    waitImages = true,
  } = opts;

  const start = now();

  const tasks: Promise<void>[] = [waitForFonts(4000)];

  if (includeWindowLoad) tasks.push(waitForWindowLoad());

  if (waitImages) {
    const main = document.querySelector("main") ?? document.body;
    tasks.push(waitForImages(main, 12000));
  }

  await Promise.race([Promise.all(tasks), waitMs(maxMs)]);

  if (waitVideos) {
    const { wallpaper, logo } = getCriticalVideos();
    await Promise.race([
      Promise.all([
        waitForVideo(wallpaper, 15000),
        waitForVideo(logo, 10000),
      ]),
      waitMs(maxMs),
    ]);
  }

  await doubleFrame();

  const elapsed = now() - start;
  if (elapsed < minMs) await waitMs(minMs - elapsed);
}
