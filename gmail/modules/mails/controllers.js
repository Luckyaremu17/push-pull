import axios from "axios";
import dayjs from "dayjs";
import redis from "../../utils/redis";

export function getMails(req, res) {
  res.status(200).json({
    message: "Successfully fetched mails",
  });
}

export async function addMail(req, res) {
  try {
    const { data, messageId, publishTime } = req.body.message;
    let str = Buffer.from(data, "base64").toString("ascii");
    const mailHistory = await getMailHistory();
    const historyId = await getHistoryId();

    res.status(200).json({
      message: "success",
    });

    if (mailHistory.length) {
      const data = await Promise.all(
        mailHistory.map(async (item) => await getMessageData(item))
      );
      const formattedData = data.map((item) => ({
        message: item.snippet,
        from: item.payload.headers
          .find((item) => item.name === "From")
          .value.split(" ")
          [
            item.payload.headers
              .find((item) => item.name === "From")
              .value.split(" ").length - 1
          ].replace("<", "")
          .replace(">", ""),
      }));
      const filteredMails = formattedData.filter((item) =>
        item.from.split("@").includes("gmail.com")
      );
      console.log(formattedData, "unfiltered mails");
      const existingMessages = await redis.get(`${historyId}-messages`);
      if (existingMessages) {
        await redis.set(
          `${historyId}-messages`,
          JSON.stringify([...JSON.parse(existingMessages), ...filteredMails])
        );
      } else {
        await redis.set(`${historyId}-messages`, JSON.stringify(filteredMails));
      }
      const parsedEmails = JSON.parse(await redis.get(`${historyId}-messages`));
      console.log(parsedEmails, "filtered mails");
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      message: "something went wrong",
    });
  }
}

async function getHistoryId() {
  let historyId = await redis.get("historyId");

  if (!historyId) {
    const response = await axios.post(
      process.env.GOOGLE_WATCH_URL,
      {
        labelIds: ["INBOX"],
        topicName: "projects/mydemo-345010/topics/mydemo",
      },
      {
        headers: {
          authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
        },
      }
    );
    historyId = response.data.historyId;
    await redis.setEx(`historyId`, 7 * 60 * 60 * 24, historyId);
  }

  return historyId;
}

export async function watchEmail(req, res) {
  try {
    await redis.del("historyId");
    const historyId = await getHistoryId();

    res.status(200).json({
      message: "success",
      data: historyId,
    });
  } catch (error) {
    console.log(error.response);
    res.status(500).json({
      message: "something went wrong",
    });
  }
}

export async function getMailHistory() {
  const historyId = await getHistoryId();
  const response = await axios.get(
    `${process.env.GET_HISTORY_URL}?startHistoryId=${historyId}&historyTYpes=messageAdded`,
    {
      headers: {
        authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
    }
  );

  let messageIds = response.data.history.map((item) => item.messages[0].id);
  const existingMessageIds = await redis.get(historyId); // returns an array of all message ids if they exist

  console.log(existingMessageIds, "======@@");

  if (existingMessageIds) {
    messageIds = messageIds.filter(
      (item) => !JSON.parse(existingMessageIds).includes(item)
    );
    await redis.set(
      historyId,
      JSON.stringify([...existingMessageIds, ...messageIds])
    );
  } else {
    await redis.set(historyId, JSON.stringify(messageIds));
  }

  return messageIds;
}

export async function getMessageData(messageId) {
  const response = await axios.get(
    `${process.env.GET_MESSAGE_URL}/${messageId}`,
    {
      headers: {
        authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function getMessage(req, res) {
  try {
    const data = getMessageData(req.params.messageId);

    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
}
