const EVENTS = [
  {
    id: "evt-1",
    title: "World Book Fair & Literary Fest",
    category: "Book Fair",
    statusTags: ["ongoing", "popular"],
    dateRange: "10th Jan 2026 - 18th Jan 2026",
    time: "11:00 AM - 8:00 PM",
    locationName: "New Delhi",
    locationAddress: "Bharat Mandapam, Appu Ghar, Pragati Maidan",
    host: "National Book Trust",
    seatsFilled: 158,
    seatsTotal: 500,
    coverKey: "bookfair",
    description: "One of the country's largest gatherings of publishers, independent presses, and readers, featuring panel talks, book launches, and a dedicated children's pavilion."
  },
  {
    id: "evt-2",
    title: "Foggy Morning Book Club - Zero to One",
    category: "Book Club",
    statusTags: ["ongoing"],
    dateRange: "6th Aug 2026",
    time: "07:00 PM - 08:30 PM",
    locationName: "Reading Nook & Espresso Bar",
    locationAddress: "Corner Fireplace Room, Chapter & Verse Bookstore",
    host: "Book Club Moderators",
    seatsFilled: 6,
    seatsTotal: 25,
    coverKey: "bookclub",
    description: "This month's discussion dives into startup theory and contrarian thinking over coffee and pastries by the fireplace."
  },
  {
    id: "evt-3",
    title: "Indie Publishers Showcase & Small Press Fair",
    category: "Book Fair",
    statusTags: ["ongoing", "popular"],
    dateRange: "15th Jul 2026 - 30th Jul 2026",
    time: "10:00 AM - 07:00 PM",
    locationName: "Courtyard Gallery",
    locationAddress: "Outdoor Glass Pavilion, 124 Elm Street",
    host: "Indie Press Collective",
    seatsFilled: 35,
    seatsTotal: 200,
    coverKey: "indiepublishers",
    description: "A two-week showcase spotlighting small and independent publishing houses, with meet-the-publisher sessions each weekend."
  },
  {
    id: "evt-4",
    title: "Saturday Story Time: Dinosaurs & Dragons",
    category: "Kids Story Time",
    statusTags: ["upcoming", "popular"],
    dateRange: "9th Aug 2026",
    time: "11:00 AM - 12:30 PM",
    locationName: "Children's Treehouse Corner",
    locationAddress: "Section B, Chapter & Verse Kids Floor",
    host: "Ms. Alvarez & Puppet Friends",
    seatsFilled: 12,
    seatsTotal: 40,
    coverKey: "kidsstory",
    description: "A playful storytelling hour with puppet shows, dress-up dragons, and a craft table for our youngest readers."
  },
  {
    id: "evt-5",
    title: "Hand-Sewn Leather Journals Workshop",
    category: "Workshop",
    statusTags: ["upcoming"],
    dateRange: "14th Aug 2026",
    time: "05:30 PM - 08:00 PM",
    locationName: "Craft & Press Studio",
    locationAddress: "Mezzanine Level, Chapter & Verse Bookstore",
    host: "Studio Bindery Guild",
    seatsFilled: 4,
    seatsTotal: 18,
    coverKey: "workshop",
    description: "Learn traditional bookbinding stitches and leave with your own hand-sewn leather journal. All materials included."
  },
  {
    id: "evt-6",
    title: "Third Thursday Poetry Open Mic",
    category: "Author Reading",
    statusTags: ["upcoming"],
    dateRange: "21st Aug 2026",
    time: "07:30 PM - 09:30 PM",
    locationName: "Poet's Stage",
    locationAddress: "Acoustic Lounge, Chapter & Verse Bookstore",
    host: "Local Poets Collective",
    seatsFilled: 19,
    seatsTotal: 50,
    coverKey: "poetry",
    description: "Sign up at the door to share your own verse, or simply come to listen to voices from our local poetry community."
  },
  {
    id: "evt-7",
    title: "An Evening with Mara Voss: Author Reading",
    category: "Author Reading",
    statusTags: ["popular"],
    dateRange: "3rd Aug 2026",
    time: "06:30 PM - 08:30 PM",
    locationName: "Main Literary Atrium",
    locationAddress: "Chapter & Verse Bookstore, 124 Elm Street",
    host: "Mara Voss",
    seatsFilled: 7,
    seatsTotal: 65,
    coverKey: "authorreading",
    description: "Bestselling novelist Mara Voss reads from her latest work, followed by an audience Q&A and book signing."
  },
  {
    id: "evt-8",
    title: "First Edition Signing: The Same River Twice",
    category: "Signing",
    statusTags: ["popular"],
    dateRange: "20th Aug 2026",
    time: "04:00 PM - 06:30 PM",
    locationName: "Grand Rotunda",
    locationAddress: "Chapter & Verse Main Hall, 124 Elm Street",
    host: "Featured Author",
    seatsFilled: 18,
    seatsTotal: 100,
    coverKey: "signing",
    description: "A limited first-edition signing event. Copies are available for purchase at the door while supplies last."
  }
];

