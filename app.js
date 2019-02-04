/* https://github.com/vipinkrishna */

const userList = document.querySelector('#user-list');
const addForm = document.querySelector('#user-add-form');

let users=[];
let filteredUsers=[];

//SEARCH FILTER
const search = document.querySelector('#search');
search.addEventListener('input', (e) => {
    let value = e.target.value;
    if(value.length > 0) {
        searchFilter(value);
    } else {
        userList.innerHTML = '';  //EMPTY DOM LIST
        users.forEach(doc => renderUser(doc));
    }
});

//SEARCH FILTER
function searchFilter(value) {
    // const regex = new RegExp(`${value}`, 'i');
    const regex = new RegExp(value, 'i');

    // filteredUsers = users.filter(doc => !Object.keys(doc.data()).every(key => regex.test(doc.data()[key]) ? false: true));
    // filteredUsers = users.filter(doc => !(Object.keys(doc.data()).every(key => (typeof doc.data()[key] === 'object') ? true : !regex.test(doc.data()[key]))))

    filteredUsers = users.filter(doc => Object.keys(doc.data()).some(key => ((key === "timestamp") ? false : regex.test(doc.data()[key]))));  //NEW SEARCH ALGORITHM

    userList.innerHTML = '';  //EMPTY DOM LIST
    filteredUsers.forEach(doc => renderUser(doc));
}

// CREATE USER LIST
function renderUser(doc) {

    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let phone = document.createElement('span');
    let close = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    phone.textContent = doc.data().phone;
    close.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(phone);
    li.appendChild(close);

    userList.appendChild(li);

    
    // DELETE EVENT
    close.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');

        // db.collection('users').doc(id).delete().then(() => {
        //     let li = userList.querySelector('[data-id="' + id + '"]'); //NEW
        //     userList.removeChild(li);  //NEW
        // });

        db.collection('users').doc(id).delete();

            // let li = userList.querySelector('[data-id="' + id + '"]'); //NEW
            // userList.removeChild(li);  //NEW

    });
}


// CREATE A USER
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('users').add({
        name: addForm.name.value,
        city: addForm.city.value,
        phone: addForm.phone.value
    });
    addForm.name.value = '';
    addForm.city.value = '';
    addForm.phone.value = '';
    addForm.name.focus();
});


// REALTIME EVENT HANDLING
db.collection('users').orderBy('name').onSnapshot(snapshot => {
    
    users = snapshot.docs;
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        //ADD
        if (change.type == 'added') {
            renderUser(change.doc);
            searchFilter(search.value);
        } else if (change.type == 'removed') {
            let li = userList.querySelector('[data-id="' + change.doc.id + '"]');  //OBSELETE
            userList.removeChild(li);  //OBSELETE

            // userList.innerHTML = '';  //EMPTY DOM LIST
            // users.forEach(doc => renderUser(doc));
            // console.log('REMOVED ' + change.doc.id);
        }
    });
});















// =============================================================================
// db.collection().add()
// db.collection().get()
// db.collection().orderBy().get()
// db.collection().onSnapshot()  //docChanges() //type=="added" //type=="removed"
// db.collection().orderBy().onSnapshot()
// db.collection().doc(id).update()
// db.collection().doc(id).set()
// db.collection().doc(id).delete()

// doc.id
// doc.data().name
// snapshot.docs[0].data()
// snapshot.docChanges()[0].type
// snapshot.docChanges()[0].doc.id
// snapshot.docChanges()[0].doc.data().name

//snapshot.docs
//snapshot.docChanges()
// =============================================================================

// // UPDATE
// db.collection('users').doc('DOgwUvtEQbjZohQNIeMr').update({
//     city: 'bangalore'
// });

    
// // SET
// db.collection('users').doc('DOgwUvtEQbjZohQNIeMr').set({
//     city: 'cochin'
// });
// =============================================================================

// // READ
// db.collection('users').orderBy('city').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderUser(doc);
//     });
// });

// users = snapshot.docs.map(doc => doc.data());