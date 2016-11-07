<?php

require 'Curl.php';

// step 1
$curl = new Curl();

$curl->get('https://www.fshare.vn');
$session_id = $curl->getCookie('session_id');


$doc = new DOMDocument();
$doc->loadHTML($curl->response);

$xpath = new DOMXpath($doc);
$array = $xpath->query("//*[@id='login-form']//*[@name='fs_csrf']");

foreach($array as $v){
  $fs_csrf = $v->getAttribute('value');
}


// step 2
$curl->setCookie('session_id', $session_id);

$curl->post('https://www.fshare.vn/login', array(
  "fs_csrf" => $fs_csrf,
  "LoginForm[email]" => "phandung1111059@gmail.com",
  "LoginForm[password]" => "7508286",
  "LoginForm[rememberMe]" => "0",
  "yt0" => "Đăng nhập"
));

$session_id = $curl->getCookie('session_id');


// step 3
$curl->setCookie('session_id', $session_id);

$curl->post('https://www.fshare.vn/login', array(
  "fs_csrf" => $fs_csrf,
  "LoginForm[email]" => "phandung1111059@gmail.com",
  "LoginForm[password]" => "7508286",
  "LoginForm[rememberMe]" => "0",
  "yt0" => "Đăng nhập"
));


$curl->get('https://www.fshare.vn/account/profile');

$doc = new DOMDocument();
$doc->loadHTML($curl->response);

$xpath = new DOMXpath($doc);
$array = $xpath->query("//*[@id='ProfileForm_name']");

foreach($array as $v){
  $test = $v->getAttribute('value');
}