let customEvents = [];

let state = {
  tab: "all",
  search: "",
  category: "all"
};

let editingEventId = null;
let lastFocusedElement = null;
let currentDetailsEvent = null;
let successMessageTimer = null;

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = String(str == null ? "" : str);
  return div.innerHTML;
}

function logAnalytics(action) {
  console.log("[Analytics] User interacted with Independent Bookstore Events Page - " + action);
}

function getAllEvents() {
  return EVENTS.concat(customEvents);
}

function getEventImagePath(event) {
  return "images/" + event.coverKey + ".jpg";
}

function matchesSearch(event, term) {
  if (!term) return true;
  const haystack = (event.title + " " + event.host + " " + event.locationName + " " + event.locationAddress).toLowerCase();
  return haystack.includes(term.toLowerCase());
}

function matchesCategory(event, category) {
  if (category === "all") return true;
  return event.category === category;
}

function getFilteredEvents() {
  return getAllEvents().filter(function (event) {
    return matchesSearch(event, state.search) && matchesCategory(event, state.category);
  });
}

function buildCardHTML(event, isAboveFold) {
  const seatsOpen = Math.max(event.seatsTotal - event.seatsFilled, 0);
  const imagePath = getEventImagePath(event);
  const loadingAttr = isAboveFold ? "eager" : "lazy";
  const priorityAttr = isAboveFold ? ' fetchpriority="high"' : "";

  return (
    '<article class="event-card">' +
      '<div class="event-image-wrap">' +
        '<div class="image-spinner-wrap"><span class="image-spinner" aria-hidden="true"></span></div>' +
        '<img src="' + escapeHTML(imagePath) + '" alt="' + escapeHTML(event.title) + ' cover photo" width="400" height="260" loading="' + loadingAttr + '"' + priorityAttr + ' decoding="async" onload="handleCardImageLoad(this)" onerror="handleCardImageError(this)" />' +
        '<div class="image-error-state">' +
          '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>' +
          '<p>Unable to load image. Please check your internet connection.</p>' +
        '</div>' +
      '</div>' +
      '<div class="event-card-body">' +
        '<div class="event-card-panel">' +
          '<h3 class="event-card-title" title="' + escapeHTML(event.title) + '">' + escapeHTML(event.title) + '</h3>' +
          '<div class="event-card-meta-row">' +
            '<i class="fa-regular fa-calendar" aria-hidden="true"></i>' +
            '<span>' + escapeHTML(event.dateRange) + '</span>' +
          '</div>' +
          '<div class="event-card-meta-row">' +
            '<i class="fa-regular fa-clock" aria-hidden="true"></i>' +
            '<span>' + escapeHTML(event.time) + '</span>' +
          '</div>' +
          '<div class="event-card-meta-row">' +
            '<i class="fa-solid fa-location-dot" aria-hidden="true"></i>' +
            '<span>' +
              '<span class="meta-primary">' + escapeHTML(event.locationName) + '</span>' +
              '<span class="meta-secondary">' + escapeHTML(event.locationAddress) + '</span>' +
            '</span>' +
          '</div>' +
          '<div class="event-card-footer">' +
            '<span class="seats-info">' +
              '<i class="fa-solid fa-user-group" aria-hidden="true"></i>' +
              '<strong>' + event.seatsFilled + '</strong> / ' + event.seatsTotal + ' seats open' +
            '</span>' +
            '<button type="button" class="details-btn" data-event-id="' + escapeHTML(event.id) + '">' +
              'Details <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

function buildGroupHTML(title, dotClass, statusLabel, statusCount, events, eagerCountRef) {
  const cards = events.map(function (event) {
    const isAboveFold = eagerCountRef.count > 0;
    eagerCountRef.count -= 1;
    return buildCardHTML(event, isAboveFold);
  }).join("");
  return (
    '<div class="event-group">' +
      '<div class="event-group-header">' +
        '<h3 class="event-group-title">' +
          '<span class="group-dot ' + dotClass + '" aria-hidden="true"></span>' +
          title +
        '</h3>' +
        '<span class="event-group-status">' + statusLabel + ' &bull; ' + statusCount + '</span>' +
      '</div>' +
      '<div class="card-grid">' + cards + '</div>' +
    '</div>'
  );
}

function handleCardImageLoad(img) {
  const wrap = img.closest(".event-image-wrap");
  if (wrap) wrap.classList.add("image-ready");
}

function handleCardImageError(img) {
  const wrap = img.closest(".event-image-wrap");
  if (wrap) wrap.classList.add("image-failed");
}

function watchCardImages() {
  const wraps = document.querySelectorAll(".event-image-wrap");
  wraps.forEach(function (wrap) {
    const img = wrap.querySelector("img");
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      wrap.classList.add("image-ready");
      return;
    }

    setTimeout(function () {
      if (!wrap.classList.contains("image-ready") && !wrap.classList.contains("image-failed")) {
        wrap.classList.add("image-timeout");
      }
    }, 8000);
  });
}

function renderEvents() {
  const container = document.getElementById("eventGroups");
  const emptyState = document.getElementById("emptyState");
  const filtered = getFilteredEvents();

  document.getElementById("eventsCountLabel").textContent = filtered.length + " Event" + (filtered.length === 1 ? "" : "s") + " Listed";

  if (filtered.length === 0) {
    container.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  const eagerCountRef = { count: 3 };

  if (state.tab === "all") {
    const shownIds = {};

    const ongoing = filtered.filter(function (e) { return e.statusTags.indexOf("ongoing") !== -1; });
    ongoing.forEach(function (e) { shownIds[e.id] = true; });

    const upcoming = filtered.filter(function (e) {
      return e.statusTags.indexOf("upcoming") !== -1 && !shownIds[e.id];
    });
    upcoming.forEach(function (e) { shownIds[e.id] = true; });

    const popular = filtered.filter(function (e) {
      return e.statusTags.indexOf("popular") !== -1 && !shownIds[e.id];
    });

    let html = "";
    if (ongoing.length) html += buildGroupHTML("Ongoing Events", "dot-live", "Live Now", ongoing.length, ongoing, eagerCountRef);
    if (upcoming.length) html += buildGroupHTML("Upcoming Events", "dot-upcoming", "Scheduled", upcoming.length, upcoming, eagerCountRef);
    if (popular.length) html += buildGroupHTML("Popular Events", "dot-popular", "High Demand", popular.length, popular, eagerCountRef);

    container.innerHTML = html;
    if (!html) emptyState.hidden = false;
  } else {
    const single = filtered.filter(function (e) { return e.statusTags.indexOf(state.tab) !== -1; });
    if (single.length === 0) {
      container.innerHTML = "";
      emptyState.hidden = false;
      return;
    }
    const cards = single.map(function (event) {
      const isAboveFold = eagerCountRef.count > 0;
      eagerCountRef.count -= 1;
      return buildCardHTML(event, isAboveFold);
    }).join("");
    container.innerHTML = '<div class="event-group"><div class="card-grid">' + cards + '</div></div>';
  }

  attachDetailsButtons();
  watchCardImages();
}

function updateTabCounts() {
  const all = getAllEvents();
  document.getElementById("count-all").textContent = all.length;
  document.getElementById("count-ongoing").textContent = all.filter(function (e) { return e.statusTags.indexOf("ongoing") !== -1; }).length;
  document.getElementById("count-upcoming").textContent = all.filter(function (e) { return e.statusTags.indexOf("upcoming") !== -1; }).length;
  document.getElementById("count-popular").textContent = all.filter(function (e) { return e.statusTags.indexOf("popular") !== -1; }).length;
}

function loadAndRenderEvents() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  const eventGroups = document.getElementById("eventGroups");
  loadingIndicator.hidden = false;
  eventGroups.innerHTML = "";
  document.getElementById("emptyState").hidden = true;

  setTimeout(function () {
    loadingIndicator.hidden = true;
    updateTabCounts();
    renderEvents();
  }, 500);
}

function activateTab(btn, tabButtons) {
  tabButtons.forEach(function (b) {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
    b.setAttribute("tabindex", "-1");
  });
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");
  btn.setAttribute("tabindex", "0");

  const panel = document.getElementById("eventGroups");
  if (panel) panel.setAttribute("aria-labelledby", btn.id);

  state.tab = btn.dataset.tab;
  logAnalytics('switched to "' + btn.dataset.tab + '" tab');
  renderEvents();
}

function setupTabs() {
  const tabButtons = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activateTab(btn, tabButtons);
    });
  });

  const tabsList = document.getElementById("tabsList");
  tabsList.addEventListener("keydown", function (e) {
    const currentIndex = tabButtons.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabButtons.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabButtons.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextBtn = tabButtons[nextIndex];
    nextBtn.focus();
    nextBtn.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    activateTab(nextBtn, tabButtons);
  });
}

