self.addEventListener("install", (event) => {
  console.log("install event");
});

self.addEventListener("activate", (event) => {
  console.log("event activated");
});
self.addEventListener("fetch", (event) => {
  console.log("fetch event", event);
});
