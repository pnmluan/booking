<?php

namespace App\Http\Controllers\TicketCrawlers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class AirlineController extends \App\Http\Controllers\ApiController
{
    public function index(){
        $arr = ['api'=> 'test'];
        return $this->respondWithSuccess(['data'=>$arr]);
    }

    public function test() {
        echo date('Y/m', strtotime('2016-12-06'));
        exit;
    }

    public function vietjet(Request $request) {
        libxml_use_internal_errors(true);
        require_once(base_path('app/Libraries/Curl.php'));

        // PREPARE PARAM
        $round_trip = $request->input('round_trip'); // Option: on, off
        $from = $request->input('from'); // Example: HAN
        $to = $request->input('to');    // Example: SGN
        $from_date = strtotime($request->input('from_date'));
        $to_date = strtotime($request->input('to_date'));
        $adult = $request->input('adult');
        $children = $request->input('children');
        $infant = $request->input('infant');

        // GET SESSION ID
        $url = 'http://www.vietjetair.com/Sites/Web/vi-VN/Home';

        $curl = new \Curl();

        $curl->get($url);

        $curl->setHeader('Host', 'book.vietjetair.com');
        $curl->setHeader('Referer', 'http://www.vietjetair.com/Sites/Web/vi-VN/Home');

        $curl->setCookie('ASP.NET_SessionId', $curl->getCookie('ASP.NET_SessionId'));

        // SEARCH FLIGHT
        $curl->post('https://book.vietjetair.com/ameliapost.aspx?lang=vi', array(
            'chkRoundTrip' => $round_trip,
            'lstOrigAP' => $from,
            'lstDestAP' => $to,
            'dlstDepDate_Day' => date('d', $from_date),
            'dlstDepDate_Month' => date('Y/m', $from_date),
            'dlstRetDate_Day' => date('d', $to_date),
            'dlstRetDate_Month' => date('Y/m', $to_date),
            'lstCurrency' => 'VND',
            'lstResCurrency' => 'VND',
            'lstDepDateRange' => 0,
            'lstRetDateRange' => 0,
            'txtNumAdults' => $adult,
            'txtNumChildren' => $children,
            'txtNumInfants' => $infant,
            'lstLvlService' => 1,
            'blnFares' => 'False',
            'txtPromoCode' => ''
        ));

        $curl->post('https://book.vietjetair.com/ameliapost.aspx?lang=vi', array(
            '__VIEWSTATE'=> '/wEPDwULLTE1MzQ1MjI3MzAPZBYCZg9kFg4CCA8QZGQWAGQCCQ8QZGQWAGQCCw8QZGQWAGQCDQ8QZGQWAGQCEQ8QZGQWAGQCEg8QZGQWAGQCEw8QZGQWAGRk/SLp6eYBboDTdTTmIOra109LSis=',
            '__VIEWSTATEGENERATOR' => '35449566',
            'SesID'=> '',
            'DebugID'=> 04,
            'lstOrigAP'=> -1,
            'lstDestAP'=> -1,
            'dlstDepDate_Day'=> date('d', $from_date),
            'dlstDepDate_Month'=> date('Y/m', $from_date),
            'lstDepDateRange'=> 0,
            'dlstRetDate_Day'=> date('d', $to_date),
            'dlstRetDate_Month'=> date('Y/m', $to_date),
            'lstRetDateRange'=> 0,
            'txtNumAdults'=> 0,
            'txtNumChildren'=> 0,
            'txtNumInfants'=> 0,
            'lstLvlService'=> 1,
            'lstResCurrency'=> 'VND',
            'lstCurrency'=> 'VND',
            'txtPromoCode'=> '',
        ));


        // GET DATA

        $curl->get('https://book.vietjetair.com//TravelOptions.aspx?lang=vi&st=pb&sesid=');

        $doc = new \DOMDocument();
        $doc->loadHTML($curl->response);
        $xpath = new \DOMXpath($doc);

        $result = [];

        // DEPARTURE FLIGHT
        $left_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')]/td[1]/table//tr/td");
        $right_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')]/td[2]/table//tr/td");

        for ($i = 0; $i < $left_fields->length / 4 ; $i++) {
            $data = [];

            $data['start_date'] = substr($left_fields[$i * 4]->nodeValue, 0 ,10);

            $t = $left_fields[$i * 4 + 1]->nodeValue;
            $data['start_time'] = substr($t, 0, 5);
            $data['start_from'] = substr($t, 10);
            $data['start_code'] = substr($t, 7, 3);

            $t = $left_fields[$i * 4 + 2]->nodeValue;
            $data['end_time'] = substr($t, 0, 5);
            $data['end_to'] = substr($t, 10);
            $data['end_code'] = substr($t, 7, 3);

            $data['flight_code'] = substr($left_fields[$i * 4 + 3]->nodeValue, 0, 5);

            $data['promo'] = trim($right_fields[$i * 3 + 0]->nodeValue);
            $data['eco'] = trim($right_fields[$i * 3 + 1]->nodeValue);
            $data['skyboss'] = trim($right_fields[$i * 3 + 2]->nodeValue);

            $result['dep_flights'][] = $data;
        }

        // RETURN FLIGHT
        if (!empty($round_trip)) {
            $left_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')]/td[1]/table//tr/td");
            $right_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')]/td[2]/table//tr/td");

            for ($i = 0; $i < $left_fields->length / 4 ; $i++) {
                $data = [];

                $data['start_date'] = substr($left_fields[$i * 4]->nodeValue, 0 ,10);

                $t = $left_fields[$i * 4 + 1]->nodeValue;
                $data['start_time'] = substr($t, 0, 5);
                $data['start_from'] = substr($t, 10);
                $data['start_code'] = substr($t, 7, 3);

                $t = $left_fields[$i * 4 + 2]->nodeValue;
                $data['end_time'] = substr($t, 0, 5);
                $data['end_to'] = substr($t, 10);
                $data['end_code'] = substr($t, 7, 3);

                $data['flight_code'] = substr($left_fields[$i * 4 + 3]->nodeValue, 0, 5);

                $data['promo'] = trim($right_fields[$i * 3 + 0]->nodeValue);
                $data['eco'] = trim($right_fields[$i * 3 + 1]->nodeValue);
                $data['skyboss'] = trim($right_fields[$i * 3 + 2]->nodeValue);

                $result['ret_flights'][] = $data;
            }
        }

        // $this->respondWithSuccess(['data'=> $result]);
        echo json_encode($result);
        exit;
    }
}