function setupFilters() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");

  searchForm.addEventListener("submit", function (e) { e.preventDefault(); });

  let debounceTimer;
  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      state.search = searchInput.value.trim();
      logAnalytics("used search box");
      renderEvents();
    }, 250);
  });

  categorySelect.addEventListener("change", function () {
    state.category = categorySelect.value;
    logAnalytics('filtered by category "' + categorySelect.value + '"');
    renderEvents();
  });

  document.getElementById("clearFiltersBtn").addEventListener("click", function () {
    searchInput.value = "";
    categorySelect.value = "all";
    state.search = "";
    state.category = "all";
    logAnalytics("cleared filters");
    renderEvents();
  });
}

function badgeForStatus(tag) {
  if (tag === "ongoing") return '<span class="badge badge-ongoing">ONGOING</span>';
  if (tag === "upcoming") return '<span class="badge badge-upcoming">UPCOMING</span>';
  if (tag === "popular") return '<span class="badge badge-popular"><i class="fa-solid fa-fire" aria-hidden="true"></i> Popular</span>';
  return "";
}

function attachDetailsButtons() {
  document.querySelectorAll(".details-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const event = getAllEvents().find(function (e) { return e.id === btn.dataset.eventId; });
      if (event) openDetailsModal(event);
    });
  });
}

