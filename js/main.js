/*
Author: Nick Clawson
Date: 6/14/2012
VFW 1206 Project: Coaster Rater */

window.addEventListener("DOMContentLoaded", function(){ //This function waits until the DOM is ready to exectute

	function $(x){ //This function will get an element by it's ID and return that element
		var element = document.getElementById(x);
		return element;
	};
	function makeCategory(){ //Creates a select element in HTML form
		var formTag = document.getElementsByTagName("form"); 
		var selectLi = $('select');
		var makeSelect = document.createElement('select');
		makeSelect.setAttribute("id", "locations");//sets id attribute of select element to 'location'
		
		for(var i = 0, j = rideLocation.length; i<j; i++){ //for loop cycles through rideLocation array and assigns the value of each index to the new select element
			var makeOption = document.createElement('option');
			var optText = rideLocation[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		};
		selectLi.appendChild(makeSelect);

	};
	function getSelectedRadio(){//function determines if radio button is checked
		var radios = document.forms[0].type;
		for(var i = 0; i < radios.length; i++){
			if(radios[i].checked){
				typeValue = radios[i].value;
			};
		};
	};

	function toggleControls(n){//hides form when displaying data and vice versa
		switch(n){
			case "on":
				$("rideForm").style.display = "none";
				$("clear").style.display = "inline";
				$("displayLink").style.display = "none";
				$("addNew").style.display = "inline";
				break;
			case "off":
				$("rideForm").style.display = "block";
				$("clear").style.display = "inline";
				$("displayLink").style.display = "inline";
				$("addNew").style.display = "none";
				$("items").style.display = "none";
				break;
			default:
				return false;
		}
	};

	function saveData(key){ //function will add form data to local storage
		if (!key){//if no existing key, creates new item with new key
			var id = Math.floor(Math.random() * 132145433);
		}
		else{//if existing key value, overwrites data to exising key
			id = key;
		}
		getSelectedRadio();
		var storageItem = {};
			storageItem.ride = ["Ride Name: ", $("rname").value];
			storageItem.park = ["Park: ", $("locations").value];
			storageItem.type = ["Ride Type: ", typeValue];
			storageItem.rating = ["Rating: ", $("rating").value];
			storageItem.date = ["Date Ridden: ", $("date").value];
			storageItem.comments = ["Comments: ", $("comments").value];
		
		//local storage can only accept strings! below converts above object to string and saves it
		localStorage.setItem(id, JSON.stringify(storageItem));
		alert("Rating Saved, Ride On!");
	};

	function getData(){//function will retrieve data from local storage and display in window
		toggleControls("on");
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement("ul");
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$("items").style.display = "block";
		for(var i = 0, j = localStorage.length; i < j; i++){//retrieving each item from local storage
			var makeLi = document.createElement("li");
			var linksLi = document.createElement("li");
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var rideRating = JSON.parse(value); //converted from local object string to object
			var makeSubList = document.createElement("ul");
			makeLi.appendChild(makeSubList);
			for (var n in rideRating){
				var makeSubLi = document.createElement("li");
				makeSubList.appendChild(makeSubLi);
				var optSubText = rideRating[n][0] + " " + rideRating[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			};
			makeItemLinks(localStorage.key(i), linksLi); 
		};
	};

	function makeItemLinks(key, linksLi){ //creates edit and delete links
		var editLink = document.createElement("a");
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Ride";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);

		var breakTag = document.createElement("br");
		linksLi.appendChild(breakTag);

		var deleteLink = document.createElement("a");
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Ride";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	};

	function editItem(){
		var value = localStorage.getItem(this.key);//gets data from current local storage values
		var item = JSON.parse(value);
		
		toggleControls("off");//shows the form

		//below populates the form with current local storage data
		$("rname").value = item.ride[1];
		$("locations").value = item.park[1];
		var radios = document.forms[0].type;
		for(var i = 0; i < radios.length; i++){
			if(radios[i].value == "Roller Coaster" && item.type[1] == "Roller Coaster"){
				radios[i].setAttribute("checked", "checked");
			}
			else if (radios[i].value == "Thrill Ride" && item.type[1] == "Thrill Ride"){
				radios[i].setAttribute("checked", "checked");
			}
			else if (radios[i].value == "Water Ride" && item.type[1] == "Water Ride"){
				radios[i].setAttribute("checked", "checked");
			}
			else if (radios[i].value == "Haunted House" && item.type[1] == "Haunted House"){
				radios[i].setAttribute("checked", "checked");
			}
			else if (radios[i].value == "Train" && item.type[1] == "Train"){
				radios[i].setAttribute("checked", "checked");
			}
			else if (radios[i].value == "Transport" && item.type[1] == "Transport"){
				radios[i].setAttribute("checked", "checked");
			}
		};
		$("rating").value = item.rating[1];
		$("date").value = item.date[1];
		$("comments").value = item.comments[1];

		save.removeEventListener("click", saveData); //removes initial submit event listener
		$("submit").value = "Edit Ride"; //changes value of button to Edit Ride
		var editSubmit = $("submit");
		editSubmit.addEventListener("click", validate);//this line and below save key value as property of editSubmit
		editSubmit.key = this.key;

	};

	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this ride?");
		if(ask){
			localStorage.removeItem(this.key);
			window.location.reload();
		}
		else{
			alert("Ride has not been deleted.");
		}
	};
	function clearLocal(){//function to clear local storage data
		if(localStorage.length === 0){
			alert("There is no data to clear!")
		}
		else{
			localStorage.clear();
			alert("All ratings have been cleared.");
			window.location.reload();
			return false;
		};
	};

	function validate(e){ //function to validate dorm data
		//define which elements need validation
		var getRide = $("rname");
		var getPark = $("locations");
		var getRating = $("rating");
		var getDate = $("date");

		//clears previous error messages
		errorMessage.innerHTML = "";
		getRide.style.border = "1px solid black";
		getPark.style.border = "1px solid black";
		getDate.style.border = "1px solid black";
		getRating.style.border = "1px solid black";

		var messageArr = [];

		if(getRide.value === ""){ //checks ride name field
			var rideError = "Please type a ride name.";
			getRide.style.border = "1px solid red";
			messageArr.push(rideError);
		}

		if(getPark.value === "--Choose a Park--"){ //checks park location selection
			var parkError = "Please select a park location.";
			getPark.style.border = "1px solid red";
			messageArr.push(parkError);
		}

		if(getDate.value === ""){ //checks date field
			var dateError = "Please select a date for the visit.";
			getDate.style.border = "1px solid red";
			messageArr.push(dateError);
		}

		var pattern = /^([1-9]|10)$/; //checks rating slider/field
		if(!(pattern.exec(getRating.value))){
			var ratingError = "Please select a value 1-10.";
			getRating.style.border = "1px solid red";
			messageArr.push(ratingError);
		}

		if(messageArr.length >= 1){ //if there are any errors, displays each error on page
			for(var i = 0, j = messageArr.length; i < j; i++){
				var errorText = document.createElement("li");
				errorText.innerHTML = messageArr[i];
				errorMessage.appendChild(errorText);
			}
			e.preventDefault();
			return false;
		}
		else{ //saves data as normal if no errors
			saveData(this.key);
		};

	};

	//Default Variables
	var rideLocation = ["--Choose a Park--", "Cedar Point", "King's Island","Kennywood","Hersheypark"];
	var typeValue;
	makeCategory();
	errorMessage = $("errors");

	//The below variales set link and submit button click events
	var displayLink = $("displayLink");
	displayLink.addEventListener("click", getData);
	var clearLink = $("clear");
	clearLink.addEventListener("click", clearLocal);
	var save = $("submit");
	save.addEventListener("click", validate);
});