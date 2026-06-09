import cron from "node-cron";
import {
  expireTransactions,
  autoCancelTransactions,
} from "../services/transaction.lifecycle";

// every minute
cron.schedule("* * * * *", async () => {
  console.log("⏱ Running transaction lifecycle job...");

  await expireTransactions();
  await autoCancelTransactions();
});