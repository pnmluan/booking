<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 27-Nov-16
 * Time: 12:33 PM
 */

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends ApiController
{

    public function send(Request $request) {
        $email = $request->input('email');
        $full_name = $request->input('first_name') . ' ' . $request->input('last_name');


        $data = ['full_name' => $full_name, 'to' => $email];

        Mail::send('_booking_mail',  ['data'=>$data], function($message) use ($data)
        {
            $message->from('banamlehsb@gmail.com' , 'Đặt vé giá rẻ');
            $message->to($data['to'], $data['full_name']);
            $message->subject('Thông tin đặt vé - ' . $data['full_name']);
        });

    }
}