const dom = document.body;
const observer = new MutationObserver(onChanged);

function updateFonts() {
  dom.style.fontFamily = window
    .getComputedStyle(dom)
    .fontFamily.replace('"Color Emoji", ', "");
  // console.log(
  //   "[emojifix] Font updated. Current font-family: ",
  //   dom.style.fontFamily
  // );
}

function onChanged(mutations, _) {
  for (var mutation of mutations) {
    if (mutation.type === "attributes") {
      updateFonts();
    }
  }
}

function onload() {
  updateFonts();
  observer.observe(dom, { attributeFilter: ["style"] });
  setInterval(() => {
    observer.disconnect();
    updateFonts();
    observer.observe(dom, { attributeFilter: ["style"] });
  }, 1000);
}
onload();
