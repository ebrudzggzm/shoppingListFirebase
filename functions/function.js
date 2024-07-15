//!to do ; düzenle.

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
