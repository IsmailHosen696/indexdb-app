window.addEventListener("DOMContentLoaded", () => {

    // for loading data
    let productarray = [];
    //getting or creating new db
    let db = null;
    const dbName = "products";
    const indexedDbReq = indexedDB.open(dbName, 1);


    // creating new product
    const createProductBtn = document.getElementById("btn-create");
    const updateProductBtn = document.getElementById("btn-update");

    const prInputName = document.getElementById("productName");
    const prInPrice = document.getElementById("price");
    const cellerIn = document.getElementById("celler");

    createProductBtn.addEventListener('click', () => {
        let instance = {
            id: Math.random(),
            prName: prInputName.value,
            prPrice: prInPrice.value,
            celler: cellerIn.value
        }
        const ntx = db.transaction("allproduct", "readwrite")
        const nPr = ntx.objectStore("allproduct")
        nPr.add(instance)
        productarray.push(instance)
        loadToHtml(productarray)
        instance = null;
        prInputName.value = ""
        prInPrice.value = ""
        cellerIn.value = ""
    })

    //index db on ready
    indexedDbReq.onupgradeneeded = e => {
        db = e.target.result;
        db.createObjectStore("allproduct", { keyPath: "id" })
    }
    indexedDbReq.onsuccess = e => {
        db = e.target.result;
        var objectStore = db.transaction("allproduct", "readonly").objectStore("allproduct")
        objectStore.getAll().onsuccess = e => {
            productarray = e.target.result
            loadToHtml(productarray)
        }
    }
    indexedDbReq.onerror = e => {
        alert(e.target.error)
    }

    if (productarray.length > 0) {
        console.log(document.querySelectorAll(".fa-edit"));
    }

    function loadToHtml(arr) {
        let tbody = document.getElementById("tbody");

        if (arr.length > 0) {
            tbody.innerHTML = arr.map((item, i) => {
                return `<tr>
                <th scope="row">${i + 1}</th>
                <td>${item.prName}</td>
                <td>${item.celler}</td>
                <td>${item.prPrice}</td>
                <td><i id=${item.id} class="fas fa-edit btnedit"></i></td>
                <td><i id=${item.id} class="fas fa-trash btndelete"></i></td>
            </tr>`
            }).join("")

            const alledtBtn = document.querySelectorAll(".fa-edit");
            alledtBtn.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    updateInputs(e.target.id);
                })
            })

            const deleteProductBtn = document.querySelectorAll(".fa-trash");
            deleteProductBtn.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    deleteProduct(e.target.id)
                })
            })
        } else {
            tbody.innerHTML = `<p>No Data found</p>`
        }
    }
    const deleteProduct = async (id) => {
        var objectStore = db.transaction("allproduct", "readwrite").objectStore("allproduct")
        objectStore.delete(parseFloat(id));

        objectStore.getAll().onsuccess = e => {
            productarray = e.target.result
            loadToHtml(productarray)
        }
    }
    const updateInputs = (id) => {
        var objectStore = db.transaction("allproduct", "readwrite").objectStore("allproduct");
        var request = objectStore.get(parseFloat(id));

        request.onerror = function (event) {
            alert(event.target.error)
        };
        // after successfully updated
        request.onsuccess = function (event) {
            var data = event.target.result;
            prInputName.value = data.prName
            prInPrice.value = data.prPrice
            cellerIn.value = data.celler
        }
        updateProductBtn.addEventListener("click", () => updateData(id))
    }
    function updateData(id) {

        var objectStore = db.transaction("allproduct", "readwrite").objectStore("allproduct");
        var request = objectStore.get(parseFloat(id));

        request.onerror = function (event) {
            alert(event.target.error)
        };
        // after successfully updated
        request.onsuccess = function (event) {
            var data = event.target.result;
            data.prName = prInputName.value
            data.prPrice = prInPrice.value
            data.celler = cellerIn.value

            var requestUpdate = objectStore.put(data);

            requestUpdate.onerror = function (event) {
                alert(event.target.error)
            };
            requestUpdate.onsuccess = function (event) {
                alert("updated")
                let newIstance = [];
                newIstance = productarray.filter(ar => {
                    if (ar.id === requestUpdate.result) {
                        ar.prName = prInputName.value
                        ar.prPrice = prInPrice.value
                        ar.celler = cellerIn.value
                    }
                    return ar
                })
                loadToHtml(newIstance);
            };
        };

    }
})