function seatSummaryText(event) {
  const remaining = Math.max(event.seatsTotal - event.seatsFilled, 0);
  return event.seatsFilled + " of " + event.seatsTotal + " seats reserved (" + remaining + " remaining)";
}

function refreshSeatPanel(event) {
  document.getElementById("detailsModalSeats").textContent = seatSummaryText(event);
}

function openDetailsModal(event) {
  const overlay = document.getElementById("detailsModalOverlay");
  const hero = document.getElementById("detailsModalHero");
  const badgesWrap = document.getElementById("detailsModalBadges");

  currentDetailsEvent = event;

  hero.style.backgroundImage = "linear-gradient(180deg, rgba(10,12,20,0.15), rgba(10,12,20,0.85)), url('" + getEventImagePath(event) + "')";
  badgesWrap.innerHTML =
    '<span class="badge badge-plain">' + escapeHTML(event.category.toUpperCase()) + '</span>' +
    event.statusTags.map(badgeForStatus).join("");

  document.getElementById("detailsModalTitle").textContent = event.title;
  document.getElementById("detailsModalDate").textContent = event.dateRange;
  document.getElementById("detailsModalTime").textContent = event.time;
  document.getElementById("detailsModalLocation").textContent = event.locationName + " - " + event.locationAddress;
  document.getElementById("detailsModalHost").textContent = event.host || "To be announced";
  document.getElementById("detailsModalDescription").textContent = event.description || "";

  refreshSeatPanel(event);

  logAnalytics('viewed details for "' + event.title + '"');
  openModal(overlay, document.getElementById("detailsModal"));
}

function setupDetailsModal() {
  document.getElementById("editEventBtn").addEventListener("click", function () {
    if (!currentDetailsEvent) return;
    closeModal(document.getElementById("detailsModalOverlay"));
    openEventForm(currentDetailsEvent);
  });

  document.getElementById("detailsModalCloseBtn").addEventListener("click", function () {
    closeModal(document.getElementById("detailsModalOverlay"));
  });
}

function openModal(overlay, modalEl) {
  lastFocusedElement = document.activeElement;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";

  const closeBtn = modalEl.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();

  overlay.addEventListener("keydown", trapFocus);
}

function closeModal(overlay) {
  overlay.hidden = true;
  document.body.style.overflow = "";
  overlay.removeEventListener("keydown", trapFocus);
  if (lastFocusedElement) lastFocusedElement.focus();
}

