const burgerIcon = document.querySelector(".burger-icon");
const mobileNavigation = document.querySelector(".nav-mobile");
const mobileNavigationLinks = document.querySelectorAll(".nav-mobile__link");
const urlInput = document.querySelector(".shorten__input");
const shortenItBtn = document.querySelector(".shorten__btn");

let longLinks = [];
let longLinksTextContent = [];

const validateUrl = () => {
  const errorLine = document.querySelector(".shorten__error");
  const validRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

  if (urlInput.value.match(validRegex)) {
    errorLine.textContent = "";
    urlInput.classList.remove("shorten__input--error");
    return true;
  } else {
    errorLine.textContent = "Plase add a correct link";
    urlInput.classList.add("shorten__input--error");
    return false;
  }
};

const addDotsToLink = (link, limit) =>
  link.length > limit ? link.substr(0, limit - 1).trim() + "..." : link;

const setCharacterLimit = () => {
  const windowWidth = window.innerWidth;
  let characterLimit;

  if (windowWidth < 576) {
    characterLimit = 25;
  } else if (windowWidth < 1200) {
    characterLimit = 45;
  } else {
    characterLimit = 70;
  }

  return characterLimit;
};

const createHtmlElement = (htmlElement, className) => {
  const element = document.createElement(htmlElement);
  element.classList.add(className);
  return element;
};

const copyToClipboard = (e) => {
  const copyBtn = e.target;
  const shortenCardBox = copyBtn.closest(".shorten-card__box");
  const shortLink = shortenCardBox.querySelector(".shorten-card__short-link");
  navigator.clipboard.writeText(shortLink.textContent);
  copyBtn.textContent = "Copied";
  copyBtn.classList.add("shorten-card__copy-btn--copied");
};

const createShortenUrlCard = (longLink, shortLink) => {
  const shortenCardsBox = document.querySelector(".shorten-cards-box");
  const shortenCard = createHtmlElement("div", "shorten-card");
  const cardLongLink = createHtmlElement("p", "shorten-card__long-link");
  const line = createHtmlElement("div", "shorten-card__line");
  const shortenCardBox = createHtmlElement("div", "shorten-card__box");
  const cardShortLink = createHtmlElement("p", "shorten-card__short-link");
  const copyBtn = createHtmlElement("button", "shorten-card__copy-btn");

  cardLongLink.textContent = longLink;
  cardShortLink.textContent = shortLink;
  copyBtn.textContent = "Copy";

  shortenCardBox.append(cardShortLink, copyBtn);
  shortenCard.append(cardLongLink, line, shortenCardBox);
  shortenCardsBox.append(shortenCard);
  longLinks.push(cardLongLink);
  longLinksTextContent.push(cardLongLink.textContent);

  copyBtn.addEventListener("click", copyToClipboard);
};

const fetchData = async function () {
  try {
    const response = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${urlInput.value}`
    );
    const data = await response.json();
    const longLink = addDotsToLink(
      data.result.original_link,
      setCharacterLimit()
    );
    const shortLink = data.result.short_link;

    if (data) {
      createShortenUrlCard(longLink, shortLink);
      urlInput.value = "";
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
  }
};

const shortenLink = (e) => {
  if (e.keyCode === 13 && validateUrl()) {
    fetchData();
  }
};

mobileNavigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileNavigation.classList.remove("nav-mobile--active");
  });
});

shortenItBtn.addEventListener("click", () => {
  if (validateUrl()) fetchData();
});

window.addEventListener("resize", () => {
  longLinks.forEach((link, index) => {
    link.textContent = addDotsToLink(
      longLinksTextContent[index],
      setCharacterLimit()
    );
  });
});

burgerIcon.addEventListener("click", () => {
  mobileNavigation.classList.toggle("nav-mobile--active");
});

urlInput.addEventListener("keydown", shortenLink);
