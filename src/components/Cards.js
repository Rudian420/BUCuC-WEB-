import { fetchData, createImageElement, formatDate, formatTime, truncateText } from '../utils/helpers.js';

export class MemberCard {
  constructor(member, container) {
    this.member = member;
    this.container = container;
    this.render();
  }

  render() {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <div class="card-body">
        <figure class="member-image">
          ${createImageElement(this.member.image, `${this.member.name}'s photo`, 'img-fluid').outerHTML}
          <figcaption class="member-name">${this.member.name}</figcaption>
          <span class="member-position">${this.member.position}</span>
        </figure>
        <div class="card-info">
          <p>${truncateText(this.member.bio, 150)}</p>
          <ul class="member-achievements">
            ${this.member.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
          </ul>
        </div>
        <div class="card-footer">
          <a href="${this.member.facebook}" target="_blank" class="social-link"><i class="bi bi-facebook"></i></a>
          <a href="mailto:${this.member.email}" class="social-link"><i class="bi bi-envelope"></i></a>
        </div>
      </div>
    `;
    this.container.appendChild(card);
  }

  static async loadMembers(url, container) {
    const membersData = await fetchData(url);
    if (membersData) {
      membersData.forEach(member => new MemberCard(member, container));
    }
  }
}

export class EventCard {
  constructor(event, container) {
    this.event = event;
    this.container = container;
    this.render();
  }

  render() {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <figure class="event-banner">
        ${createImageElement(this.event.image, `${this.event.title} banner`, 'img-fluid').outerHTML}
      </figure>
      <div class="event-details">
        <h3>${this.event.title}</h3>
        <p>${this.event.subtitle}</p>
        <p>Date: ${formatDate(this.event.date)}</p>
        <p>Time: ${formatTime(this.event.time)} - ${formatTime(this.event.endTime)}</p>
        <p>Venue: ${this.event.venue}</p>
        <a href="#" class="btn btn-primary">View Details</a>
      </div>
    `;
    this.container.appendChild(card);
  }

  static async loadEvents(url, container) {
    const eventsData = await fetchData(url);
    if (eventsData) {
      eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      eventsData.forEach(event => new EventCard(event, container));
    }
  }
}

