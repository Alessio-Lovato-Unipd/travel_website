function start_quiz() {
	/* The elements of the array 'data' represents in order:
		- number of answered question
		- number of questiond given for destination 1
		- number of questiond given for destination 2
		- number of questiond given for destination 3
		- number of questiond given for destination 4
		- number of questiond given for destination 5
	*/
	var data = [0,0,0,0,0];

	// Convert the array to a JSON string
	var arrayString = JSON.stringify(data);

	// Save the JSON string to sessionStorage with a specific key
	sessionStorage.setItem('fitted_travel_data', arrayString);
	
	//Set parameters for the new question
	load_question();
}

function load_question() {

	// Obtain question number
	number = get_question_number() + 1;

	//Get questions elements
		getQuestionData(number)
		.then(questionData => {
			if (questionData) {
				//Set new question parameters
				set_new_parameters(questionData);

			} else {
				console.log("Question not found");
			}
		})
		.catch(error => {
			console.log("Error:", error);
		});
		// Check if it's the last question
		if (number == JSON.parse(sessionStorage.getItem('num_of_questions')))
			document.getElementById("next_button").textContent = "Invia risposte";
}

async function getQuestionData(questionId) {
	try {
	  // Fetch the JSON data from the external file
	  const response = await fetch('questions.json');
	  const jsonData = await response.json();
	  // Save the JSON string to sessionStorage with a specific key
	  sessionStorage.setItem('num_of_questions', JSON.stringify(jsonData.questions.length));
  
	  // Find the question with the specified ID
	  const question = jsonData.questions.find(q => q.id === questionId);
  
	  // Return the question data
	  if (question) {
		return {
		  id: question.id,
		  text: question.text,
		  options: question.options
		};
	  } else {
		return null; // Question not found
	  }
	} catch (error) {
	  console.log('Error fetching question data:', error);
	  return null; // Error occurred
	}
  }

  function set_new_parameters(questionData) {
	const questionNumberElement = document.getElementById('question_number');
	const questionTextElement = document.getElementById('question_text');
	const optionsContainer = document.querySelector('.options');
  
	questionNumberElement.textContent = `Domanda ${questionData.id}:`;
	questionTextElement.textContent = questionData.text;
  
	// Clear existing options
	optionsContainer.innerHTML = '';
  
	questionData.options.forEach((option, index) => {
	  const label = document.createElement('label');
	  const input = document.createElement('input');
	  const labelText = document.createTextNode(option.label);
  
	  input.type = 'radio';
	  input.name = `q${questionData.id}`;
	  input.value = option.value;
	  input.id = `answer${index + 1}`;
  
	  label.appendChild(input);
	  label.appendChild(labelText);
  
	  optionsContainer.appendChild(label);
	});
  }
  
  
function get_question_number() {
	// Retrieve the array string from sessionStorage using the specific key
	var storedArrayString = sessionStorage.getItem('fitted_travel_data');

	// Convert the array string back to a JavaScript array
	var data = JSON.parse(storedArrayString);

	// Get the value of the first element in the array
	return data[0];
}

function next_question() {

	// Retrieve the array string from sessionStorage using the specific key
	var storedArrayString = sessionStorage.getItem('fitted_travel_data');

	// Convert the array string back to a JavaScript array
	var data = JSON.parse(storedArrayString);

	//Insert answer on sessionStorage
	answer = getSelectedAnswer();
	if (answer == null) {
		alert("Si prega di inserire una risposta");
	} else {
		data[answer]++;
		//Increment question number
		data[0]++;
	
	// Save the JSON string to sessionStorage with a specific key
	sessionStorage.setItem('fitted_travel_data', JSON.stringify(data));

	//Check if it is the last question
	if (document.getElementById("next_button").textContent != "Invia risposte") {
		//Load next question
		load_question();
	} else {
		alert ("Fine quiz");
	}
	}
}

function getSelectedAnswer() {
	const options = document.querySelectorAll('.options input[type="radio"]');
	
	for (let i = 0; i < options.length; i++) {
	  if (options[i].checked) {
		return options[i].value;
	  }
	}
	
	// No answer selected
	return null;
  }