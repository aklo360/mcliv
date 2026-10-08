window.EVENT_1620 = Object.freeze({
  title: "1620",
  subtitle: "A group exhibition of 18 artists presented by MCLIV",
  statement:
    "Artists from all walks of life come together in one cohesive exhibition. Every work shares the same 16 × 20-inch format; each artist brings a distinct point of view.",
  date: "September 16",
  dateShort: "SEP 16",
  time: "6:00PM ET",
  timeShort: "6PM",
  venue: "Port Authority, NYC",
  venueDetail: "NYC Culture Club",
  venuePublicName: "The Port Authority Midtown Bus Terminal",
  venueFlyerName: "Port Authority",
  venueAddress: "625 8th Ave & W40th St.",
  venueFloor: "South Wing · Main Floor",
  venueCity: "New York, NY",
  afterPartyVenue: "Shinsen",
  afterPartyTime: "9PM",
  afterPartyAddress: "44 Bowery · New York, NY 10013",
  workFormat: "16 × 20 in.",
  artistCount: 18,
  wallCount: 3,
  worksPerWall: 6,
  artists: [
    "Madsteez",
    "Trouble Andrew",
    "Hoxxoh",
    "Jerami Dean Goodwin",
    "Cavier Coleman",
    "Gianni Lee",
    "Steph Costello",
    "John Black",
    "Smurfo",
    "Jason Rohlf",
    "King Saladeen",
    "AKLO",
    "Lola Jiblazee",
    "Gazoo ToTheMoon",
    "NotYourMuse",
    "Keya Tama",
    "Kevin Cincotta",
    "Esteban",
  ],
  rosterSlotsOpen: 0,
});

function hydrate1620() {
  const event = window.EVENT_1620;

  document.querySelectorAll("[data-event]").forEach((node) => {
    const value = event[node.dataset.event];
    if (value !== undefined) node.textContent = value;
  });

  document.querySelectorAll("[data-artist-list]").forEach((list) => {
    list.replaceChildren(
      ...event.artists.map((artist, index) => {
        const item = document.createElement("li");
        item.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${artist}`;
        return item;
      }),
    );
  });

  document.querySelectorAll("[data-open-roster]").forEach((node) => {
    if (event.rosterSlotsOpen === 0) {
      node.remove();
      return;
    }

    node.textContent = `+ ${event.rosterSlotsOpen} artists to be announced`;
  });

  document.querySelectorAll("[data-work-grid]").forEach((grid) => {
    const count = Number(grid.dataset.workGrid || event.worksPerWall);
    grid.replaceChildren(
      ...Array.from({length: count}, (_, index) => {
        const work = document.createElement("span");
        work.setAttribute("aria-label", `Artwork position ${index + 1}`);
        return work;
      }),
    );
  });

  const requestedPage = Number(
    new URLSearchParams(window.location.search).get("page"),
  );
  if (requestedPage > 0) {
    document.body.classList.add("single-page");
    document
      .querySelector(`.slide:nth-of-type(${requestedPage})`)
      ?.classList.add("page-active");
  }

  initializeResponsiveDeck();
  alignFinalFlyerType();
}

async function alignFinalFlyerType() {
  const title = document.querySelector(".cover-caption h1");
  const label = document.querySelector(".exhibition-label");
  const centered = document.querySelector("[data-center-ink]");
  if (!title || (!label && !centered)) return;

  await document.fonts.ready;
  const context = document.createElement("canvas").getContext("2d");
  const measure = (node) => {
    const style = getComputedStyle(node);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.letterSpacing = style.letterSpacing;
    const text = node.textContent.trim();
    const metrics = context.measureText(style.textTransform === "uppercase" ? text.toUpperCase() : text);
    return {
      width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      center: (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) / 2,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
      descent: metrics.actualBoundingBoxDescent,
    };
  };

  if (centered) {
    const date = centered.querySelector(".date-time h2");
    const time = centered.querySelector(".date-time .time");
    // Numerals and capitals have different visible heights at the same font size.
    if (date && time) {
      time.style.fontSize = "";
      time.style.top = "0px";
      for (let i = 0; i < 6; i++) {
        const ratio = measure(date).height / measure(time).height;
        if (Math.abs(measure(date).height - measure(time).height) < 0.1) break;
        time.style.fontSize = `${parseFloat(getComputedStyle(time).fontSize) * ratio}px`;
      }
      time.style.top = `${measure(date).descent - measure(time).descent}px`;
    }
    const bounds = centered.getBoundingClientRect();
    const axis = (bounds.left + bounds.right) / 2;
    for (const node of centered.querySelectorAll("[data-ink-center]")) {
      node.style.left = "0px";
      const parts = node.matches(".date-time") ? [...node.children] : [node];
      const ink = parts.map((part) => {
        const range = document.createRange();
        range.selectNodeContents(part);
        const metrics = measure(part);
        const center = range.getBoundingClientRect().left + metrics.center;
        return {left: center - metrics.width / 2, right: center + metrics.width / 2};
      });
      const inkCenter = (Math.min(...ink.map((part) => part.left)) + Math.max(...ink.map((part) => part.right))) / 2;
      node.style.left = `${axis - inkCenter}px`;
    }
    document.documentElement.dataset.finalFlyerReady = "true";
    return;
  }

  const target = measure(title).width;
  for (let i = 0; i < 6; i++) {
    const width = measure(label).width;
    if (Math.abs(width - target) < 0.1) break;
    label.style.fontSize = `${parseFloat(getComputedStyle(label).fontSize) * target / width}px`;
  }
  if (Math.abs(measure(label).width - target) > 0.2) {
    throw new Error("The exhibition label could not match the title width");
  }
  // Match the visible letter edges, including the title's tight tracking.
  // Font size changes naturally; no glyph stretching or transforms are used.
  for (const node of [title, label]) {
    node.style.left = `${node.getBoundingClientRect().width / 2 - measure(node).center}px`;
  }
  document.documentElement.dataset.finalFlyerReady = "true";
}

function initializeResponsiveDeck() {
  const slides = [...document.querySelectorAll(".slide")];

  slides.forEach((slide) => {
    if (slide.parentElement?.classList.contains("slide-frame")) return;

    const frame = document.createElement("div");
    frame.className = "slide-frame";
    slide.before(frame);
    frame.append(slide);
  });

  const fitSlidesToViewport = () => {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.visualViewport?.height ?? document.documentElement.clientHeight;
    const safeWidth = Math.max(viewportWidth - 32, 320);
    const safeHeight = Math.max(viewportHeight - 32, 180);
    const scale = Math.min(safeWidth / 1920, safeHeight / 1080, 1);
    document.documentElement.style.setProperty("--slide-scale", String(scale));
  };

  fitSlidesToViewport();
  window.addEventListener("resize", fitSlidesToViewport, {passive: true});
  window.visualViewport?.addEventListener("resize", fitSlidesToViewport, {passive: true});
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hydrate1620);
} else {
  hydrate1620();
}
