
$(function () {
  $(".navSection").load("/header");
  $("footer").load("/footer");
});
// document.querySelector('.subCategoryForm').style.display = 'none'

// admin section

// function showProduct(value) {
//   const sections = document.getElementById("content-section");
//   // sections.style.display = "none";
//   const productList = document.getElementById("product-list");
//   const productCreate = document.getElementById("create-product");
//   const productEdit = document.getElementById("edit-product");
//   const catList = document.getElementById("category-list");
//   const catCreate = document.getElementById("create-category");
//   // productList.style.display = "none";
//   // productCreate.style.display = "none";
//   // productEdit.style.display = "none";

//   if (value === "product-list") {
//     console.log('product list')
//     productList.style.display = "block";
//     productCreate.style.display = "none";
//     productEdit.style.display = "none";
//     catList.style.display = "none";
//     catCreate.style.display = "none";
//     console.log("product-list");
//   }
//   if (value === "create-product") {
//     productCreate.style.display = "block";
//     productList.style.display = "none";
//     productEdit.style.display = "none";
//     catList.style.display = "none";
//     catCreate.style.display = "none";
//     console.log("product-cresae");
//     // console.log(
//     //   document.querySelector("#image-upload").style.file
//     // )


//     // console.log()
//     // const fileInput = document.querySelector("#image-upload");
//     // fileInput.addEventListener("change", (event) => {

//     // console.log(fileInput.style)
//     // const file = event.target.files[0]; // Get the first file from the FileList
//     // if (file) {
//     // console.log("File name:", file.name); // Access the file name
//     // Generate a temporary object URL for the fil
//     // const fileURL = URL.createObjectURL(file);
//     // You can now use the fileURL as a src for an image
//     // console.log("File URL:", fileURL);
//     // Set the temporary URL as the src of the image element for preview
//     // document.querySelector('.preview img').src = fileURL;
//     // } else {
//     // console.log("No file selected");
//     // }
//     // });
//     // if (file) {
//     //   console.log("File name:", file.name); // Access the file name
//     // }
//   }
//   if (value === "edit-product") {
//     productEdit.style.display = "block";
//     productCreate.style.display = "none";
//     productList.style.display = "none";
//     catList.style.display = "none";
//     catCreate.style.display = "none";
//     console.log("product-edit");
//   }
//   // else {
//   //   productList.style.display = "none";
//   //   productCreate.style.display = "none";
//   //   productEdit.style.display = "none";
//   // }
//   // sections.forEach((section) => section.classList.remove("active"));
// }

// function showCategory(value) {
//   const productList = document.getElementById("product-list");
//   const productCreate = document.getElementById("create-product");
//   const productEdit = document.getElementById("edit-product");
//   const catList = document.getElementById("category-list");
//   const catCreate = document.getElementById("create-category");
//   if (value === "category-list") {
//     catList.style.display = "block";
//     productCreate.style.display = "none";
//     productList.style.display = "none";
//     productEdit.style.display = "none";
//     catCreate.style.display = "none";
//     console.log("cat-create");
//     console.log(window.location.href)
//     // window.location.href = "http://localhost:3500/product/catList"
//     showMainCategory() // show main category 
//   }
//   if (value === "create-category") {
//     catCreate.style.display = "block";
//     productCreate.style.display = "none";
//     productList.style.display = "none";
//     productEdit.style.display = "none";
//     catList.style.display = "none";
//     console.log("cat-create");
//   }
// }






// for selecting size and colour

// document.addEventListener("DOMContentLoaded", () => {
//   // Arrays to store selected sizes and colors
//   const selectedSizes = [];
//   const selectedColors = [];

//   // Handle size selection
//   document.querySelectorAll(".sizes span").forEach((sizeSpan) => {
//     sizeSpan.addEventListener("click", () => {
//       const size = sizeSpan.textContent;

//       // Toggle selection state
//       if (selectedSizes.includes(size)) {
//         selectedSizes.splice(selectedSizes.indexOf(size), 1);
//         sizeSpan.classList.remove("selected");
//       } else {
//         selectedSizes.push(size);
//         sizeSpan.classList.add("selected");
//       }
//       console.log("Selected Sizes:", selectedSizes);
//     });
//   });

//   // Handle color selection

//   document.querySelectorAll(".colors span").forEach((colorSpan) => {
//     colorSpan.addEventListener("click", () => {
//       const color = colorSpan.textContent;

