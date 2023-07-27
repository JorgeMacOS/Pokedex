const pokemonSelect = document.getElementById("pokemonSelect");
const nameOutput = document.getElementById("name");
const skillsOutput = document.getElementById("skills");
const statsOutput = document.getElementById("stats");
const imageOutput = document.getElementById("image");
const typeOutput = document.getElementById("type");
const searchInput = document.getElementById("searchInput");
const statsChart = document.getElementById("statsChart").getContext("2d");

async function fetchPokemonData(pokemonName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos del Pokemon:", error);
    return null;
  }
}

function updatePokemonInfo(pokemonData) {
  if (pokemonData) {
    nameOutput.textContent = pokemonData.name;
    skillsOutput.innerHTML = pokemonData.abilities.map(ability => `<li>${ability.ability.name}</li>`).join("");
    statsOutput.innerHTML = pokemonData.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join("");
    imageOutput.src = pokemonData.sprites.front_default;

    const type = pokemonData.types[0].type.name;
    typeOutput.textContent = `Tipo: ${type}`;

    const statsLabels = pokemonData.stats.map(stat => stat.stat.name);
    const statsValues = pokemonData.stats.map(stat => stat.base_stat);

    new Chart(statsChart, {
      type: "bar",
      data: {
        labels: statsLabels,
        datasets: [{
          label: "Estadísticas",
          backgroundColor: "#5cb85c",
          borderColor: "#4cae4c",
          borderWidth: 1,
          data: statsValues,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }
}

pokemonSelect.addEventListener("change", () => {
  const selectedPokemon = pokemonSelect.value;
  fetchPokemonData(selectedPokemon)
    .then(updatePokemonInfo);
});

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.toLowerCase();
    fetchPokemonData(searchTerm)
      .then(updatePokemonInfo);
  }
});

fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
  .then(response => response.json())
  .then(data => {
    const pokemonList = data.results;
    pokemonList.forEach(pokemon => {
      const option = document.createElement("option");
      option.textContent = pokemon.name;
      pokemonSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error("Error al obtener la lista de Pokemon:", error);
  });