function trapFocus(e) {
  const overlay = e.currentTarget;
  if (e.key === "Escape") {
    closeModal(overlay);
    return;
  }
  if (e.key !== "Tab") return;

  const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function setupModalDismissals() {
  const detailsOverlay = document.getElementById("detailsModalOverlay");
  const addOverlay = document.getElementById("addEventModalOverlay");

  document.getElementById("detailsModalClose").addEventListener("click", function () { closeModal(detailsOverlay); });
  document.getElementById("addEventModalClose").addEventListener("click", function () { closeModal(addOverlay); });
  document.getElementById("cancelAddEventBtn").addEventListener("click", function () { closeModal(addOverlay); });

  [detailsOverlay, addOverlay].forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
  });
}

function setupAddEventModal() {
  const overlay = document.getElementById("addEventModalOverlay");
  const modal = document.getElementById("addEventModal");

  document.getElementById("openAddEventBtn").addEventListener("click", function () {
    openEventForm(null);
  });

  document.getElementById("footerAddEventLink").addEventListener("click", function (e) {
    e.preventDefault();
    openEventForm(null);
  });

  document.getElementById("coverStyleGrid").addEventListener("change", function (e) {
    if (e.target.name === "coverStyle") {
      logAnalytics('selected cover style "' + e.target.value + '"');
    }
  });

  document.getElementById("addEventForm").addEventListener("submit", function (e) {
    e.preventDefault();
    handleEventFormSubmit(overlay);
  });

  document.getElementById("addEventSuccessClose").addEventListener("click", function () {
    clearTimeout(successMessageTimer);
    document.getElementById("addEventSuccess").hidden = true;
    closeModal(overlay);
  });
}

function openEventForm(eventToEdit) {
  const overlay = document.getElementById("addEventModalOverlay");
  const modal = document.getElementById("addEventModal");
  const form = document.getElementById("addEventForm");
  const successMsg = document.getElementById("addEventSuccess");
  const titleEl = document.getElementById("addEventModalTitle");
  const badgeEl = document.getElementById("addEventFormBadge");
  const submitBtn = document.getElementById("addEventSubmitBtn");

  clearFormErrors(form);
  clearTimeout(successMessageTimer);
  successMsg.hidden = true;
  form.reset();
  document.getElementById("cancelAddEventBtn").textContent = "Cancel";

  if (eventToEdit) {
    editingEventId = eventToEdit.id;
    titleEl.textContent = "Edit Bookstore Event";
    badgeEl.innerHTML = '<i class="fa-solid fa-pen" aria-hidden="true"></i> EDIT LISTING ENTRY';
    submitBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Save Changes';

    form.eventTitle.value = eventToEdit.title;
    form.eventCategory.value = eventToEdit.category;
    const primaryTag = eventToEdit.statusTags.find(function (t) { return t !== "popular"; }) || eventToEdit.statusTags[0] || "";
    form.eventTabSection.value = primaryTag;
    form.eventStartDate.value = eventToEdit.dateRange;
    form.eventTime.value = eventToEdit.time;
    form.eventCity.value = eventToEdit.locationName;
    form.eventHost.value = eventToEdit.host;
    form.eventVenueAddress.value = eventToEdit.locationAddress;
    form.eventSeats.value = eventToEdit.seatsTotal;
    form.eventDescription.value = eventToEdit.description;

    const radio = form.querySelector('input[name="coverStyle"][value="' + eventToEdit.coverKey + '"]');
    if (radio) radio.checked = true;
  } else {
    editingEventId = null;
    titleEl.textContent = "Add New Bookstore Event";
    badgeEl.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i> NEW LISTING ENTRY';
    submitBtn.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i> Save Event';
  }

  logAnalytics(eventToEdit ? "opened Edit Event form" : "opened Add Event form");
  openModal(overlay, modal);
}

