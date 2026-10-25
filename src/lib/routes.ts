// Central place for links to pages. Your friend's pages (events list, event
// details, favorites) live at these paths - change them here if they differ.
export const routes = {
  home: "/",
  events: "/events",
  favorites: "/favorites",
  myBookings: "/my-bookings",
  booking: "/booking",
  eventDetail: (slug: string) => `/event/?id=${encodeURIComponent(slug)}`,
};

// Pages that show the "Hi, Alex / Log out" navbar (as in the design).
export const signedInPaths = ["/booking", "/confirmation", "/my-bookings"];