//       // Toggle selection state
//       if (selectedColors.includes(color)) {
//         selectedColors.splice(selectedColors.indexOf(color), 1);
//         colorSpan.classList.remove("selected");
//       } else {
//         selectedColors.push(color);
//         colorSpan.classList.add("selected");
//       }
//       console.log("Selected Colors:", selectedColors);
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  // Arrays to store selected sizes and colors
  const selectedSizes = [];
  const selectedColors = [];

  // Handle size selection
  document.querySelectorAll(".sizes span").forEach((sizeSpan) => {
    sizeSpan.addEventListener("click", () => {
      const size = sizeSpan.textContent;

      // Toggle selection state
      if (selectedSizes.includes(size)) {
        selectedSizes.splice(selectedSizes.indexOf(size), 1);
        sizeSpan.classList.remove("selected");
      } else {
        selectedSizes.push(size);
        sizeSpan.classList.add("selected");
      }
      console.log("Selected Sizes:", selectedSizes);
    });
  });

  // Handle color selection
  document.querySelectorAll(".colors span").forEach((colorSpan) => {
    colorSpan.addEventListener("click", () => {
      const color = colorSpan.textContent;

      // Toggle selection state
      if (selectedColors.includes(color)) {
        selectedColors.splice(selectedColors.indexOf(color), 1);
        colorSpan.classList.remove("selected");
      } else {
        selectedColors.push(color);
        colorSpan.classList.add("selected");
      }
      console.log("Selected Colors:", selectedColors);
    });
  });

  // Image upload functionality
  const uploadBox = document.querySelector(".upload-box");
  const fileInput = document.getElementById("image-upload");

  uploadBox.addEventListener("click", () => {
    fileInput.click(); // Trigger the hidden file input
  });

  fileInput.addEventListener("change", (event) => {
    const files = fileInput.files;
    if (files.length > 0) {
      const fileNames = Array.from(files).map((file) => file.name);
      uploadBox.textContent = `Uploaded: ${fileNames.join(", ")}`;
      console.log("Uploaded Files:", files);
    }


    console.log(fileInput.style)
    const file = event.target.files[0]; // Get the first file from the FileList
    if (file) {
      console.log("File name:", file.name); // Access the file name
      // Generate a temporary object URL for the fil
      const fileURL = URL.createObjectURL(file);
      // You can now use the fileURL as a src for an image
      console.log("File URL:", fileURL);
      // Set the temporary URL as the src of the image element for preview
      document.querySelector('.preview img').src = fileURL;
    } else {
      console.log("No file selected");
    }
  });

  const uploadBoxs = document.querySelector("#upload-boxs");
  const fileInputs = document.getElementById("image-uploads");
  const previewContainer = document.querySelector(".multiProductImage");

  // Trigger the file input click when the upload box is clicked
  uploadBoxs.addEventListener("click", () => {
    fileInputs.click(); // Trigger the hidden file input
  });

  // Handle image upload and preview
  fileInputs.addEventListener("change", function (event) {
    const files = event.target.files; // Get the selected files

    // Clear previous previews
    previewContainer.innerHTML = '';

    // Loop through selected files and create image elements for each
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Create a FileReader to read the file as a data URL
      const reader = new FileReader();

      reader.onload = function (e) {
        // Create an image element
        const imgElement = document.createElement("img");
        imgElement.src = e.target.result; // Set the image source to the file data
        imgElement.alt = `Product Image ${i + 1}`; // Set the alt text
        imgElement.style.maxWidth = '100px'; // You can style it as per your need
        imgElement.style.margin = '5px'; // Add some space between images

        // Append the image to the preview container
        previewContainer.appendChild(imgElement);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  });

  // Step 1: Define the route to section mapping
  const routes = {
    "/admin/dashboard/category-lists": "#category-list",        // Maps to the Home section
    // "/admin/dashboard/category-edit": "#subcategory-container",  // Maps to the Settings section
    "/admin/dashboard/category-create": "#create-category",   // Maps to the Profile section
    "/admin/dashboard/category-edit": "#category-edit"
  };

  const sections = document.querySelectorAll(".section");

  // Step 2: Hide all sections and then show the active one
  const renderRoute = (route) => {
    console.log('route in renderRoute', route)
    // Hide all sections
    sections.forEach((section) => section.style.display = "none");
    console.log(routes[route])
    // Show the section corresponding to the current route

    if (routes[route] === "#category-list") {
      document.querySelector("#category-list").style.display = "block";
      showMainCategory()
    }
    else if (routes[route] === "#create-category") {
      document.querySelector("#create-category").style.display = "block";
      document.querySelector("#create-category .main-content").style.display = "block";
      document.querySelector("#create-category .main-content .section").style.display = "block";
      document.querySelector("#create-category .main-content #createCategoryForm .section").style.display = "block";

    }
    else if (routes[route] === "#category-edit") {
      console.log('heo')
      document.querySelector("#edit-category").style.display = "block";
      document.querySelector("#create-category").style.display = "block";
      document.querySelector("#create-category .main-content").style.display = "block";
      document.querySelector("#create-category .main-content .section").style.display = "block";
      document.querySelector("#create-category .main-content #createCategoryForm .section").style.display = "block";

    }
    else {
      // If no matching section is found, show a default "404" message
      document.body.innerHTML = "<h1>404 - Page Not Found</h1>";
    }
  };

  // Step 3: Navigate to a new route and update browser history
  const navigateTo = (route) => {
    // Update the browser's address bar using pushState (without reloading the page)
    history.pushState(null, "", route);
    // Render the content for the current route
    renderRoute(route);
  };

  // Step 4: Attach event listeners to <a> tags for navigation
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      console.log('clicked', link)
      event.preventDefault();  // Prevent the default anchor tag behavior (page reload)
      const route = link.getAttribute("data-route");  // Get the route from the href attribute
      console.log('route', route)
      navigateTo(route);  // Navigate to the route
    });
  });

  // Step 5: Handle back/forward navigation in the browser
  window.addEventListener("popstate", () => {
    // When the user goes back/forward, render the content for the current route
    renderRoute(window.location.pathname);
  });

  // Step 6: Load the initial route on page load
  renderRoute(window.location.pathname || "/dashboard/home");
})

