function generateOrderId() {
  const prefix = "BKO";
  const date = new Date().toISOString().split("T")[0].split("-").join("");
  const random = Math.ceil(Math.random() * 100000);

  const uniqueNumber = `${prefix}-${date}-${random}`;

  return uniqueNumber;
}

module.exports = generateOrderId;
