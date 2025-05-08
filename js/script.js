"use strict";
let contactArray = [];
// constant elements
const contactsTable = document.getElementById('contactsTable');
const form = document.getElementById('form');


// top bar tools elements
const clearAllIcon = document.getElementById('iconClearAll');
const clearAll = document.getElementById('clearAll');
const addBtn = document.getElementById('addUser');
const save = document.getElementById('saveAll');
const btnSearch = document.getElementById('btnSearch');
const iconSearch = document.getElementById('iconSearch'); 
const inputSearch = document.getElementById('searchInput');


// inputs in-form after clicking add a new contact button
const contName = document.getElementById('nameInput');
const phoneNumber = document.getElementById('phoneInput');
const address = document.getElementById('addressInput');
const addContact = document.getElementById('saveInput');
const cancelForm = document.getElementById('cancelInput');
const changeContact = document.getElementById('changeInput');


const checkName = document.getElementById('msgName');
const checkPhone = document.getElementById('msgPhone');
const checkAddress = document.getElementById('msgAddress');


let index; // this is index variable used as static variable, in the change contact multi-functions.

let tempArr = []; // this is a temp array in it is the search reults.

let oldNumber; // this is the old number in the change contact details section.

// Display available contacts.
document.addEventListener('DOMContentLoaded', ()=>{

    // getting the contatcs array from [localStorage => 'contactsArray']to contactArray.
    if (localStorage.getItem('contactsArray')!=null) {
        contactArray = JSON.parse(localStorage.getItem('contactsArray'));
        sort();
        displayContact();
    }
});


// Object constructor for Contact.
function Contact(name, number, address){
    this.name = name;
    this.number = number;
    this.address = address;
}


// <--- 2 events functions to - Add a new contact  ---->

addBtn.addEventListener('click', (e)=>{
    form.style.display = 'block';
    e.preventDefault();
});

addContact.addEventListener('click', (e)=>{
    
    if (nameValidation(contName.value) && !isExistedNumber(phoneNumber.value)
    && numberValidation(phoneNumber.value) && addressValidation(address.value))
    {
        removeMessages();
        successAddContact();
    }
    e.preventDefault();
});




// search field functions

btnSearch.addEventListener('click',(e)=>{
    inputSearch.focus();
    inputSearch.select();
    e.preventDefault();
});

iconSearch.addEventListener('click',(e)=>{
    inputSearch.focus();
    inputSearch.select();
    e.preventDefault();
})

inputSearch.addEventListener('keyup', (e)=>{
    let str = e.target.value.toLowerCase();
    if (str!=''){
        tempArr=contactArray.filter((contact)=>{
            return contact.name.toLowerCase().includes(str);
        });
        sortSearchEvent();
        displayContactSearchEvent();
    }
    else {
        while (contactsTable.lastElementChild)
        {
            if (contactsTable.lastElementChild.className=='row')
                contactsTable.removeChild(contactsTable.lastElementChild);
            else {
                break;
            }
        }
        displayContact();
    }
});


// function to clear all contacts
clearAllIcon.addEventListener('click', ()=>{
    contactArray = [];
    localStorage.setItem('contactsArray', JSON.stringify(contactArray));
    location.reload();
});



// An event if user click on cancel button, then hide the form from the display.
cancelForm.addEventListener('click', ()=>{
    form.style.display = 'none';
});



// if user clicked on save, and there was a new data, put it in the [localStorage => 'contactsArray'].
save.addEventListener('click', ()=>{
    if (contactArray!=null){
        sort();
        localStorage.setItem('contactsArray', JSON.stringify(contactArray));
    }
});


// Display function
function displayContact(){
    sort();
    for (let i = 0; i<contactArray.length; i++)
    {
        addToList(contactArray[i]);
    }
}


