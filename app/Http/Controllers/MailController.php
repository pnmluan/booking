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

    public function sendInfoPayment(Request $request) {
        $data = $request->all();
        $data['routes'] = json_decode($data['routes']);
        if(!empty($data)) {

            Mail::send('_booking_mail',  ['data'=>$data], function($message) use ($data)
            {
                $message->from(env('MAIL_USERNAME') , 'Đặt vé giá rẻ');
                $message->to($data['email'], $data['fullname']);
                $message->subject('Thông tin đặt vé - ' . $data['fullname']);
            });
        }

    }

    
}