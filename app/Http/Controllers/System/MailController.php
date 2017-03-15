<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 27-Nov-16
 * Time: 12:33 PM
 */

namespace App\Http\Controllers\System;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{

    public function sendInfoPayment(Request $request) {
        $data = $request->all();
        $data['expiredDate'] = explode('-', $data['expired_payment_date']);
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

    public function sendEntranceTicketPayment(Request $request) {
        $data = $request->all();
        $data['expiredDate'] = explode('-', $data['expired_payment_date']);
        $data['tickets'] = json_decode($data['tickets']);
        if(!empty($data)) {

            Mail::send('_entrance_ticket_mail',  ['data'=>$data], function($message) use ($data)
            {
                $message->from(env('MAIL_USERNAME') , 'Đặt vé giá rẻ');
                $message->to($data['email'], $data['fullname']);
                $message->subject('Thông tin đặt vé - ' . $data['fullname']);
            });
        }

    }

    
}