// Display function in the search event
function displayContactSearchEvent(){
    while (contactsTable.lastElementChild)
    {
        if (contactsTable.lastElementChild.className == 'row')
            contactsTable.removeChild(contactsTable.lastElementChild);
        else {
            break;
        }
    }
    sortSearchEvent();
    for (let i = 0; i<tempArr.length; i++)
    {
        addToList(tempArr[i]);
    } 
}



changeContact.addEventListener('click', (e)=>{
     
    if (nameValidation(contName.value) && numberValidation(phoneNumber.value) 
    && addressValidation(address.value) && (!isExistedNumberEdit(phoneNumber.value, oldNumber)))
    {
        removeMessages();
        editContact(index, contName.value, phoneNumber.value, address.value);
    }
    e.preventDefault();
});



contactsTable.addEventListener('click', (e)=>{
   
    if (e.target.id == 'iconEdt'){
        let item = e.target.parentElement.parentElement.parentElement;
        let number = item.children[1].textContent;
        let name = '', thisAddress = '';
        let flag = false;
        for (index = 0; index<contactArray.length; index++)
        {
            if (contactArray[index].number == number){
                name = contactArray[index].name;
                thisAddress = contactArray[index].address;
                flag = true;
                break;
            }
        }
        if (flag){
            form.style.display = 'block';
            addContact.style.display = 'none';
            changeContact.style.display = 'block';
            contName.value = name;
            phoneNumber.value = number;
            address.value = thisAddress;
            oldNumber = number;
        }
    }
    e.preventDefault();
});



// function changes the filed's values of a contact
function editContact(index, name, number, address){
    
    contactArray[index].name = name;
    contactArray[index].number = number;
    contactArray[index].address = address;
    sort();
    localStorage.setItem('contactsArray', JSON.stringify(contactArray));
    index = 0;
    location.reload();
}


// event function to delete 1 sprecific contact
contactsTable.addEventListener('click', (e)=>{
    if (e.target.id == 'iconClearOne'){
    // removing from DOM
    let item = e.target.parentElement.parentElement.parentElement;
    contactsTable.removeChild(item); 
    let tempList = contactArray.filter((cont)=>{
        return (cont.number !== item.children[1].textContent);
    });
    contactArray = tempList;
    sort();
    // Removing from Local Storage by overwriting
    localStorage.setItem('contactsArray', JSON.stringify(contactArray));
    }
});

// function to initialize a new contact with the input's values set by the user,
// then add the contact object to the contatcs array, and move the contact to the [addToList] function to,
// create new [HTML] elements to display it.
function successAddContact(){
    const contact = new Contact(contName.value, phoneNumber.value, address.value);
    contactArray.push(contact);
    sort();
    while (contactsTable.lastElementChild)
    {
        if (contactsTable.lastElementChild.className == 'row')
            contactsTable.removeChild(contactsTable.lastElementChild);
        else {
            break;
        }
    }
    form.style.display = 'none';
    displayContact();
}



// Adding to list, a new contact values, display it using a new [div] element that'll be a child of the contatcs container [id = mainTable].

function addToList(item){
    const newContactDiv = document.createElement('div');
    newContactDiv.classList = 'row';
    newContactDiv.innerHTML =`
        <div class='name'>${item.name}</div>
        <div class='phone'>${item.number}</div>
        <div class='address'>${item.address}</div>
        <div class='tools-row'>
            <button type="button" class='trash-btn'>
                <i class='fas fa-trash-alt' id='iconClearOne'></i>
            </button>
            <button type="button" class='edt-btn'>
                <i class='fas fa-user-edit' id='iconEdt'></i>
            </button>
        </div>
    `;
    contactsTable.appendChild(newContactDiv);
}



