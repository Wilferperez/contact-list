var loadingDiv = document.getElementById("loading");

// mostrar loading
function showSpinner() {
  loadingDiv.style.visibility = "visible";
}
// esconder loading
function hideSpinner() {
  loadingDiv.style.visibility = "hidden";
}
// duracion esconder loading
function delayHideSpinner() {
  setTimeout(() => {
    console.log("cerrando spiner");
    hideSpinner();
  }, 1000);
}

const formulario = document.getElementById("formulario");
const listContact = document.getElementById("listContact");
const button = document.getElementById("button");
//  Limpiar formulario
function cleanForm() {
  formulario.elements["name"].value = "";
  formulario.elements["lastname"].value = "";

  document.getElementById("female").checked = false;
  document.getElementById("male").checked = false;
  button.value = "ADD";
  button.className = "btn btn-primary";
}

let contacts = localStorage.getItem("contacts")
  ? JSON.parse(localStorage.getItem("contacts"))
  : [];

// Cargar lista de contactos
function loadListContact(contacts) {
  listContact.innerHTML = "";
  contacts.forEach((contact) => {
    listContact.innerHTML += renderContact(contact);
  });
}

loadListContact(contacts);
//  escuchar evento submit
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = formulario.elements["name"].value;
  const lastname = formulario.elements["lastname"].value;
  const sex = formulario.elements["sex"].value;

  const emptyInput = checkEmptyInput(name, lastname, sex);
  if (emptyInput) {
    alert("Please complete all the inputs.");
  } else {
    showSpinner();

    console.log("text", button.value);
    const ids = contacts.map((contact) => contact.id);
    const maxId = Math.max(...ids);
    const id = maxId === -Infinity ? 1 : maxId + 1;
    const contact = {
      id,
      name,
      lastname,
      sex,
    };

    if (button.value === "ADD") {
      addcontact(contact);
    } else {
      updateContact(name, lastname, sex);
    }
  }
});

let addcontact = (contact) => {
  contacts.push(contact);

  listContact.innerHTML += renderContact(contact);

  window.localStorage.setItem("contacts", JSON.stringify(contacts));

  delayHideSpinner();
  cleanForm();
};

let deleteContact = (id) => {
  console.log(id);
  const contactsFiltered = contacts.filter((contact) => {
    return contact.id !== id;
  });
  contacts = contactsFiltered;
  window.localStorage.setItem("contacts", JSON.stringify(contacts));

  let contactDeleted = document.getElementById(id);
  console.log(listContact);
  console.log(contactDeleted);
  listContact.removeChild(contactDeleted);
};

let updateContact = (name, lastname, sex) => {
  console.log(button.id);
  contacts[button.id].name = name;
  contacts[button.id].lastname = lastname;
  contacts[button.id].sex = sex;

  window.localStorage.setItem("contacts", JSON.stringify(contacts));

  loadListContact(contacts);

  delayHideSpinner();
  cleanForm();
};
//
let loadContact = (id) => {
  console.log(id);
  const index = contacts.findIndex((contact) => {
    return contact.id === id;
  });
  console.log(index);
  console.log(contacts[index]);
  const contact = contacts[index];
  button.value = "UPDATE";
  button.className = "btn btn-success";
  button.id = index;

  const name = document.getElementById("name");
  const lastname = document.getElementById("lastname");
  const female = document.getElementById("female");
  const male = document.getElementById("male");

  name.value = contact.name;
  lastname.value = contact.lastname;
  if (contact.sex === "male") {
    male.checked = true;
  } else {
    female.checked = true;
  }
};

// validar input vacios
function checkEmptyInput(name, lastname, sex) {
  if (name === "" || lastname === "" || sex === "") {
    return true;
  }
  return false;
}

function renderContact(contact) {
  return `<div class="contact-container" id="${contact.id}">
<label>
  <img
    src="./img/${contact.sex === "male" ? "hombre" : "mujer"}.png"
    id=""
    class="closeBtn"
    width="15px"
    height="15px"
    onClick="showSpinner()"
  />
  <span>${contact.name} ${contact.lastname}</span>
</label>
<label>
<img
  src="./img/escritura.png"
  id="${contact.id}"
  class="closeBtn"
  width="15px"
  height="15px"
  onClick="loadContact(${contact.id})"
/>
<img
  src="./img/basura.png"
  id="${contact.id}"
  class="closeBtn"
  width="15px"
  height="15px"
  onClick="deleteContact(${contact.id})"
/>
</label>
</div>`;
}
