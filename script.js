document.querySelectorAll(".reveal-card").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.dataset.answer || "";
    const note = button.dataset.note || "";
    const answerSlot = button.querySelector(".answer");
    const showing = button.classList.toggle("is-revealed");
    answerSlot.textContent = showing ? (note ? answer + " — " + note : answer) : "Tap to reveal";
  });
});
