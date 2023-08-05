console.log("the site is loaded!");

const url = `http://127.0.0.1:3000/users`;

const userHTML = user => `<div class="user"><span class="user.id">${user.id}</span> ${user.name}</div>`;

const usersHTML = users => `<div id="users">${users.map(user => userHTML(user)).join("")}</div>`;

const fetchData = async (url, id, method = "GET", body = {name: ""}) => {
  
    try {
      const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? {method} : {method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)} );
      return await response.json();
    
    } catch (error) {
      console.error(error);
    }
  }

  
  const inputHTML = name => `<input placeholder="Write the name here" value="${name}">`;
  
  const buttonHTML = (text, method) => `<button type="submit" data-method="${method}">${text}</button>`;
  
  const formHTML = (user) => `
  <form id="form" data-id="${user.id}">
    ${inputHTML(user.name)}
    ${buttonHTML("Save", "PATCH")}
  </form>
`;
  const main = async _ => {
      const root = document.getElementById("root");
      const users = await fetchData(url);
      root.insertAdjacentHTML("beforeend", usersHTML(users));
      root.insertAdjacentHTML("beforeend", formHTML({id: 0, name: ""}));
      window.addEventListener("input", handleInput);
      window.addEventListener("submit", handleSubmit);

  
  };

const handleClick = async ({ target }) => {
    const userTarget = target.classList.contains('user') ? target : target.closest('.user');
    
    if (userTarget) {
    const userId = userTarget.innerText.split("")[0];
    const userData = await fetchData(url, userId);
    document.getElementById("form").outerHTML = formHTML(userData);

    
    const response = await fetch(`${url}/${userId}`);
    const data = await response.json();
    
    console.log(userTarget)
    const inputElement = userTarget.querySelectorAll('input');
    inputElement.value = data.name;
    
    document.getElementById('form').dataset.id = userId;
    }
    };

window.addEventListener("click", event => {
    handleClick(event)
})

const handleInput = ({target}) => {
    target.setAttribute("value", target.value);
  }

const handleSubmit = e => {
    e.preventDefault();

    const method = e.submitter.getAttribute("data-method");

    fetchData(url, e.target.getAttribute("data-id"), method, method === "PATCH" ? {name: e.target.querySelector("input").value} : {name: ""})
}
window.addEventListener("load", main);