let selected_Category_value = {};// Declare selected_Category_value as an object
//main category shows with name and tagId
async function showMainCategory() {
  // creating var to category data
  const categoriesData = [];
  let mainCategoryTagId
  // console.log(categoriesData)
  // step : request to a server to get the existing categories data from the database
  try {
    const fetchWithTimeout = (url, options, timeout = 5000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
      ]);
    };

    const fetchWithRetry = async (url, options, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetchWithTimeout(url, options);
          if (!response.ok) throw new Error('Network response was not ok');
          return response;
        } catch (error) {
          if (i === retries - 1) throw error;
        }
      }
    };

    const response = await fetchWithRetry('/admin/dashboard/getallcategory', {
      method: 'GET',
    });
    if (response.ok) {
      const categories = await response.json();
      console.log('Categories:', categories.data);
      categoriesData.push(...categories.data)
    } else {
      console.error('Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching main category from server. Please try again. ');
  }
  // console.log(categoriesData)
  let div;
  const categoriesContainer = document.querySelector('.categories-container')
  categoriesContainer.innerHTML = '';

  categoriesData.map((category, index) => {
    //step1 : create a div element
    div = document.createElement('div')
    div.classList.add('category-box')
    div.innerHTML = ''
    console.log('index', index)
    div.setAttribute('data-category', index)
    div.innerHTML = `
    <img src=${category.CategoryThumbnail} alt='Main Category' >
    <p>${category.name}</p>
    <p>${category.TagId}</p>
    `
    // console.log(category[0])
    //step2 : append the div element to the categories-container
    if (categoriesContainer) {
      categoriesContainer.appendChild(div)
    }
    else {
      console.log('categories-container element not found')
    }
    console.log('category of sub cat', category.subCategories)
  })
  ///cat-list
  const categoriesData1 = [
    {
      name: "Fashion Categories",
      subCategories: [
        {
          name: "Fashion Men, Women & Kid's",
          image: "https://via.placeholder.com/50/0000FF/FFFFFF?text=FM",
          createdBy: "Seller",
          id: "FS16276",
          stock: "46233",
        },
        {
          name: "Women Hand Bag",
          image: "https://via.placeholder.com/50/FF00FF/FFFFFF?text=HB",
          createdBy: "Admin",
          id: "HB73029",
          stock: "2739",
        },
        {
          name: "Cap and Hat",
          image: "https://via.placeholder.com/50/808080/FFFFFF?text=CH",
          createdBy: "Admin",
          id: "CH4929",
          stock: "1829",
        },
      ],
    },
    {
      name: "Electronics Headphone",
      subCategories: [
        {
          name: "Wireless Headphones",
          image: "https://via.placeholder.com/50/FF0000/FFFFFF?text=WH",
          createdBy: "admin",
          id: "EH23818",
          stock: "1902",
        },
        {
          name: "Gaming Headsets",
          image: "https://via.placeholder.com/50/800000/FFFFFF?text=GH",
          createdBy: "Admin",
          id: "GH73122",
          stock: "873",
        },
      ],
    },
    {
      name: "Foot Wares",
      subCategories: [
        {
          name: "Sneakers",
          image: "https://via.placeholder.com/50/008000/FFFFFF?text=SN",
          createdBy: "Seller",
          id: "FW11009",
          stock: "2733",
        },
        {
          name: "Sandals",
          image: "https://via.placeholder.com/50/00FF00/FFFFFF?text=SA",
          createdBy: "Admin",
          id: "SA39201",
          stock: "1932",
        },
      ],
    },
    {
      name: "Eye Ware & Sunglass",
      subCategories: [
        {
          name: "Sunglasses",
          image: "https://via.placeholder.com/50/FFA500/FFFFFF?text=SG",
          createdBy: "Seller",
          id: "SG45123",
          stock: "3421",
        },
        {
          name: "Reading Glasses",
          image: "https://via.placeholder.com/50/FFD700/FFFFFF?text=RG",
          createdBy: "Admin",
          id: "RG12345",
          stock: "1923",
        },
      ],
    },
  ];

  const categoryBoxes = document.querySelectorAll(".category-box");
  const subcategoryContainer = document.getElementById("subcategory-container");
  const subcategoryList = document.getElementById("subcategory-list");
  let selectedCategory;
  categoryBoxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      console.log('clicked', index)
      console.log('box is', box.querySelector('p ~p').textContent)
      mainCategoryTagId = box.querySelector('p ~p').textContent
      console.log(mainCategoryTagId)
      selectedCategory = categoriesData[index];
      subcategoryContainer.style.display = "block";
      subcategoryList.innerHTML = "";
      // console.log(selected_Category_value)
      console.log("subCategory", selectedCategory)

      selectedCategory.subCategories.forEach((subCategory) => {
        const row = document.createElement("tr");
        // console.log("subCategory", subCategory)
        row.innerHTML = `
          <td>${subCategory.TagId}</td>
        <td>${subCategory.name}</td>
        <td>
        <span class="action-btn edit">Edit</span>
        <span class="action-btn delete">Delete</span>
        </td>
        `;
        subcategoryList.appendChild(row);
      });

      editMainCategory(selectedCategory)
    });
    // console.log(selectedCategory)
  });

  // edit main category event
  function editMainCategory(selectedCategory) {
    document.querySelector('#category-list span h2 ~ button').addEventListener('click', (e) => {
      // document.querySelector('#create-category').style.display = 'flex'
      document.querySelector("#create-category").style.display = "block";
      document.querySelector("#create-category .main-content").style.display = "block";
      document.querySelector("#create-category .main-content .section").style.display = "block";
      document.querySelector("#create-category .main-content #createCategoryForm .section").style.display = "block";
      document.querySelector("#create-category")
      const createCategorySection = document.querySelector("#create-category");
      createCategorySection.style.position = "absolute";
      createCategorySection.style.top = "100px";
      createCategorySection.style.zIndex = "1000";
      console.log('click for edit btn main category', selectedCategory.name)

      //assigning  a value to the input field of form main category
      document.getElementById('categoryTitle').value = selectedCategory.name;
      document.getElementById('createdBy').value = selectedCategory.createdBy;
      document.getElementById('tagID').value = selectedCategory.TagId;
      document.getElementById('description').value = selectedCategory.description;

      // Set thumbnail preview if available
      if (selectedCategory.CategoryThumbnail) {
        const thumbnailContainer = document.querySelector('#categoryThumbnail');
        const thumbnailInput = document.querySelector('#thumbnailInput');
        thumbnailInput.removeAttribute('required')
        document.querySelector('#formMode').value = 'edit';

        // const img = document.createElement('img');
        // img.src = selectedCategory.CategoryThumbnail;
        // img.style.maxWidth = '100%';
        // img.style.marginTop = '10px';
        // thumbnailContainer.appendChild(img);
        thumbnailContainer.src = selectedCategory.CategoryThumbnail;
        console.log(thumbnailContainer.src)
      }

    })

    //create category form logic to send data to server and receive response
    const createCategoryForm = document.querySelector('#createCategoryForm');
    createCategoryForm.children[0].action = `/admin/dashboard/updatecategory`
    // createCategoryForm.addEventListener('submit', async (e) => {
    //   e.preventDefault();
    //   // let url = '/admin/dashboard/createcategory'
    //   // Validate form fields
    //   const categoryName = createCategoryForm.categoryTitle.value;
    //   const createdBy = createCategoryForm.createdBy.value;
    //   const description = createCategoryForm.description.value;
    //   const TagId = createCategoryForm.tagId.value;
    //   // const file = createCategoryForm.get('categoryThumbnail'); // Retrieve the image file from FormData
    //   // const fileInput = createCategoryForm.querySelector('input[name="image"]'); // Get the file input element
    //   const cat_existing_thumbnail_for_edit = document.querySelector('#categoryThumbnail')
    //   // console.log(cat_existing_thumbnail_for_edit.children[0].src)
    //   const fileInput = createCategoryForm.querySelector('#thumbnailInput'); // Get the file input element
    //   console.log('fileInput is', fileInput)
    //   const formData = new FormData();
    //   if (fileInput) {
    //     console.log(fileInput)
    //     const file = fileInput.files[0]; // Retrieve the selected file from the file input
    //     console.log(file)

    //     // Create a FormData object
    //     // thumbnailContainer.children[0].src
    //     // Check if a file is selected
    //     if (file) {
    //       formData.append('image', file)
    //       console.log('Image Selected:', file.name);
    //       console.log('File Name:', file.name);
    //       console.log('File Size:', file.size, 'bytes');
    //       console.log('File Type:', file.type);
    //     } else {
    //       alert('Category thumbnail is required.');
    //       console.log('No image file selected');
    //     }

    //   }
    //   // else {
    //   //   if (cat_existing_thumbnail_for_edit != undefined) {
    //   //     url = '/admin/dashboard/updatecategory'
    //   //     console.log('cat_existing_thumbnail_for_edit is appended into a formData object')
    //   //     formData.append('image', cat_existing_thumbnail_for_edit.src)
    //   //   }
    //   //   else {
    //   //     console.log('cat_existing_thumbnail_for_edit is undefined')
    //   //   }
    //   // }
    //   if (categoryName && categoryName.trim() !== '' && typeof categoryName === 'string' && categoryName.length > 0) {
    //     formData.append('categoryName', categoryName)
    //     console.log("category name is appended into formData object")
    //   } else {
    //     alert('Category name is required.');
    //     return;
    //   }

    //   if (createdBy && createdBy.trim() !== '' && typeof createdBy === 'string' && createdBy.length > 0) {
    //     formData.append('createdBy', createdBy)
    //     console.log("createdBy is appended into formData object")
    //   }
    //   else {
    //     alert('Created By is required.');
    //     return;
    //   }
    //   if (description && description.trim() !== '' && typeof description === 'string' && description.length > 0) {
    //     formData.append('description', description)
    //     console.log("description is appended into formData object")
    //   }
    //   else {
    //     alert('Description is required.');
    //     return;
    //   }
    //   if (TagId && TagId.trim() !== '' && typeof TagId === 'string' && TagId.length > 0) {
    //     formData.append('TagId', TagId)
    //     console.log("TagId is appended into formData object")
    //   }
    //   else {
    //     alert('TagId is required.');
    //     return;
    //   }
    //   // console.log('formData', formData)
    //   // Log formData correctly
    //   for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    //   }

    //   try {
    //     // console.log(url)
    //     const response = await fetch('/admin/dashboard/updatecategory', {
    //       method: 'POST',
    //       body: formData,
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log(`Category updated successfully!`, data);
    //       // resetForm();
    //       if (data.data) {
    //         // console.log(data.message)
    //         alert(`${data.message}`);
    //         console.log('Category created successfully!');
    //         // resetForm();
    //         // showCategory('category-list')
    //         window.location.href = 'http://localhost:3500/admin/dashboard/category-lists'
    //         console.log(window.location.href)
    //       }
    //       else {
    //         alert('Failed to create category. Please try again.');
    //       }
    //     } else {
    //       // alert('Failed to create category. Please try again.');
    //       const errorData = await response.json(); // Parse the error response

    //       console.error('Error:', errorData); // Log error details

    //       alert(`Error uploading image: ${errorData.error || 'Unknown error'}`); // Notify the users
    //     }
    //   } catch (error) {
    //     console.error('Error:', error);
    //     alert('An error occurred. Please try again.');
    //   }
    // })


  }


  //
  const sCb = document.querySelector('#subcategory-list')
  // document.querySelector('.subCategoryForm').style.display = 'flex'
  // try {
  subcategoryList.addEventListener("click", (event) => {
    console.log(sCb)
    const btn = document.querySelector('#subcategory-list tr ')
    console.log(btn)
    //      Find the closest parent <tr> for the clicked element
    const clickedRow = event.target.closest('tr');

    if (clickedRow) {
      // Perform actions based on the clicked element's class
      if (event.target.classList.contains("edit")) {
        subCategoryEditAction(clickedRow, mainCategoryTagId);
        console.log("Edit button clicked", clickedRow);

        // Perform actions for the "Edit" button
      } else if (event.target.classList.contains("delete")) {
        console.log("Delete button clicked", clickedRow);
        // Perform actions for the "Delete" button
        // subCategoryDeleteAction(clickedRow);
      } else {
        console.log("Clicked outside buttons but within a row:", clickedRow);
      }
    } else {
      console.log("Clicked outside any row, ignoring...");
    }
  });
  // }
  // catch (err) {
  //   console.log(err)
  //   console.log('not worked')
  // }



  //
  // console.log(document.querySelector('#subcategory-list td .action-btn'))
  const createSubCategorybtn = document.querySelector('.createSubCategorybtn')
  createSubCategorybtn.addEventListener('click', () => {
    const subCategoryForm = document.querySelector('.subCategoryForm')
    if (subCategoryForm) {
      subCategoryForm.style.display = 'flex'
      subCategoryForm.style.color = 'blue'
      // document.querySelector('.subCategoryForm').id = 'subCatFormAdd'
    }
    console.log(selected_Category_value)
    // Set the value of the Main Category TagId input
    document.getElementById("mainCategoryTagId").value = mainCategoryTagId; // Assuming each category has a 'TagId'
    console.log('create sub categoryBtn', createSubCategorybtn)
  })

  // Close subCategoryForm when clicking outside of it
  document.addEventListener('click', (event) => {
    const subCategoryForm = document.querySelector('.subCategoryForm');
    // if (!subCategoryForm.contains(event.target) && !createSubCategorybtn.contains(event.target)) {
    //   event.stopPropagation();
    //   subCategoryForm.style.display = 'none ';
    //   // document.querySelector('.subCategoryForm').classList.add('subCatFormRemove')
    //   // document.querySelector('.subCategoryForm').id = 'subCatFormRemove'

    // }
    document.querySelector('.subCategoryForm form .form-buttons .btn-danger').addEventListener('click', (event) => {
      console.log('cancel button')
      subCategoryForm.style.display = 'none ';
    })
  });

};
function subCategoryEditAction(clickedRow, mainCategoryTagId) {
  console.log('Edit button clicked');

  // Get the container element and set its display property
  const subCategoryForm = document.querySelector('.subCategoryForm');

  // Check if the form is found
  if (!subCategoryForm) {
    console.error('SubCategory form not found!');
    return; // Exit the function if the form is not found
  }


  // Set the form's display property to 'flex'
  subCategoryForm.style.display = 'flex';
  // console.log(clickedRow.children)
  // console.log(clickedRow.children[0].innerHTML)
  // console.log(clickedRow.children[1].innerHTML)
  // console.log(mainCategoryTagId)
  document.querySelector('.subCategoryForm form ').subCategoryName.value = clickedRow.children[0].innerHTML
  document.querySelector('.subCategoryForm form ').tagId.value = clickedRow.children[1].innerHTML
  document.querySelector('.subCategoryForm form').mainCategoryTagId.value = mainCategoryTagId
  // subCategoryForm.children[0].action = `/admin/dashboard/createsubcategory`

  console.log(subCategoryForm.children[0].action)
  const subformMode = document.querySelector('#subformMode').value = 'editSub';
  console.log(`subformMode is ${subformMode}`);// console.log(subCategoryForm)
  // subCategoryForm.addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //   const formData = {};
  //   const subCategoryName = document.querySelector('.subCategoryForm form ').subCategoryName.value;
  //   console.log(subCategoryName, document.querySelector('.subCategoryForm form ').subCategoryName.value)
  //   // const subCategoryCreatedBy = subCategoryForm.subCategoryCreatedBy.value;
  //   const description = document.querySelector('.subCategoryForm form ').description.value;
  //   const categoryTagId = document.querySelector('.subCategoryForm form ').mainCategoryTagId.value;
  //   const TagId = document.querySelector('.subCategoryForm form ').tagId.value;
  //   console.log(TagId)
  //   if (categoryTagId && categoryTagId.trim() !== '' && typeof categoryTagId === 'string' && categoryTagId.length > 0) {
  //     console.log('Category TagId:', categoryTagId);
  //     formData.categoryTagId = categoryTagId;
  //   }

  //   if (subCategoryName && subCategoryName.trim() !== '' && typeof subCategoryName === 'string' && subCategoryName.length > 0) {
  //     console.log('Sub Category Name:', subCategoryName);
  //     formData.subCategoryName = subCategoryName;
  //   }
  //   else {
  //     alert('Sub Category name is required.');
  //     return;
  //   }
  //   if (description && description.trim() !== '' && typeof description === 'string' && description.length > 0) {
  //     console.log('Description:', description);
  //     formData.description = description;
  //   }
  //   else {
  //     alert('Description is required.');
  //     return;
  //   }
  //   if (TagId && TagId.trim() !== '' && typeof TagId === 'string' && TagId.length <= 10) {
  //     console.log('TagId:', TagId);
  //     formData.TagId = TagId;
  //   }
  //   else {
  //     alert('TagId is required.');
  //     return;
  //   }
  //   console.log('formData', formData)
  //   try {
  //     const response = await fetch('/admin/dashboard/createsubcategory', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     })
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Sub Category Added Successfully', data);
  //       alert('Sub Category Added Successfully');
  //       // subCategoryForm.style.display = 'none'
  //       // document.querySelector('.subCategoryForm').style.display = 'none'
  //       // document.querySelector('.subCategoryForm').style.hidden = true
  //       document.querySelector('.subCategoryForm').style.display = 'none'


  //       // document.querySelector('.subCategoryForm').id = 'subCatFormRemove'
  //     }
  //     else {
  //       const data = await response.json();
  //       console.log('Error while adding sub category', data);
  //       alert('Failed to add sub category something went wrong or sub category already exists in db');
  //       subCategoryForm.style.display = 'none';
  //       // document.querySelector('.subCategoryForm').style.hidden = true
  //       // document.querySelector('.subCategoryForm').id = 'subCatFormRemove'
  //     }

  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('An error occurred in sub Category form while sending data or receiving data from server . Please try again.');
  //   }
  // })
}
// sub category form logic to send data to server and receive response
const subCategoryForm = document.querySelector('.subCategoryForm form');
// console.log(subCategoryForm)
subCategoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let url;
  if (document.querySelector('#subformMode').value === 'createSub') {
    url = '/admin/dashboard/createsubcategory'
  }
  else if (document.querySelector('#subformMode').value === 'editSub') {
    url = '/admin/dashboard/editsubcategory'
  }
  const formData = {};
  const subCategoryName = subCategoryForm.subCategoryName.value;
  // const subCategoryCreatedBy = subCategoryForm.subCategoryCreatedBy.value;
  const description = subCategoryForm.description.value;
  const categoryTagId = subCategoryForm.mainCategoryTagId.value;
  const TagId = subCategoryForm.tagId.value;
  console.log(TagId)
  if (categoryTagId && categoryTagId.trim() !== '' && typeof categoryTagId === 'string' && categoryTagId.length > 0) {
    console.log('Category TagId:', categoryTagId);
    formData.categoryTagId = categoryTagId;
  }

  if (subCategoryName && subCategoryName.trim() !== '' && typeof subCategoryName === 'string' && subCategoryName.length > 0) {
    console.log('Sub Category Name:', subCategoryName);
    formData.subCategoryName = subCategoryName;
  }
  else {
    alert('Sub Category name is required.');
    return;
  }
  if (description && description.trim() !== '' && typeof description === 'string' && description.length > 0) {
    console.log('Description:', description);
    formData.description = description;
  }
  else {
    alert('Description is required.');
    return;
  }
  if (TagId && TagId.trim() !== '' && typeof TagId === 'string' && TagId.length <= 10) {
    console.log('TagId:', TagId);
    formData.TagId = TagId;
  }
  else {
    alert('TagId is required.');
    return;
  }
  console.log('formData', formData)
  try {
    console.log(url)
    console.log('Selected Portion is empty. Adding logs to the entire code file.')
    const response = await fetch('/admin/dashboard/createsubcategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      const data = await response.json();
      console.log('Sub Category Added Successfully', data);
      alert('Sub Category Added Successfully');
      // document.querySelector('.subCategoryForm').style.hidden = true
      document.querySelector('.subCategoryForm').style.display = 'none'
    }
    else {
      const data = await response.json();
      console.log('Error while adding sub category', data);
      alert('Failed to add sub category something went wrong or sub category already exists in db');
      // document.querySelector('.subCategoryForm').style.display = 'none'
      document.querySelector('.subCategoryForm').style.hidden = true
      // document.querySelector('.subCategoryForm').id = 'subCatFormRemove'
    }

  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred in sub Category form while sending data or receiving data from server . Please try again.');
  }
})

