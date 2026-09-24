export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    const name = String(data.name || "").trim();
    const contact = String(data.contact || "").trim();
    const project = String(data.project || "").trim();

    if (!name || !contact || !project) {
      return Response.json(
        {
          success: false,
          message: "Заповніть усі поля."
        },
        { status: 400 }
      );
    }

    const token = context.env.BOT_TOKEN;
    const chatId = context.env.CHAT_ID;

    if (!token || !chatId) {
      return Response.json(
        {
          success: false,
          message: "BOT_TOKEN або CHAT_ID не налаштований."
        },
        { status: 500 }
      );
    }

    const message = [
      "🚀 НОВА ЗАЯВКА — PRODUCT WEB",
      "",
      "👤 Ім'я:",
      name,
      "",
      "📱 Контакт:",
      contact,
      "",
      "💬 Проєкт:",
      project
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      return Response.json(
        {
          success: false,
          message: "Telegram не прийняв повідомлення."
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Заявку успішно надіслано!"
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Помилка сервера."
      },
      { status: 500 }
    );
  }
}
