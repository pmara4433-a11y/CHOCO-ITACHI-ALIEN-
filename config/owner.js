module.exports = {
  name: "CHOCO-ITACHI-ALIEN",
  ownerNumber: process.env.OWNER_NUMBER || "224629447488",
  getOwnerJid() {
    return `${this.ownerNumber}@s.whatsapp.net`;
  }
};
