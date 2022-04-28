const API_BASE_URL= 'https://rickandmortyapi.com/api';

const API_REQUEST = {
  characters: `${API_BASE_URL}/character/`,
  episodes: `${API_BASE_URL}/episode/`,
  locations: `${API_BASE_URL}/location/`
}

const requestToApi = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch(error) {
    console.error(error);
  }
}

const transformCharacterData = (data) => {
  return data?.results?.map?.(character => outputCharacter(character)) || [];
};

function outputCharacter(character, selector = '#characters') {
  const { document} = globalThis || window;
  const characterElement = document.createElement('div');
  characterElement.classList.add('character');
  characterElement.innerHTML = `
  <ul>
  <li>Name: ${character.name}</li>
  <li>Species: ${character.species}</li>
  <li>Gender: ${character.gender}</li>
  </ul>
  <img src="${character.image}" alt="${character.name}">
  `;
  document.querySelector(selector).appendChild(characterElement);
}

function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}


async function main() {
  const INTERCEP_RATIO = 0.9;
  const { document} = globalThis || window;
  let observer = new IntersectionObserver(async (entries) => {
    const [entry] = entries;
    console.log(entry);
    if (entry.isIntersecting && entry.intersectionRatio >= INTERCEP_RATIO) {
      const characters = await requestToApi(API_REQUEST.characters);
      transformCharacterData(characters);
    }
  }, {
    threshold: INTERCEP_RATIO
  })

  const endofpage = document.createElement('span');
  endofpage.id = 'end-of-page';
  document.body.appendChild(endofpage);

  observer.observe(document.querySelector('#end-of-page'));
}

window.addEventListener('load', main);
