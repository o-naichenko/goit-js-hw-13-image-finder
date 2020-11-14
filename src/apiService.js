export default class ApiService {
  constructor() {
    this.API_KEY = "19115402-2f4ed690e134b4c839000dec3";
    this.searchQuery = "";
    this.queryPage = 1;
  }
  fetchImages() {
    const url = `https://pixabay.com/api/?key=${this.API_KEY}&q=${this.searchQuery}&page=${this.queryPage}`;
    return fetch(url)
      .then((r) => r.json())
      .then(this.incrementQueryPage());
  }
  incrementQueryPage() {
    this.queryPage += 1;
  }
  resetQueryPage() {
    this.queryPage = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery.split(" ").join("+");
    this.resetQueryPage();
  }
}