// Validation function
function nameValidation(name){
    if (name==''){
        checkName.textContent = 'Name cannot be empty!';
        checkName.style.color = 'rgb(233, 17, 17)';
        return false;
    }
    let regex = /^([a-zA-Z0-9]+|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{1,}|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{3,}\s{1}[a-zA-Z0-9]{1,})$/;
    if (!regex.test(name)){
        let icon = `<i class="fas fa-times-circle"></i>`;
        checkName.innerHTML = icon;
        checkName.style.color = 'rgb(233, 17, 17)';
        return false;
    }
    else {
        let icon = `<i class="fas fa-check-circle"></i>`;
        checkName.style.color = 'rgb(22, 195, 22)';
        checkName.innerHTML = icon;
        return true;
    }
}


function numberValidation(number){
    if (number == ''){
        let icon = `<i class="fas fa-times-circle"></i>`;
        checkPhone.innerHTML = icon;
        checkPhone.textContent = 'Phone number cannot be empty!';
        checkPhone.style.color = 'rgb(233, 17, 17)';
        return false;
    }
    let numberRegex = /^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|([71,72,73,74,75,76,77]{2}\d{7})|[5]{1}\d{8})$/;
    if (!numberRegex.test(number)){
        let icon = `<i class="fas fa-times-circle"></i>`;
        checkPhone.innerHTML = icon;
        checkPhone.style.color = 'rgb(233, 17, 17)';
        return false;
    }
    else {
        let icon = `<i class="fas fa-check-circle"></i>`;
        checkPhone.style.color = 'rgb(22, 195, 22)';
        checkPhone.innerHTML = icon;
        checkPhone.textContent = '';
        return true;
    }
}

function isExistedNumber(number){
    for (let i = 0; i<contactArray.length; i++)
    {
        if (contactArray[i].number == number){
            checkPhone.textContent = 'Phone number already added!';
            checkPhone.style.color = 'rgb(233, 17, 17)';
            return true;
        }
    }
    let icon = `<i class="fas fa-check-circle"></i>`;
    checkPhone.innerHTML = icon;
    checkPhone.textContent = '';
    checkPhone.style.color = 'rgb(22, 195, 22)';
    return false;
}



// function checks if number existed in the edit contact
function isExistedNumberEdit(number1, number2){
    if (number1!=number2){
        for (let i = 0; i<contactArray.length; i++)
        {
            if ((contactArray[i].number == number1)){
                checkPhone.textContent = 'Phone number already existed!';
                checkPhone.style.color = 'rgb(233, 17, 17)';
                return true;
            }
        }
    }
    let icon = `<i class="fas fa-check-circle"></i>`;
    checkPhone.innerHTML = icon;
    checkPhone.textContent = '';
    checkPhone.style.color = 'rgb(22, 195, 22)';
    return false;
}


function addressValidation(address){
    if (address==''){
        let icon = `<i class="fas fa-times-circle" id="failed"></i>`;
        checkAddress.innerHTML = icon;
        checkAddress.textContent = 'address cannot be empty!'
        checkAddress.style.color = 'rgb(233, 17, 17)';
        return false;
    }
    let regex = /^[a-zA-Z.-_0-9]$/;
    if (regex.test(address)){
        let icon = `<i class="fas fa-times-circle" id="failed"></i>`;
        checkAddress.innerHTML = icon;
        checkAddress.style.color = 'rgb(233, 17, 17)';
        return false;
    }
    else {
        let icon = `<i class="fas fa-check-circle"></i>`;
        checkAddress.innerHTML = icon;
        checkAddress.style.color = 'rgb(22, 195, 22)';
        checkAddress.textContent = '';
        return true;
    }
}


// sorting by name
function sort(){
    contactArray.sort((a, b)=>{
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}


// sort for the array in search event
function sortSearchEvent(){
    tempArr.sort((a, b)=>{
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}


// remove messages above input fields
function removeMessages(){

    checkName.remove(checkName.lastElementChild);
    checkPhone.remove(checkPhone.lastElementChild);
    checkAddress.remove(checkAddress.lastElementChild);

    checkName.textContent = '';
    checkPhone.textContent = '';
    checkAddress.textContent = '';
}