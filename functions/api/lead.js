export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    const name = String(data.name || "").trim();
    const contact = String(data.contact || "").trim();
    const project = String(data.project || "").trim();

    if (!name || !contact || !project) {
      return Response.json(
        { success: false, message: "Заповніть усі поля." },
        { status: 400 }
      );
    }

    const message = `🚀 НОВА ЗАЯВКА — PRODUCT WEB

👤 Ім'я:
${name}

📱 Контакт:
${contact}

💬 Проєкт:
${project}`;

    const telegram = await fetch(
      `https://api.telegram.org/bot${context.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: context.env.CHAT_ID,
          text: message
        })
      }
    );

    const result = await telegram.json();

    if (!result.ok) {
      return Response.json(
        { success: false, message: "Помилка Telegram." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });

  } catch {
    return Response.json(
      { success: false, message: "Помилка сервера." },
      { status: 500 }
    );
  }
}