function handleEventFormSubmit(overlay) {
  const form = document.getElementById("addEventForm");
  const successMsg = document.getElementById("addEventSuccess");
  const successText = document.getElementById("addEventSuccessText");
  successMsg.hidden = true;

  const selectedCoverStyle = form.querySelector('input[name="coverStyle"]:checked');

  const values = {
    eventTitle: form.eventTitle.value.trim(),
    eventCategory: form.eventCategory.value,
    eventTabSection: form.eventTabSection.value,
    eventStartDate: form.eventStartDate.value.trim(),
    eventTime: form.eventTime.value.trim(),
    eventCity: form.eventCity.value.trim(),
    eventHost: form.eventHost.value.trim(),
    eventVenueAddress: form.eventVenueAddress.value.trim(),
    eventSeats: form.eventSeats.value,
    coverStyle: selectedCoverStyle ? selectedCoverStyle.value : "",
    eventDescription: form.eventDescription.value.trim()
  };

  const errors = validateAddEventForm(values);
  clearFormErrors(form);

  if (Object.keys(errors).length > 0) {
    showFormErrors(errors);
    const firstFieldId = Object.keys(errors)[0];
    const firstField = firstFieldId === "coverStyle"
      ? document.getElementById("coverStyleGrid")
      : document.getElementById(firstFieldId);
    if (firstField) firstField.focus();
    return;
  }

  const seatsTotal = parseInt(values.eventSeats, 10);

  if (editingEventId) {
    const target = getAllEvents().find(function (e) { return e.id === editingEventId; });
    if (target) {
      const wasPopular = target.statusTags.indexOf("popular") !== -1;
      const keepPopular = wasPopular && values.eventTabSection !== "popular";

      target.title = values.eventTitle;
      target.category = values.eventCategory;
      target.statusTags = keepPopular ? [values.eventTabSection, "popular"] : [values.eventTabSection];
      target.dateRange = values.eventStartDate;
      target.time = values.eventTime;
      target.locationName = values.eventCity;
      target.locationAddress = values.eventVenueAddress;
      target.host = values.eventHost;
      target.seatsTotal = seatsTotal;
      if (target.seatsFilled > seatsTotal) target.seatsFilled = seatsTotal;
      target.coverKey = values.coverStyle;
      target.description = values.eventDescription;

      successText.textContent = "Event updated successfully!";
      logAnalytics('updated event "' + target.title + '"');
    }
  } else {
    const newEvent = {
      id: "custom-" + Date.now(),
      title: values.eventTitle,
      category: values.eventCategory,
      statusTags: [values.eventTabSection],
      dateRange: values.eventStartDate,
      time: values.eventTime,
      locationName: values.eventCity,
      locationAddress: values.eventVenueAddress,
      host: values.eventHost,
      seatsFilled: 0,
      seatsTotal: seatsTotal,
      coverKey: values.coverStyle,
      description: values.eventDescription
    };

    customEvents.push(newEvent);
    successText.textContent = "Event saved successfully! It has been added to the calendar.";
    logAnalytics('saved new event "' + newEvent.title + '"');
  }

  successMsg.hidden = false;
  document.getElementById("cancelAddEventBtn").textContent = "Close";
  clearTimeout(successMessageTimer);
  successMessageTimer = setTimeout(function () {
    successMsg.hidden = true;
  }, 4000);

  updateTabCounts();
  renderEvents();
}

function validateAddEventForm(values) {
  const errors = {};
  if (!values.eventTitle) errors.eventTitle = true;
  if (!values.eventCategory) errors.eventCategory = true;
  if (!values.eventTabSection) errors.eventTabSection = true;
  if (!values.eventStartDate) errors.eventStartDate = true;
  if (!values.eventTime) errors.eventTime = true;
  if (!values.eventCity) errors.eventCity = true;
  if (!values.eventHost) errors.eventHost = true;
  if (!values.eventVenueAddress) errors.eventVenueAddress = true;
  if (!values.coverStyle) errors.coverStyle = true;
  if (!values.eventDescription) errors.eventDescription = true;

  const seats = parseInt(values.eventSeats, 10);
  if (!values.eventSeats || Number.isNaN(seats) || seats < 1) errors.eventSeats = true;

  return errors;
}

function showFormErrors(errors) {
  Object.keys(errors).forEach(function (fieldId) {
    const errorMsg = document.getElementById("error-" + fieldId);
    if (errorMsg) errorMsg.hidden = false;

    if (fieldId === "coverStyle") {
      document.getElementById("coverStyleGrid").classList.add("input-invalid");
      return;
    }

    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("input-invalid");
      field.setAttribute("aria-invalid", "true");
    }
  });
}

function clearFormErrors(form) {
  form.querySelectorAll(".input-invalid").forEach(function (el) {
    el.classList.remove("input-invalid");
    el.removeAttribute("aria-invalid");
  });
  form.querySelectorAll(".field-error").forEach(function (el) { el.hidden = true; });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  setupTabs();
  setupFilters();
  setupModalDismissals();
  setupDetailsModal();
  setupAddEventModal();
  loadAndRenderEvents();
});