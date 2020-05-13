var employeesAPI = "http://rest.vedinas.ro/employees";

function fetchEmployees() {
  fetch(employeesAPI + "?_limit=5")
    .then(deserializeResponse)
    .then(listEmployees);
}

function deserializeResponse(response) {
  return response.json();
}

function createEmployeeHTMLElement(employee) {
  console.log("Creating HTML element for Employee: " + employee.id);

  var employeeElement = document.createElement("li");
  employeeElement.classList.add("employee");

  var employeeNameElement = document.createElement("div");
  employeeNameElement.classList.add("name");
  employeeNameElement.innerText = employee.name;

  var pElement = document.createElement("p");

  var pInnerHtml3 = `<span>Age: ${employee.age}</span> <span>Salary: ${employee.salary}</span>`;

  pElement.innerHTML = pInnerHtml3;

  var removeButtonElement = document.createElement("button");
  removeButtonElement.classList.add("remove");
  removeButtonElement.innerText = "X";
  removeButtonElement.setAttribute("employee_id", employee.id);
  removeButtonElement.addEventListener("click", removeEmployee);

  employeeElement.appendChild(employeeNameElement);
  employeeElement.appendChild(pElement);
  employeeElement.appendChild(removeButtonElement);

  return employeeElement;
}

function listEmployees(employees) {
  console.log("Employees: " + employees);

  var agendaElement = document.querySelector(".agenda");
  for (var i = 0; i < employees.length; i++) {
    var employeeElement = createEmployeeHTMLElement(employees[i]);
    agendaElement.appendChild(employeeElement);
  }
}

function addEmployee() {
  console.log("Should add employee..");
  event.preventDefault();

  var mainElement = document.getElementsByTagName("main")[0];
  var loaderElement = document.createElement("div");
  loaderElement.id = "loader";
  var pElement = document.createElement("p");
  pElement.innerText = "Loading...";
  loaderElement.appendChild(pElement);
  var mainElement = document.getElementsByTagName("main")[0];
  mainElement.appendChild(loaderElement);

  setTimeout(function () {
    mainElement.removeChild(loaderElement);
  }, 2000);

  var name = document.querySelector('input[name="name"]').value;
  var age = document.querySelector('input[name="age"]').value;
  var salary = document.querySelector('input[name="salary"]').value;
  var employee = {
    name: name,
    age: age,
    salary: salary,
  };
  console.log("afisat:" + name + " , " + age + " , " + salary);

  fetch(employeesAPI, {
    method: "POST",
    body: JSON.stringify(employee),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (apiEmployeeJSON) {
      var employeeElement = createEmployeeHTMLElement(apiEmployeeJSON);
      var agendaElement = document.querySelector(".agenda");
      agendaElement.appendChild(employeeElement);
    });
}

function removeEmployee(event) {
  console.log("Deleted comment with id " + this.getAttribute("employee_id"));
  var employeeId = this.getAttribute("employee_id");

  console.log(event.target.parentNode);
  var agendaElement = document.querySelector(".agenda");
  agendaElement.removeChild(event.target.parentNode);

  fetch(employeesAPI + "/" + employeeId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonResp) {
      console.log(jsonResp);
    });
}

function onDOMLoad() {
  console.log("document is loaded");
  fetchEmployees();

  var addEmployeeElement = document.querySelector(".addbutton");
  addEmployeeElement.addEventListener("click", addEmployee);
}

document.addEventListener("DOMContentLoaded", onDOMLoad);
