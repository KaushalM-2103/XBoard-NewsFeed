topics = ["Science", "Gaming", "Technology"];

const accordionElement = document.querySelector("#newsAccordion");

async function newsFeedURL(URL) {
  // CONVERT RSS TO JSON using url
  const convertedURL = `https://api.rss2json.com/v1/api.json?rss_url=${URL}`;

  try {
    // fetch the news feed through URL
    const newsResponse = await fetch(convertedURL);

    // check if response is ok --IT RETURNs TRUE
    if (newsResponse.ok) {
      const news = await newsResponse.json();
      //return items if response is true
      return news.items;
    }
    if (newsResponse.ok) {
      const news = await newsResponse.json();
      //return items if response is true
      return news.feed;
    } else {
      //throw error message if response get failed.
      const errorMessage = `Error ${newsResponse.status}`; //return error status
      throw new Error(errorMessage);
    }
  } catch (e) {
    //catch the error message and console log it in the dev tools
    console.log(e.errorMessage);
  }
}

const getNewsCard = (news) => `
  <a href="${news.link}">
      <div class=" card-body">
      <img src="${news.enclosure.link}" class="card-img-top " alt="News image">
        <div class="m-3">
          <h5 class="card-title text-uppercase">${news.title}</h5>
          <span class="fw-bold card-author">${news.author}  &#8226;  ${new Date(news.pubDate).toLocaleDateString()}
          </span>
          <p class="card-text">${news.description}</p>
        </div>
  </a>

  `;

function getCarouselInnerElement(newsCards) {
  //Create a div for carousel
  const carouslElementInnerHTML = document.createElement("div");

  //give class and class name to the div
  carouslElementInnerHTML.setAttribute("class", "carousel-inner");

  //loop into newscards array and append  news card in carousel
  newsCards.forEach((newsCard, index) => {
    //Create a div for carousel item
    const carouselItems = document.createElement("div");

    //set the class name to carousel item depending upon index array
    const carouselClassName =
      index == 0 ? "carousel-item active" : "carousel-item";

    //give class and class name to the div
    carouselItems.setAttribute("class", carouselClassName);

    //set carousel innerHTML item to news card
    carouselItems.innerHTML = newsCard;

    //append the carousel to DOM
    carouslElementInnerHTML.append(carouselItems);
  });
  return carouslElementInnerHTML;
}
function getAccordionItemElement(carouslElementInnerHTML, index,) {
  // Create a div for accordion item element
  const accordionItemElement = document.createElement("div");

  // Set the class attribute
  accordionItemElement.setAttribute("class", "accordion-item");

  // Set the innerHTML of accordion item
  accordionItemElement.innerHTML = `
    <h2 class="accordion-header" id="heading-${index}">
      <button class="accordion-button ${
        index === 0 ? "" : "collapsed"
      }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
        <ion-icon class="accordion-button-icon" name="chevron-down-outline"></ion-icon>
        ${topics[index]}
      </button>
    </h2>

    <div id="collapse-${index}" class="accordion-collapse collapse ${
    index === 0 ? "show" : ""
  }" aria-labelledby="heading-${index}" data-bs-parent="#newsAccordion">

        <div id="newsCarousel-${index}" class="carousel slide" data-bs-ride="carousel">
      
        <div class="">
          <div class="carousel-inner">
            ${carouslElementInnerHTML.innerHTML}
          </div>
        </div>

        <button class="carousel-control-prev " type="button" data-bs-target="#newsCarousel-${index}" data-bs-slide="prev">
          <ion-icon name="chevron-back-outline" class="icon-prev"></ion-icon>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next " type="button" data-bs-target="#newsCarousel-${index}" data-bs-slide="next">
         <ion-icon name="chevron-forward-outline" class="icon-prev"></ion-icon>

          <span class="visually-hidden">Next</span>
        </button>
      
        </div>
    
        </div>
  `;

  return accordionItemElement;
}

async function init() {
  // Loop over the dmagazinces array and add an accordion for each magazine link
  let newsItems;

  for (index = 0; index < magazines.length; index++) {
    // Get the news items for each magazine link
    newsItems = await newsFeedURL(magazines[index]);

    // Declare a array to store the newscards
    let newsCards = [];

    // Get the cards for each news items
    newsItems.forEach((newsItem) => {
      newsCards.push(getNewsCard(newsItem));
    });

    // Get the carousel inner element
    const carouselInnerElement = getCarouselInnerElement(newsCards);

    // Get the accordion item element
    const accordionItemElement = getAccordionItemElement(
      carouselInnerElement,
      index
    );

    // Append the accordion item elements to accordion element
    accordionElement.append(accordionItemElement);
  }
}

init();
