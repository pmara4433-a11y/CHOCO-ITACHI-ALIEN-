module.exports = {
  name: "CHOCO-ITACHI-ALIEN",
  ownerNumber: process.env.OWNER_NUMBER || "224000000000",
  getOwnerJid() {
    return `${this.ownerNumber}@s.whatsapp.net`;
  }
};
