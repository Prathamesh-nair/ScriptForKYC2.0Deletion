require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const axios = require("axios");
const csv = require("csv-parser");
const fs = require("fs");
const logger = require("./logger");

const headers = {
  Authorization: process.env.Authorization,
  accept: "application/json",
  "X-source": "kyc-admin",
  "X-menuId": 10,
};

fs.createReadStream("./Book1.csv")
  .pipe(csv())
  .on("data", async (row) => {
    // console.log(row);
    let { mobile, reason } = row;
    mobile = +mobile; //String to Number conversion  parseInt('text)
    try {
      const response = await axios.delete(
        `https://services-kyc2-prod.angelbroking.com/v1/kyc/${mobile}?reason=${reason}`,
        { headers }
      );
      if (response.data.status === "success") {
        logger.info(`${mobile}: has been deleted. Reason: ${reason}`);
      }
    } catch (error) {
      logger.error(`${mobile}: ` + error.response.data.message);
      // console.log(response.data.message);//added for testing purpose
    }
  })
  .on("end", () => {
    console.log("CSV File Successfully executed.");
  });
