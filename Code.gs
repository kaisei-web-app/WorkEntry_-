/*************************************************
 * Kaisei Works - 依頼受付バックエンド
 *
 * 使い方
 * 1. Googleスプレッドシートを1つ作る
 * 2. 拡張機能 → Apps Script
 * 3. このコードを貼り付ける
 * 4. OWNER_EMAIL を自分のメールアドレスに変更
 * 5. 「デプロイ」→「新しいデプロイ」
 * 6. 種類：ウェブアプリ
 * 7. 次のユーザーとして実行：自分
 * 8. アクセスできるユーザー：全員
 * 9. 発行されたURLを index.html の GAS_URL に入れる
 *************************************************/

const OWNER_EMAIL = "ここに自分のメールアドレス";
const SHEET_NAME = "依頼一覧";

function doGet() {
  return ContentService
    .createTextOutput("Kaisei Works request API is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};

    // 簡易スパム対策：画面に見えない項目に入力されていたら無視
    if (p.website) {
      return json_({ok:false, message:"blocked"});
    }

    const name = clean_(p.name);
    const email = clean_(p.email);
    const service = clean_(p.service);
    const details = clean_(p.details);
    const deadline = clean_(p.deadline);
    const budget = clean_(p.budget);
    const referenceUrl = clean_(p.reference_url);

    if (!name || !email || !service || !details) {
      return json_({ok:false, message:"required"});
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ok:false, message:"invalid email"});
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "受付日時","ステータス","名前","メール","依頼内容",
        "詳細","希望納期","予算","参考URL"
      ]);
      sheet.setFrozenRows(1);
    }

    const now = new Date();
    sheet.appendRow([
      now,
      "未対応",
      name,
      email,
      service,
      details,
      deadline,
      budget,
      referenceUrl
    ]);

    // 管理者へ通知
    if (OWNER_EMAIL && !OWNER_EMAIL.includes("ここに")) {
      const subject = "【Kaisei Works】新しい仕事依頼が届きました";
      const body =
        "新しい仕事依頼を受け付けました。\n\n" +
        "受付日時： " + now + "\n" +
        "名前： " + name + "\n" +
        "メール： " + email + "\n" +
        "依頼： " + service + "\n" +
        "希望納期： " + deadline + "\n" +
        "予算： " + budget + "\n" +
        "参考URL： " + referenceUrl + "\n\n" +
        "依頼内容：\n" + details;

      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: subject,
        body: body,
        replyTo: email
      });
    }

    return json_({ok:true});

  } catch (err) {
    console.error(err);
    return json_({ok:false, message:"server error"});
  }
}

function clean_(value) {
  return String(value || "").trim().slice(0, 10000);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
