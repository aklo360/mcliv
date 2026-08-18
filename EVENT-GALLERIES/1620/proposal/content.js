window.EVENT_1620 = Object.freeze({
  title: "1620",
  subtitle: "A group exhibition of 18 artists presented by MCLIV",
  statement:
    "Artists from all walks of life come together in one cohesive exhibition. Every work shares the same 16 × 20-inch format; each artist brings a distinct point of view.",
  date: "September 16",
  dateShort: "SEP 16",
  time: "6:00PM ET",
  venue: "Port Authority, NYC",
  venueDetail: "NYC Culture Club",
  venuePublicName: "The Port Authority Midtown Bus Terminal",
  venueFlyerName: "Port Authority",
  venueAddress: "625 8th Ave & W40th St.",
  venueFloor: "South Wing · Main Floor",
  venueCity: "New York, NY",
  afterPartyVenue: "Shinsen",
  afterPartyTime: "10PM",
  afterPartyAddress: "44 Bowery · New York, NY 10013",
  workFormat: "16 × 20 in.",
  artistCount: 18,
  wallCount: 3,
  worksPerWall: 9,
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
