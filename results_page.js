
function loadResultPage(){
	showList();
	//Fetch destinations
	fetchJSON('destinations.json')
	.then(resultMap => {
		if (resultMap) {
			var currentURL = window.location.href;
			answers = getArrayFromURL(currentURL);
			//Create map that associate answer with personality
			const destinationMap = generateDestinationMap(answers);
			console.log(answers);
			// Find the key with the highest value in resultMap
			const maxKey = findMaxValueKey(destinationMap);

			// Get the corresponding text from resultMap
			const maxText = resultMap.get(maxKey);

			// Set the text to the HTML element with id "text-placeholder"
			document.getElementById("text-placeholder").textContent = maxText;
			document.getElementById("title").textContent = maxKey;
			document.body.style.backgroundImage = url(maxKey + ".jpg");
			// Create graph
			generateRadarChart(destinationMap);

			//Show list with answers
			showList();

		}
		})
		.catch(error => console.error(error));
}


function getArrayFromURL(urlString) {
	// Rimuove tutto prima del segno di uguale (=) nella stringa dell'URL
	const startIndex = urlString.indexOf('=') + 1;
	const numbersString = urlString.substring(startIndex);
  
	// Divide la stringa dei numeri in base alla virgola
	const numbersArray = numbersString.split(',');
  
	// Converte ogni elemento in un numero intero
	const resultArray = numbersArray.map(Number);
  
	return resultArray;
  }
  

async function fetchJSON(url) {
	try {
	  const response = await fetch(url);
	  if (!response.ok) {
		throw new Error(`Error: ${response.status} ${response.statusText}`);
	  }
	  const data = await response.json();
	  const resultMap = new Map();
	  data.forEach(item => {
		resultMap.set(item.risposta, item.testo);
	  });
	  return resultMap;
	} catch (error) {
	  console.error(error);
	  return null;
	}
  }


function showList() {
	// Get the results list element
	const resultsList = document.getElementById("results-list");

	// Clear the results list
	resultsList.innerHTML = "";

	// Fetch the JSON data from the "questions.json" file
	fetch('questions.json')
	.then(response => response.json())
	.then(jsonData => {
		const selectedAnswers = download_answers_from_Sessionstorage();

		// Populate the results list with selected answers
		jsonData.questions.forEach(question => {

			const selectedOption = question.options.find(option => option.value === selectedAnswers[question.id]);

			// Create a new list item for each question and answer
			const listItem = document.createElement("li");

			// Create the question element
			const questionElement = document.createElement("div");
			questionElement.classList.add("question");
			questionElement.textContent = question.text;
			listItem.appendChild(questionElement);

			// Create the options list
			const optionsList = document.createElement("ul");
			optionsList.classList.add("options");
			question.options.forEach((option, index) => {
			const optionItem = document.createElement("li");
			optionItem.classList.add("option");

			const label = document.createElement("label");
			const input = document.createElement("input");
			const labelText = document.createTextNode(option.label);

			input.type = "radio";
			input.name = `q${question.id}`;
			input.value = option.value;
			input.id = `answer${index + 1}`;
			if (selectedAnswers[question.id] === option.value) {
				input.checked = true;
			}
			

			// Disable the option
			input.disabled = true;

			label.appendChild(input);
			label.appendChild(labelText);
			optionItem.appendChild(label);
			optionsList.appendChild(optionItem);
		});

		listItem.appendChild(optionsList);

		// Append the list item to the results list
		resultsList.appendChild(listItem);

		});
	})
	.catch(error => {
		console.log('Error:', error);
	});

	}
	
	async function fetch_destinations(url) {
		try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();
		const resultMap = new Map();
		data.forEach(item => {
			resultMap.set(item.risposta, item.testo);
		});
		return resultMap;
		} catch (error) {
		console.error(error);
		return null;
		}
  }

  // Function to create the radar chart with data from a JSON file
  function generateRadarChart(destinationMap) {
	// Get the canvas element from the HTML
	const canvas = document.getElementById("radarChart");
  
	// Extract the labels (keys) and data (values) from the destination map
	const labels = Array.from(destinationMap.keys());
	const data = Array.from(destinationMap.values());
	console.log(destinationMap);
  
// Create the radar chart using Chart.js
const maxDataValue = Math.ceil(Math.max(...data));

new Chart(canvas, {
  type: "radar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Personalità",
        data: data,
        backgroundColor: "rgba(255, 70, 87, 0.5)", // Set the background color for the data area
        borderColor: "rgba(255, 70, 87, 1)", // Set the color for the data lines
        borderWidth: 2, // Set the border width for the data lines
      },
    ],
  },
  options: {
    scale: {
	  r: {
		min: 0,
		beginAtZero: true,
		suggestedMin: 0
	  },
      ticks: {
		min: 0,
		beginAtZero: true, // Imposta beginAtZero su true per avere sempre il centro del grafico in 0
        suggestedMin: 0, // Set the suggested minimum value for the scale to 0
        suggestedMax: maxDataValue, // Set the suggested maximum value for the scale to the rounded-up maximum data value
        precision: 0, // Set the precision to 0 to hide decimal values
      },
    },
  },
});

  
  
  }
  

// Returns a map with the types of the answers
function generateDestinationMap(answers) {
	const resultMap = new Map();
  
	// Inizializzazione dei valori a zero
	resultMap.set("Messico", 0);
	resultMap.set("Norvegia", 0);
	resultMap.set("Giappone", 0);
  
	// Question 1
	switch (answers[1]) {
	  case 1:
	  case 6:
		resultMap.set("Messico", resultMap.get("Messico") + 1);
		break;
	  case 3:
	  case 4:
		resultMap.set("Norvegia", resultMap.get("Norvegia") + 1);
		break;
	  case 2:
	  case 5:
		resultMap.set("Giappone", resultMap.get("Giappone") + 1);
	}
  
	// Question 2
	switch (answers[2]) {
	  case 1:
		resultMap.set("Messico", resultMap.get("Messico") + 1);
		break;
	  case 2:
		resultMap.set("Norvegia", resultMap.get("Norvegia") + 1);
		break;
	  case 3:
		resultMap.set("Giappone", resultMap.get("Giappone") + 1);
	}
  
	// Question 3
	switch (answers[3]) {
	  case 5:
	  case 6:
		resultMap.set("Messico", resultMap.get("Messico") + 1);
		break;
	  case 1:
	  case 2:
		resultMap.set("Norvegia", resultMap.get("Norvegia") + 1);
		break;
	  case 3:
	  case 4:
		resultMap.set("Giappone", resultMap.get("Giappone") + 1);
	}
  
	// Question 4
	switch (answers[4]) {
	  case 2:
	  case 5:
		resultMap.set("Messico", resultMap.get("Messico") + 1);
		break;
	  case 3:
	  case 4:
		resultMap.set("Norvegia", resultMap.get("Norvegia") + 1);
		break;
	  case 1:
	  case 6:
		resultMap.set("Giappone", resultMap.get("Giappone") + 1);
		break;
	}
  
	return resultMap;
  }

  function findMaxValueKey(map) {
	let maxKey = null;
	let maxValue = -Infinity;
  
	for (const [key, value] of map.entries()) {
	  if (value > maxValue) {
		maxValue = value;
		maxKey = key;
	  }
	}
  
	return maxKey;
  }
  
  function BackToOrigin() {
	document.location.href = "index.html";
  }
  
  
  