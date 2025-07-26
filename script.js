// Birthday Data
const sampleBirthdays = [
    {
        name: "Sounak Roy",
        batch: "2025",
        profession: "Student",
        dob: new Date("2007-05-07"), // May 7
        profilePic: "",
        message: "Wishing you a fantastic year ahead!"
    },
    {
        name: "Anant Raj",
        batch: "2025",
        profession: "Student",
        dob: new Date("2007-11-23"), // November 23
        profilePic: "",
        message: "Happy birthday! Wishing you success!"
    }
];

// DOM Elements
const birthdayForm = document.getElementById('birthdayForm');
const todayList = document.getElementById('todayList');
const upcomingList = document.getElementById('upcomingList');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Load birthdays from localStorage or use sample data
    let birthdays = localStorage.getItem('birthdays') 
        ? JSON.parse(localStorage.getItem('birthdays')) 
        : sampleBirthdays;
    
    // Parse date strings back to Date objects
    birthdays = birthdays.map(b => ({
        ...b,
        dob: new Date(b.dob)
    }));

    // Display current date/time
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Display birthdays
    showTodaysBirthdays(birthdays);
    showUpcomingBirthdays(birthdays);

    // Form submission
    birthdayForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewBirthday(birthdays);
    });
});

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
    document.getElementById('todaysDate').textContent = now.toLocaleDateString();
}

function showTodaysBirthdays(birthdays) {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    
    const todaysBirthdays = birthdays.filter(b => 
        b.dob.getMonth() === todayMonth && 
        b.dob.getDate() === todayDate
    );

    if (todaysBirthdays.length === 0) {
        todayList.innerHTML = '<p class="col-span-full text-gray-500 text-center py-8">No birthdays today!</p>';
        return;
    }

    todayList.innerHTML = todaysBirthdays.map(birthday => `
        <div class="birthday-card bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-start">
                ${birthday.profilePic 
                    ? `<img src="${birthday.profilePic}" alt="${birthday.name}" class="w-12 h-12 rounded-full object-cover mr-4">`
                    : `<div class="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-4">🎂</div>`
                }
                <div>
                    <h3 class="text-xl font-bold">${birthday.name}</h3>
                    <p class="text-gray-600">Batch: ${birthday.batch} • ${birthday.profession}</p>
                    <p class="text-sm text-gray-500">${birthday.dob.toLocaleDateString()}</p>
                    <p class="mt-2 text-purple-600 font-medium">"Happy ${calculateAge(birthday.dob)}th Birthday! ${birthday.message}"</p>
                </div>
            </div>
        </div>
    `).join('');
}

function showUpcomingBirthdays(birthdays) {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];

    upcomingList.innerHTML = monthNames.map((month, monthIndex) => {
        const monthBirthdays = birthdays.filter(b => 
            b.dob.getMonth() === monthIndex && 
            (b.dob.getMonth() > now.getMonth() || 
             (b.dob.getMonth() === now.getMonth() && b.dob.getDate() > now.getDate()))
        );

        return `
            <div class="month-section">
                <h3 class="text-2xl font-semibold mb-4 flex items-center bg-blue-50 p-3 rounded-lg">
                    <span class="bg-blue-100 text-blue-600 rounded-lg px-3 py-1 mr-2">${month}</span>
                    <span class="text-gray-500 text-sm">${monthBirthdays.length} ${monthBirthdays.length === 1 ? 'birthday' : 'birthdays'}</span>
                </h3>
                ${monthBirthdays.length > 0 ? `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${monthBirthdays.map(b => `
                            <div class="birthday-card bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h4 class="font-bold">${b.name}</h4>
                                <p class="text-sm text-gray-600">${month} ${b.dob.getDate()} • Batch ${b.batch}</p>
                                <p class="text-xs text-gray-500 mt-1">Turning ${calculateAge(b.dob) + 1}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-gray-500 text-center py-4">No upcoming birthdays</p>'}
            </div>
        `;
    }).join('');
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function addNewBirthday(birthdays) {
    const formData = new FormData(birthdayForm);
    
    const newBirthday = {
        name: formData.get('name'),
        batch: formData.get('batch'),
        profession: formData.get('profession'),
        dob: new Date(formData.get('dob')),
        message: "We're excited to celebrate with you!",
        profilePic: ""
    };

    // Handle profile picture upload
    const fileInput = document.getElementById('profilePic');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            newBirthday.profilePic = e.target.result;
            saveBirthday([...birthdays, newBirthday]);
        };
        reader.readAsDataURL(file);
    } else {
        saveBirthday([...birthdays, newBirthday]);
    }
}

function saveBirthday(birthdays) {
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
    window.location.reload(); // Refresh to show changes
}
