import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-646a8-default-rtdb.europe-west1.firebasedatabase.app/",
};

const input = document.querySelector("#input-field");
const btnAdd = document.querySelector("#add-button");
const list = document.querySelector(".shopping-list");

//firebase proje bağlantılandırma
const app = initializeApp(appSettings);
const database = getDatabase(app);
const listDB = ref(database, "listShopping");
//console.log(app, database, listDB, "list");

//firebasede oluşturulan databasedeki verileri alma.
const fetchData = async () => {
  try {
    const snapshot = await get(listDB);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return data;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

//firebaseden alınan verileri işleyerek ekrana basma
const getData = () => {
  fetchData().then((data) => {
    if (data) {
      const dataArr = Object.entries(data);
      console.log(data, "data var", dataArr);
      for (let i = 0; i < dataArr.length; i++) {
        const [key, value] = dataArr[i];
        //console.log(`key: ${key}, value:`, value);
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("btnList");
        // const value = data[i];
        //console.log(value);
        buttonElement.textContent = value;
        buttonElement.addEventListener("click", btnDelete);
        list.appendChild(buttonElement);
      }
    } else {
      console.log("data yok");
    }
  });
};

//sayfa yüklendğinde databasedeki verilerin ekrana gelmesi.
document.addEventListener("DOMContentLoaded", getData);

//liste oluştur
const shoppingListArr = [];
//inputtan girilen değerleri listeye ekleme
const addList = () => {
  let inputValue = input.value.trim();

  push(listDB, inputValue);
  input.value = "";
  list.innerHTML = "";
  getData();

  console.log(shoppingListArr, "shoppingList");
  console.log(`${inputValue} added to database`);
};

//firebase olmadan listeye ekleme
// const addList = () => {
//     let inputValue = input.value;
//
//   shoppingListArr.push(inputValue);

//   input.value = "";
//   list.innerHTML = "";
//   for (let i = 0; i < shoppingListArr.length; i++) {
//     const buttonElement = document.createElement("button");
//     buttonElement.classList.add("btnList");
//     buttonElement.textContent = shoppingListArr[i];
//     buttonElement.addEventListener("click", btnDelete);
//     list.appendChild(buttonElement);
//   }
// };
//add to cart ile tıklandığında listeye ekle
btnAdd.addEventListener("click", addList);

//-----------------------------------------------------------
//firebase olmadanelementi DOM dan kaldırma.

// const btnDelete = (e) => {
//   console.log(e.target)
//   const itemText = e.target.textContent;
//   //console.log(itemText,e);
//   const itemIndex = shoppingListArr.indexOf(itemText);

//   if (itemIndex > -1) {
//     shoppingListArr.splice(itemIndex, 1);
//   }
//   // DOM'dan butonu kaldır
//   e.target.classList.remove("btnList");
//   e.target.classList.add("remove");
// };

//-----------------------------------------------------------

//fire base ile databaseden elementi silme
const btnDelete = (e) => {
  console.log(e.target.innerHTML, "val");
  const chosenItem = e.target.innerHTML;
  fetchData().then((data) => {
    if (data) {
      const dataArr = Object.entries(data);
      console.log(dataArr, "index");
      //const [key, value] = dataArr;
      const findProduct = dataArr.find(([key, value]) => value == chosenItem);
      console.log(findProduct, "findProduct");
      const [key] = findProduct;
      const itemRef = ref(database, `listShopping/${key}`);
      findProduct && remove(itemRef);
      fetchData();
    }
  });
  // DOM'dan butonu kaldır
  e.target.classList.remove("btnList");
  e.target.classList.add("remove");
};
