<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

# проверка, что ошибки нет
if (!error_get_last()) {

    // Переменные, которые отправляет пользователь
    $json = file_get_contents('php://input');
    $jsonData = json_decode($json, true);

    $name = $jsonData['name'];
    $phone = $jsonData['phone'];
    $email = $jsonData['email'];
    $comment = $jsonData['comment'];

    $translatedData = [
        'Имя' => $name,
        'Телефон' => $phone,
        'Почта' => $email,
        'Комментарий' => $comment,
    ];
    
    // Формирование самого письма
    $title = "Заявка с сайта";
    $body = "";

    foreach ($translatedData as $field => $value) {
        if ($value !== null) {
            $body .= "$field: $value<br>"; // \r\n для писем
        }
    }
    
    // Настройки PHPMailer
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 0;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['data']['debug'][] = '';};
    // $mail->Debugoutput = function($str, $level) {$GLOBALS['data']['debug'][] = $str;};
    
    // Настройки вашей почты
    $mail->Host       = 'smtp.mail.ru'; // SMTP сервера вашей почты
    $mail->Username   = 'noname@hipers.ru'; // Логин на почте
    $mail->Password   = 'f1gFT1HPPx4c0A3iRX7z'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('noname@hipers.ru', 'noname@hipers.ru'); // Адрес самой почты и имя отправителя
    
    // Получатель письма 
    $mail->addAddress('e.lylova@hipers.ru'); // Email получателя
    $mail->addAddress('it@hipers.ru'); // Ещё один, если нужен
    

    // Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;    
    
    // Проверяем отправленность сообщения
    if (preg_match_all('/[\S]+/', $phone)) {
        if ($mail->send()) {
            $data['result'] = "success";
            $data['info'] = "Сообщение успешно отправлено!";
        } else {
            $data['result'] = "error";
            $data['info'] = "Сообщение не было отправлено. Ошибка при отправке письма";
            $data['desc'] = "Причина ошибки: {$mail->ErrorInfo}";
        }
    } else {
        $data['result'] = 0;
    }
    
} else {
    $data['result'] = "error";
    $data['info'] = "В коде присутствует ошибка";
    $data['desc'] = error_get_last();
}

// Отправка результата
header('Content-Type: application/json');
echo json_encode($data);