const createCategoryBtn = document.querySelector('.createCatBtn')
createCategoryBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:3500/admin/dashboard/category-create';
  document.querySelector('#formMode').value = 'create';

  // document.querySelector('#create-category').style.display = 'block'
  // document.querySelector('.subcategory-container').style.display = 'none'
  // document.querySelector('#create-category .main-content').style.display = 'block'
  // // document.querySelector('#create-category #createCategoryForm').style.display = 'flex'
  // document.querySelector('#create-category #createCategoryForm .section').style.display = 'block'
  // document.querySelector('.cat-container').style.margin = '0'
  // document.querySelector('.container ').style.height = '175vh'


})
// creating category
// Reset Form Functionality
function resetForm() {
  const form = document.getElementById("createCategoryForm");
  form.reset();
  document.getElementById("thumbnailInput").value = "";
  document.getElementById("categoryThumbnail").src =
    "https://via.placeholder.com/200x150";
}

// Thumbnail Preview
document.getElementById("thumbnailInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("categoryThumbnail").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.querySelector('.create-btn').addEventListener('click', async (Event) => {
  // document.querySelector("#create-product").style.display = 'block'
  showProduct('create-product')

})

//create category form logic to send data to server and receive response
const createCategoryForm = document.querySelector('#createCategoryForm');
createCategoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formMode = document.querySelector('#formMode').value;
  console.log(`formMode is ${formMode}`);
  let url;
  // Validate form fields
  const categoryName = createCategoryForm.categoryTitle.value;
  const createdBy = createCategoryForm.createdBy.value;
  const description = createCategoryForm.description.value;
  const TagId = createCategoryForm.tagId.value;
  // const file = createCategoryForm.get('categoryThumbnail'); // Retrieve the image file from FormData
  // const fileInput = createCategoryForm.querySelector('input[name="image"]'); // Get the file input element
  const cat_existing_thumbnail_for_edit = document.querySelector('#categoryThumbnail')
  console.log(cat_existing_thumbnail_for_edit.src)
  const fileInput = createCategoryForm.querySelector('#thumbnailInput'); // Get the file input element
  console.log('fileInput is', fileInput)
  const formData = new FormData();

  if (formMode === 'create') {
    if (fileInput.files[0] !== undefined) {
      console.log(fileInput)
      const file = fileInput.files[0]; // Retrieve the selected file from the file input
      console.log(file)
      url = '/admin/dashboard/createcategory'
      // Create a FormData object
      // thumbnailContainer.children[0].src
      // Check if a file is selected
      formData.append('image', file)
      console.log('Image Selected:', file.name);
      console.log('File Name:', file.name);
      console.log('File Size:', file.size, 'bytes');
      console.log('File Type:', file.type);
    } else {
      // alert('image is required')
      console.log(' image is required')
    }
  } else if (formMode === 'edit') {
    if (fileInput.files[0] !== undefined) {
      console.log(fileInput)
      const file = fileInput.files[0]; // Retrieve the selected file from the file input
      console.log(file)
      url = '/admin/dashboard/updatecategory'
      // Create a FormData object
      // thumbnailContainer.children[0].src
      // Check if a file is selected
      formData.append('image', file)
      console.log('Image Selected:', file.name);
      console.log('File Name:', file.name);
      console.log('File Size:', file.size, 'bytes');
      console.log('File Type:', file.type);
    } else {
      alert('image is required')
      console.log(' image is required')
      url = '/admin/dashboard/updatecategory'
      formData.append('image', cat_existing_thumbnail_for_edit.src)
      console.log('image is selected from cat_existing_thumbnail_for_edit.src')
    }
  }

  if (categoryName && categoryName.trim() !== '' && typeof categoryName === 'string' && categoryName.length > 0) {
    formData.append('categoryName', categoryName)
    console.log("category name is appended into formData object")
  } else {
    alert('Category name is required.');
    return;
  }

  if (createdBy && createdBy.trim() !== '' && typeof createdBy === 'string' && createdBy.length > 0) {
    formData.append('createdBy', createdBy)
    console.log("createdBy is appended into formData object")
  }
  else {
    alert('Created By is required.');
    return;
  }
  if (description && description.trim() !== '' && typeof description === 'string' && description.length > 0) {
    formData.append('description', description)
    console.log("description is appended into formData object")
  }
  else {
    alert('Description is required.');
    return;
  }
  if (TagId && TagId.trim() !== '' && typeof TagId === 'string' && TagId.length > 0) {
    formData.append('TagId', TagId)
    console.log("TagId is appended into formData object")
  }
  else {
    alert('TagId is required.');
    return;
  }
  // console.log('formData', formData)
  // Log formData correctly
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    console.log(url)
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Category updated successfully!`, data);
      // resetForm();
      if (data.data) {
        // console.log(data.message)
        alert(`${data.message}`);
        console.log('Category created successfully!');
        // resetForm();
        // showCategory('category-list')
        window.location.href = 'http://localhost:3500/admin/dashboard/category-lists'
        console.log(window.location.href)
      }
      else {
        alert('Failed to create category. Please try again.');
      }
    } else {
      // alert('Failed to create category. Please try again.');
      const errorData = await response.json(); // Parse the error response

      console.error('Error:', errorData); // Log error details

      alert(`Error uploading image: ${errorData.error || 'Unknown error'}`); // Notify the users
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
})