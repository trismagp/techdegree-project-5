const NB_EMPLOYEES = 12;
var indexModal;
var employees;
var filteredIndex;

// helper function to create employee list item
function createEmployeeItem(employee){
  var firstName = employee.name.first;
  var lastName = employee.name.last;
  var town = employee.location.city;
  var email = employee.email;
  var picture = employee.picture.large;

  var employeeItem = `<li class="employee-item cf">
                        <div class="employee-img">
                            <img class="avatar" src="${picture}">
                        </div>
                        <div class="employee-details">
                            <h3>${firstName} ${lastName}</h3>
                            <span class="email">${email}</span>
                            <span class="town">${town}</span>
                        </div>
                    </li>`;

  return employeeItem;
}

// async function to fetch random user from https://randomuser.me api
async function fetchRandomUsers(nbUsers){
  var url= `https://randomuser.me/api/?results=${nbUsers}&nat=us,gb`;
  var users = await fetch(url)
                          .then(response =>{ return response.json() })
                          .then(jsonResponse =>{ return jsonResponse.results });
  return users;
}

// format birthday to mm-dd-yy
function formatBirthday(dateString){
  var year = dateString.substring(2,4);
  var month = dateString.substring(5,7);
  var day = dateString.substring(8,10);
  return `${month}-${day}-${year}`;
}

// return state abreviation if state is listed in usStates.js
function stateAbreviation(stateFullName){
  for (var i = 0; i < states.length; i++) {
    if(states[i][0].toLowerCase() === stateFullName){
      return states[i][1];
    }
  }
  return stateFullName;
}

// helper function for displaying modal
function displayEmployeeModal(employee){
  var firstName = employee.name.first;
  var lastName = employee.name.last;
  var town = employee.location.city;
  var email = employee.email;
  var picture = employee.picture.large;
  var cell = employee.cell;
  var address = employee.location.street;
  var state = stateAbreviation(employee.location.state);
  var postcode = employee.location.postcode;
  var birthday = formatBirthday(employee.dob.date);


  var employeeInnerModal = `<div class="inner-modal">
                                <img class="avatar-modal" src="${picture}">
                                <h3>${firstName} ${lastName}</h3>
                                <p><span class="email">${email}</span></p>
                                <p><span class="town">${town}</span></p>
                                <hr />
                                <p><span class="cell">${cell}</span></p>
                                <p><span class="town">${address}<br />${state} ${postcode}</span></p>
                                <p><span class="birthday">Birthday: ${birthday}</span></p>
                            </div>`;

    $(".modal-body").empty();                       // empty the modal first
    $(".modal-body").append(employeeInnerModal);    // insert employee infos
    $('#employee-modal').modal('show');             // show modal

    // display first previous and next button
    $('.employee-switch a').show();

    // hide previous button if displaying first employee
    if(indexModal === 0){
      $('#employee-previous').hide();
    }
    // hide next button if displaying last employee
    if(indexModal === filteredIndex.length -1 ){
      $('#employee-next').hide();
    }
}


// helper function for displaying employees
function displayEmployees(){
  $("#employee-list").empty();

  if(filteredIndex.length === 0 ){
    $("#employee-list").append("<li>No result</li>");
  }else{
    for (var i = 0; i < filteredIndex.length; i++) {
      $("#employee-list").append(createEmployeeItem(employees[filteredIndex[i]]));
    }
  }

  // event listener to open modal
  $(".employee-item").on('click',function(){
    indexModal = $(this).index();
    displayEmployeeModal(employees[filteredIndex[indexModal]]);
  });
}

// If "filter" is contained in first name, last name or email username
// then the employee index will be stored in filteredIndex.
//  Employees listed in filteredIndex will be displayed on the web page
function filterEmployees(filter){
  if(filter === ""){
    initFilterEmployees();
  }else{
    filteredIndex = [];
    for (var i = 0; i < employees.length; i++) {
      var firstName = employees[i].name.first;
      var lastName = employees[i].name.last;
      var email = employees[i].email;
      var username = email.substring(0,email.search("@"));

      if(firstName.includes(filter) || lastName.includes(filter) || username.includes(filter)){
          filteredIndex.push(i);
      }
    }
  }

  displayEmployees();
}

// init filteredIndex, an array that contains the employee indexes
// to be displayed on the page
function initFilterEmployees(){
  filteredIndex = [];
  for (var i = 0; i < employees.length; i++) {
    filteredIndex.push(i);
  }
}

// reset search form, fetch employee and display employees
async function loadInitialPage(nbUsers){
  $('#input-search').val("");
  employees = await fetchRandomUsers(nbUsers);
  initFilterEmployees();
  displayEmployees();
}

/* =================================
  Page inital load
==================================== */

loadInitialPage(NB_EMPLOYEES);


/* =================================
  Event listeners
==================================== */

// search form button event listener
$('.search button').on('click', function(){
  const searchString = $('.search input').val().toLowerCase();
  filterEmployees(searchString);
});

$('.search input').on('keyup', function(){
  const searchString = $('.search input').val().toLowerCase();
  filterEmployees(searchString);
});


// modal previous employee event listener
$('#employee-previous').on('click', function(){
  if(indexModal > 0){
    indexModal -= 1;
    displayEmployeeModal(employees[filteredIndex[indexModal]]);
  }
  if(indexModal === 0){
    $('#employee-previous').hide();
  }
  if(indexModal < filteredIndex.length -1 ){
    $('#employee-next').show();
  }
});

// modal next employee event listener
$('#employee-next').on('click', function(){
  indexModal += 1;
  displayEmployeeModal(employees[filteredIndex[indexModal]]);

  if(indexModal === filteredIndex.length -1 ){
    $('#employee-next').hide();
  }
  if(indexModal > 0 ){
    $('#employee-previous').show();
  }
});
