import { Restaurant, Menu } from "./interfaces";

const restaurantRow = (restaurant: Restaurant): HTMLTableRowElement => {
  const { name, address, company } = restaurant;
  const tr = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.innerText = name;

  const addressCell = document.createElement('td');
  addressCell.innerText = address;

  const companyCell = document.createElement('td');
  companyCell.innerText = company;

  tr.appendChild(nameCell);
  tr.appendChild(addressCell);
  tr.appendChild(companyCell);

  return tr;
};

const restaurantModal = (restaurant: Restaurant, menu: Menu): string => {
  const { name, address, city, postalCode, phone, company } = restaurant;
  let html = `
    <h3>${name}</h3>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Address:</strong> ${address}, ${postalCode} ${city}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <table>
      <thead>
        <tr>
          <th>Course</th>
          <th>Diet</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
  `;

  menu.courses.forEach((course) => {
    const { name: courseName, diets, price } = course;
    html += `
      <tr>
        <td>${courseName}</td>
        <td>${diets ?? ' - '}</td>
        <td>${price ?? ' - '}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
};

const errorModal = (message: string): string => {
  const html = `
    <h3>Error</h3>
    <p>${message}</p>
  `;
  return html;
};

export { restaurantRow, restaurantModal, errorModal };