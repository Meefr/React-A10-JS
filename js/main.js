var prods = JSON.parse(localStorage.getItem("products")) || [];
var productsContainer = document.getElementById("product-tabel-container");
var warningMessage = document.getElementById("warning-msg");
var tableBody = document.getElementById("tabel-body");

class Product {
  constructor(name, cat, price, dec) {
    this.name = name;
    this.cat = cat;
    this.price = price;
    this.dec = dec;
  }
  edit(name, cat, price, dec) {
    this.name = name;
    this.cat = cat;
    this.price = price;
    this.dec = dec;
  }
}

class Products {
  constructor() {
    this.products = [];
  }
  addProduct(pName, pCat, pPrice, pDesc) {
    let p = new Product(pName, pCat, pPrice, pDesc);
    this.products.push(p);
    return p;
  }
  numberOfProducts() {
    return this.products.length;
  }
}

let products = new Products();

prods.products.forEach((element) => {
  products.addProduct(element.name, element.cat, element.price, element.dec);
});

function handleRenderData() {
  if (products && products.numberOfProducts() !== 0) {
    productsContainer.classList.remove("d-none");
    productsContainer.classList.add("d-block");
    warningMessage.classList.add("d-none");
    warningMessage.classList.remove("d-block");

    tableBody.innerHTML = "";
    for (let i = 0; i < products.numberOfProducts(); i++) {
      var row = document.createElement("tr");

      var cellIndex = document.createElement("th");
      cellIndex.textContent = i + 1;
      row.appendChild(cellIndex);

      var cellName = document.createElement("td");
      cellName.textContent = products.products[i].name;
      row.appendChild(cellName);

      var cellCat = document.createElement("td");
      cellCat.textContent = products.products[i].cat;
      row.appendChild(cellCat);

      var cellPrice = document.createElement("td");
      cellPrice.textContent = products.products[i].price;
      row.appendChild(cellPrice);

      var cellDesc = document.createElement("td");
      cellDesc.textContent = products.products[i].dec;
      row.appendChild(cellDesc);

      var cellEdit = document.createElement("td");
      var editButton = document.createElement("button");
      editButton.className = "btn btn-outline-success";
      editButton.onclick = () => editData(i);
      editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      cellEdit.appendChild(editButton);
      row.appendChild(cellEdit);

      var cellDelete = document.createElement("td");
      var deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-outline-danger";
      deleteButton.onclick = () => deleteData(i);
      deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      cellDelete.appendChild(deleteButton);
      row.appendChild(cellDelete);

      tableBody.appendChild(row);
    }
  } else {
    warningMessage.classList.remove("d-none");
    warningMessage.classList.add("d-block");
    productsContainer.classList.add("d-none");
    productsContainer.classList.remove("d-block");
  }
}

// function Product(pName, pCat,pPrice, pDesc){
//   this.name = pName;
//   this.price = pPrice;
//   this.cat = pCat;
//   this.desc = pDesc;
// }
// Product.prototype.edit = (pName, pCat, pPrice, pDesc) => {
//   this.name = pName;
//   this.price = pPrice;
//   this.cat = pCat;
//   this.desc = pDesc;
// };
// Product.prototype.delete = ()=>{
//   delete this.name;
//   delete this.price;
//   delete this.cat;
//   delete this.desc;

// }

var productName = document.getElementById("product_name");
var productCat = document.getElementById("product_category");
var productPrice = document.getElementById("product_price");
var productDesc = document.getElementById("prodct_desc");

var createBtn = document.getElementById("create-btn");
var productForm = document.getElementById("product-form");

var isEditMode = false;
var editIndex = -1;

handleRenderData();

productForm.onsubmit = function (event) {
  event.preventDefault();

  if (isEditMode) {
    products.products[editIndex].edit(
      productName.value,
      productCat.value,
      productPrice.value,
      productDesc.value
    );
    isEditMode = false;
    createBtn.innerText = "Add Product";
  } else {
    products.addProduct(
      productName.value,
      productCat.value,
      productPrice.value,
      productDesc.value
    );
  }

  localStorage.setItem("products", JSON.stringify(products));
  handleRenderData();
  productForm.reset();
};

function editData(id) {
  productForm.reset();
  productCat.value = products.products[id].cat;
  productDesc.value = products.products[id].dec;
  productName.value = products.products[id].name;
  productPrice.value = products.products[id].price;


  products.products[id].edit(
    productName.value,
    productCat.value,
    productPrice.value,
    productDesc.value
  );
  editIndex = id;

  isEditMode = true;
  createBtn.innerText = "Update Product";
}

function deleteData(id) {
  isEditMode = false;
  createBtn.innerText = "Add Product";
  productForm.reset();
  if (typeof Swal === "undefined") {
    if (confirm("Do you want to delete item?")) {
      products.products.splice(id, 1);
      localStorage.setItem("products", JSON.stringify(products));
      handleRenderData();
      alert("Deleted!");
    }
  } else {
    Swal.fire({
      title: "Do you want to delete item?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        products.products.splice(id, 1);
        localStorage.setItem("products", JSON.stringify(products));
        handleRenderData();
        Swal.fire("Deleted!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Item didn't delete", "", "info");
      }
    });
  }
}

var searchInput = document.getElementById("search-input");
searchInput.onkeyup = () => {
  var value = searchInput.value.toLowerCase();
  var row = "";

  for (let i = 0; i < products.numberOfProducts(); i++) {
    if (products.products[i].name.toLowerCase().includes(value)) {
      const regex = new RegExp(`(${value})`, "gi");
      const highlightedName = products.products[i].name.replace(
        regex,
        '<span class="highlight">$1</span>'
      );

      row += `<tr>
        <th>${i + 1}</th>
        <td>${highlightedName}</td>
        <td>${products.products[i].cat}</td>
        <td>${products.products[i].price}</td>
        <td>${products.products[i].dec}</td>
        <td>
          <button class="btn btn-outline-success" onclick="editData(${i})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </td>
        <td>
          <button class="btn btn-outline-danger" onclick="deleteData(${i})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`;
    }
  }

  if (row) {
    tableBody.innerHTML = row;
  } else {
    alert("No Results");
    handleRenderData();
    searchInput.value = "";
  }
};
