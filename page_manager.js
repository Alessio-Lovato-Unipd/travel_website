  function start_quiz() {

	data = [0];

	// Save the JSON string to sessionStorage with a specific key
	upload_answers_to_sessionStorage(data);
	//Set parameters for the new question
	load_question();
 }  

function load_question() {

	// Obtain question number
	number = get_question_number() + 1;

	//Get questions elements
		getanswerData(number)
		.then(answerData => {
			console.log(answerData);
			if (answerData) {
				//Set new question parameters
				set_new_parameters(answerData);

			} else {
				console.log("Question not found");
			}
		})
		.catch(error => {
			console.log("Error:", error);
		});
		if (number == JSON.parse(sessionStorage.getItem('num_of_questions'))) {
			// Check if it's the last question
			document.getElementById("next_button").textContent = "Invia risposte";
		}
}

async function getanswerData(questionId) {
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

  function set_new_parameters(answerData) {

	const questionNumberElement = document.getElementById('question_number');
	const questionTextElement = document.getElementById('question_text');
	const optionsContainer = document.querySelector('.options');
 
	questionNumberElement.textContent = `DOMANDA ${answerData.id}:`;
	questionTextElement.textContent = answerData.text;
  
	// Clear existing options
	optionsContainer.innerHTML = '';
  
	answerData.options.forEach((option, index) => {
	  const label = document.createElement('label');
	  const input = document.createElement('input');
	  const labelText = document.createTextNode(option.label);
  
	  input.type = 'radio';
	  input.name = `q${answerData.id}`;
	  input.value = option.value;
	  input.id = `answer${index + 1}`;
  
	  label.appendChild(input);
	  label.appendChild(labelText);
  
	  optionsContainer.appendChild(label);
	});
  }
  
  
function get_question_number() {
	return download_answers_from_Sessionstorage().length - 1;
}

function next_question() {

	//Retrieve array from sessionStorage
	data = download_answers_from_Sessionstorage();

	//Insert answer on sessionStorage
	answer = getSelectedAnswer();
	if (answer == null) {
		alert("Si prega di inserire una risposta");
	} else {

		//Save data into array
		data.push(answer);
		
		//Save data to sessionStorage
		upload_answers_to_sessionStorage(data);

		//Check if it is the last question
		if (document.getElementById("next_button").textContent != "Invia risposte") {
			//Load next question
			load_question();
		} else {
			//Show result
			showResult();
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


function download_answers_from_Sessionstorage() {

	// Retrieve the array string from sessionStorage using the specific key
	var storedArrayString = sessionStorage.getItem('fitted_travel_data');
	// Convert the array string back to a JavaScript array
	var data = JSON.parse(storedArrayString);	

	return data;
}

function upload_answers_to_sessionStorage(data) {
	// Save the JSON string to sessionStorage with a specific key
	sessionStorage.setItem('fitted_travel_data', JSON.stringify(data));
}

function showResult() {
	//Save data from sessionStorage
	data = download_answers_from_Sessionstorage();

	// convert array into string with comma as separator
	var dataString = data.join(',');

	// Concatenare la stringa di elementi all'URL
	var newURL = 'results_page.html?elementi=' + dataString;
	//Go to the new webpage
	document.location.href = newURL;
}