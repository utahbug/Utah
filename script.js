const htmlEscapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => htmlEscapeMap[character]);
}

function addImageFallback(slot) {
  const image = slot.querySelector("img");
  if (!image) return;
  image.addEventListener("error", () => {
    const media = image.closest(".state-media");
    if (media) media.textContent = "Image unavailable";
  }, { once: true });
}

document.querySelectorAll(".reveal-card").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.dataset.answer || "";
    const note = button.dataset.note || "";
    const answerSlot = button.querySelector(".answer");
    const showing = button.classList.toggle("is-revealed");
    answerSlot.textContent = showing ? (note ? answer + " - " + note : answer) : "Tap to reveal";
  });
});

function resetStateCard(card) {
  const slot = card.querySelector(".state-stage");
  const surface = card.querySelector(".state-cycle-surface");
  card.dataset.stage = "0";
  card.classList.remove("is-active", "stage-capital", "stage-map", "stage-flag", "stage-facts", "stage-all");
  if (slot) slot.textContent = "";
  if (surface) surface.setAttribute("aria-label", "Show " + (card.dataset.name || "state") + " details");
}

function renderStateStage(card, stage) {
  if (stage === 0) {
    resetStateCard(card);
    return;
  }

  const slot = card.querySelector(".state-stage");
  const surface = card.querySelector(".state-cycle-surface");
  if (!slot) return;

  const name = card.dataset.name || "State";
  const capital = card.dataset.capital || "";
  const area = card.dataset.area || "";
  const population = card.dataset.population || "";
  const map = card.dataset.map || "";
  const flag = card.dataset.flag || "";

  card.dataset.stage = String(stage);
  card.classList.remove("stage-capital", "stage-map", "stage-flag", "stage-facts", "stage-all");
  card.classList.add("is-active");

  if (stage === 1) {
    card.classList.add("stage-capital");
    slot.innerHTML = '<span class="cycle-label">Capital</span><strong>' + escapeHtml(capital) + '</strong>';
  }

  if (stage === 2) {
    card.classList.add("stage-map");
    slot.innerHTML = '<span class="cycle-label">Map</span><span class="state-media"><img src="' + escapeHtml(map) + '" alt="' + escapeHtml(name) + ' map" loading="lazy"></span>';
    addImageFallback(slot);
  }

  if (stage === 3) {
    card.classList.add("stage-flag");
    slot.innerHTML = '<span class="cycle-label">Flag</span><span class="state-media"><img src="' + escapeHtml(flag) + '" alt="' + escapeHtml(name) + ' flag" loading="lazy"></span>';
    addImageFallback(slot);
  }

  if (stage === 4) {
    card.classList.add("stage-facts");
    slot.innerHTML = '<span class="cycle-label">Area + population</span><span class="state-facts"><span>Area: ' + escapeHtml(area) + ' sq mi</span><span>2020 population: ' + escapeHtml(population) + '</span></span>';
  }

  if (stage === 5) {
    card.classList.add("stage-all");
    slot.innerHTML = '<span class="cycle-label">All together</span><ul class="state-bullets"><li><strong>Capital:</strong> ' + escapeHtml(capital) + '</li><li><strong>Map:</strong> state location view</li><li><strong>Flag:</strong> state flag view</li><li><strong>Area:</strong> ' + escapeHtml(area) + ' sq mi</li><li><strong>2020 population:</strong> ' + escapeHtml(population) + '</li></ul>';
  }

  if (surface) surface.setAttribute("aria-label", "Show next " + name + " detail");
}

document.querySelectorAll(".state-cycle-card").forEach((card) => {
  const surface = card.querySelector(".state-cycle-surface");
  const reset = card.querySelector(".state-card-reset");

  if (surface) {
    surface.addEventListener("click", () => {
      const current = Number(card.dataset.stage || "0");
      const next = current >= 4 ? 1 : current + 1;
      renderStateStage(card, next);
    });
  }

  if (reset) {
    reset.addEventListener("click", () => {
      resetStateCard(card);
    });
  }
});

const revealStateGrid = document.querySelector(".reveal-state-grid");
if (revealStateGrid) {
  revealStateGrid.addEventListener("click", () => {
    document.querySelectorAll(".state-cycle-card").forEach((card) => renderStateStage(card, 5));
  });
}

const resetStateGrid = document.querySelector(".reset-state-grid");
if (resetStateGrid) {
  resetStateGrid.addEventListener("click", () => {
    document.querySelectorAll(".state-cycle-card").forEach(resetStateCard);
  });
}

function resetDistrictCard(card) {
  const slot = card.querySelector(".district-stage");
  const surface = card.querySelector(".district-cycle-surface");
  card.dataset.stage = "0";
  card.classList.remove("is-active", "stage-coverage", "stage-verification", "stage-all");
  if (slot) slot.textContent = "";
  if (surface) surface.setAttribute("aria-label", "Show " + (card.dataset.label || "district") + " details");
}

function renderDistrictStage(card, stage) {
  if (stage === 0) {
    resetDistrictCard(card);
    return;
  }

  const slot = card.querySelector(".district-stage");
  const surface = card.querySelector(".district-cycle-surface");
  if (!slot) return;

  const label = card.dataset.label || "District";
  const answer = card.dataset.answer || "";
  const note = card.dataset.note || "";

  card.dataset.stage = String(stage);
  card.classList.remove("stage-coverage", "stage-verification", "stage-all");
  card.classList.add("is-active");

  if (stage === 1) {
    card.classList.add("stage-coverage");
    slot.innerHTML = '<span class="district-label">Coverage note</span><strong>' + escapeHtml(answer) + '</strong>';
  }

  if (stage === 2) {
    card.classList.add("stage-verification");
    slot.innerHTML = '<span class="district-label">Verification note</span><span>' + escapeHtml(note) + '</span>';
  }

  if (stage === 3) {
    card.classList.add("stage-all");
    slot.innerHTML = '<span class="district-label">All together</span><ul class="district-bullets"><li><strong>Coverage:</strong> ' + escapeHtml(answer) + '</li><li><strong>Note:</strong> ' + escapeHtml(note) + '</li></ul>';
  }

  if (surface) surface.setAttribute("aria-label", "Show next " + label + " detail");
}

function districtCardsForGroup(group) {
  return document.querySelectorAll('.district-cycle-card[data-district-group="' + group + '"]');
}

document.querySelectorAll(".district-cycle-card").forEach((card) => {
  const surface = card.querySelector(".district-cycle-surface");
  const reset = card.querySelector(".district-card-reset");

  if (surface) {
    surface.addEventListener("click", () => {
      const current = Number(card.dataset.stage || "0");
      const next = current >= 2 ? 1 : current + 1;
      renderDistrictStage(card, next);
    });
  }

  if (reset) {
    reset.addEventListener("click", () => {
      resetDistrictCard(card);
    });
  }
});

document.querySelectorAll(".district-reveal-all").forEach((button) => {
  button.addEventListener("click", () => {
    districtCardsForGroup(button.dataset.districtGroup || "").forEach((card) => renderDistrictStage(card, 3));
  });
});

document.querySelectorAll(".district-reset-all").forEach((button) => {
  button.addEventListener("click", () => {
    districtCardsForGroup(button.dataset.districtGroup || "").forEach(resetDistrictCard);
  });
});
