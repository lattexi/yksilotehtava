import { errorModal, restaurantModal, restaurantRow, weeklyRestaurantModal } from './components';
import { fetchData } from './functions';
import { apiUrl, positionOptions } from './variables';
import { Menu, Restaurant } from './interfaces';

const modal = document.getElementById('restaurant-modal') as HTMLDialogElement;
const modalContent = document.getElementById('modal-content') as HTMLDivElement;
const closeModalButton = document.getElementById('close-modal-button') as HTMLButtonElement;

if (!modal || !modalContent || !closeModalButton) {
  throw new Error('Modal elements not found');
}

modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeModal();
});

closeModalButton.addEventListener('click', (event) => {
  event.stopPropagation();
  closeModal();
});

function openModal() {
  document.body.classList.add('modal-open');
  modal.showModal();
}

function closeModal() {
  const allHighs = document.querySelectorAll('.highlight');
  allHighs.forEach((high) => {
    high.classList.remove('highlight');
  });
  document.body.classList.remove('modal-open');
  modal.close();
}

const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const createTable = (restaurants: Restaurant[]) => {
  const tableBody = document.getElementById('restaurant-table-body') as HTMLTableSectionElement;
  if (!tableBody) {
    throw new Error('Table body not found');
  }
  tableBody.innerHTML = '';
  restaurants.forEach((restaurant: Restaurant) => {
    const tr = restaurantRow(restaurant);
    tableBody.appendChild(tr);
    tr.addEventListener('click', async () => {
      try {
        tr.classList.add('highlight');

        const dayMenu: Menu = await fetchData(apiUrl + `/restaurants/daily/${restaurant._id}/fi`);

        if (dayMenu && dayMenu.courses && dayMenu.courses.length > 0) {
          modalContent.innerHTML = '';
          const menuHtml = restaurantModal(restaurant, dayMenu);
          modalContent.innerHTML = menuHtml;
          console.log(dayMenu);
        } else {
          modalContent.innerHTML = errorModal('Menu not available.');
        }
        openModal();
      } catch (error) {
        modalContent.innerHTML = errorModal((error as Error).message);
        openModal();
      }

      const weekMenuButton = document.getElementById('week') as HTMLButtonElement;
      const dayMenuButton = document.getElementById('day') as HTMLButtonElement;

      weekMenuButton.onclick = async () => {
        try {
          const weekMenu = await fetchData(apiUrl + `/restaurants/weekly/${restaurant._id}/fi`);
          console.log(weekMenu);

          if (weekMenu && weekMenu.days && weekMenu.days.length > 0) {
            modalContent.innerHTML = '';
            const menuHtml = weeklyRestaurantModal(restaurant, weekMenu.days);
            modalContent.innerHTML = menuHtml;
          } else {
            modalContent.innerHTML = errorModal('Weekly menu not available.');
          }
        } catch (error) {
          if (error instanceof Error) {
            modalContent.innerHTML = errorModal(error.message);
          } else {
            modalContent.innerHTML = errorModal('An unknown error occurred.');
          }
        }
      };

      dayMenuButton.onclick = async () => {
        try {
          const dayMenu = await fetchData(apiUrl + `/restaurants/daily/${restaurant._id}/fi`);
          console.log(dayMenu);

          if (dayMenu && dayMenu.courses && dayMenu.courses.length > 0) {
            modalContent.innerHTML = '';
            const menuHtml = restaurantModal(restaurant, dayMenu);
            modalContent.innerHTML = menuHtml;
          } else {
            modalContent.innerHTML = errorModal('Daily menu not available.');
          }
        } catch (error) {
          if (error instanceof Error) {
            modalContent.innerHTML = errorModal(error.message);
          } else {
            modalContent.innerHTML = errorModal('An unknown error occurred.');
          }
        }
      };
    });
  });
};

const error = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData(apiUrl + '/restaurants');
    console.log(restaurants);
    restaurants.sort((a: Restaurant, b: Restaurant) => {
      const x1 = crd.latitude;
      const y1 = crd.longitude;
      const x2a = a.location.coordinates[1];
      const y2a = a.location.coordinates[0];
      const distanceA = calculateDistance(x1, y1, x2a, y2a);
      const x2b = b.location.coordinates[1];
      const y2b = b.location.coordinates[0];
      const distanceB = calculateDistance(x1, y1, x2b, y2b);
      return distanceA - distanceB;
    });

    createTable(restaurants);
  } catch (error) {
    modalContent.innerHTML = errorModal((error as Error).message);
    openModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);

const themeToggle = document.getElementById('toggle-theme') as HTMLButtonElement;

// Tarkista, onko käyttäjällä jo tallennettuna teema
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    let currentTheme = document.body.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Aseta uusi teema body-elementtiin
    document.body.setAttribute('data-theme', newTheme);

    // Tallenna käyttäjän valinta localStorageen
    localStorage.setItem('theme', newTheme);
  });
}