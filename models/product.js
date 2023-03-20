// db 임포트해주기
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  // 새로운 프로덕트를 생성하는 메서드
  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {}
  // 프로덕트를 fetch 가져오는 메서드
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
  // 특정 프로덕트를 id로 찾는 메서드 (where 키워드)
  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
