const API_URL = 'https://68038d9b0a99cb7408ec5706.mockapi.io/user/User';

let editingId = null;

// Kontaktlarni yuklash
async function fetchContacts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = '';
        data.forEach(contact => renderContact(contact));
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

// Kontaktni render qilish
function renderContact(contact) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${contact.name} - ${contact.number}</span>
        <div>
            <button onclick="startEdit('${contact.id}', '${contact.name}', '${contact.number}')">✏️</button>
            <button onclick="deleteContact('${contact.id}')">🗑</button>
        </div>
    `;
    document.getElementById('contactList').appendChild(li);
}

// Kontakt qo'shish yoki yangilash
async function addContact() {
    const name = document.getElementById('nameInput').value.trim();
    const number = document.getElementById('numberInput').value.trim();

    if (!name || !number) {
        return alert('Iltimos, barcha maydonlarni to`ldiring');
    }

    const contactData = { name, number };

    try {
        if (editingId) {
            // UPDATE
            await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            editingId = null;
            document.querySelector('button').innerText = 'Add Contact';
        } else {
            // YANGI qo'shish
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
        }

        document.getElementById('nameInput').value = '';
        document.getElementById('numberInput').value = '';
        fetchContacts();
    } catch (error) {
        console.error('Error adding/updating contact:', error);
    }
}

// Kontaktni o'chirish
async function deleteContact(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchContacts();
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

// Kontaktni tahrirlash uchun inputlarga joylash
function startEdit(id, name, number) {
    document.getElementById('nameInput').value = name;
    document.getElementById('numberInput').value = number;
    editingId = id;
    document.querySelector('button').innerText = 'Update Contact';
}

// Dastlabki yuklash
fetchContacts();