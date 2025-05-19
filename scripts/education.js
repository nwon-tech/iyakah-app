const imgListOne = document.querySelector(".img-list");

let imgBoxList = Array.prototype.slice.call(
  document.querySelectorAll(".img-list .img-box")
);
const imgBoxCount = imgBoxList.length;
const root = document.documentElement;
const btnGroup = document.querySelector(".btn-group");
const lastBtn = document.querySelector(".last");
const nextBtn = document.querySelector(".next");
const lastImgBox = document.getElementById("last-img-box");

// get value of --post-spacing and --post-size
const postSpacing = Number(
  getComputedStyle(root).getPropertyValue("--post-spacing").replace("vw", "")
);
const postSize = Number(
  getComputedStyle(root).getPropertyValue("--post-size").replace("vw", "")
);

// get width of img-list
let imgListLength = (postSize + postSpacing) * imgBoxCount;
console.log(imgListLength);
// get width of img-listimg-box
const imgBoxLength = postSize + postSpacing;

let index = 0;
let indexOne = 1;
let timer = null;
let animationTime = 0.5;

imgBoxList.unshift(imgBoxList.pop());
imgListOne.style.transition = animationTime + "s ease";
// button
setTimeout(function () {
  btnGroup.style.opacity = "1";
  btnGroup.style.bottom = "5%";
}, animationTime * 1000);

function cilckFun(flag) {
  // next
  if (flag == "next") {
    index--;
    console.log(index);
    // move on left
    imgListOne.style.left = imgBoxLength * index + "vw";
    setTimeout(function () {
      imgListOne.style.transition = "none";
      // reset
      if (Math.abs(index) == imgBoxCount) {
        index = 0;
        imgListOne.style.left = 0;
        imgBoxList.forEach((item) => {
          if (item.id == "last-img-box") {
            item.style.transform = `translateX(-160.68vw)`;
          } else {
            item.style.transform = "none";
          }
        });
      } else {
        if (imgBoxList[0].id == "last-img-box") {
          lastImgBox.style.transition = "none";
          lastImgBox.style.transform = "translateX(0px)";
        } else if (index >= 0) {
          imgBoxList[0].style.transform = "none";
        } else {
          // the left picture move end
          imgBoxList[0].style.transform = "translateX(160.68vw)";
        }
      }

      imgBoxList.push(imgBoxList.shift());
    }, animationTime * 1000);
  } else {
    // last
    index++;
    console.log(index);
    // move the rigtt one front
    imgBoxList.unshift(imgBoxList.pop());

    if (imgBoxList[0].id == "last-img-box" && index != 0) {
      imgBoxList[0].style.transform = "translateX(-321.36vw)";
    } else if (index < 0) {
      // next = back
      imgBoxList[0].style.transform = "none";
    } else {
      imgBoxList[0].style.transform = "translateX(-160.68vw)";
    }
    imgListOne.style.left = imgBoxLength * index + "vw";
    lastImgBox.style.transition = "none";
    // reset
    if (Math.abs(index) == imgBoxCount) {
      index = 0;
      setTimeout(function () {
        imgListOne.style.transition = "none";
        imgListOne.style.left = 0;
        imgBoxList.forEach((item) => {
          if (item.id == "last-img-box") {
            item.style.transform = "translateX(-160.68vw)";
          } else {
            item.style.transform = "none";
          }
        });
      }, animationTime * 1000);
    }
  }
  imgListOne.style.transition = animationTime + "s ease";
}

//Throttling function
function throttle(fn, delay) {
  return function () {
    if (timer) {
      return;
    }
    fn.apply(this, arguments);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}

nextBtn.onclick = throttle(() => cilckFun("next"), animationTime * 1000);
lastBtn.onclick = throttle(() => cilckFun("last"), animationTime * 1000);

function showContent(contentId) {
  // Hide all content sections (new content)
  const contentSections = document.querySelectorAll(
    ".educational-page .newContent"
  );
  contentSections.forEach((content) => {
    content.style.display = "none"; // Hide each content
  });

  // Show the relevant content (the clicked content)
  const contentToShow = document.getElementById(contentId);
  if (contentToShow) {
    contentToShow.style.display = "block"; // Display the selected content
  }

  const btnGroup = document.querySelector(".btn-group");
  if (btnGroup) {
    btnGroup.style.display = "none"; // Hide the button group (carousel arrows)
  }

  // Optionally, hide the img-list (carousel items)
  const imgList = document.getElementById("banner");
  imgList.style.display = "none"; // Hide the carousel

  // Show the navigation bar (if required)
  const navBar = document.getElementById("navBar");
  if (navBar) {
    navBar.style.display = "flex"; // Make the nav bar visible
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let chosenSlideNumber = 1;
  let offset = 0;
  let barOffset = 0;
  let intervalID;

  startSlide();

  // get all content  of the whole page
  const pageIds = ["content1", "content2", "content3", "content4"];

  pageIds.forEach((pageId) => {
    const slideSection = document.getElementById(pageId);

    if (slideSection) {
      // get button
      const drawerBtns = Array.from(
        slideSection.querySelectorAll(".drawer-btn")
      );
      drawerBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => {
          clearInterval(intervalID); // clear timer
          startSlide(); // reset

          // get slide number
          const slideNumber = parseInt(
            btn.querySelector(".drawer-head").textContent
          );
          slideTo(slideNumber, pageId); // change by click
        });
      });

      // mouse enter/exit
      slideSection.addEventListener("mouseenter", () => {
        clearInterval(intervalID);
      });

      slideSection.addEventListener("mouseleave", () => {
        startSlide(); // reset
      });
    }
  });

  // change to contend ID slide
  function slideTo(slideNumber, pageId) {
    drawerboxToggle(slideNumber, pageId);
    drawerbtnToggle(slideNumber, pageId);

    // update the offset
    let previousSlideNumber = chosenSlideNumber;
    chosenSlideNumber = slideNumber;
    offset += (chosenSlideNumber - previousSlideNumber) * -100;
    barOffset += (chosenSlideNumber - previousSlideNumber) * 100;
    barSlide(barOffset); // move bar

    // get all slides
    const slides = document.querySelectorAll(`#${pageId} .card`);
    Array.from(slides).forEach((slide) => {
      slide.style.transform = `translateY(${offset}%)`;
    });
  }

  function drawerboxToggle(drawerboxNumber, pageId) {
    const drawerboxes = document.querySelectorAll(`#${pageId} .drawerbox`);
    drawerboxes.forEach((box, index) => {
      if (index === drawerboxNumber - 1) {
        box.classList.add("active");
      } else {
        box.classList.remove("active");
      }
    });
  }

  function drawerbtnToggle(drawerBtnNumber, pageId) {
    const drawerBtns = document.querySelectorAll(`#${pageId} .drawer-btn`);
    drawerBtns.forEach((btn, index) => {
      if (index === drawerBtnNumber - 1) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function barSlide(barOffset) {
    const bar = document.querySelector("#bar");
    bar.style.transform = `translateY(${barOffset}%)`;
  }

  function startSlide() {
    intervalID = setInterval(() => {
      slideTo((chosenSlideNumber % 4) + 1, "content1");
    }, 100000); // 10 min auto switch
  }
});
