export const displayToast = async (message: string) => {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);
  await toast.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 200,
    endDelay: 3000,
    fill: "forwards",
  }).finished;
  await toast.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 150,
    fill: "forwards",
  }).finished;
  toast.remove();
};
