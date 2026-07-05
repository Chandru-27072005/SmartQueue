const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.smartqueuecluster.myq0asm.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log(addresses);
    }
  }
);