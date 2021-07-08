const REGEX_EMAIL =
  /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-]{1,63}\.[a-zA-Z]{1,5}$/;
const REGEX_NAME =
  /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)?)+$/;

//Validate
const isRequired = (value) =>
  value.trim() !== "" ? "" : "This input is Required!";
const isEmail = (value) =>
  REGEX_EMAIL.test(value) ? "" : "Email is not valid!";
const isName = (value) => (REGEX_NAME.test(value) ? "" : "This is not a name!");
const max = (max) => (value) =>
  value.length <= max ? "" : `This input must be less than ${max} character`;
const min = (min) => (value) =>
  value.length >= min ? "" : `This input must be more than ${min} character`;
const isSame = (value1, value2) =>
  value1 === value2 ? "" : `Confirm Password and Password is not same`;

//Create Message
const createMessage = (parentNode, controlNode, message) => {
  const invalidDiv = document.createElement("div");
  invalidDiv.className = "invalid-feedback";
  invalidDiv.innerText = message;
  parentNode.appendChild(invalidDiv);
  controlNode.forEach((item) => {
    item.classList.add("is-invalid");
  });
};

//Check Valid and show message
const isValid = (param) => {
  const { value, arrFunc, parentNode, controlNode } = param;
  for (const func of arrFunc) {
    const message = func(value);
    if (message) {
      createMessage(parentNode, controlNode, message);
      return message;
    }
  }
  return "";
};

const compare = (param) => {
  const { value1, value2, arrFunc, parentNode, controlNode } = param;
  for (const func of arrFunc) {
    const message = func(value1, value2);
    if (message) {
      createMessage(parentNode, controlNode, message);
      return message;
    }
  }
  return "";
};

//Clear Message
const clearMessage = () => {
  document.querySelectorAll(".is-invalid").forEach((item) => {
    item.classList.remove("is-invalid");
  });
  document.querySelectorAll(".invalid-feedback").forEach((item) => {
    item.remove();
  });
};

//Even Submit form
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  clearMessage();
  const emailNode = document.getElementById("email");
  const nameNode = document.getElementById("name");
  const genderNode = document.getElementById("gender");
  const nationNode = document.querySelector('input[name="nation"]:checked');
  const passwordNode = document.getElementById("password");
  const confirmPasswordNode = document.getElementById("confirmedPassword");
  const isAgree = document.querySelector("input#agree:checked");

  const errorForm = [
    isValid({
      value: emailNode.value,
      arrFunc: [isRequired, isEmail],
      parentNode: emailNode.parentElement,
      controlNode: [emailNode],
    }),
    isValid({
      value: nameNode.value,
      arrFunc: [isRequired, isName],
      parentNode: nameNode.parentElement,
      controlNode: [nameNode],
    }),
    isValid({
      value: genderNode.value,
      arrFunc: [isRequired],
      parentNode: genderNode.parentElement,
      controlNode: [genderNode],
    }),
    isValid({
      value: nationNode ? nationNode.value : "",
      arrFunc: [isRequired],
      parentNode: document.querySelector(".form-check-nation:last-child"),
      controlNode: document.querySelectorAll('input[name="nation"]'),
    }),
    isValid({
      value: passwordNode.value,
      arrFunc: [isRequired, min(8), max(20)],
      parentNode: passwordNode.parentElement,
      controlNode: [passwordNode],
    }),
    isValid({
      value: confirmPasswordNode.value,
      arrFunc: [isRequired, min(8), max(20)],
      parentNode: confirmPasswordNode.parentElement,
      controlNode: [confirmPasswordNode],
    }),
    compare({
      value1: passwordNode.value,
      value2: confirmPasswordNode.value,
      arrFunc: [isSame],
      parentNode: confirmPasswordNode.parentElement,
      controlNode: [confirmPasswordNode],
    }),
    isValid({
      value: isAgree ? isAgree.value : "",
      arrFunc: [isRequired],
      parentNode: document.getElementById("agree").parentElement,
      controlNode: [document.getElementById("agree")],
    }),
  ];

  // Show message when Form is Valid
  const isValidForm = errorForm.every((item) => !item);
  if (isValidForm) {
    clearMessage();
    alert("Form is Valid");
  }
});
