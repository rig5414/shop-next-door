import { NextApiRequest, NextApiResponse } from "next";

let mockTransactions: Record<string, any> = {}; // Store mock transactions

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { orderId, amount, method } = req.body;

    if (!orderId || !amount || !method) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transactionId = `txn_${Date.now()}`;
    mockTransactions[transactionId] = {
      transactionId,
      orderId,
      amount,
      method,
      status: "pending",
    };

    return res.status(201).json({ transactionId, status: "pending" });
  }

  if (req.method === "GET") {
    const { transactionId } = req.query;

    if (!transactionId || typeof transactionId !== "string") {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const transaction = mockTransactions[transactionId];

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json(transaction);
  }

  if (req.method === "PATCH") {
    const { transactionId } = req.query;
    const { status } = req.body;

    if (!transactionId || typeof transactionId !== "string") {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    if (!status || !["successful", "failed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    if (!mockTransactions[transactionId]) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    mockTransactions[transactionId].status = status;
    return res.status(200).json({ transactionId, status });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
