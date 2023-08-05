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
    ${buttonHTML("Replace", "PUT")}
    ${buttonHTML("Remove", "DELETE")}
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
        //TELL NOAH: querrySelector doesnt work
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

const handleSubmit = async e => {
    e.preventDefault();

    const method = e.submitter.getAttribute("data-method");
    const id = parseInt(e.target.getAttribute("data-id"));

    const result = await fetchData(
        url, 
        id, 
        method, 
        method === "PATCH" ? 
          { name: e.target.querySelector("input").value } : 
        method === "PUT" ? 
          { name: e.target.querySelector("input").value, id } : 
        method === "DELETE" ?
          { id } :
          { name: "" }
      );
      
      

    if (result.state === "DONE") {
        const users = await fetchData(url);
        document.getElementById("users").outerHTML = usersHTML(users);
    }
}
window.addEventListener("load", main);